-- Migration: Community V2 - Travel Partner Requests
-- Table to store travel partner matching requests

CREATE TABLE IF NOT EXISTS public.travel_partner_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    destination_id TEXT NOT NULL, -- Reference to district ID
    travel_date DATE NOT NULL,
    duration TEXT, -- e.g., '3-5 days'
    budget_range TEXT,
    description TEXT NOT NULL,
    interests TEXT[], -- Array of interest tags
    status TEXT DEFAULT 'active', -- 'active', 'matched', 'expired', 'cancelled'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.travel_partner_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partners_select_public" 
ON public.travel_partner_requests FOR SELECT 
USING (status = 'active');

CREATE POLICY "partners_insert_auth" 
ON public.travel_partner_requests FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "partners_manage_own" 
ON public.travel_partner_requests FOR ALL 
USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partners_user ON public.travel_partner_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_partners_dest ON public.travel_partner_requests (destination_id);
CREATE INDEX IF NOT EXISTS idx_partners_status ON public.travel_partner_requests (status);
