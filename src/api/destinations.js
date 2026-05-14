import { supabase } from '../lib/supabase';

/**
 * Fetch all districts with their spots
 */
export const getDistricts = async () => {
    const { data, error } = await supabase
        .from('districts')
        .select('*')
        .order('division', { ascending: true });
    return { data, error };
};

/**
 * Fetch popular places (Popular Destinations)
 */
export const getPlaces = async () => {
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: false });
    return { data, error };
};

/**
 * Fetch details for a specific place
 */
export const getPlaceById = async (id) => {
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('id', id)
        .single();
    return { data, error };
};

/**
 * Fetch places by district name
 */
export const getPlacesByDistrict = async (districtName) => {
    const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('district_name', districtName);
    return { data, error };
};
