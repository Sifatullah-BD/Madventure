-- Migration: Unicorn Upgrade Phase 1 (Foundation)
-- Implements Media Management, Inventory Locking, Refunds, and Reviews

-- 1. Media Management System
CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_type VARCHAR(50), -- 'district', 'place', 'tour', 'user'
    owner_id UUID,
    file_type VARCHAR(30), -- 'image', 'video', 'doc'
    file_url TEXT NOT NULL,
    mime_type VARCHAR(100),
    file_size BIGINT,
    storage_provider VARCHAR(50) DEFAULT 'supabase',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Inventory Locking (Prevent Overbooking)
CREATE TABLE IF NOT EXISTS public.booking_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    schedule_id UUID,
    locked_seats INTEGER NOT NULL DEFAULT 1,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Refund System
CREATE TABLE IF NOT EXISTS public.refund_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id),
    reason TEXT NOT NULL,
    refund_amount NUMERIC(12,2) NOT NULL,
    refund_status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'processed'
    admin_notes TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- 4. Review System (Production Grade)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    entity_type VARCHAR(30), -- 'tour', 'hotel', 'place'
    entity_id UUID,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    verified_booking BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Search Optimization (Full-Text Search)
-- Adding tsvector column to places for fast search
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS places_search_idx ON public.places USING GIN(search_vector);

-- Function to update search vector
CREATE OR REPLACE FUNCTION places_search_trigger() RETURNS trigger AS $$
BEGIN
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'B');
  return new;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_places_search_update
BEFORE INSERT OR UPDATE ON public.places
FOR EACH ROW EXECUTE FUNCTION places_search_trigger();

-- 6. Enable RLS for new tables
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read on media_files" ON public.media_files FOR SELECT USING (true);
CREATE POLICY "Allow public read on reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can view own locks" ON public.booking_locks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own refunds" ON public.refund_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
);
