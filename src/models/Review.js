export const reviewTable = 'reviews';

// Create a review for a booking (must be booking owned by user)
export const createReview = async (supabase, { userId, bookingId, tourId, rating, title, body, images }) => {
  // Verify booking exists and belongs to user
  const { data: booking, error: bookingErr } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .single();
  if (bookingErr || !booking) throw new Error('Invalid booking');

  const reviewData = {
    user_id: userId,
    booking_id: bookingId,
    tour_id: tourId,
    rating,
    title,
    body,
    images: images || []
  };

  const { data, error } = await supabase.from(reviewTable).insert([reviewData]).single();
  if (error) throw error;
  return data;
};

export const getReviewsByTour = async (supabase, tourId, { limit = 20, offset = 0 }) => {
  const { data, error, count } = await supabase
    .from(reviewTable)
    .select('*', { count: 'exact' })
    .eq('tour_id', tourId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return { reviews: data, total: count };
};

export const getUserReviews = async (supabase, userId, { limit = 20, offset = 0 }) => {
  const { data, error, count } = await supabase
    .from(reviewTable)
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return { reviews: data, total: count };
};

export const updateReview = async (supabase, { reviewId, userId, updates }) => {
  // Only allow owner to edit
  const { data, error } = await supabase
    .from(reviewTable)
    .update(updates)
    .eq('id', reviewId)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteReview = async (supabase, { reviewId, userId }) => {
  const { error } = await supabase
    .from(reviewTable)
    .delete()
    .eq('id', reviewId)
    .eq('user_id', userId);
  if (error) throw error;
  return true;
};
