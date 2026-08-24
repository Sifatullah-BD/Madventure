-- Migration: 004_video_hub_schema.sql
-- Creates tables for the Madventure Video Hub feature

-- Enable PostGIS for geospatial if not already enabled
-- (Assumes Supabase has PostGIS extension installed)

CREATE EXTENSION IF NOT EXISTS postgis;

-- videos table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_type TEXT CHECK (video_type IN ('UPLOAD','EXTERNAL')) NOT NULL,
    source_type TEXT CHECK (source_type IN ('YOUTUBE','VIMEO','OTHERS')),
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration INT, -- seconds
    category TEXT,
    location TEXT,
    tags TEXT[],
    visibility TEXT CHECK (visibility IN ('PUBLIC','FOLLOWERS','PRIVATE')) DEFAULT 'PUBLIC',
    destination_id UUID REFERENCES public.places(id),
    tour_id UUID REFERENCES public.tours(id),
    agency_id UUID REFERENCES public.user_profiles(id),
    views_count BIGINT DEFAULT 0,
    likes_count BIGINT DEFAULT 0,
    comments_count BIGINT DEFAULT 0,
    shares_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- video_likes table
CREATE TABLE IF NOT EXISTS public.video_likes (
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    video_id UUID REFERENCES public.videos(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    PRIMARY KEY (user_id, video_id)
);

-- video_comments table
CREATE TABLE IF NOT EXISTS public.video_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID REFERENCES public.videos(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    parent_id UUID REFERENCES public.video_comments(id),
    content TEXT NOT NULL,
    likes_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- video_saves table
CREATE TABLE IF NOT EXISTS public.video_saves (
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    video_id UUID REFERENCES public.videos(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    PRIMARY KEY (user_id, video_id)
);

-- video_shares table
CREATE TABLE IF NOT EXISTS public.video_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users(id) NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) NOT NULL,
    video_id UUID REFERENCES public.videos(id) NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- video_reports table
CREATE TABLE IF NOT EXISTS public.video_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES auth.users(id) NOT NULL,
    video_id UUID REFERENCES public.videos(id) NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_videos_destination ON public.videos(destination_id);
CREATE INDEX IF NOT EXISTS idx_videos_tour ON public.videos(tour_id);
CREATE INDEX IF NOT EXISTS idx_videos_created ON public.videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_likes_video ON public.video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_video_comments_video ON public.video_comments(video_id);

-- Row Level Security policies
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Select policy
CREATE POLICY "public videos" ON public.videos
    FOR SELECT USING (
        visibility = 'PUBLIC'
        OR user_id = auth.uid()
        OR (visibility = 'FOLLOWERS' AND EXISTS (
            SELECT 1 FROM public.followers f WHERE f.follower_id = auth.uid() AND f.followed_id = videos.user_id
        ))
    );

-- Insert / Update / Delete policy for owners
CREATE POLICY "owner manage" ON public.videos
    FOR ALL USING (user_id = auth.uid());

-- Admin policy (assumes role claim "admin")
CREATE POLICY "admin manage" ON public.videos
    FOR ALL USING (auth.jwt()->>'role' = 'admin');

-- Similar RLS for related tables (likes, comments, saves, shares, reports)
ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes select" ON public.video_likes FOR SELECT USING (true);
CREATE POLICY "likes manage" ON public.video_likes FOR ALL USING (user_id = auth.uid());

ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments select" ON public.video_comments FOR SELECT USING (true);
CREATE POLICY "comments manage" ON public.video_comments FOR ALL USING (user_id = auth.uid());

ALTER TABLE public.video_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saves select" ON public.video_saves FOR SELECT USING (true);
CREATE POLICY "saves manage" ON public.video_saves FOR ALL USING (user_id = auth.uid());

ALTER TABLE public.video_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shares select" ON public.video_shares FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "shares manage" ON public.video_shares FOR INSERT USING (sender_id = auth.uid());

ALTER TABLE public.video_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports select" ON public.video_reports FOR SELECT USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "reports manage" ON public.video_reports FOR ALL USING (reporter_id = auth.uid() OR auth.jwt()->>'role' = 'admin');

-- Trigger to update updated_at on row change
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc', now());
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_videos_updated BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER trg_video_comments_updated BEFORE UPDATE ON public.video_comments FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
