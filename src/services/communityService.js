import { supabase } from '../lib/supabase';
import { FORUM_THREADS } from '../data/madventure-data';

export async function listCommunityPosts({ type = 'ALL', query = '', limit = 40 } = {}) {
    let request = supabase.from('community_posts').select('*').eq('visibility', 'public').order('created_at', { ascending: false }).limit(limit);
    if (type !== 'ALL') request = request.eq('post_type', type);
    if (query.trim()) request = request.or(`title.ilike.%${query.trim()}%,content.ilike.%${query.trim()}%,destination_text.ilike.%${query.trim()}%`);
    const { data, error } = await request;
    if (error?.code === 'PGRST205') return [];
    if (error) throw error;
    return data || [];
}

export async function createCommunityPost(payload) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Please log in to post.');
    const { data, error } = await supabase.from('community_posts').insert({ ...payload, author_id: user.id }).select().single();
    if (error?.code === 'PGRST205') throw new Error('Community video database is not set up yet. Run 08_community_video_posts.sql in Supabase SQL Editor.');
    if (error) throw error;
    return data;
}

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

            const { data } = await query;
            if (!data || data.length === 0) {
                let mockData = FORUM_THREADS;
                if (category && category !== 'all') mockData = mockData.filter(t => t.category === category);
                return mockData;
            }
            return data;
        } catch {
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
        } catch {
            const mockThread = FORUM_THREADS.find(t => t.id === threadId || t.id === Number(threadId));
            return mockThread ? { ...mockThread, replies: [] } : null;
        }
    }

    async createThread(userId, title, body, category = 'tips', districtId = null, mediaUrls = null) {
        const { data, error } = await supabase
            .from('forum_threads')
            .insert([{ user_id: userId, title, body, category, district_id: districtId, media_urls: mediaUrls }])
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
        if (filters.gender) query = query.eq('gender', filters.gender);
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
        if (!followerId || !followingId || followerId === followingId) throw new Error('You cannot follow this profile.');
        const { data, error } = await supabase.from('follows').insert([{ follower_id: followerId, following_id: followingId }]).select().single();
        if (error) throw error;
        await supabase.from('notifications').insert({
            user_id: followingId,
            actor_id: followerId,
            type: 'community',
            title: 'New follower',
            body: 'A traveler started following you.',
            payload: { action: 'new_follower', actor_id: followerId, target_type: 'user', target_id: followerId },
            action_url: `/profile/${followerId}`,
        });
        await supabase.from('activity_events').insert({
            actor_id: followerId,
            event_type: 'followed_user',
            entity_type: 'user',
            entity_id: followingId,
            metadata: { following_id: followingId },
        });
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

    async getPublicProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, username, avatar_url, bio, district, division, role, xp, level')
            .eq('id', userId)
            .maybeSingle();
        if (error) throw error;
        return data;
    }

    async getConnectionStatus(userId, otherUserId) {
        if (!userId || !otherUserId || userId === otherUserId) return 'self';
        const [block, connection, outgoing, incoming] = await Promise.all([
            supabase.from('user_blocks').select('blocker_id').or(`and(blocker_id.eq.${userId},blocked_id.eq.${otherUserId}),and(blocker_id.eq.${otherUserId},blocked_id.eq.${userId})`).maybeSingle(),
            supabase.from('connections').select('id').or(`and(user_id.eq.${userId},connected_user_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},connected_user_id.eq.${userId})`).maybeSingle(),
            supabase.from('connection_requests').select('id').eq('sender_id', userId).eq('receiver_id', otherUserId).eq('status', 'pending').maybeSingle(),
            supabase.from('connection_requests').select('id').eq('sender_id', otherUserId).eq('receiver_id', userId).eq('status', 'pending').maybeSingle(),
        ]);
        if (block.data) return 'blocked';
        if (connection.data) return 'connected';
        if (outgoing.data) return 'request_sent';
        if (incoming.data) return 'request_received';
        return 'none';
    }

    async requestConnection(senderId, receiverId) {
        const status = await this.getConnectionStatus(senderId, receiverId);
        if (status !== 'none') throw new Error(`Connection action unavailable while status is ${status}.`);
        const { data, error } = await supabase.from('connection_requests').insert({ sender_id: senderId, receiver_id: receiverId }).select().single();
        if (error) throw error;
        await supabase.from('notifications').insert({
            user_id: receiverId,
            actor_id: senderId,
            type: 'community',
            title: 'New connection request',
            body: 'A traveler wants to connect with you.',
            payload: { action: 'connection_request', request_id: data.id, actor_id: senderId },
            action_url: '/profile?tab=connections',
        });
        return data;
    }

    async respondToConnectionRequest(requestId, receiverId, accept) {
        const { data: request, error: requestError } = await supabase
            .from('connection_requests')
            .select('id, sender_id, receiver_id')
            .eq('id', requestId)
            .eq('receiver_id', receiverId)
            .eq('status', 'pending')
            .single();
        if (requestError) throw requestError;

        const status = accept ? 'accepted' : 'declined';
        const { error: updateError } = await supabase
            .from('connection_requests')
            .update({ status, responded_at: new Date().toISOString() })
            .eq('id', requestId);
        if (updateError) throw updateError;

        if (accept) {
            const [userId, connectedUserId] = [request.sender_id, request.receiver_id].sort();
            const { error: connectionError } = await supabase
                .from('connections')
                .insert({ user_id: userId, connected_user_id: connectedUserId });
            if (connectionError) throw connectionError;
            await supabase.from('notifications').insert({
                user_id: request.sender_id,
                actor_id: receiverId,
                type: 'community',
                title: 'Connection accepted',
                body: 'Your connection request was accepted.',
                payload: { action: 'connection_accepted', actor_id: receiverId },
                action_url: `/profile/${receiverId}`,
            });
        }
        return { ...request, status };
    }

    async blockUser(blockerId, blockedId) {
        const { error } = await supabase.from('user_blocks').upsert({ blocker_id: blockerId, blocked_id: blockedId });
        if (error) throw error;
        await Promise.all([
            supabase.from('follows').delete().or(`and(follower_id.eq.${blockerId},following_id.eq.${blockedId}),and(follower_id.eq.${blockedId},following_id.eq.${blockerId})`),
            supabase.from('connection_requests').update({ status: 'cancelled', responded_at: new Date().toISOString() }).or(`and(sender_id.eq.${blockerId},receiver_id.eq.${blockedId},status.eq.pending),and(sender_id.eq.${blockedId},receiver_id.eq.${blockerId},status.eq.pending)`),
        ]);
        return true;
    }

    async reportContent(reporterId, entityType, entityId, reason = 'Inappropriate content') {
        const { data, error } = await supabase.from('content_reports').insert({
            reporter_id: reporterId,
            entity_type: entityType,
            entity_id: entityId,
            reason,
        }).select().single();
        if (error) throw error;
        return data;
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

    // --------------------------------------------------------
    // Achievements & Leaderboard
    // --------------------------------------------------------
    async getUserAchievements(userId) {
        const { data, error } = await supabase
            .from('user_achievements')
            .select(`earned_at, achievements (*)`)
            .eq('user_id', userId);
        if (error) throw error;
        return data || [];
    }

    async getLeaderboard(limit = 10) {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, avatar, level, xp')
            .order('xp', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data || [];
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
export const getConnectionStatus = (...args) => communityService.getConnectionStatus(...args);
export const requestConnection = (...args) => communityService.requestConnection(...args);
export const respondToConnectionRequest = (...args) => communityService.respondToConnectionRequest(...args);
export const blockUser = (...args) => communityService.blockUser(...args);
export const reportContent = (...args) => communityService.reportContent(...args);
export const getFollowStats = (...args) => communityService.getFollowStats(...args);
export const getPublicProfile = (...args) => communityService.getPublicProfile(...args);
export const getReviews = (...args) => communityService.getReviews(...args);
export const addReview = (...args) => communityService.addReview(...args);
export const getUserAchievements = (...args) => communityService.getUserAchievements(...args);
export const getLeaderboard = (...args) => communityService.getLeaderboard(...args);
