-- Migration: Videos
-- Creates tables for video sharing functionality

CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL, -- either storage URL or external link
    thumbnail_url TEXT,
    visibility VARCHAR(20) NOT NULL DEFAULT 'public', -- public, followers, private
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.video_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.video_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.video_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.video_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_with VARCHAR(255), -- could be a user ID list or group ID
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.video_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_reports ENABLE ROW LEVEL SECURITY;

-- Policies for videos
CREATE POLICY "Allow public read all videos" ON public.videos FOR SELECT USING (visibility = 'public');
CREATE POLICY "Allow owner read own videos" ON public.videos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow owner insert" ON public.videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow owner update" ON public.videos FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow owner delete" ON public.videos FOR DELETE USING (auth.uid() = user_id);

-- Policies for likes, comments, saves, shares, reports (owner only)
CREATE POLICY "Allow authenticated insert own" ON public.video_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated delete own" ON public.video_likes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated insert own" ON public.video_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated delete own" ON public.video_comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated insert own" ON public.video_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated delete own" ON public.video_saves FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated insert own" ON public.video_shares FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated delete own" ON public.video_shares FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated insert own" ON public.video_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
