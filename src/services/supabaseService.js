import { supabase } from '../lib/supabase';

export const supabaseService = {
    // Divisions
    async getDivisions() {
        const { data, error } = await supabase
            .from('divisions')
            .select('*');
        if (error) throw error;
        return data;
    },

    // Districts
    async getDistricts() {
        const { data, error } = await supabase
            .from('districts')
            .select('*');
        if (error) throw error;
        return data;
    },

    async getDistrictsByDivision(divisionId) {
        const { data, error } = await supabase
            .from('districts')
            .select('*')
            .eq('division_id', divisionId);
        if (error) throw error;
        return data;
    },

    async getDistrictByName(name) {
        const { data, error } = await supabase
            .from('districts')
            .select('*')
            .ilike('name', name) // Case-insensitive match
            .single();
        if (error) throw error;
        return data;
    },

    // Tours
    async getTours() {
        const { data, error } = await supabase
            .from('tours')
            .select('*');
        if (error) throw error;
        return data;
    },

    async getToursByDestination(destination) {
        const { data, error } = await supabase
            .from('tours')
            .select('*')
            .ilike('destination', `%${destination}%`);
        if (error) throw error;
        return data;
    },

    async getTourById(id) {
        const { data, error } = await supabase
            .from('tours')
            .select('*, cancellation_policies(*)')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async getToursByAgency(agencyId) {
        const { data, error } = await supabase
            .from('tours')
            .select('*')
            .eq('agency_id', agencyId);
        if (error) throw error;
        return data;
    },

    async createTour(tourData) {
        const { data, error } = await supabase
            .from('tours')
            .insert(tourData)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Places
    async getPlaces() {
        const { data, error } = await supabase
            .from('places')
            .select('*');
        if (error) throw error;
        return data;
    },

    async getPlacesByRegion(region) {
        const { data, error } = await supabase
            .from('places')
            .select('*')
            .ilike('region', `%${region}%`);
        if (error) throw error;
        return data;
    },

    async getPlaceById(id) {
        const { data, error } = await supabase
            .from('places')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async sendSOS(sosData) {
        const { data, error } = await supabase
            .from('emergency_logs')
            .insert(sosData)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};
