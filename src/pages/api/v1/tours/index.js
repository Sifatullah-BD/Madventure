import { supabase } from '@/lib/db';
import { successResponse, errorResponse } from '@/utils/apiResponse';

// GET /api/v1/tours - list published tours with optional pagination and place filter
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const place_id = searchParams.get('place_id');

    let query = supabase
      .from('tours')
      .select('*, places(*)', { count: 'exact' })
      .eq('published', true);
    if (place_id) query = query.eq('place_id', place_id);
    const { data, error, count } = await query.range(offset, offset + limit - 1);
    if (error) throw error;
    return successResponse({ tours: data, total: count });
  } catch (err) {
    return errorResponse(err);
  }
}

// POST /api/v1/tours - create a new tour (admin only)
export async function POST(req) {
  try {
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) return errorResponse({ message: 'Unauthenticated' }, 401);
    // Assuming role is stored in user.user_metadata.role
    if (user.user_metadata?.role !== 'admin') return errorResponse({ message: 'Forbidden' }, 403);
    const body = await req.json();
    const { data, error } = await supabase.from('tours').insert([body]).select().single();
    if (error) throw error;
    return successResponse(data, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
