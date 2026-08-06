import { supabase } from '@/lib/db';
import { successResponse, errorResponse } from '@/utils/apiResponse';
import { updateReview, deleteReview } from '@/models/Review';

/**
 * PATCH /api/v1/reviews/:id – Owner edits their review
 */
export async function PATCH(req, { params }) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return errorResponse('AUTH_001', 'Invalid token', 401);

    const { id } = params;
    const body = await req.json();
    const { rating, title, body: reviewBody, images } = body;

    const updates = {};
    if (rating !== undefined) updates.rating = rating;
    if (title !== undefined) updates.title = title;
    if (reviewBody !== undefined) updates.body = reviewBody;
    if (images !== undefined) updates.images = images;

    const updated = await updateReview(supabase, { reviewId: id, userId: user.id, updates });
    return successResponse('Review updated', updated);
  } catch (err) {
    console.error('Review PATCH error:', err);
    return errorResponse('SERVER_ERR', 'Failed to update review', 500);
  }
}

/**
 * DELETE /api/v1/reviews/:id – Owner deletes their review
 */
export async function DELETE(req, { params }) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return errorResponse('AUTH_001', 'Invalid token', 401);

    const { id } = params;
    await deleteReview(supabase, { reviewId: id, userId: user.id });
    return successResponse('Review deleted');
  } catch (err) {
    console.error('Review DELETE error:', err);
    return errorResponse('SERVER_ERR', 'Failed to delete review', 500);
  }
}
