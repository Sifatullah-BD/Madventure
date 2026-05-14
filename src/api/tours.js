import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TOURS } from '../data/madventure-data';

/**
 * Get all available tours
 */
export const getTours = async () => {
    if (!isSupabaseConfigured) {
        return { data: TOURS, error: null };
    }
    const { data, error } = await supabase.from('tours').select('*');
    return { data, error };
};

/**
 * Get tours filtered by a destination/district ID
 */
export const getToursByDistrict = async (districtId) => {
    if (!isSupabaseConfigured) {
        const filtered = TOURS.filter(t => t.districtId === districtId);
        return { data: filtered, error: null };
    }
    const { data, error } = await supabase.from('tours').select('*').eq('district_id', districtId);
    return { data, error };
};

/**
 * Get a single tour by ID
 */
export const getTourById = async (id) => {
    if (!isSupabaseConfigured) {
        const tour = TOURS.find(t => t.id === id);
        return { data: tour || null, error: tour ? null : new Error('Tour not found') };
    }
    const { data, error } = await supabase.from('tours').select('*').eq('id', id).single();
    return { data, error };
};

/**
 * Create a new custom tour (Agency/Admin)
 */
export const createTour = async (tourData) => {
    if (!isSupabaseConfigured) {
        return { data: { ...tourData, id: `tour_${Date.now()}` }, error: null };
    }
    const { data, error } = await supabase.from('tours').insert([tourData]).select().single();
    return { data, error };
};

/**
 * Get available departure dates for a tour
 */
export const getTourDepartures = async (tourId) => {
    if (!isSupabaseConfigured) {
        return { data: [], error: null };
    }
    const { data, error } = await supabase
        .from('tour_departures')
        .select('*')
        .eq('tour_id', tourId)
        .gte('departure_date', new Date().toISOString().split('T')[0])
        .order('departure_date', { ascending: true });
    return { data, error };
};

/**
 * Check if seats are available for a tour on a specific date
 */
export const checkTourAvailability = async (tourId, date, seats) => {
    if (!isSupabaseConfigured) {
        return { data: true, error: null };
    }
    const { data, error } = await supabase
        .from('tour_departures')
        .select('capacity, booked_seats')
        .eq('tour_id', tourId)
        .eq('departure_date', date)
        .single();
    
    if (error) return { data: false, error };
    const available = (data.capacity || 0) - (data.booked_seats || 0);
    return { data: available >= seats, error: null };
};
