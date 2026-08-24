-- Migration 032: Group Community Schema
-- Adds tables for travel-focused groups, members, posts, comments, reactions, media, events, guides, and join requests.

-- Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Groups table
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    avatar_image TEXT,
    privacy VARCHAR(20) NOT NULL DEFAULT 'public', -- public, private, secret
    category VARCHAR(100),
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Group members table
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'member', -- member, moderator, admin
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(group_id, user_id)
);

-- Group join requests (for private groups)
CREATE TABLE IF NOT EXISTS public.group_join_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(group_id, user_id)
);

-- Group posts
CREATE TABLE IF NOT EXISTS public.group_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    content TEXT NOT NULL,
    location VARCHAR(200),
    trip_id UUID, -- reference to a tour if needed
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Group post media (photos/videos)
CREATE TABLE IF NOT EXISTS public.group_post_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.group_posts(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(20) NOT NULL, -- image, video
    order_idx INTEGER DEFAULT 0
);

-- Group comments (on posts)
CREATE TABLE IF NOT EXISTS public.group_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.group_posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    body TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.group_comments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Group reactions (on posts)
CREATE TYPE public.group_reaction_type AS ENUM ('like', 'love', 'funny', 'wow', 'sad', 'awesome');

CREATE TABLE IF NOT EXISTS public.group_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.group_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    reaction public.group_reaction_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(post_id, user_id)
);

-- Group events
CREATE TABLE IF NOT EXISTS public.group_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image TEXT,
    event_date DATE NOT NULL,
    location VARCHAR(200),
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Group guides / resources (optional)
CREATE TABLE IF NOT EXISTS public.group_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_group_posts_group ON public.group_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_group_comments_post ON public.group_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_group_reactions_post ON public.group_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_group_events_group ON public.group_events(group_id);

-- Row Level Security (RLS) policies
-- Groups: public read, members can write
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Groups are public" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create groups" ON public.groups FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Group owners can update/delete" ON public.groups FOR UPDATE, DELETE USING (auth.uid() = created_by);

-- Group members: members can read, owner/admin can manage
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view own membership" ON public.group_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Members can join groups" ON public.group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins/moderators can manage members" ON public.group_members FOR UPDATE, DELETE USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_id AND gm.user_id = auth.uid() AND gm.role = 'admin')
);

-- Join requests: owners can view/manage
ALTER TABLE public.group_join_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can view own join request" ON public.group_join_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User can create join request" ON public.group_join_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage requests" ON public.group_join_requests FOR UPDATE, DELETE USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_id AND gm.user_id = auth.uid() AND gm.role = 'admin')
);

-- Group posts: members can read, author can edit/delete, admins can moderate
ALTER TABLE public.group_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read posts" ON public.group_posts FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_id AND gm.user_id = auth.uid())
    OR privacy = 'public'
);
CREATE POLICY "Authors can edit/delete" ON public.group_posts FOR UPDATE, DELETE USING (auth.uid() = author_id);
CREATE POLICY "Members can create posts" ON public.group_posts FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_id AND gm.user_id = auth.uid())
);

-- Group comments: similar to posts
ALTER TABLE public.group_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read comments" ON public.group_comments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = (SELECT group_id FROM public.group_posts WHERE id = post_id) AND gm.user_id = auth.uid())
);
CREATE POLICY "Authors can edit/delete comments" ON public.group_comments FOR UPDATE, DELETE USING (auth.uid() = author_id);
CREATE POLICY "Members can add comments" ON public.group_comments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = (SELECT group_id FROM public.group_posts WHERE id = post_id) AND gm.user_id = auth.uid())
);

-- Reactions: members can add/remove reactions
ALTER TABLE public.group_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can react" ON public.group_reactions FOR SELECT, INSERT, DELETE USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = (SELECT group_id FROM public.group_posts WHERE id = post_id) AND gm.user_id = auth.uid())
);

-- Events: members can view, owners can manage
ALTER TABLE public.group_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view events" ON public.group_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_id AND gm.user_id = auth.uid())
);
CREATE POLICY "Owners can manage events" ON public.group_events FOR INSERT, UPDATE, DELETE USING (auth.uid() = created_by);

-- Guides: members can read, owners can manage
ALTER TABLE public.group_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view guides" ON public.group_guides FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_id AND gm.user_id = auth.uid())
);
CREATE POLICY "Owners can manage guides" ON public.group_guides FOR INSERT, UPDATE, DELETE USING (auth.uid() = created_by);

-- Enable realtime for group tables (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_guides;
