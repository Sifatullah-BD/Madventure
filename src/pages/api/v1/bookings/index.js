import { supabase } from '@/lib/db';
import { successResponse, errorResponse } from '@/utils/apiResponse';

// GET /api/v1/bookings - list bookings for authenticated user
export async function GET(req) {
  try {
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) return errorResponse({ message: 'Unauthenticated' }, 401);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, tour_schedules(*, tours(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}

// POST /api/v1/bookings - create a new booking (authenticated users)
export async function POST(req) {
  try {
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) return errorResponse({ message: 'Unauthenticated' }, 401);
    const body = await req.json();
    // Ensure the booking is linked to the authenticated user
    const bookingData = { ...body, user_id: user.id };
    const { data, error } = await supabase.from('bookings').insert([bookingData]).select().single();
    if (error) throw error;
    return successResponse(data, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
