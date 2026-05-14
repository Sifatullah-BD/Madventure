-- Add youtube_url column to relevant tables for video embedding

ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS youtube_url TEXT;
