import { supabase } from './supabaseClient';
import { errorResponse } from '../utils/apiResponse';

/**
 * Validates if the current user has admin privileges.
 * Usually used inside API endpoints.
 * 
 * @param {Request} req - The incoming HTTP request
 * @returns {Promise<{isAdmin: boolean, user: object, error: object}>}
 */
export const checkAdminAuth = async (req) => {
    try {
        const token = req.headers.get('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return { isAdmin: false, error: errorResponse('Missing Authorization header', 401) };
        }

        // Get user from token
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        
        if (authError || !user) {
            return { isAdmin: false, error: errorResponse('Invalid or expired token', 401) };
        }

        // Check user role from profile
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return { isAdmin: false, error: errorResponse('Profile not found', 404) };
        }

        const isAdmin = ['admin', 'super_admin'].includes(profile.role);

        if (!isAdmin) {
            return { isAdmin: false, error: errorResponse('Forbidden: Admin access required', 403) };
        }

        // Add role to user object for convenience
        const userWithRole = { ...user, role: profile.role };

        return { isAdmin: true, user: userWithRole, error: null };
    } catch (error) {
        console.error('Admin Auth Check Error:', error);
        return { isAdmin: false, error: errorResponse('Internal Server Error', 500) };
    }
};

/**
 * Logs an admin action to the audit_logs table
 */
export const logAdminAction = async (adminId, action, targetTable, targetId = null, details = {}) => {
    try {
        const { error } = await supabase
            .from('audit_logs')
            .insert({
                admin_id: adminId,
                action,
                target_table: targetTable,
                target_id: targetId,
                details
            });
        
        if (error) {
            console.error('Failed to write audit log:', error);
        }
    } catch (err) {
        console.error('Audit Log Exception:', err);
    }
};
