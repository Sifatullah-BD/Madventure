import { supabase } from '../../../../../lib/supabaseClient';
import { successResponse, errorResponse } from '../../../../../utils/apiResponse';
import { checkAdminAuth, logAdminAction } from '../../../../../lib/adminAuth';

export default async function handler(req, res) {
    const auth = await checkAdminAuth(req);
    if (!auth.isAdmin) {
        return res ? res.status(auth.error.status).json(auth.error) : auth.error;
    }

    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('id, full_name, role, status, phone, created_at')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                return res ? res.status(200).json(successResponse(data)) : successResponse(data);
            } catch (err) {
                return res ? res.status(500).json(errorResponse(err.message)) : errorResponse(err.message);
            }

        case 'PATCH':
            try {
                // Update User Role/Status
                // Expected body: { userId: 'uuid', role: 'admin', status: 'active' }
                const body = req.body || await req.json();
                const { userId, role, status } = body;

                if (!userId) {
                    return res ? res.status(400).json(errorResponse('Missing userId')) : errorResponse('Missing userId');
                }

                const updates = {};
                if (role) updates.role = role;
                if (status) updates.status = status;

                const { data, error } = await supabase
                    .from('user_profiles')
                    .update(updates)
                    .eq('id', userId)
                    .select()
                    .single();

                if (error) throw error;

                // Log the action
                await logAdminAction(auth.user.id, 'UPDATE_USER', 'user_profiles', userId, updates);

                return res ? res.status(200).json(successResponse(data)) : successResponse(data);
            } catch (err) {
                return res ? res.status(500).json(errorResponse(err.message)) : errorResponse(err.message);
            }

        default:
            return res ? res.status(405).json(errorResponse('Method Not Allowed')) : errorResponse('Method Not Allowed', 405);
    }
}
