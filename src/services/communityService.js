import { supabase } from '../lib/supabase';
import { FORUM_THREADS } from '../data/madventure-data';

class CommunityService {
    // --------------------------------------------------------
    // Forum Operations
    // --------------------------------------------------------
    async getForumThreads(category = null, districtId = null) {
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
            if (!data || data.length === 0) {
                let mockData = FORUM_THREADS;
                if (category && category !== 'all') mockData = mockData.filter(t => t.category === category);
                return mockData;
            }
            return data;
        } catch (err) {
            return FORUM_THREADS;
        }
    }

    async getThreadDetails(threadId) {
        try {
            const { data: thread, error: tErr } = await supabase
                .from('forum_threads')
                .select('*, profiles(full_name, avatar_url)')
                .eq('id', threadId)
                .maybeSingle();

            if (tErr || !thread) {
                const mockThread = FORUM_THREADS.find(t => t.id === threadId || t.id === Number(threadId));
                if (mockThread) return { ...mockThread, replies: [] };
                throw tErr || new Error('Thread not found');
            }

            const { data: replies } = await supabase
                .from('forum_replies')
                .select('*, profiles(full_name, avatar_url)')
                .eq('thread_id', threadId)
                .order('created_at', { ascending: true });

            return { ...thread, replies: replies || [] };
        } catch (err) {
            const mockThread = FORUM_THREADS.find(t => t.id === threadId || t.id === Number(threadId));
            return mockThread ? { ...mockThread, replies: [] } : null;
        }
    }

    async createThread(userId, title, body, category = 'tips', districtId = null) {
        const { data, error } = await supabase
            .from('forum_threads')
            .insert([{ user_id: userId, title, body, category, district_id: districtId }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async upvoteThread(threadId) {
        const { data, error } = await supabase.rpc('increment_thread_upvotes', { thread_id: threadId });
        if (error) throw error;
        return data;
    }

    async postReply(threadId, userId, body) {
        const { data, error } = await supabase
            .from('forum_replies')
            .insert([{ thread_id: threadId, user_id: userId, body }])
            .select('*, profiles(full_name, avatar_url)')
            .single();
        if (error) throw error;
        return data;
    }

    // --------------------------------------------------------
    // Lost & Found Operations
    // --------------------------------------------------------
    async getLostFoundItems(type = null) {
        let query = supabase
            .from('lost_found')
            .select('*, profiles(full_name, avatar_url)')
            .order('created_at', { ascending: false });

        if (type) query = query.eq('type', type);
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    }

    async reportLostFoundItem(itemData) {
        const { data, error } = await supabase
            .from('lost_found')
            .insert([itemData])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async updateLostFoundStatus(id, status) {
        const { data, error } = await supabase
            .from('lost_found')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    // --------------------------------------------------------
    // Travel Partner Operations
    // --------------------------------------------------------
    async getTravelPartners(filters = {}) {
        let query = supabase
            .from('travel_partners')
            .select('*, profiles(full_name, avatar_url)')
            .eq('status', 'open')
            .order('created_at', { ascending: false });

        if (filters.destination) query = query.ilike('destination', `%${filters.destination}%`);
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    }

    async createPartnerRequest(requestData) {
        const { data, error } = await supabase
            .from('travel_partners')
            .insert([requestData])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    // --------------------------------------------------------
    // Wishlist Operations
    // --------------------------------------------------------
    async getWishlist(userId) {
        try {
            const { data, error } = await supabase.from('wishlists').select('*').eq('user_id', userId);
            if (error) throw error;
            return data || [];
        } catch {
            return JSON.parse(localStorage.getItem('madventure_wishlist') || '[]');
        }
    }

    async addToWishlist(userId, itemType, itemId) {
        try {
            const { data, error } = await supabase
                .from('wishlists')
                .insert([{ user_id: userId, item_type: itemType, item_id: itemId }])
                .select()
                .single();
            if (error) throw error;
            return data;
        } catch {
            const local = JSON.parse(localStorage.getItem('madventure_wishlist') || '[]');
            const newItem = { id: Date.now(), user_id: userId, item_type: itemType, item_id: itemId };
            localStorage.setItem('madventure_wishlist', JSON.stringify([...local, newItem]));
            return newItem;
        }
    }

    async removeFromWishlist(id) {
        try {
            const { error } = await supabase.from('wishlists').delete().eq('id', id);
            if (error) throw error;
        } catch {
            const local = JSON.parse(localStorage.getItem('madventure_wishlist') || '[]');
            localStorage.setItem('madventure_wishlist', JSON.stringify(local.filter(i => i.id !== id)));
        }
    }

    // --------------------------------------------------------
    // Social / Follow Operations
    // --------------------------------------------------------
    async followUser(followerId, followingId) {
        const { data, error } = await supabase.from('follows').insert([{ follower_id: followerId, following_id: followingId }]);
        if (error) throw error;
        return data;
    }

    async unfollowUser(followerId, followingId) {
        const { data, error } = await supabase.from('follows').delete().eq('follower_id', followerId).eq('following_id', followingId);
        if (error) throw error;
        return data;
    }

    async getFollowStats(userId) {
        const [followers, following] = await Promise.all([
            supabase.from('follows').select('follower_id', { count: 'exact', head: true }).eq('following_id', userId),
            supabase.from('follows').select('following_id', { count: 'exact', head: true }).eq('follower_id', userId)
        ]);
        if (followers.error) throw followers.error;
        if (following.error) throw following.error;
        return { followers: followers.count || 0, following: following.count || 0 };
    }

    // --------------------------------------------------------
    // Review Operations
    // --------------------------------------------------------
    async getReviews(entityType, entityId) {
        let query = supabase.from('reviews').select('*');
        if (entityType) query = query.eq('entity_type', entityType);
        if (entityId) query = query.eq('entity_id', entityId);
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }

    async addReview(reviewData) {
        const { data, error } = await supabase.from('reviews').insert([reviewData]).select().single();
        if (error) throw error;
        return data;
    }
}

export const communityService = new CommunityService();

export const getForumThreads = (...args) => communityService.getForumThreads(...args);
export const getThreadDetails = (...args) => communityService.getThreadDetails(...args);
export const createThread = (...args) => communityService.createThread(...args);
export const upvoteThread = (...args) => communityService.upvoteThread(...args);
export const postReply = (...args) => communityService.postReply(...args);
export const getLostFoundItems = (...args) => communityService.getLostFoundItems(...args);
export const reportLostFoundItem = (...args) => communityService.reportLostFoundItem(...args);
export const updateLostFoundStatus = (...args) => communityService.updateLostFoundStatus(...args);
export const getTravelPartners = (...args) => communityService.getTravelPartners(...args);
export const createPartnerRequest = (...args) => communityService.createPartnerRequest(...args);
export const getWishlist = (...args) => communityService.getWishlist(...args);
export const addToWishlist = (...args) => communityService.addToWishlist(...args);
export const removeFromWishlist = (...args) => communityService.removeFromWishlist(...args);
export const followUser = (...args) => communityService.followUser(...args);
export const unfollowUser = (...args) => communityService.unfollowUser(...args);
export const getFollowStats = (...args) => communityService.getFollowStats(...args);
export const getReviews = (...args) => communityService.getReviews(...args);
export const addReview = (...args) => communityService.addReview(...args);
