import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db';

/**
 * Hook to fetch a single published tour by its slug, including place info and schedules.
 * Returns { tour, loading, error }.
 */
export const useTourDetail = (slug) => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const fetchTour = async () => {
      try {
        const { data, error } = await supabase
          .from('tours')
          .select('*, places(*), tour_schedules(*)')
          .eq('slug', slug)
          .eq('published', true)
          .single();
        if (error) throw error;
        // Sort schedules chronologically
        if (data.tour_schedules) {
          data.tour_schedules.sort((a, b) => new Date(a.start_timestamp) - new Date(b.start_timestamp));
        }
        setTour(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [slug]);

  return { tour, loading, error };
};
