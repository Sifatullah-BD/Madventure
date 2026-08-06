import { supabase } from '../../../../../lib/supabaseClient';
import { successResponse, errorResponse } from '../../../../../utils/apiResponse';
import { checkAdminAuth } from '../../../../../lib/adminAuth';

export default async function handler(req, res) {
    const auth = await checkAdminAuth(req);
    if (!auth.isAdmin) {
        return res ? res.status(auth.error.status).json(auth.error) : auth.error;
    }

    if (req.method !== 'GET') {
        return res ? res.status(405).json(errorResponse('Method Not Allowed')) : errorResponse('Method Not Allowed', 405);
    }

    try {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*, user_profiles!admin_id(full_name)')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;
        return res ? res.status(200).json(successResponse(data)) : successResponse(data);
    } catch (err) {
        return res ? res.status(500).json(errorResponse(err.message)) : errorResponse(err.message);
    }
}
