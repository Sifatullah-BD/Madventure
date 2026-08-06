// src/lib/realtime.js
// Realtime broadcasting wrapper for Supabase events
import { supabase } from '@/lib/supabase';

/**
 * Broadcast an event to all subscribed clients.
 * @param {string} event - Name of the event (e.g., 'post_created', 'comment_added', 'reaction_added').
 * @param {object} payload - Data to send with the event.
 */
export const broadcast = async (event, payload) => {
  try {
    const channel = supabase.channel(`realtime:${event}`);
    await channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.send({
          type: 'broadcast',
          event,
          payload,
        });
        // Cleanup after sending
        supabase.removeChannel(channel);
      }
    });
  } catch (err) {
    console.error('Realtime broadcast error:', err);
  }
};
