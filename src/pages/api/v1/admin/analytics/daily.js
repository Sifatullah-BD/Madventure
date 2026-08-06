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
        // Since we are mocking materialized views for this example if they aren't fully refreshed,
        // we can fetch from mv_daily_analytics. If it fails, fallback to direct query for the demo.
        let { data, error } = await supabase
            .from('mv_daily_analytics')
            .select('*')
            .order('day', { ascending: true })
            .limit(30);

        if (error) {
            console.warn('Materialized view might not be populated, falling back to direct query', error);
            // Fallback for demo/development purposes
            const { data: bookings } = await supabase
                .from('bookings')
                .select('created_at, total_amount')
                .eq('status', 'confirmed');
                
            // Process data manually if view fails
            const aggregated = {};
            bookings?.forEach(b => {
                const day = new Date(b.created_at).toISOString().split('T')[0];
                if (!aggregated[day]) {
                    aggregated[day] = { day, total_bookings: 0, total_revenue: 0 };
                }
                aggregated[day].total_bookings += 1;
                aggregated[day].total_revenue += (b.total_amount || 0);
            });
            data = Object.values(aggregated).sort((a, b) => new Date(a.day) - new Date(b.day));
        }

        return res ? res.status(200).json(successResponse(data)) : successResponse(data);
    } catch (err) {
        return res ? res.status(500).json(errorResponse(err.message)) : errorResponse(err.message);
    }
}
