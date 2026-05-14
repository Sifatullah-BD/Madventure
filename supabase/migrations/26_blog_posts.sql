-- Migration: Madventure Blog System

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    cover_image TEXT,
    excerpt TEXT,
    content TEXT,
    category VARCHAR(100),
    tags TEXT[],
    author_id UUID REFERENCES public.profiles(id),
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published'
    language VARCHAR(10) DEFAULT 'bn', -- 'bn', 'en'
    views INTEGER DEFAULT 0,
    reading_time INTEGER,
    meta_title VARCHAR(255),
    meta_description TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_blog_status_lang ON public.blog_posts(status, language);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_category ON public.blog_posts(category);

-- RLS Policies
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view published posts
CREATE POLICY "Public can read published posts"
    ON public.blog_posts
    FOR SELECT
    USING (status = 'published');

-- 2. Admins can do everything
CREATE POLICY "Admins can manage all posts"
    ON public.blog_posts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.app_role IN ('admin', 'super_admin')
        )
    );
