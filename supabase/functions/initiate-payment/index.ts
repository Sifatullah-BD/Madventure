import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return json(401, { error: 'Missing Authorization' })
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userData?.user) {
      return json(401, { error: 'Invalid session' })
    }
    const authUser = userData.user

    const { bookingId, amount, cus_name, cus_email, cus_phone } = await req.json()
    if (!bookingId || amount == null) {
      return json(400, { error: 'bookingId and amount are required' })
    }

    const admin = createClient(supabaseUrl, serviceKey)
    const { data: booking, error: bErr } = await admin
      .from('bookings')
      .select('id,user_id,total_price,status,payment_status')
      .eq('id', bookingId)
      .maybeSingle()

    if (bErr || !booking) {
      return json(404, { error: 'Booking not found' })
    }
    if (String(booking.user_id) !== String(authUser.id)) {
      return json(403, { error: 'Not allowed for this booking' })
    }
    if (booking.payment_status === 'paid' || booking.status === 'confirmed') {
      return json(400, { error: 'Booking already paid' })
    }

    const expected = Number(booking.total_price)
    const got = Number(amount)
    if (!Number.isFinite(expected) || !Number.isFinite(got) || Math.abs(expected - got) > 0.5) {
      return json(400, { error: 'Amount mismatch' })
    }

    const store_id = Deno.env.get('SSLCOMMERZ_STORE_ID')
    const store_passwd = Deno.env.get('SSLCOMMERZ_STORE_PASSWORD')
    const paymentMock = Deno.env.get('PAYMENT_MOCK') === '1'
    const useSandbox = Deno.env.get('SSLCOMMERZ_LIVE') !== '1'
    const isTestbox = !store_id || store_id === 'testbox' || paymentMock

    const apiurl = useSandbox
      ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
      : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'

    const callbackBase = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/payment-callback`

    const formData = new URLSearchParams()
    formData.append('store_id', store_id || 'testbox')
    formData.append('store_passwd', store_passwd || 'testpass')
    formData.append('total_amount', String(got))
    formData.append('currency', 'BDT')
    formData.append('tran_id', String(bookingId))
    formData.append('success_url', `${callbackBase}?outcome=success`)
    formData.append('fail_url', `${callbackBase}?outcome=fail`)
    formData.append('cancel_url', `${callbackBase}?outcome=cancel`)
    formData.append('cus_name', cus_name || 'Customer')
    formData.append('cus_email', cus_email || authUser.email || 'customer@example.com')
    formData.append('cus_add1', 'Dhaka')
    formData.append('cus_city', 'Dhaka')
    formData.append('cus_country', 'Bangladesh')
    formData.append('cus_phone', cus_phone || '01700000000')
    formData.append('shipping_method', 'NO')
    formData.append('product_name', 'Travel Service')
    formData.append('product_category', 'Travel')
    formData.append('product_profile', 'general')

    if (isTestbox) {
      const devToken = Deno.env.get('DEV_PAYMENT_SECRET') || 'local_mock_only'
      const mockGatewayURL = `${callbackBase}?outcome=mock_confirm&tran_id=${encodeURIComponent(String(bookingId))}&token=${encodeURIComponent(devToken)}`
      return new Response(JSON.stringify({ GatewayPageURL: mockGatewayURL }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const sslRes = await fetch(apiurl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })
    const sslText = await sslRes.text()
    let sslJson: Record<string, unknown> = {}
    try {
      sslJson = JSON.parse(sslText)
    } catch {
      return json(502, { error: 'Invalid gateway response', raw: sslText.slice(0, 200) })
    }
    const gw = sslJson['GatewayPageURL'] as string | undefined
    if (!gw) {
      return json(502, { error: 'GatewayPageURL missing', ssl: sslJson })
    }
    return new Response(JSON.stringify({ GatewayPageURL: gw }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return json(400, { error: (error as Error).message })
  }
})
