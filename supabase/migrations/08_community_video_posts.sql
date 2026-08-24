CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_type text NOT NULL CHECK (post_type IN ('PHOTO','VIDEO','STORY','GUIDE','TIP','REVIEW','QUESTION','TRAVEL_COMPANION')),
  title text NOT NULL, content text, images jsonb NOT NULL DEFAULT '[]'::jsonb,
  provider text NOT NULL DEFAULT 'NONE' CHECK (provider IN ('NONE','YOUTUBE','BILIBILI')),
  source_url text, video_id text, embed_url text, thumbnail_url text,
  destination_text text, district text, category text, tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','private')),
  like_count int NOT NULL DEFAULT 0, comment_count int NOT NULL DEFAULT 0, save_count int NOT NULL DEFAULT 0, share_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT community_video_integrity CHECK (post_type <> 'VIDEO' OR (provider IN ('YOUTUBE','BILIBILI') AND video_id IS NOT NULL AND source_url IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS idx_community_posts_type_created ON public.community_posts(post_type, created_at DESC);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS community_posts_public_read ON public.community_posts;
CREATE POLICY community_posts_public_read ON public.community_posts FOR SELECT USING (visibility = 'public' OR author_id = auth.uid());
DROP POLICY IF EXISTS community_posts_insert_own ON public.community_posts;
CREATE POLICY community_posts_insert_own ON public.community_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
DROP POLICY IF EXISTS community_posts_update_own ON public.community_posts;
CREATE POLICY community_posts_update_own ON public.community_posts FOR UPDATE TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
DROP POLICY IF EXISTS community_posts_delete_own ON public.community_posts;
CREATE POLICY community_posts_delete_own ON public.community_posts FOR DELETE TO authenticated USING (author_id = auth.uid());