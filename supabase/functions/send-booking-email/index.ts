import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name, bookingId, tourTitle, totalAmount, date } = await req.json()

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not provided. Email suppressed.")
      return new Response(JSON.stringify({ message: "Simulated Email Sent" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Madventure <bookings@madventure.com>',
        to: [email],
        subject: `Booking Confirmed: ${tourTitle}`,
        html: `
          <h1>Hi ${name},</h1>
          <p>Your booking for <strong>${tourTitle}</strong> on <strong>${date}</strong> has been confirmed.</p>
          <p><strong>Booking Reference:</strong> ${bookingId}</p>
          <p><strong>Total Paid:</strong> ৳${totalAmount}</p>
          <br/>
          <p>Looking forward to exploring with you!</p>
          <p>The Madventure Team</p>
        `
      })
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
