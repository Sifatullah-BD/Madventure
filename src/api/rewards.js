import { supabase } from '../lib/supabase';

/**
 * Reward a user with XP for an action
 */
export const awardXP = async (userId, amount) => {
    const { error } = await supabase.rpc('add_user_xp', {
        p_user_id: userId,
        p_amount: amount
    });
    return { error };
};

/**
 * Grant an achievement to a user
 */
export const grantAchievement = async (userId, achievementId) => {
    // 1. Get achievement info to find XP reward
    const { data: ach } = await supabase
        .from('achievements')
        .select('xp_reward')
        .eq('id', achievementId)
        .single();
    
    // 2. Insert into user_achievements
    const { data, error } = await supabase
        .from('user_achievements')
        .insert([{ user_id: userId, achievement_id: achievementId }]);
    
    // 3. Award XP if successful
    if (!error && ach) {
        await awardXP(userId, ach.xp_reward);
    }
    
    return { data, error };
};
