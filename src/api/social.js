import { supabase } from '../lib/supabase';

/**
 * Follow a user
 */
export const followUser = async (followerId, followingId) => {
    const { data, error } = await supabase
        .from('follows')
        .insert([{ follower_id: followerId, following_id: followingId }]);
    return { data, error };
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (followerId, followingId) => {
    const { data, error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);
    return { data, error };
};

/**
 * Get follower count and following count for a user
 */
export const getFollowStats = async (userId) => {
    const [followers, following] = await Promise.all([
        supabase.from('follows').select('follower_id', { count: 'exact', head: true }).eq('following_id', userId),
        supabase.from('follows').select('following_id', { count: 'exact', head: true }).eq('follower_id', userId)
    ]);
    
    return {
        followers: followers.count || 0,
        following: following.count || 0,
        error: followers.error || following.error
    };
};

/**
 * Get user's earned achievements
 */
export const getUserAchievements = async (userId) => {
    const { data, error } = await supabase
        .from('user_achievements')
        .select(`
            earned_at,
            achievements (*)
        `)
        .eq('user_id', userId);
    return { data, error };
};

/**
 * Get global explorer leaderboard
 */
export const getLeaderboard = async (limit = 10) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar, level, xp')
        .order('xp', { ascending: false })
        .limit(limit);
    return { data, error };
};
