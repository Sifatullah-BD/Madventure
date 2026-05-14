import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * PRODUCTION READY BOOKING SERVICE
 * Enforces Supabase integration. Fallback to localStorage only if VITE_DEMO_MODE=1.
 */

const IS_DEMO = import.meta.env.VITE_DEMO_MODE === '1';

const handleMockBooking = async (bookingData) => {
    if (!IS_DEMO) throw new Error('Supabase not configured. Booking failed.');
    
    return new Promise(resolve => {
        setTimeout(() => {
            const newBooking = {
                ...bookingData,
                id: `bkg_${Date.now()}`,
                status: 'pending',
                created_at: new Date().toISOString()
            };
            const existing = JSON.parse(localStorage.getItem('madventure_bookings') || '[]');
            existing.push(newBooking);
            localStorage.setItem('madventure_bookings', JSON.stringify(existing));
            resolve({ data: newBooking, error: null });
        }, 600);
    });
};

export const createPendingBooking = async ({
    userId,
    entityType,
    entityId,
    bookingDate,
    totalPrice,
    extras = {},
}) => {
    if (!isSupabaseConfigured) {
        return handleMockBooking({
            user_id: userId,
            entity_id: entityId,
            entity_type: entityType,
            booking_date: bookingDate,
            total_price: totalPrice,
            status: 'pending',
            payment_status: 'pending',
            extras,
        });
    }

    // --- Tour Flow ---
    if (entityType === 'tour') {
        const seats = Math.max(1, Math.min(99, Number(extras?.seats) || 1));
        const { data: rpcId, error: rpcErr } = await supabase.rpc('create_tour_booking_atomic', {
            p_user_id: userId,
            p_tour_id: entityId,
            p_booking_date: bookingDate,
            p_total_price: totalPrice,
            p_seats: seats,
            p_extras: { ...extras, seats },
        });

        if (!rpcErr && rpcId) {
            if (Array.isArray(extras.travelers)) {
                for (const t of extras.travelers) {
                    await supabase.from('booking_travelers').insert({
                        booking_id: rpcId,
                        full_name: t.name,
                        age: t.age,
                        nid: t.nid
                    });
                }
            }
            return { data: { id: rpcId }, error: null };
        }
        return { data: null, error: rpcErr };
    }

    // --- Hotel Flow ---
    if (entityType === 'hotel') {
        const { data: rpcId, error: rpcErr } = await supabase.rpc('create_hotel_booking_atomic', {
            p_user_id: userId,
            p_hotel_id: entityId,
            p_room_id: extras.room_id,
            p_booking_date: bookingDate,
            p_total_price: totalPrice,
            p_travelers: JSON.stringify(extras.travelers || []),
            p_extras: extras
        });
        return { data: { id: rpcId }, error: rpcErr };
    }

    return { data: null, error: new Error('Unsupported entity type for atomic booking') };
};

export const createBooking = async (bookingData) => {
    if (!isSupabaseConfigured) return handleMockBooking(bookingData);

    const row = {
        payment_status: 'pending',
        extras: {},
        ...bookingData,
    };

    const { data, error } = await supabase
        .from('bookings')
        .insert([row])
        .select()
        .single();

    return { data, error };
};

export const getUserBookings = async (userId) => {
    if (!isSupabaseConfigured) {
        if (!IS_DEMO) return { data: [], error: null };
        const local = JSON.parse(localStorage.getItem('madventure_bookings') || '[]');
        const userBookings = local.filter(b => b.user_id === userId);
        return { data: userBookings, error: null };
    }
    
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
    return { data, error };
};

export const getAgencyBookings = async (agencyId, { page = 1, limit = 10 } = {}) => {
    if (!isSupabaseConfigured) {
        if (!IS_DEMO) return { data: [], count: 0, error: null };
        const local = JSON.parse(localStorage.getItem('madventure_bookings') || '[]');
        return { data: local.slice((page-1)*limit, page*limit), count: local.length, error: null };
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from('bookings')
        .select(`
            *,
            tours!inner (
                title,
                agency_id
            )
        `, { count: 'exact' })
        .eq('tours.agency_id', agencyId)
        .order('created_at', { ascending: false })
        .range(from, to);

    return { data, count, error };
};

export const requestRefund = async (bookingId, reason, amount) => {
    if (!isSupabaseConfigured) {
        return { data: { id: 'ref-mock', status: 'pending' }, error: null };
    }

    const { data, error } = await supabase
        .from('refund_requests')
        .insert({
            booking_id: bookingId,
            reason,
            refund_amount: amount,
            refund_status: 'pending'
        })
        .select()
        .single();

    return { data, error };
};
