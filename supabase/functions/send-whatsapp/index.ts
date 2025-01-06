import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const WHATSAPP_NUMBER = "+353838770548";
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
    const { reminder } = await req.json();
    console.log('Received reminder data:', reminder);

    if (!reminder || !reminder.provider_name || !reminder.due_date || !reminder.amount) {
      throw new Error('Missing required reminder data');
    }

    console.log('Attempting to send WhatsApp message via Twilio');
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${Deno.env.get('TWILIO_ACCOUNT_SID')}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${Deno.env.get('TWILIO_ACCOUNT_SID')}:${Deno.env.get('TWILIO_AUTH_TOKEN')}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: `whatsapp:${WHATSAPP_NUMBER}`,
          From: `whatsapp:${Deno.env.get('TWILIO_PHONE_NUMBER')}`,
          Body: `Reminder: Your ${reminder.provider_name} bill of €${reminder.amount} is due on day ${reminder.due_date} of this month.`,
        }),
      }
    );

    const result = await twilioResponse.json();
    console.log('Twilio API response:', result);

    if (!twilioResponse.ok) {
      throw new Error(result.message || 'Failed to send WhatsApp message');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'WhatsApp message sent successfully' }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in send-whatsapp function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        details: 'Failed to send WhatsApp message' 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});