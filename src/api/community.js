import { supabase } from '../lib/supabase';
import { FORUM_THREADS } from '../data/madventure-data';

/**
 * FORUM OPERATIONS
 * Table: forum_threads, forum_replies
 */

export const getForumThreads = async (category = null, districtId = null) => {
    try {
        let query = supabase
            .from('forum_threads')
            .select('*, profiles(full_name, avatar_url)')
            .order('created_at', { ascending: false });

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }
        if (districtId) {
            query = query.eq('district_id', districtId);
        }

        const { data, error } = await query;

        // Fallback to mock data if Supabase returns empty
        if (!data || data.length === 0) {
            let mockData = FORUM_THREADS;
            if (category && category !== 'all') {
                mockData = mockData.filter(t => t.category === category);
            }
            return { data: mockData, error: null };
        }
        return { data, error };
    } catch (err) {
        // Network error — use mock
        return { data: FORUM_THREADS, error: null };
    }
};

export const getThreadDetails = async (threadId) => {
    try {
        const { data: thread, error: tErr } = await supabase
            .from('forum_threads')
            .select('*, profiles(full_name, avatar_url)')
            .eq('id', threadId)
            .maybeSingle();

        if (tErr || !thread) {
            const mockThread = FORUM_THREADS.find(t => t.id === threadId || t.id === Number(threadId));
            if (mockThread) return { data: { ...mockThread, replies: [] }, error: null };
            return { data: null, error: tErr || new Error('Thread not found') };
        }

        const { data: replies } = await supabase
            .from('forum_replies')
            .select('*, profiles(full_name, avatar_url)')
            .eq('thread_id', threadId)
            .order('created_at', { ascending: true });

        return { data: { ...thread, replies: replies || [] }, error: null };
    } catch (err) {
        const mockThread = FORUM_THREADS.find(t => t.id === threadId || t.id === Number(threadId));
        return { data: mockThread ? { ...mockThread, replies: [] } : null, error: null };
    }
};

export const createThread = async (userId, title, body, category = 'tips', districtId = null) => {
    try {
        const { data, error } = await supabase
            .from('forum_threads')
            .insert([{ user_id: userId, title, body, category, district_id: districtId }])
            .select()
            .single();
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const upvoteThread = async (threadId) => {
    try {
        const { data, error } = await supabase.rpc('increment_thread_upvotes', { thread_id: threadId });
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const postReply = async (threadId, userId, body) => {
    try {
        const { data, error } = await supabase
            .from('forum_replies')
            .insert([{ thread_id: threadId, user_id: userId, body }])
            .select('*, profiles(full_name, avatar_url)')
            .single();
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * LOST & FOUND OPERATIONS
 * Table: lost_found
 */

export const getLostFoundItems = async (type = null) => {
    try {
        let query = supabase
            .from('lost_found')
            .select('*, profiles(full_name, avatar_url)')
            .order('created_at', { ascending: false });

        if (type) query = query.eq('type', type);

        const { data, error } = await query;
        return { data: data || [], error };
    } catch (error) {
        return { data: [], error };
    }
};

export const reportLostFoundItem = async (itemData) => {
    try {
        const { data, error } = await supabase
            .from('lost_found')
            .insert([itemData])
            .select()
            .single();
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const updateLostFoundStatus = async (id, status) => {
    try {
        const { data, error } = await supabase
            .from('lost_found')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * TRAVEL PARTNER OPERATIONS
 * Table: travel_partners
 */

export const getTravelPartners = async (filters = {}) => {
    try {
        let query = supabase
            .from('travel_partners')
            .select('*, profiles(full_name, avatar_url)')
            .eq('status', 'open')
            .order('created_at', { ascending: false });

        if (filters.destination) query = query.ilike('destination', `%${filters.destination}%`);

        const { data, error } = await query;
        return { data: data || [], error };
    } catch (error) {
        return { data: [], error };
    }
};

export const createPartnerRequest = async (requestData) => {
    try {
        const { data, error } = await supabase
            .from('travel_partners')
            .insert([requestData])
            .select()
            .single();
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * WISHLIST OPERATIONS
 * Uses localStorage as fallback (no wishlist table yet)
 */

export const getWishlist = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('wishlists')
            .select('*')
            .eq('user_id', userId);
        return { data: data || [], error };
    } catch {
        // Fallback: localStorage
        const local = JSON.parse(localStorage.getItem('madventure_wishlist') || '[]');
        return { data: local, error: null };
    }
};

export const addToWishlist = async (userId, itemType, itemId) => {
    try {
        const { data, error } = await supabase
            .from('wishlists')
            .insert([{ user_id: userId, item_type: itemType, item_id: itemId }])
            .select()
            .single();
        return { data, error };
    } catch {
        // Fallback: localStorage
        const local = JSON.parse(localStorage.getItem('madventure_wishlist') || '[]');
        const newItem = { id: Date.now(), user_id: userId, item_type: itemType, item_id: itemId };
        localStorage.setItem('madventure_wishlist', JSON.stringify([...local, newItem]));
        return { data: newItem, error: null };
    }
};

export const removeFromWishlist = async (id) => {
    try {
        const { error } = await supabase.from('wishlists').delete().eq('id', id);
        return { error };
    } catch {
        const local = JSON.parse(localStorage.getItem('madventure_wishlist') || '[]');
        localStorage.setItem('madventure_wishlist', JSON.stringify(local.filter(i => i.id !== id)));
        return { error: null };
    }
};

/**
 * NOTIFICATIONS
 */

export const getNotifications = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(30);
        return { data: data || [], error };
    } catch (error) {
        return { data: [], error };
    }
};

export const markNotificationRead = async (id) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);
        return { error };
    } catch (error) {
        return { error };
    }
};

export const markAllNotificationsRead = async (userId) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId);
        return { error };
    } catch (error) {
        return { error };
    }
};
