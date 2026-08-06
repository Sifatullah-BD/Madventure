import { supabase } from '@/lib/db';
import { successResponse, errorResponse, createdResponse } from '@/utils/apiResponse';
import { createReview, getReviewsByTour, getUserReviews } from '@/models/Review';

export async function POST(req) {
  try {
    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return errorResponse('AUTH_001', 'Invalid token', 401);

    const body = await req.json();
    const { booking_id, tour_id, rating, title, body: reviewBody, images } = body;
    if (!booking_id || !rating) {
      return errorResponse('VALIDATION_ERR', 'booking_id and rating are required', 400);
    }
    const review = await createReview(supabase, {
      userId: user.id,
      bookingId: booking_id,
      tourId: tour_id,
      rating,
      title,
      body: reviewBody,
      images,
    });
    return createdResponse('Review created', review);
  } catch (err) {
    console.error('Review POST error:', err);
    return errorResponse('SERVER_ERR', 'Failed to create review', 500);
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const tourId = url.searchParams.get('tour_id');
    const userId = url.searchParams.get('user_id');
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    if (tourId) {
      const { reviews, total } = await getReviewsByTour(supabase, tourId, { limit, offset });
      return successResponse('Reviews fetched', reviews, { total, page: Math.floor(offset/limit)+1, limit });
    } else if (userId) {
      const { reviews, total } = await getUserReviews(supabase, userId, { limit, offset });
      return successResponse('User reviews fetched', reviews, { total, page: Math.floor(offset/limit)+1, limit });
    } else {
      return errorResponse('VALIDATION_ERR', 'Provide tour_id or user_id', 400);
    }
  } catch (err) {
    console.error('Review GET error:', err);
    return errorResponse('SERVER_ERR', 'Failed to fetch reviews', 500);
  }
}
