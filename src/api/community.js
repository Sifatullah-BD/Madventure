import { supabase } from '../lib/supabase';

/**
 * WISHLIST OPERATIONS
 */

export const getWishlist = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('wishlists')
            .select('*')
            .eq('user_id', userId);
        return { data, error };
    } catch (error) {
        return { data: null, error };
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
    } catch (error) {
        return { data: null, error };
    }
};

export const removeFromWishlist = async (id) => {
    try {
        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('id', id);
        return { error };
    } catch (error) {
        return { error };
    }
};

/**
 * FORUM OPERATIONS
 */

export const getForumThreads = async (tag = null) => {
    try {
        let query = supabase
            .from('forum_threads')
            .select('*, profiles(full_name, avatar_url)')
            .eq('status', 'published')
            .order('created_at', { ascending: false });
        
        if (tag) {
            query = query.contains('tags', [tag]);
        }

        const { data, error } = await query;
        if (!data || data.length === 0) {
            const { FORUM_THREADS } = await import('../data/madventure-data');
            let mockData = FORUM_THREADS;
            if (tag) mockData = mockData.filter(t => t.category === tag || (t.tags && t.tags.includes(tag)));
            return { data: mockData, error: null };
        }
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const getThreadDetails = async (threadId) => {
    try {
        const { data: thread, error: tErr } = await supabase
            .from('forum_threads')
            .select('*, profiles(full_name, avatar_url)')
            .eq('id', threadId)
            .single();
        
        if (tErr || !thread) {
            const { FORUM_THREADS } = await import('../data/madventure-data');
            const mockThread = FORUM_THREADS.find(t => t.id === threadId);
            if (mockThread) {
                return { data: { ...mockThread, replies: [] }, error: null };
            }
            return { data: null, error: tErr || new Error('Thread not found') };
        }

        const { data: replies, error: rErr } = await supabase
            .from('forum_replies')
            .select('*, profiles(full_name, avatar_url)')
            .eq('thread_id', threadId)
            .order('created_at', { ascending: true });

        return { data: { ...thread, replies: replies || [] }, error: rErr };
    } catch (error) {
        return { data: null, error };
    }
};

export const createThread = async (userId, title, body, tags = []) => {
    try {
        const { data, error } = await supabase
            .from('forum_threads')
            .insert([{ user_id: userId, title, body, tags }])
            .select()
            .single();
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
            .select()
            .single();
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * LOST & FOUND OPERATIONS
 */

export const getLostFoundItems = async () => {
    try {
        const { data, error } = await supabase
            .from('lost_found_items')
            .select('*, profiles(full_name, avatar_url)')
            .order('created_at', { ascending: false });
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const reportLostFoundItem = async (data) => {
    try {
        const { data: res, error } = await supabase
            .from('lost_found_items')
            .insert([data])
            .select()
            .single();
        return { data: res, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * TRAVEL PARTNER OPERATIONS
 */

export const getTravelPartners = async (filters = {}) => {
    try {
        let query = supabase
            .from('travel_partner_requests')
            .select('*, profiles(full_name, avatar_url, gender, phone)')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (filters.districtId) query = query.eq('destination_id', filters.districtId);
        if (filters.gender) query = query.eq('profiles.gender', filters.gender);

        const { data, error } = await query;
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const createPartnerRequest = async (requestData) => {
    try {
        const { data, error } = await supabase
            .from('travel_partner_requests')
            .insert([requestData])
            .select()
            .single();
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};
