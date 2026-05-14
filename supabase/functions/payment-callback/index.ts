import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type SslValidation = {
  status?: string
  tran_id?: string
  val_id?: string
  amount?: string
  store_amount?: string
  currency?: string
  [k: string]: unknown
}

type BookingRow = {
  id: string
  user_id: string
  total_price: number | string
  payment_status?: string
  status?: string
}

async function verifyValId(
  val_id: string,
  store_id: string,
  store_passwd: string,
  live: boolean,
): Promise<SslValidation | null> {
  const base = live
    ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI'
    : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI'
  const qs = new URLSearchParams({
    val_id,
    store_id,
    store_passwd,
    format: 'json',
  })
  const res = await fetch(`${base}?${qs.toString()}`)
  const text = await res.text()
  try {
    return JSON.parse(text) as SslValidation
  } catch {
    return null
  }
}

async function releaseInventory(admin: ReturnType<typeof createClient>, bookingId: string) {
  try {
    await admin.rpc('release_booking_inventory', { p_booking_id: bookingId })
  } catch (e) {
    console.warn('[payment-callback] release_booking_inventory', e)
  }
}

async function appendWalletLedgerForBooking(
  admin: ReturnType<typeof createClient>,
  booking: BookingRow,
  amount: number,
) {
  try {
    const uid = String(booking.user_id)
    let { data: wallet } = await admin.from('wallets').select('id,current_balance').eq('user_id', uid).maybeSingle()
    if (!wallet) {
      const ins = await admin.from('wallets').insert([{ user_id: uid }]).select('id,current_balance').single()
      wallet = ins.data as { id: string; current_balance: number }
    }
    if (!wallet?.id) return
    const bal = Number(wallet.current_balance ?? 0)
    await admin.from('wallet_ledger').insert([
      {
        wallet_id: wallet.id,
        transaction_type: 'booking_payment_external',
        reference_type: 'booking',
        reference_id: booking.id,
        debit: 0,
        credit: 0,
        balance_after: bal,
        remarks: `Gateway payment confirmed — BDT ${amount} (booking ${booking.id})`,
      },
    ])
  } catch (e) {
    console.warn('[payment-callback] wallet_ledger', e)
  }
}

async function logAudit(
  admin: ReturnType<typeof createClient>,
  action: string,
  opts: { entity_id?: string | null; actor_id?: string | null; metadata?: Record<string, unknown> },
) {
  try {
    await admin.from('audit_logs').insert([
      {
        actor_id: opts.actor_id ?? null,
        action,
        entity_type: 'booking',
        entity_id: opts.entity_id ?? null,
        metadata: opts.metadata ?? {},
      },
    ])
  } catch (e) {
    console.warn('[payment-callback] audit_logs', e)
  }
}

async function enqueueNotification(
  admin: ReturnType<typeof createClient>,
  userId: string,
  title: string,
  body: string,
  actionUrl: string,
) {
  try {
    await admin.from('notification_queue').insert([
      {
        user_id: userId,
        type: 'booking_confirmed',
        title,
        body,
        action_url: actionUrl,
        status: 'pending',
      },
    ])
  } catch (e) {
    console.warn('[payment-callback] notification_queue', e)
  }
}

