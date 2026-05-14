import { supabase } from '../lib/supabase';

export const saveItinerary = async (itineraryData) => {
    try {
        const { data, error } = await supabase
            .from('itineraries')
            .insert([itineraryData])
            .select()
            .single();
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const getUserItineraries = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('itineraries')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const getItineraryBySlug = async (slug) => {
    try {
        const { data, error } = await supabase
            .from('itineraries')
            .select('*')
            .eq('share_slug', slug)
            .single();
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};
