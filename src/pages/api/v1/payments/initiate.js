import { supabase } from '@/lib/db';
import { successResponse, errorResponse, createdResponse } from '@/utils/apiResponse';

export async function POST(req) {
  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing or invalid token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return errorResponse('AUTH_001', 'Invalid authentication token', 401);
    }

    const body = await req.json();
    const { booking_id, method, idempotency_key } = body;

    if (!booking_id || !method) {
      return errorResponse('VALIDATION_ERR', 'booking_id and method are required', 400);
    }

    // Idempotency check
    if (idempotency_key) {
      const { data: existing } = await supabase
        .from('payments')
        .select('id, status')
        .eq('idempotency_key', idempotency_key)
        .maybeSingle();
      if (existing) {
        return successResponse('Payment already initiated', existing);
      }
    }

    // Verify booking belongs to user and is pending
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .eq('user_id', user.id)
      .single();

    if (bookingErr || !booking) {
      return errorResponse('NOT_FOUND', 'Booking not found', 404);
    }
    if (booking.payment_status === 'paid') {
      return errorResponse('PAY_002', 'Booking is already paid', 409);
    }

    // Create payment record
    const paymentData = {
      booking_id,
      user_id: user.id,
      amount: booking.total_amount,
      method,
      status: 'unpaid',
      idempotency_key: idempotency_key || undefined,
    };

    const { data: payment, error: payErr } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single();

    if (payErr) {
      return errorResponse('PAY_001', payErr.message, 500);
    }

    // Mock gateway response (SSLCommerz / bKash)
    // In production, this would call the actual payment gateway API
    const gatewayResponse = {
      payment_id: payment.id,
      redirect_url: `https://sandbox.sslcommerz.com/pay?order=${payment.id}`,
      status: 'INITIATED',
      message: 'Redirect user to payment gateway'
    };

    // Update payment with gateway info
    await supabase
      .from('payments')
      .update({ gateway_response: gatewayResponse })
      .eq('id', payment.id);

    return createdResponse('Payment initiated successfully', {
      payment_id: payment.id,
      amount: payment.amount,
      method: payment.method,
      gateway: gatewayResponse
    });
  } catch (err) {
    console.error('Payment initiate error:', err);
    return errorResponse('SERVER_ERR', 'Failed to initiate payment', 500);
  }
}
