-- Final Production Hardening Migration
-- 1. Enable RLS on all relevant tables
ALTER TABLE IF EXISTS public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cancellation_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.refund_requests ENABLE ROW LEVEL SECURITY;

-- 2. Define Policies

-- Coupons: Everyone can view active coupons (for validation), but only admins can modify
DROP POLICY IF EXISTS "Public can view active coupons" ON public.coupons;
CREATE POLICY "Public can view active coupons" ON public.coupons
    FOR SELECT USING (expiry_date > NOW() AND status = 'active');

-- Transports: Everyone can view available transports
DROP POLICY IF EXISTS "Public can view active transports" ON public.transports;
CREATE POLICY "Public can view active transports" ON public.transports
    FOR SELECT USING (status = 'active');

-- Refund Requests: Users see their own, admins see all
DROP POLICY IF EXISTS "Users can view own refunds" ON public.refund_requests;
CREATE POLICY "Users can view own refunds" ON public.refund_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings b 
            WHERE b.id = public.refund_requests.booking_id 
            AND b.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can view all refunds" ON public.refund_requests;
CREATE POLICY "Admins can view all refunds" ON public.refund_requests
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.app_role IN ('admin', 'super_admin'))
    );

-- 3. Inventory Protection Trigger (Prevent overbooking)
CREATE OR REPLACE FUNCTION public.check_transport_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT available_seats FROM public.transports WHERE id = NEW.transport_id) < NEW.seat_count THEN
        RAISE EXCEPTION 'No more seats available on this transport.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Audit Log Table (Optional but recommended for Production)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT,
    table_name TEXT,
    record_id TEXT,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
