import { serve } from "https://deno.fresh.dev/std@v9.6.1/http/server.ts";

const WHATSAPP_NUMBER = "+353838770548";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { reminder } = await req.json();

    const twilioClient = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${Deno.env.get('TWILIO_ACCOUNT_SID')}/Messages.json`, {
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
    });

    const result = await twilioClient.json();

    if (!twilioClient.ok) {
      throw new Error(result.message || 'Failed to send WhatsApp message');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});