import React, { createContext, useContext, useEffect, useState } from 'react';
import { requestForToken, onMessageListener } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const NotificationContext = createContext();

// ─── Token Sync ───────────────────────────────────────────────────────────────
const handleTokenSync = async (user) => {
    try {
        const token = await requestForToken();
        if (token && user) {
            await supabase.from('user_tokens').upsert({
                user_id: user.id,
                token
            });
        }
    } catch (err) {
        console.warn('Token sync failed:', err);
    }
};

// ─── Browser Toast ────────────────────────────────────────────────────────────
const showBrowserToast = (notification) => {
    if (!('Notification' in window)) return;

    const show = () => {
        try {
            new Notification(notification.title || 'নতুন বিজ্ঞপ্তি', {
                body: notification.body || '',
                icon: '/madventure-logo-v2.png'
            });
        } catch (err) {
            console.warn('Browser notification error:', err);
        }
    };

    if (Notification.permission === 'granted') {
        show();
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') show();
        });
    }
};

// ─── Realtime Subscription (userId filter সহ) ─────────────────────────────────
const subscribeToRealTimeNotifications = (userId, setNotifications, setUnreadCount) => {
    if (!userId) return null;

    const topic = `notifications-user-${userId}`;

    // পুরনো channel remove করো
    supabase.getChannels().forEach(ch => {
        if (ch.topic === topic) supabase.removeChannel(ch);
    });

    const channel = supabase
        .channel(topic)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`   // ✅ শুধু এই user-এর notification
            },
            (payload) => {
                if (!payload.new) return;

                const newNotif = {
                    id: payload.new.id,
                    title: payload.new.title,
                    body: payload.new.body,
                    type: payload.new.type || 'info',
                    time: new Date(payload.new.created_at).toLocaleTimeString('bn-BD'),
                    read: false
                };

                setNotifications(prev => [newNotif, ...prev]);
                setUnreadCount(prev => prev + 1);
                showBrowserToast(newNotif);
            }
        )
        .subscribe((status) => {
            console.log(`[Notification] Realtime status (${userId}):`, status);
        });

    return channel;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;

            if (data) {
                const formatted = data.map(n => ({
                    id: n.id,
                    title: n.title,
                    body: n.body,
                    type: n.type || 'info',
                    actionUrl: n.action_url || n.payload?.action_url || null,
                    time: new Date(n.created_at).toLocaleTimeString('bn-BD'),
                    read: n.read ?? false
                }));
                setNotifications(formatted);
                setUnreadCount(formatted.filter(n => !n.read).length);
            }
        } catch (err) {
            console.warn('fetchNotifications error:', err);
        }
    };

    const markAllRead = async () => {
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

        if (user) {
            await supabase
                .from('notifications')
                .update({ read: true, read_at: new Date().toISOString() })
                .eq('user_id', user.id)
                .eq('read', false);
        }
    };

    const markOneRead = async (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));

        await supabase
            .from('notifications')
            .update({ read: true, read_at: new Date().toISOString() })
            .eq('id', id);
    };

    useEffect(() => {
        if (!user) return;

        let channel = null;
        // Initial fetch
        handleTokenSync(user);
        fetchNotifications(user.id);

        // Realtime subscribe
        channel = subscribeToRealTimeNotifications(user.id, setNotifications, setUnreadCount);

        onMessageListener()
            .then(payload => {
                if (!payload) return;
                const newNotif = {
                    id: Date.now(),
                    title: payload.notification?.title || 'নতুন বার্তা',
                    body: payload.notification?.body || '',
                    type: 'info',
                    time: new Date().toLocaleTimeString('bn-BD'),
                    read: false
                };
                setNotifications(prev => [newNotif, ...prev]);
                setUnreadCount(prev => prev + 1);
                showBrowserToast(newNotif);
            })
            .catch(err => console.warn('onMessageListener error:', err));

        // ✅ Cleanup on unmount / user change
        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [user]);

    return (
        <NotificationContext.Provider
            value={{ notifications, unreadCount, markAllRead, markOneRead, setUnreadCount }}
        >
            {children}
        </NotificationContext.Provider>
    );
};