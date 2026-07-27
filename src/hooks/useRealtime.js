/**
 * useRealtime.js – Generic Supabase Realtime subscription hook
 *
 * Usage:
 *   const { data } = useRealtime({
 *     table: 'forum_replies',
 *     event: 'INSERT',
 *     filter: `thread_id=eq.${threadId}`,
 *     onNew: (payload) => { ... }
 *   });
 */
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * @param {object} opts
 * @param {string} opts.table           – Supabase table name
 * @param {string} [opts.event]         – 'INSERT' | 'UPDATE' | 'DELETE' | '*'
 * @param {string} [opts.schema]        – default 'public'
 * @param {string} [opts.filter]        – e.g. `user_id=eq.${userId}`
 * @param {function} [opts.onNew]       – callback(payload.new) for INSERT/UPDATE
 * @param {function} [opts.onDelete]    – callback(payload.old) for DELETE
 * @param {boolean} [opts.enabled]      – set false to skip subscription (e.g. user not logged in)
 */
const useRealtime = ({
    table,
    event = '*',
    schema = 'public',
    filter = null,
    onNew = null,
    onDelete = null,
    enabled = true,
}) => {
    const channelRef = useRef(null);
    const onNewRef = useRef(onNew);
    const onDeleteRef = useRef(onDelete);

    // Keep refs current without needing to re-subscribe
    useEffect(() => { onNewRef.current = onNew; }, [onNew]);
    useEffect(() => { onDeleteRef.current = onDelete; }, [onDelete]);

    useEffect(() => {
        if (!enabled || !table) return;

        const channelName = `realtime:${table}${filter ? `:${filter}` : ''}`;

        // Remove any existing channel with the same name
        supabase.getChannels().forEach(ch => {
            if (ch.topic === channelName) supabase.removeChannel(ch);
        });

        const config = {
            event,
            schema,
            table,
            ...(filter ? { filter } : {}),
        };

        channelRef.current = supabase
            .channel(channelName)
            .on('postgres_changes', config, (payload) => {
                if ((payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') && onNewRef.current) {
                    onNewRef.current(payload.new, payload);
                }
                if (payload.eventType === 'DELETE' && onDeleteRef.current) {
                    onDeleteRef.current(payload.old, payload);
                }
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`[Realtime] ✅ Subscribed to ${table}${filter ? ` (${filter})` : ''}`);
                }
                if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                    console.warn(`[Realtime] ⚠️ Channel ${status} for ${table}`);
                }
            });

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [table, event, schema, filter, enabled]);
};

export default useRealtime;
