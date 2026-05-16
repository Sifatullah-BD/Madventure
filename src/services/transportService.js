import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const transportService = {
    async searchTransports({ from, to, type } = {}) {
        if (!isSupabaseConfigured) {
            // Mock data fallback for demo
            return [
                { id: 1, provider_name: 'Hanif Enterprise', transport_type: 'BUS', route_from: from, route_to: to, departure_time: '22:00', price: 1200, available_seats: 12 },
                { id: 2, provider_name: 'Green Line', transport_type: 'BUS', route_from: from, route_to: to, departure_time: '23:30', price: 1800, available_seats: 5 },
            ];
        }

        let query = supabase.from('transports').select('*').eq('status', 'active');
        
        if (from) query = query.ilike('route_from', `%${from}%`);
        if (to) query = query.ilike('route_to', `%${to}%`);
        if (type && type !== 'ALL') query = query.eq('transport_type', type);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    async getTransportById(id) {
        if (!isSupabaseConfigured) return null;
        const { data, error } = await supabase.from('transports').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async bookTicket(transportId, userId, seats = []) {
        // Implementation for ticket booking
        // 1. Check availability
        // 2. Create booking entry
        // 3. Decrement available seats
        const { data, error } = await supabase.rpc('book_transport_ticket', {
            p_transport_id: transportId,
            p_user_id: userId,
            p_seat_count: seats.length,
            p_seats_json: JSON.stringify(seats)
        });
        if (error) throw error;
        return data;
    }
};
