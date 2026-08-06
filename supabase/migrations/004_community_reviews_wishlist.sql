-- =============================================
-- Migration 004: Community, Reviews, Wishlist & Search
-- =============================================

-- Enums
CREATE TYPE public.thread_status AS ENUM ('open', 'closed', 'flagged');
CREATE TYPE public.report_reason AS ENUM ('spam', 'hate_speech', 'adult_content', 'fake_news', 'illegal', 'other');
CREATE TYPE public.wishlist_type AS ENUM ('tour', 'hotel', 'place');

-- =============================================
-- Community Threads
-- =============================================
CREATE TABLE IF NOT EXISTS public.threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    title VARCHAR(300) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(100),
    images JSONB DEFAULT '[]'::jsonb,
    status public.thread_status DEFAULT 'open'::public.thread_status,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- Thread Replies
-- =============================================
CREATE TABLE IF NOT EXISTS public.thread_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    body TEXT NOT NULL,
    parent_reply_id UUID REFERENCES public.thread_replies(id),
    upvotes INT DEFAULT 0,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- Thread Votes (prevent duplicate voting)
-- =============================================
CREATE TABLE IF NOT EXISTS public.thread_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    vote_type SMALLINT NOT NULL CHECK (vote_type IN (1, -1)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(thread_id, user_id)
);

-- =============================================
-- Reports
-- =============================================
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES auth.users(id) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    reason public.report_reason NOT NULL,
    description TEXT,
    resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- Reviews (Booking-verified only)
-- =============================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) NOT NULL UNIQUE,
    tour_id UUID REFERENCES public.tours(id),
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    body TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- Wishlist
-- =============================================
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    item_type public.wishlist_type NOT NULL,
    item_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, item_type, item_id)
);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_threads_author ON public.threads(author_id);
CREATE INDEX IF NOT EXISTS idx_threads_category ON public.threads(category);
CREATE INDEX IF NOT EXISTS idx_thread_replies_thread ON public.thread_replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_reviews_tour ON public.reviews(tour_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_target ON public.reports(target_type, target_id);

-- Full-text search index on threads
CREATE INDEX IF NOT EXISTS idx_threads_search ON public.threads USING GIN (to_tsvector('simple', title || ' ' || body));

-- =============================================
-- Triggers
-- =============================================
CREATE TRIGGER threads_updated_at BEFORE UPDATE ON public.threads FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-increment reply_count
CREATE OR REPLACE FUNCTION public.handle_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.threads SET reply_count = reply_count + 1 WHERE id = NEW.thread_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER thread_reply_count
AFTER INSERT ON public.thread_replies
FOR EACH ROW EXECUTE FUNCTION public.handle_reply_count();

-- =============================================
-- RLS
-- =============================================
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Threads: Public read, auth write
CREATE POLICY "Threads are public" ON public.threads FOR SELECT USING (true);
CREATE POLICY "Auth users can create threads" ON public.threads FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own threads" ON public.threads FOR UPDATE USING (auth.uid() = author_id);

-- Replies: Public read, auth write
CREATE POLICY "Replies are public" ON public.thread_replies FOR SELECT USING (true);
CREATE POLICY "Auth users can reply" ON public.thread_replies FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Votes: Auth users
CREATE POLICY "Users can view own votes" ON public.thread_votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can vote" ON public.thread_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can change vote" ON public.thread_votes FOR UPDATE USING (auth.uid() = user_id);

-- Reports: Auth users can create, only admins can view
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Reviews: Public read, verified user write
CREATE POLICY "Reviews are public" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Wishlist: User's own only
CREATE POLICY "Users can view own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime for threads
ALTER PUBLICATION supabase_realtime ADD TABLE public.threads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.thread_replies;
