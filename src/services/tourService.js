import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TOURS, DISTRICTS } from '../data/madventure-data';

class TourService {
    async getTours() {
        if (!isSupabaseConfigured) return TOURS;
        const { data, error } = await supabase.from('tours').select('*');
        if (error) throw error;
        return data;
    }

    async getToursByDistrict(districtId) {
        if (!isSupabaseConfigured) return TOURS.filter(t => t.districtId === districtId);
        const { data, error } = await supabase.from('tours').select('*').eq('district_id', districtId);
        if (error) throw error;
        return data;
    }

    async getTourById(id) {
        if (!isSupabaseConfigured) {
            const tour = TOURS.find(t => t.id === id);
            if (!tour) throw new Error('Tour not found');
            return tour;
        }
        const { data, error } = await supabase.from('tours').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    }

    async createTour(tourData) {
        if (!isSupabaseConfigured) return { ...tourData, id: `tour_${Date.now()}` };
        const { data, error } = await supabase.from('tours').insert([tourData]).select().single();
        if (error) throw error;
        return data;
    }

    async getTourDepartures(tourId) {
        if (!isSupabaseConfigured) return [];
        const { data, error } = await supabase
            .from('tour_departures')
            .select('*')
            .eq('tour_id', tourId)
            .gte('departure_date', new Date().toISOString().split('T')[0])
            .order('departure_date', { ascending: true });
        if (error) throw error;
        return data;
    }

    async checkTourAvailability(tourId, date, seats) {
        if (!isSupabaseConfigured) return true;
        const { data, error } = await supabase
            .from('tour_departures')
            .select('capacity, booked_seats')
            .eq('tour_id', tourId)
            .eq('departure_date', date)
            .single();
        if (error) throw error;
        const available = (data.capacity || 0) - (data.booked_seats || 0);
        return available >= seats;
    }
}

export const tourService = new TourService();

export const getTours = (...args) => tourService.getTours(...args);
export const getToursByDistrict = (...args) => tourService.getToursByDistrict(...args);
export const getTourById = (...args) => tourService.getTourById(...args);
export const createTour = (...args) => tourService.createTour(...args);
export const getTourDepartures = (...args) => tourService.getTourDepartures(...args);
export const checkTourAvailability = (...args) => tourService.checkTourAvailability(...args);

// Alias helpers for Destinations page
export const getDistricts = async () => {
    if (!isSupabaseConfigured) return DISTRICTS;
    const { data, error } = await supabase.from('districts').select('*');
    if (error) return DISTRICTS; // fallback to static data
    return data?.length ? data : DISTRICTS;
};

export const getPlaces = async (districtId) => {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase.from('places').select('*').eq('district_id', districtId);
    if (error) return [];
    return data || [];
};
