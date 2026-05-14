import { supabase, isSupabaseConfigured } from '../lib/supabase';
// Assuming FOOD doesn't exist explicitly inside madventure-data.js 
// We will build an architecture ready for it
import { DISTRICTS } from '../data/madventure-data';

export const getRestaurants = async () => {
    if (!isSupabaseConfigured) {
        // Fallback or empty mock array
        return { data: [], error: null };
    }
    const { data, error } = await supabase.from('restaurants').select('*');
    return { data, error };
};

export const filterByHalal = async (districtId) => {
    if (!isSupabaseConfigured) {
        // Fallback dummy data if no supabase connection
        return { data: [{ id: 'mock', name: 'Al-Madina Cuisine', cuisine_type: 'Bengali', is_halal: true }], error: null };
    }
    
    let query = supabase.from('restaurants').select('*').eq('is_halal', true);
    if (districtId) {
        query = query.eq('district_id', districtId);
    }
    
    const { data, error } = await query;
    return { data, error };
};
