import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Fire-and-forget product analytics (requires `analytics_events` + RLS from migration 03).
 * @param {string} name
 * @param {Record<string, unknown>} [properties]
 * @param {string | null} [userId]
 */
export function trackEvent(name, properties = {}, userId = null) {
    if (!isSupabaseConfigured || !name) return;

    const row = {
        name: String(name),
        properties: properties || {},
        user_id: userId || null,
    };

    void supabase.from('analytics_events').insert([row]).then(({ error }) => {
        if (error) console.warn('[analytics]', error.message);
    });
}
