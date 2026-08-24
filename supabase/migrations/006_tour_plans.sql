-- Migration: Tour Plans
-- Creates tour_plans table for user-generated trip planning

CREATE TABLE IF NOT EXISTS public.tour_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    destination VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travelers INTEGER DEFAULT 1,
    budget NUMERIC(12,2),
    travel_style VARCHAR(50), -- e.g., 'adventure', 'family', etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.tour_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can SELECT their own plans, and public can read all plans
CREATE POLICY "Allow authenticated read own plans" ON public.tour_plans
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow public read all plans" ON public.tour_plans
    FOR SELECT USING (true);

-- Policy: Users can INSERT, UPDATE, DELETE their own plans
CREATE POLICY "Allow insert own" ON public.tour_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow update own" ON public.tour_plans FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow delete own" ON public.tour_plans FOR DELETE USING (auth.uid() = user_id);
