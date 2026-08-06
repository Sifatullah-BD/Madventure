export const tourScheduleTable = 'tour_schedules';

// List schedules for a tour with optional date filter
export const listSchedules = async (supabase, { tourId, startDate, endDate, limit = 20, offset = 0 }) => {
  let query = supabase
    .from(tourScheduleTable)
    .select('*, tours(*)', { count: 'exact' })
    .eq('tour_id', tourId);
  if (startDate) query = query.gte('start_timestamp', startDate);
  if (endDate) query = query.lte('end_timestamp', endDate);
  const { data, error, count } = await query.range(offset, offset + limit - 1);
  if (error) throw error;
  return { schedules: data, total: count };
};

// Create a schedule (admin only)
export const createSchedule = async (supabase, scheduleData) => {
  const { data, error } = await supabase.from(tourScheduleTable).insert([scheduleData]).select().single();
  if (error) throw error;
  return data;
};
