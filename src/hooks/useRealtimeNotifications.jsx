import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Custom hook to subscribe to real-time notifications from Supabase.
 * Listens for INSERT events on the notifications table for the current user.
 * 
 * @param {string} userId - The authenticated user's UUID
 * @returns {{ notifications: Array, unreadCount: number, markAsRead: Function, markAllAsRead: Function }}
 */
export function useRealtimeNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial notifications
  useEffect(() => {
    if (!isSupabaseConfigured || !userId) return;

    const fetchInitial = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    };

    fetchInitial();
  }, [userId]);

  // Subscribe to real-time inserts
  useEffect(() => {
    if (!isSupabaseConfigured || !userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAsRead = useCallback(async (ids) => {
    if (!isSupabaseConfigured) return;
    await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', ids);

    setNotifications(prev =>
      prev.map(n => ids.includes(n.id) ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - ids.length));
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!isSupabaseConfigured || !userId) return;
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [userId]);

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
