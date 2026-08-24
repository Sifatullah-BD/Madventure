-- Blog editor workflow fields. Existing blog_posts remains the canonical content table.
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS featured_order INTEGER;

DROP POLICY IF EXISTS "Authors can manage own workflow posts" ON public.blog_posts;
CREATE POLICY "Authors can manage own workflow posts" ON public.blog_posts
FOR ALL USING (auth.uid() = author_id OR EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.app_role IN ('admin', 'super_admin')
)) WITH CHECK (auth.uid() = author_id OR EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.app_role IN ('admin', 'super_admin')
));

DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;
CREATE POLICY "Public can read published posts" ON public.blog_posts
FOR SELECT USING (status = 'published' OR auth.uid() = author_id OR EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.app_role IN ('admin', 'super_admin')
));