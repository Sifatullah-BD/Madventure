-- Migration: Step 2 Features (Transport, Cancellation, Reviews refinement)

-- 1. Transport Support
CREATE TABLE IF NOT EXISTS public.transports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name TEXT NOT NULL,
    transport_type TEXT NOT NULL, -- 'BUS', 'LAUNCH', 'TRAIN'
    route_from TEXT NOT NULL,
    route_to TEXT NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME,
    price NUMERIC(12,2) NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on active transports" ON public.transports FOR SELECT USING (status = 'active');

-- 2. Cancellation Policy Engine
-- Policy types: 'FLX' (Flexible), 'MOD' (Moderate), 'STRICT' (Strict)
CREATE TABLE IF NOT EXISTS public.cancellation_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    refund_percentage INTEGER NOT NULL, -- percentage of refund
    deadline_days INTEGER NOT NULL, -- days before start date for this refund %
    is_default BOOLEAN DEFAULT FALSE
);

-- Add policy references to tours and hotels
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS cancellation_policy_id UUID REFERENCES public.cancellation_policies(id);
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS cancellation_policy_id UUID REFERENCES public.cancellation_policies(id);

-- 3. Review Refinement: Ensure mandatory verified reviews
-- (Table already exists, adding trigger to check booking status if needed)
CREATE OR REPLACE FUNCTION public.check_verified_review()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.verified_booking = TRUE THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.bookings 
            WHERE user_id = NEW.user_id 
            AND entity_id = NEW.entity_id 
            AND status = 'confirmed'
        ) THEN
            RAISE EXCEPTION 'Review must be linked to a confirmed booking.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Initial Cancellation Data
INSERT INTO public.cancellation_policies (name, description, refund_percentage, deadline_days, is_default)
VALUES 
('Flexible', 'Full refund 3 days before', 100, 3, true),
('Moderate', '50% refund 7 days before', 50, 7, false),
('Non-refundable', 'No refund after booking', 0, 0, false)
ON CONFLICT DO NOTHING;
