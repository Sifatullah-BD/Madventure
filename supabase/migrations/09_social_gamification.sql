-- Migration: Social Discovery & Gamification
-- Adds follows, achievements, and XP systems

-- 1. Extend profiles with XP and Levels
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS traveler_type TEXT DEFAULT 'explorer';

-- 2. Follows Table
CREATE TABLE IF NOT EXISTS public.follows (
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows_select_public" ON public.follows FOR SELECT USING (true);
CREATE POLICY "follows_insert_own" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete_own" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- 3. Achievements Catalog
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    xp_reward INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed some achievements
INSERT INTO public.achievements (id, title, description, icon, xp_reward) VALUES
('first_trip', 'First Adventure', 'Completed your first booking on Madventure', '🎒', 100),
('review_king', 'Review King', 'Posted 5 or more tour reviews', '⭐', 250),
('coastal_explorer', 'Coastal Explorer', 'Visited 3 beach destinations', '🏖️', 500),
('social_butterfly', 'Social Butterfly', 'Participated in 10 forum discussions', '💬', 200)
ON CONFLICT DO NOTHING;

-- 4. User Achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id TEXT REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_achievements_select_public" ON public.user_achievements FOR SELECT USING (true);

-- 5. RPC to update XP and calculate level
CREATE OR REPLACE FUNCTION public.add_user_xp(p_user_id UUID, p_amount INTEGER)
RETURNS VOID AS $$
DECLARE
    v_new_xp INTEGER;
    v_new_level INTEGER;
BEGIN
    UPDATE public.profiles
    SET xp = xp + p_amount
    WHERE id = p_user_id
    RETURNING xp INTO v_new_xp;

    -- Simple leveling logic: level = floor(sqrt(xp / 100)) + 1
    v_new_level := floor(sqrt(v_new_xp / 100.0)) + 1;

    UPDATE public.profiles
    SET level = v_new_level
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
