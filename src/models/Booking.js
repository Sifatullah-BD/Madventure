export const bookingTable = 'bookings';

export const createBooking = async (supabase, bookingData) => {
  const { data, error } = await supabase.from(bookingTable).insert([bookingData]).select().single();
  if (error) throw error;
  return data;
};

export const listUserBookings = async (supabase, userId) => {
  const { data, error } = await supabase
    .from(bookingTable)
    .select('*, tour_schedules(*, tours(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getBookingById = async (supabase, bookingId, userId) => {
  const { data, error } = await supabase
    .from(bookingTable)
    .select('*, tour_schedules(*, tours(*))')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
};