serve(async (req) => {
  const frontendOrigin = (Deno.env.get('FRONTEND_URL') || 'http://localhost:5173').replace(/\/$/, '')
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const admin = createClient(supabaseUrl, serviceKey)

  const url = new URL(req.url)

  /** Local / sandbox mock: GET redirect from initiate-payment (testbox / PAYMENT_MOCK path). */
  if (url.searchParams.get('outcome') === 'mock_confirm') {
    const tid = url.searchParams.get('tran_id')
    const token = url.searchParams.get('token') || ''
    const expected = Deno.env.get('DEV_PAYMENT_SECRET') || 'local_mock_only'
    if (tid && token === expected) {
      const { data: booking } = await admin
        .from('bookings')
        .select('id,user_id,total_price')
        .eq('id', tid)
        .maybeSingle()
      await admin
        .from('bookings')
        .update({ status: 'confirmed', payment_status: 'paid' })
        .eq('id', tid)
      if (booking) {
        const amt = Number(booking.total_price)
        await appendWalletLedgerForBooking(admin, booking as BookingRow, amt)
        const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        await logAudit(admin, 'payment_confirmed_mock', {
          entity_id: tid,
          actor_id: uuidRe.test(String(booking.user_id)) ? String(booking.user_id) : null,
          metadata: { tran_id: tid, amount: amt },
        })
        await enqueueNotification(
          admin,
          String(booking.user_id),
          'Booking confirmed',
          `Your booking is confirmed. Amount BDT ${amt}.`,
          `${frontendOrigin}/wallet`,
        )
      }
      return Response.redirect(
        `${frontendOrigin}/payment-success?booking_id=${encodeURIComponent(tid)}`,
      )
    }
    return Response.redirect(`${frontendOrigin}/payment-fail`)
  }

  let tran_id: string | null = url.searchParams.get('tran_id')
  let val_id: string | null = url.searchParams.get('val_id')
  let amountStr: string | null = url.searchParams.get('amount')

  if (req.method === 'POST') {
    try {
      const form = await req.formData()
      tran_id = (form.get('tran_id') as string) || tran_id
      val_id = (form.get('val_id') as string) || val_id
      amountStr = (form.get('amount') as string) || amountStr
    } catch {
      // ignore
    }
  }

  const redirectFail = () =>
    Response.redirect(`${frontendOrigin}/payment-fail?booking_id=${encodeURIComponent(tran_id || '')}`)
  const redirectOk = () =>
    Response.redirect(`${frontendOrigin}/payment-success?booking_id=${encodeURIComponent(tran_id || '')}`)

  if (!tran_id) {
    return redirectFail()
  }

  /** SSLCommerz includes val_id on successful payment notification. */
  if (!val_id) {
    await releaseInventory(admin, tran_id)
    await admin
      .from('bookings')
      .update({ status: 'failed', payment_status: 'failed' })
      .eq('id', tran_id)
    await logAudit(admin, 'payment_failed_no_val_id', {
      entity_id: tran_id,
      actor_id: null,
      metadata: { tran_id },
    })
    return redirectFail()
  }

  const skipVerify = Deno.env.get('SKIP_SSL_VERIFY') === '1'
  const store_id = Deno.env.get('SSLCOMMERZ_STORE_ID') || 'testbox'
  const store_passwd = Deno.env.get('SSLCOMMERZ_STORE_PASSWORD') || 'testpass'
  const live = Deno.env.get('SSLCOMMERZ_LIVE') === '1'

  if (skipVerify && live) {
    console.warn('⚠️ CRITICAL SECURITY WARNING: SKIP_SSL_VERIFY is enabled in a LIVE environment.')
  }

  let verified: SslValidation | null = null
  if (!skipVerify) {
    // 1. Validate via SSLCommerz Validator API (Strongest check)
    verified = await verifyValId(val_id, store_id, store_passwd, live)
    
    if (!verified || String(verified.status).toUpperCase() !== 'VALID') {
      await releaseInventory(admin, tran_id)
      await admin
        .from('bookings')
        .update({ status: 'failed', payment_status: 'failed' })
        .eq('id', tran_id)
      await logAudit(admin, 'payment_ssl_invalid', {
        entity_id: tran_id,
        actor_id: null,
        metadata: { val_id, response: verified },
      })
      return redirectFail()
    }

    // 2. Cross-check Transaction ID
    if (verified.tran_id && String(verified.tran_id) !== String(tran_id)) {
      await releaseInventory(admin, tran_id)
      await logAudit(admin, 'payment_tran_mismatch', {
        entity_id: tran_id,
        actor_id: null,
        metadata: { expected_tran: tran_id, got_tran: verified.tran_id },
      })
      return redirectFail()
    }
    amountStr = (verified.amount as string) || amountStr
  }

  const { data: dup } = await admin
    .from('payment_transactions')
    .select('id')
    .eq('val_id', val_id)
    .maybeSingle()
  if (dup) {
    return redirectOk()
  }

  const { data: booking, error: bookErr } = await admin
    .from('bookings')
    .select('id,user_id,total_price,payment_status,status')
    .eq('id', tran_id)
    .maybeSingle()

  if (bookErr || !booking) {
    return redirectFail()
  }

  if (booking.payment_status === 'paid') {
    return redirectOk()
  }

  const paidAmount = Number(amountStr)
  const expected = Number(booking.total_price)
  if (Number.isFinite(paidAmount) && Number.isFinite(expected) && Math.abs(paidAmount - expected) > 0.5) {
    await releaseInventory(admin, tran_id)
    await admin.from('payment_transactions').insert([
      {
        booking_id: booking.id,
        user_id: String(booking.user_id),
        tran_id,
        val_id,
        amount: paidAmount,
        payment_status: 'amount_mismatch',
        gateway_response: verified || { skipped: skipVerify },
      },
    ])
    await admin
      .from('bookings')
      .update({ status: 'failed', payment_status: 'failed' })
      .eq('id', tran_id)
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    await logAudit(admin, 'payment_amount_mismatch', {
      entity_id: tran_id,
      actor_id: uuidRe.test(String(booking.user_id)) ? String(booking.user_id) : null,
      metadata: { paidAmount, expected },
    })
    return redirectFail()
  }

  await admin.from('payment_transactions').insert([
    {
      booking_id: booking.id,
      user_id: String(booking.user_id),
      tran_id,
      val_id,
      amount: expected,
      payment_status: 'paid',
      gateway_response: verified || { skipped: skipVerify },
      paid_at: new Date().toISOString(),
    },
  ])

  await admin
    .from('bookings')
    .update({ status: 'confirmed', payment_status: 'paid' })
    .eq('id', tran_id)

  await appendWalletLedgerForBooking(admin, booking as BookingRow, expected)
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  await logAudit(admin, 'payment_confirmed', {
    entity_id: tran_id,
    actor_id: uuidRe.test(String(booking.user_id)) ? String(booking.user_id) : null,
    metadata: { val_id, tran_id, amount: expected },
  })
  await enqueueNotification(
    admin,
    String(booking.user_id),
    'Booking confirmed',
    `Payment received. BDT ${expected}.`,
    `${frontendOrigin}/wallet`,
  )

  return redirectOk()
})
