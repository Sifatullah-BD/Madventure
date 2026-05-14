import React, { createContext, useContext, useEffect, useState } from 'react';
import { requestForToken, onMessageListener } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Bell } from 'lucide-react';

const NotificationContext = createContext();

const handleTokenSync = async (user) => {
    const token = await requestForToken();
    if (token && user) {
        await supabase.from('user_tokens').upsert({
            user_id: user.id,
            token
        });
    }
};

const subscribeToRealTimeNotifications = (setNotifications, setUnreadCount) => {
    const channel = supabase.channel('notifications');

    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, payload => {
        const newNotif = {
            id: payload.new.id,
            title: payload.new.title,
            body: payload.new.body,
            time: new Date(payload.new.created_at).toLocaleTimeString(),
            read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
        showBrowserToast(newNotif);
    });

    channel.subscribe();
};

const showBrowserToast = (notification) => {
    // Logic to show browser toast (e.g., using a library like react-toastify)
    console.log('New Notification:', notification);
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async (userId) => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (data) {
            const formatted = data.map(n => ({
                id: n.id,
                title: n.title,
                body: n.body,
                type: n.type || 'info',
                time: new Date(n.created_at).toLocaleTimeString(),
                read: n.is_read
            }));
            setNotifications(formatted);
            setUnreadCount(formatted.filter(n => !n.read).length);
        }
    };

    useEffect(() => {
        if (user) {
            handleTokenSync(user);
            fetchNotifications(user.id);
            subscribeToRealTimeNotifications(setNotifications, setUnreadCount);
        }

        // Listen for foreground messages (non-blocking)
        onMessageListener().then(payload => {
            if (payload) {
                const newNotif = {
                    id: Date.now(),
                    title: payload.notification?.title || "New Message",
                    body: payload.notification?.body || "",
                    time: new Date().toLocaleTimeString(),
                    read: false
                };
                setNotifications(prev => [newNotif, ...prev]);
                setUnreadCount(prev => prev + 1);
                showBrowserToast(newNotif);
            }
        }).catch(err => console.log('onMessageListener error:', err));

        return () => {
            // Cleanup if needed
        };
    }, [user]);

    const markAllRead = () => {
        setUnreadCount(0);
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, setUnreadCount, markAllRead }}>
            {children}
        </NotificationContext.Provider>
    );
};



