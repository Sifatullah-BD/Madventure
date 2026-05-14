-- Gamification & Badges Integration

CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT, -- Lucide icon name or image URL
    criteria_type TEXT, -- 'post_count', 'booking_count', 'review_count'
    criteria_value INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    badge_id UUID REFERENCES public.badges(id),
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Seed Initial Badges
INSERT INTO public.badges (name, description, icon_name, criteria_type, criteria_value)
VALUES 
('Early Explorer', 'Joined the Madventure community early.', 'Compass', 'manual', 0),
('Frequent Flyer', 'Completed 5 or more bookings.', 'Plane', 'booking_count', 5),
('Safety Guardian', 'Helped others by reporting or contributing safety tips.', 'Shield', 'manual', 0),
('Top Reviewer', 'Contributed 10 or more verified reviews.', 'Star', 'review_count', 10);

-- Policies
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Users can view own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
