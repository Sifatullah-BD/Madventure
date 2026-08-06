-- =============================================
-- Phase 5: Admin Dashboard, Analytics & Reporting
-- =============================================

-- =============================================
-- Audit Logs Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    target_table VARCHAR(100) NOT NULL,
    target_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON public.audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- RLS for Audit Logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
);

-- Only admins/system can insert audit logs
CREATE POLICY "Admins can insert audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
);


-- =============================================
-- Materialized Views for Analytics
-- =============================================
-- Note: In a real Supabase environment, you would use pg_cron to refresh these views periodically.

-- 1. Daily Bookings & Revenue
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_daily_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) AS day,
    COUNT(id) AS total_bookings,
    SUM(total_amount) AS total_revenue
FROM public.bookings
WHERE status = 'confirmed'
GROUP BY 1
ORDER BY 1 DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_daily_analytics_day ON public.mv_daily_analytics(day);

-- 2. User Growth
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_user_growth AS
SELECT 
    DATE_TRUNC('day', created_at) AS day,
    COUNT(id) AS new_users
FROM public.user_profiles
GROUP BY 1
ORDER BY 1 DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_user_growth_day ON public.mv_user_growth(day);


-- =============================================
-- Admin Access Policies for Existing Tables
-- =============================================
-- Ensure Admins have full SELECT/UPDATE/DELETE access to all critical tables

-- 1. user_profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
CREATE POLICY "Admins can manage all profiles" 
ON public.user_profiles FOR ALL 
USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- 2. bookings
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
CREATE POLICY "Admins can manage all bookings" 
ON public.bookings FOR ALL 
USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- 3. reviews
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
CREATE POLICY "Admins can manage all reviews" 
ON public.reviews FOR ALL 
USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- 4. threads (Community)
DROP POLICY IF EXISTS "Admins can manage all threads" ON public.threads;
CREATE POLICY "Admins can manage all threads" 
ON public.threads FOR ALL 
USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
