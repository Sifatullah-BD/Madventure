import { supabase } from '../lib/supabase';

class AdminService {
    async getAllUsers() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }

    async updateUserRole(userId, newRole) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ app_role: newRole.toLowerCase() })
            .eq('id', userId);
        if (error) throw error;
        return data;
    }

    async getPendingAgencies() {
        const { data, error } = await supabase
            .from('tour_agencies')
            .select(`*, profiles:profile_id (full_name, email)`)
            .eq('verification_status', 'pending');
        if (error) throw error;
        return data;
    }

    async setAgencyStatus(agencyId, status) {
        const { data, error } = await supabase
            .from('tour_agencies')
            .update({ verification_status: status })
            .eq('id', agencyId);
        if (error) throw error;
        return data;
    }

    async getSystemAuditLogs(limit = 50) {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data;
    }

    async getRevenueReport() {
        const { data, error } = await supabase
            .from('payment_transactions')
            .select('amount, created_at, gateway, payment_status')
            .eq('payment_status', 'paid')
            .order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    }
}

export const adminService = new AdminService();
// Provide named exports to allow easy transition
export const getAllUsers = (...args) => adminService.getAllUsers(...args);
export const updateUserRole = (...args) => adminService.updateUserRole(...args);
export const getPendingAgencies = (...args) => adminService.getPendingAgencies(...args);
export const setAgencyStatus = (...args) => adminService.setAgencyStatus(...args);
export const getSystemAuditLogs = (...args) => adminService.getSystemAuditLogs(...args);
export const getRevenueReport = (...args) => adminService.getRevenueReport(...args);
