-- Migration: Unicorn Upgrade Phase 4 (BI & Infrastructure)
-- Implements BI Aggregates and Feature Flags

-- 1. BI & Analytics Aggregates (For Dashboard Charts)
CREATE TABLE IF NOT EXISTS public.bi_daily_revenue (
    date DATE PRIMARY KEY,
    total_revenue NUMERIC(12,2) DEFAULT 0,
    booking_count INTEGER DEFAULT 0,
    commission_earned NUMERIC(12,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bi_user_segments (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    total_spent NUMERIC(12,2) DEFAULT 0,
    booking_frequency INTEGER DEFAULT 0,
    last_booking_date DATE,
    customer_lifetime_value NUMERIC(12,2) DEFAULT 0,
    segment VARCHAR(50), -- 'VIP', 'Regular', 'Churn-Risk'
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Feature Flags System
CREATE TABLE IF NOT EXISTS public.feature_flags (
    key VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255),
    is_enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 100, -- 0 to 100
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS
ALTER TABLE public.bi_daily_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bi_user_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Analytics and Flags are mostly for Admin/System
CREATE POLICY "Allow public read on feature flags" ON public.feature_flags FOR SELECT USING (true);
