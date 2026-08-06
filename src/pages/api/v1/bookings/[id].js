import { supabase } from '@/lib/db';
import { successResponse, errorResponse } from '@/utils/apiResponse';

// GET /api/v1/bookings/[id] – fetch a single booking for the authenticated user
export async function GET(req) {
  try {
    const { query } = req;
    const bookingId = query.id;
    if (!bookingId) return errorResponse({ message: 'Missing booking ID' }, 400);

    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) return errorResponse({ message: 'Unauthenticated' }, 401);

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*, tour_schedules(*, tours(*))')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return errorResponse({ message: 'Booking not found' }, 404);
      throw error;
    }
    return successResponse(booking);
  } catch (err) {
    return errorResponse(err);
  }
}

// PATCH /api/v1/bookings/[id] – update booking status (user can cancel, admin can confirm)
export async function PATCH(req) {
  try {
    const { query } = req;
    const bookingId = query.id;
    if (!bookingId) return errorResponse({ message: 'Missing booking ID' }, 400);

    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) return errorResponse({ message: 'Unauthenticated' }, 401);

    const { status } = await req.json();
    if (!status) return errorResponse({ message: 'Missing status field' }, 400);

    // Allow user to cancel their own booking, admin can set any status
    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('user_id')
      .eq('id', bookingId)
      .single();
    if (fetchErr) throw fetchErr;

    const isAdmin = user.user_metadata?.role === 'admin';
    if (!isAdmin && booking.user_id !== user.id) {
      return errorResponse({ message: 'Forbidden' }, 403);
    }
    if (!isAdmin && status !== 'canceled') {
      return errorResponse({ message: 'Users may only cancel bookings' }, 403);
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();
    if (error) throw error;
    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}
