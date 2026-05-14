import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { HOTELS } from '../data/madventure-data';

/**
 * Get all available hotels
 */
export const getHotels = async () => {
    if (!isSupabaseConfigured) {
        return { data: HOTELS, error: null };
    }
    const { data, error } = await supabase.from('hotels').select('*');
    return { data, error };
};

/**
 * Get hotels filtered by a destination/district ID
 */
export const getHotelsByDistrict = async (districtId) => {
    if (!isSupabaseConfigured) {
        const districtHotels = HOTELS[districtId] || [];
        return { data: districtHotels, error: null };
    }
    // Real Supabase would return a flat list rather than an object grouped by district
    const { data, error } = await supabase.from('hotels').select('*').eq('district_id', districtId);
    return { data, error };
};

/**
 * Get a single hotel
 */
export const getHotelById = async (districtId, hotelId) => {
    if (!isSupabaseConfigured) {
        const districtHotels = HOTELS[districtId] || [];
        const hotel = districtHotels.find(h => h.id === hotelId);
        return { data: hotel || null, error: hotel ? null : new Error('Hotel not found') };
    }
    const { data, error } = await supabase.from('hotels').select('*').eq('id', hotelId).single();
    return { data, error };
};

/**
 * Get all rooms for a hotel
 */
export const getHotelRooms = async (hotelId) => {
    if (!isSupabaseConfigured) {
        return { data: [], error: null };
    }
    const { data, error } = await supabase
        .from('hotel_rooms')
        .select('*')
        .eq('hotel_id', hotelId);
    return { data, error };
};

/**
 * Get inventory for a room on a specific date
 */
export const getRoomInventory = async (roomId, date) => {
    if (!isSupabaseConfigured) {
        return { data: null, error: null };
    }
    const { data, error } = await supabase
        .from('hotel_room_inventory')
        .select('available')
        .eq('room_id', roomId)
        .eq('date', date)
        .maybeSingle();
    return { data, error };
};

/**
 * Check if a room is available for a date range
 */
export const checkHotelAvailability = async (roomId, checkIn, checkOut) => {
    if (!isSupabaseConfigured) {
        return { data: true, error: null };
    }
    const { data, error } = await supabase
        .from('hotel_room_inventory')
        .select('available')
        .eq('room_id', roomId)
        .gte('date', checkIn)
        .lt('date', checkOut);
    
    if (error) return { data: false, error };
    const allAvailable = data.every(d => d.available > 0);
    return { data: allAvailable, error: null };
};
