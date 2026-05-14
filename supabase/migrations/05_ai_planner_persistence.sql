-- Migration: AI Planner Persistence & Itineraries
-- Table to store AI-generated plans and custom user itineraries

CREATE TABLE IF NOT EXISTS public.itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    destination TEXT,
    duration_days INTEGER,
    start_date DATE,
    budget_estimate NUMERIC(12,2),
    plan_data JSONB NOT NULL, -- Full itinerary details (days, activities, costs)
    is_public BOOLEAN DEFAULT FALSE,
    share_slug TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "itineraries_select_own_or_public" 
ON public.itineraries FOR SELECT 
USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "itineraries_insert_auth" 
ON public.itineraries FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "itineraries_update_own" 
ON public.itineraries FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "itineraries_delete_own" 
ON public.itineraries FOR DELETE 
USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_itineraries_user ON public.itineraries (user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_slug ON public.itineraries (share_slug);
