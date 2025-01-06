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
      MessagingServiceSid: 'MG13f71a02e5e771f315e86e3efaeecdf9'
    });

    // Validate and add scheduling if provided
    if (scheduleDate) {
      const scheduledTime = new Date(scheduleDate);
      const now = new Date();
      const diffInSeconds = (scheduledTime.getTime() - now.getTime()) / 1000;
      
      // Validate scheduling time constraints
      if (diffInSeconds < 300) {
        throw new Error('Schedule time must be at least 5 minutes in the future');
      }
      if (diffInSeconds > 3024000) {
        throw new Error('Schedule time cannot be more than 35 days in the future');
      }

      console.log('Scheduling message for:', scheduledTime.toISOString());
      twilioParams.append('SendAt', scheduledTime.toISOString());
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
      JSON.stringify({ 
        success: true, 
        message: scheduleDate ? 'SMS scheduled successfully' : 'SMS sent successfully',
        result 
      }), 
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