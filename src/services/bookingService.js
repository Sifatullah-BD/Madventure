/**
 * bookingService.js – Booking CRUD operations via Supabase
 * All mutations go through this service to ensure consistent RLS behaviour.
 */
import { supabase } from '../lib/supabase';

export const getMyBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      tours(id, title, destination, images, price_per_person),
      payment_transactions(id, amount, payment_status, created_at)
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getBookingById = async (id) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      tours(id, title, destination, images, price_per_person, agency_id),
      payment_transactions(*)
    `)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const createBooking = async (payload) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // For backward compatibility if schedule_id isn't provided by the older UI yet
  if (!payload.schedule_id || !payload.travelers) {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        status: 'pending',
        payment_status: 'pending',
        ...payload,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Call RPC for transactional booking
  const { data, error } = await supabase.rpc('create_tour_booking', {
    p_user_id: user.id,
    p_tour_id: payload.tour_id,
    p_schedule_id: payload.schedule_id,
    p_quantity: payload.quantity,
    p_unit_price: payload.unit_price,
    p_travelers: payload.travelers,
    p_notes: payload.notes || ''
  });

  if (error) throw error;
  
  // Return the newly created booking ID in an object matching the old format
  return { id: data };
};

export const createPendingBooking = async ({ userId, entityType, entityId, bookingDate, totalPrice, extras = {} }) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        user_id: userId,
        entity_id: entityId,
        booking_status: 'pending',
        total_price: totalPrice,
        booking_date: bookingDate,
        extras
      }])
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const cancelBooking = async (id, reason = '') => {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancel_reason: reason,
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getAllBookings = async ({ limit = 50, offset = 0 } = {}) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, tours(title, destination), profiles(full_name)`)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
};

export const getBookingsByTour = async (tourId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, profiles(full_name)')
    .eq('tour_id', tourId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getAgencyBookings = async (agencyId, { page = 1, limit = 10 } = {}) => {
  try {
    const offset = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('bookings')
      .select('*, tours!inner(agency_id, title), user_profiles(full_name, phone)', { count: 'exact' })
      .eq('tours.agency_id', agencyId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  } catch (err) {
    console.warn('getAgencyBookings error:', err);
    return { data: [], count: 0 };
  }
};

export const bookingService = {
  getMyBookings,
  getBookingById,
  createBooking,
  createPendingBooking,
  cancelBooking,
  getAllBookings,
  getBookingsByTour,
  getAgencyBookings,
};
