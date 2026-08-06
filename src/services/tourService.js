import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TOURS, DISTRICTS, HOTELS } from '../data/madventure-data';

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

    async getHotels() {
        if (!isSupabaseConfigured) return HOTELS || [];
        const { data, error } = await supabase.from('hotels').select('*');
        if (error) return HOTELS || [];
        return data || [];
    }

    async getHotelById(id) {
        if (!isSupabaseConfigured) {
            const hotel = HOTELS?.find(h => h.id === id || h.id === Number(id));
            return hotel || { id, name: 'Grand Deluxe Resort', price_per_night: 4500, rating: 4.8 };
        }
        const { data, error } = await supabase.from('hotels').select('*').eq('id', id).single();
        if (error) {
            const hotel = HOTELS?.find(h => h.id === id || h.id === Number(id));
            return hotel || { id, name: 'Grand Deluxe Resort', price_per_night: 4500, rating: 4.8 };
        }
        return data;
    }

    async getHotelRooms(hotelId) {
        if (!isSupabaseConfigured) {
            return [
                { id: 'room_1', room_type: 'Deluxe Couple Room', price_per_night: 4500, capacity: 2 },
                { id: 'room_2', room_type: 'Family Suite', price_per_night: 7500, capacity: 4 }
            ];
        }
        const { data, error } = await supabase.from('hotel_rooms').select('*').eq('hotel_id', hotelId);
        if (error) {
            return [
                { id: 'room_1', room_type: 'Deluxe Couple Room', price_per_night: 4500, capacity: 2 },
                { id: 'room_2', room_type: 'Family Suite', price_per_night: 7500, capacity: 4 }
            ];
        }
        return data || [];
    }
}

export const tourService = new TourService();

export const getTours = (...args) => tourService.getTours(...args);
export const getToursByDistrict = (...args) => tourService.getToursByDistrict(...args);
export const getTourById = (...args) => tourService.getTourById(...args);
export const createTour = (...args) => tourService.createTour(...args);
export const getTourDepartures = (...args) => tourService.getTourDepartures(...args);
export const checkTourAvailability = (...args) => tourService.checkTourAvailability(...args);
export const getHotels = (...args) => tourService.getHotels(...args);
export const getHotelById = (...args) => tourService.getHotelById(...args);
export const getHotelRooms = (...args) => tourService.getHotelRooms(...args);

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
