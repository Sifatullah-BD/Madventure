import { supabase } from '@/lib/db';
import { successResponse, errorResponse } from '@/utils/apiResponse';

// GET /api/v1/tours/schedules?tourId=...&startDate=...&endDate=...
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tourId = searchParams.get('tourId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;

    if (!tourId) return errorResponse({ message: 'tourId is required' }, 400);

    let query = supabase
      .from('tour_schedules')
      .select('*, tours(*)', { count: 'exact' })
      .eq('tour_id', tourId);
    if (startDate) query = query.gte('start_timestamp', startDate);
    if (endDate) query = query.lte('end_timestamp', endDate);

    const { data, error, count } = await query.range(offset, offset + limit - 1);
    if (error) throw error;
    return successResponse({ schedules: data, total: count });
  } catch (err) {
    return errorResponse(err);
  }
}

// POST /api/v1/tours/schedules - create schedule (admin only)
export async function POST(req) {
  try {
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) return errorResponse({ message: 'Unauthenticated' }, 401);
    if (user.user_metadata?.role !== 'admin') return errorResponse({ message: 'Forbidden' }, 403);

    const body = await req.json();
    const { data, error } = await supabase.from('tour_schedules').insert([body]).select().single();
    if (error) throw error;
    return successResponse(data, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
