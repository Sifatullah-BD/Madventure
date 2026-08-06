import { supabase } from '@/lib/db';
import { successResponse, errorResponse } from '@/utils/apiResponse';

// GET /api/v1/places - list places with optional pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const { data, error, count } = await supabase
      .from('places')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return successResponse({ places: data, total: count });
  } catch (err) {
    return errorResponse(err);
  }
}

// POST /api/v1/places - create a new place (admin only)
export async function POST(req) {
  try {
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) return errorResponse({ message: 'Unauthenticated' }, 401);
    if (user.user_metadata?.role !== 'admin') return errorResponse({ message: 'Forbidden' }, 403);
    const body = await req.json();
    const { data, error } = await supabase.from('places').insert([body]).select().single();
    if (error) throw error;
    return successResponse(data, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
