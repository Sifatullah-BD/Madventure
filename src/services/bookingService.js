/**
 * bookingService.js – Booking CRUD operations via Supabase
 * All mutations go through this service to ensure consistent RLS behaviour.
 */
import { supabase } from '../lib/supabase';

export const bookingService = {
  /**
   * Fetch all bookings for the currently authenticated user.
   */
  async getMyBookings() {
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
  },

  /**
   * Get a single booking by ID (user must own it – enforced by RLS).
   */
  async getBookingById(id) {
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
  },

  /**
   * Create a new booking.
   * @param {Object} payload – { tour_id, num_adults, num_children, scheduled_date, notes, total_price, extras }
   */
  async createBooking(payload) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

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
  },

  /**
   * Cancel a booking by ID.
   * @param {string} id – booking UUID
   * @param {string} reason – optional cancellation reason
   */
  async cancelBooking(id, reason = '') {
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
  },

  /**
   * Admin: get all bookings (requires admin role enforced by RLS).
   */
  async getAllBookings({ limit = 50, offset = 0 } = {}) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`*, tours(title, destination), profiles(full_name)`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data;
  },

  /**
   * Agency: get bookings for a specific tour.
   */
  async getBookingsByTour(tourId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, profiles(full_name)')
      .eq('tour_id', tourId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};
