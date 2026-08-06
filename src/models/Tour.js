export const tourTable = 'tours';
export const tourScheduleTable = 'tour_schedules';

export const listPublishedTours = async (supabase, { limit = 20, offset = 0, place_id }) => {
  let query = supabase.from(tourTable).select('*, places(*)', { count: 'exact' }).eq('status', 'published');
  if (place_id) query = query.eq('place_id', place_id);
  
  const { data, error, count } = await query.range(offset, offset + limit - 1);
  if (error) throw error;
  return { tours: data, total: count };
};

export const getTourBySlug = async (supabase, slug) => {
  const { data, error } = await supabase
    .from(tourTable)
    .select('*, places(*), tour_schedules(*), user_profiles(full_name, avatar_url)')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
};

export const createTour = async (supabase, tourData) => {
  const { data, error } = await supabase.from(tourTable).insert([tourData]).select().single();
  if (error) throw error;
  return data;
};
