export const placeTable = 'places';

// List all places
export const listPlaces = async (supabase, { limit = 20, offset = 0 } = {}) => {
  const { data, error, count } = await supabase
    .from(placeTable)
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return { places: data, total: count };
};

// Create a new place (admin only)
export const createPlace = async (supabase, placeData) => {
  const { data, error } = await supabase.from(placeTable).insert([placeData]).select().single();
  if (error) throw error;
  return data;
};
