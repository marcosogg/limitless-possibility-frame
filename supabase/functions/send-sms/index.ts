import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reminder, scheduleDate } = await req.json();
    console.log('Received reminder data:', reminder);
    console.log('Schedule date:', scheduleDate);

    if (!reminder || !reminder.provider_name || !reminder.due_date || !reminder.amount || !reminder.phone_number) {
      throw new Error('Missing required reminder data');
    }

    const messageBody = `Reminder: Your ${reminder.provider_name} bill of €${reminder.amount} is due on day ${reminder.due_date} of this month.`;
    
    const twilioParams = new URLSearchParams({
      To: reminder.phone_number,
      From: Deno.env.get('TWILIO_PHONE_NUMBER') || '',
      Body: messageBody,
    });

    // Add scheduleDate if provided
    if (scheduleDate) {
      twilioParams.append('SendAt', new Date(scheduleDate).toISOString());
      twilioParams.append('ScheduleType', 'fixed');
    }

    console.log('Attempting to send SMS via Twilio');
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${Deno.env.get('TWILIO_ACCOUNT_SID')}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${Deno.env.get('TWILIO_ACCOUNT_SID')}:${Deno.env.get('TWILIO_AUTH_TOKEN')}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: twilioParams,
      }
    );

    const result = await twilioResponse.json();
    console.log('Twilio API response:', result);

    if (!twilioResponse.ok) {
      throw new Error(result.message || 'Failed to send SMS');
    }

    return new Response(
      JSON.stringify({ success: true, message: scheduleDate ? 'SMS scheduled successfully' : 'SMS sent successfully' }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in send-sms function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        details: 'Failed to send SMS' 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});