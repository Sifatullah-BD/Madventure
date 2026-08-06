import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/db';
import { useAuth } from './useAuth';

/**
 * useReviews – Fetch, create, edit, and delete reviews for a specific tour.
 *
 * @param {string}  tourId  – The tour ID to fetch reviews for
 * @param {object}  opts
 * @param {number}  opts.limit   – items per page (default 10)
 * @param {boolean} opts.enabled – skip fetching when false
 */
export const useReviews = (tourId, { limit = 10, enabled = true } = {}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const offset = (page - 1) * limit;

  const fetchReviews = useCallback(async () => {
    if (!enabled || !tourId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr, count } = await supabase
        .from('reviews')
        .select('*, author:user_id (id, avatar_url, username, full_name)', { count: 'exact' })
        .eq('tour_id', tourId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (fetchErr) throw fetchErr;
      setReviews(data || []);
      setTotal(count || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [tourId, offset, limit, enabled]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

  // Submit a new review
  const submitReview = useCallback(async ({ bookingId, rating, title, body, images }) => {
    if (!user) throw new Error('Must be logged in');
    setSubmitting(true);
    try {
      const { data, error: insertErr } = await supabase
        .from('reviews')
        .insert([{
          user_id: user.id,
          booking_id: bookingId,
          tour_id: tourId,
          rating,
          title,
          body,
          images: images || [],
        }])
        .select('*, author:user_id (id, avatar_url, username, full_name)')
        .single();

      if (insertErr) throw insertErr;
      // Prepend optimistically
      setReviews((prev) => [data, ...prev]);
      setTotal((prev) => prev + 1);
      return data;
    } finally {
      setSubmitting(false);
    }
  }, [user, tourId]);

  // Edit a review (owner only)
  const editReview = useCallback(async (reviewId, updates) => {
    if (!user) throw new Error('Must be logged in');
    const { data, error: editErr } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', reviewId)
      .eq('user_id', user.id)
      .select('*, author:user_id (id, avatar_url, username, full_name)')
      .single();

    if (editErr) throw editErr;
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? data : r)));
    return data;
  }, [user]);

  // Delete a review (owner only)
  const removeReview = useCallback(async (reviewId) => {
    if (!user) throw new Error('Must be logged in');
    const { error: delErr } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', user.id);

    if (delErr) throw delErr;
    // Optimistic removal
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    setTotal((prev) => Math.max(0, prev - 1));
  }, [user]);

  const totalPages = Math.ceil(total / limit);

  return {
    reviews,
    total,
    averageRating,
    page,
    totalPages,
    setPage,
    loading,
    error,
    submitting,
    submitReview,
    editReview,
    removeReview,
    refetch: fetchReviews,
  };
};

export default useReviews;
