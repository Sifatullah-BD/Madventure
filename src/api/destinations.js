import { supabase } from '../lib/supabase';
import { DISTRICTS } from '../data/madventure-data';

/**
 * Fetch all districts with their spots
 */
export const getDistricts = async () => {
    try {
        const { data, error } = await supabase
            .from('districts')
            .select('*')
            .order('division', { ascending: true });
        if (data && data.length > 0) return { data, error: null };
    } catch (err) {
        console.warn("Supabase districts fetch failed, using fallback.");
    }
    return { data: DISTRICTS, error: null };
};

/**
 * Fetch popular places (Popular Destinations)
 */
export const getPlaces = async () => {
    try {
        const { data, error } = await supabase
            .from('places')
            .select('*')
            .order('created_at', { ascending: false });
        if (data && data.length > 0) return { data, error: null };
    } catch (err) {
        console.warn("Supabase places fetch failed, using fallback.");
    }
    
    const fallbackPlaces = DISTRICTS.map(d => ({
        id: d.id,
        name: d.nameEn,
        location: d.division,
        region: d.division,
        image: d.heroImage,
        description: d.description,
        type: d.id === 'bandarban' || d.id === 'sajek' ? 'mountain' : 'waves'
    }));

    return { data: fallbackPlaces, error: null };
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
