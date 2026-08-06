import { supabase } from '@/lib/db';
import { successResponse, errorResponse } from '@/utils/apiResponse';

// GET /api/v1/tours/[slug] – fetch a single published tour with place and schedules
export async function GET(req) {
  try {
    const { query } = req; // Next.js provides query params for dynamic routes
    const slug = query.slug;
    if (!slug) return errorResponse({ message: 'Missing slug' }, 400);

    // Fetch tour, its place, and related schedules
    const { data: tour, error: tourError } = await supabase
      .from('tours')
      .select('*, places(*), tour_schedules(*)')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    if (tourError) {
      if (tourError.code === 'PGRST116') return errorResponse({ message: 'Tour not found' }, 404);
      throw tourError;
    }

    // Optionally, you could sort schedules by start_timestamp
    if (tour.tour_schedules) {
      tour.tour_schedules.sort((a, b) => new Date(a.start_timestamp) - new Date(b.start_timestamp));
    }

    return successResponse(tour);
  } catch (err) {
    return errorResponse(err);
  }
}

// No POST/PUT for public route – admin actions are handled elsewhere.
