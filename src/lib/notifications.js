// src/lib/notifications.js
import { supabase } from './db';

/**
 * Helper to create a notification record.
 * @param {string} userId - Recipient user ID.
 * @param {string} type - Notification type (e.g., 'like', 'comment').
 * @param {object} payload - Arbitrary data to store (e.g., postId, commentId, message).
 */
export async function createNotification(userId, type, payload) {
  try {
    const { data, error } = await supabase.from('notifications').insert([
      {
        user_id: userId,
        type,
        payload,
        read: false,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) throw error;
    return data[0];
  } catch (err) {
    console.error('Notification creation failed:', err);
    // Swallow error to avoid breaking the main flow.
    return null;
  }
}
