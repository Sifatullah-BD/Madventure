import { supabase } from '../lib/supabase';

/**
 * Fetch all users for admin management
 */
export const getAllUsers = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
    
    return { data, error };
};

/**
 * Update a user's role
 */
export const updateUserRole = async (userId, newRole) => {
    const { data, error } = await supabase
        .from('profiles')
        .update({ app_role: newRole.toLowerCase() })
        .eq('id', userId);
    
    return { data, error };
};

/**
 * Fetch all tour agencies for verification
 */
export const getPendingAgencies = async () => {
    const { data, error } = await supabase
        .from('tour_agencies')
        .select(`
            *,
            profiles:profile_id (full_name, email)
        `)
        .eq('verification_status', 'pending');
    
    return { data, error };
};

/**
 * Verify or Reject an agency
 */
export const setAgencyStatus = async (agencyId, status) => {
    const { data, error } = await supabase
        .from('tour_agencies')
        .update({ verification_status: status })
        .eq('id', agencyId);
    
    return { data, error };
};

/**
 * Get system audit logs
 */
export const getSystemAuditLogs = async (limit = 50) => {
    const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
    
    return { data, error };
};

/**
 * Get detailed revenue report
 */
export const getRevenueReport = async () => {
    const { data, error } = await supabase
        .from('payment_transactions')
        .select('amount, created_at, gateway, payment_status')
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: true });
    
    return { data, error };
};
