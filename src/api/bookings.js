import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * BOOKINGS API — Connected to Supabase `bookings` table
 */

// Fallback mock booking (localStorage)
const handleMockBooking = async (bookingData) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newBooking = {
                ...bookingData,
                id: `bkg_${Date.now()}`,
                status: 'pending',
                payment_status: 'unpaid',
                created_at: new Date().toISOString()
            };
            const existing = JSON.parse(localStorage.getItem('madventure_bookings') || '[]');
            existing.push(newBooking);
            localStorage.setItem('madventure_bookings', JSON.stringify(existing));
            resolve({ data: newBooking, error: null });
        }, 600);
    });
};

/**
 * Create a new booking
 */
export const createBooking = async ({
    userId,
    tourId,
    travelDate,
    totalPrice,
    travelers = [],
    specialRequests = '',
    paymentMethod = 'online'
}) => {
    if (!isSupabaseConfigured || !userId) {
        return handleMockBooking({
            user_id: userId,
            tour_id: tourId,
            travel_date: travelDate,
            total_price: totalPrice,
            travelers,
            special_requests: specialRequests,
            payment_method: paymentMethod,
        });
    }

    const { data, error } = await supabase
        .from('bookings')
        .insert([{
            user_id: userId,
            tour_id: tourId,
            travel_date: travelDate,
            total_price: totalPrice,
            travelers: travelers,
            special_requests: specialRequests,
            payment_method: paymentMethod,
            status: 'pending',
            payment_status: 'unpaid',
        }])
        .select()
        .single();

    return { data, error };
};

/**
 * Get all bookings for a user
 */
export const getUserBookings = async (userId) => {
    if (!isSupabaseConfigured || !userId) {
        const local = JSON.parse(localStorage.getItem('madventure_bookings') || '[]');
        return { data: local.filter(b => b.user_id === userId), error: null };
    }

    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    return { data: data || [], error };
};

/**
 * Get single booking by ID
 */
export const getBookingById = async (bookingId) => {
    if (!isSupabaseConfigured) {
        const local = JSON.parse(localStorage.getItem('madventure_bookings') || '[]');
        return { data: local.find(b => b.id === bookingId) || null, error: null };
    }

    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

    return { data, error };
};

/**
 * Update booking status (confirm, cancel, complete)
 */
export const updateBookingStatus = async (bookingId, status, paymentStatus = null) => {
    if (!isSupabaseConfigured) {
        const local = JSON.parse(localStorage.getItem('madventure_bookings') || '[]');
        const updated = local.map(b => b.id === bookingId ? { ...b, status, ...(paymentStatus && { payment_status: paymentStatus }) } : b);
        localStorage.setItem('madventure_bookings', JSON.stringify(updated));
        return { data: updated.find(b => b.id === bookingId), error: null };
    }

    const updates = { status };
    if (paymentStatus) updates.payment_status = paymentStatus;

    const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .select()
        .single();

    return { data, error };
};

/**
 * Confirm payment after SSLCommerz callback
 */
export const confirmPayment = async (bookingId, transactionId) => {
    if (!isSupabaseConfigured) {
        return updateBookingStatus(bookingId, 'confirmed', 'paid');
    }

    const { data, error } = await supabase
        .from('bookings')
        .update({
            status: 'confirmed',
            payment_status: 'paid',
            transaction_id: transactionId,
        })
        .eq('id', bookingId)
        .select()
        .single();

    return { data, error };
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId, userId) => {
    if (!isSupabaseConfigured) {
        return updateBookingStatus(bookingId, 'cancelled');
    }

    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', userId) // Only owner can cancel
        .select()
        .single();

    return { data, error };
};

/**
 * Request a refund
 */
export const requestRefund = async (bookingId, reason) => {
    if (!isSupabaseConfigured) {
        return { data: { id: `ref_${Date.now()}`, status: 'pending' }, error: null };
    }

    // Update booking status to refund requested
    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'refund_requested', special_requests: `REFUND: ${reason}` })
        .eq('id', bookingId)
        .select()
        .single();

    return { data, error };
};

/**
 * Get bookings for agency/admin
 */
export const getAgencyBookings = async (agencyId) => {
    if (!isSupabaseConfigured) {
        return { data: [], error: null };
    }

    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

    return { data: data || [], error };
};

// Legacy alias for backward compatibility
export const createPendingBooking = async ({ userId, entityId, entityType, bookingDate, totalPrice, extras = {} }) => {
    return createBooking({
        userId,
        tourId: entityId,
        travelDate: bookingDate,
        totalPrice,
        travelers: extras.travelers || [],
        specialRequests: extras.notes || '',
        paymentMethod: 'online',
    });
};
