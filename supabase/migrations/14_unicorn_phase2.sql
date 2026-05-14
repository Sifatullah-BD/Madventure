-- Migration: Unicorn Upgrade Phase 2 (Business Engines)
-- Implements Coupons, Multi-Currency, and Tax Rules

-- 1. Coupon & Promo Engine
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed'
    discount_value NUMERIC(12,2) NOT NULL,
    min_purchase NUMERIC(12,2) DEFAULT 0,
    max_discount NUMERIC(12,2),
    expiry_date TIMESTAMPTZ,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupon_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES public.coupons(id),
    user_id UUID REFERENCES auth.users(id),
    booking_id UUID REFERENCES public.bookings(id),
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Multi-Currency Support
CREATE TABLE IF NOT EXISTS public.currencies (
    code VARCHAR(10) PRIMARY KEY, -- 'BDT', 'USD', 'EUR'
    name VARCHAR(50),
    symbol VARCHAR(10),
    exchange_rate_to_bdt NUMERIC(12,4) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tax Engine
CREATE TABLE IF NOT EXISTS public.tax_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- 'VAT', 'Tourism Tax'
    percentage NUMERIC(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Notification Preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on active coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read on currencies" ON public.currencies FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage own preferences" ON public.notification_preferences 
    FOR ALL USING (auth.uid() = user_id);
