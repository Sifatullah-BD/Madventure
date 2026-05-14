import { supabase } from '../lib/supabase';

/**
 * Log a custom analytics event
 */
export const logEvent = async (eventName, eventData = {}, userId = null) => {
    try {
        const { error } = await supabase
            .from('analytics_events')
            .insert([{
                user_id: userId,
                event_name: eventName,
                event_data: eventData,
                page_url: window.location.href,
                user_agent: navigator.userAgent
            }]);
        
        if (error) console.warn('Analytics Error:', error.message);
    } catch (e) {
        console.error('Analytics Exception:', e);
    }
};

/**
 * Log an audit action (mostly for admin/critical actions)
 */
export const logAudit = async (actionData) => {
    try {
        const { error } = await supabase
            .from('audit_logs')
            .insert([actionData]);
        
        if (error) console.warn('Audit Error:', error.message);
    } catch (e) {
        console.error('Audit Exception:', e);
    }
};

/**
 * Fetch analytics summary for dashboard
 */
export const getAnalyticsSummary = async () => {
    // This could be complex, for now just some counts
    const [eventsRes, auditRes] = await Promise.all([
        supabase.from('analytics_events').select('id', { count: 'exact', head: true }),
        supabase.from('audit_logs').select('id', { count: 'exact', head: true })
    ]);

    return {
        totalEvents: eventsRes.count || 0,
        totalAudits: auditRes.count || 0
    };
};
