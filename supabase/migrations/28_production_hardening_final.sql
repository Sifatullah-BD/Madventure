-- ============================================================
-- Migration 28: Final Production Hardening
-- Critical RLS + Missing Indexes + Audit Trigger
-- Run this after all previous migrations
-- ============================================================

-- ======================================
-- 1. Ensure bookings table has all needed columns
-- ======================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='payment_status') THEN
    ALTER TABLE public.bookings ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='extras') THEN
    ALTER TABLE public.bookings ADD COLUMN extras JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='cancel_reason') THEN
    ALTER TABLE public.bookings ADD COLUMN cancel_reason TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='cancelled_at') THEN
    ALTER TABLE public.bookings ADD COLUMN cancelled_at TIMESTAMPTZ;
  END IF;
END
$$;

-- ======================================
-- 2. Performance Indexes
-- ======================================
CREATE INDEX IF NOT EXISTS idx_bookings_user_id        ON public.bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status         ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at     ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings (payment_status);

CREATE INDEX IF NOT EXISTS idx_tours_agency_id         ON public.tours (agency_id);
CREATE INDEX IF NOT EXISTS idx_tours_destination       ON public.tours (destination);
CREATE INDEX IF NOT EXISTS idx_tours_created_at        ON public.tours (created_at DESC);

-- ======================================
-- 3. Ensure audit_logs table exists
-- ======================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id     UUID         REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type  TEXT         NOT NULL,
    entity_type  TEXT         NOT NULL,
    entity_id    TEXT,
    old_data     JSONB,
    new_data     JSONB,
    ip_address   TEXT,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_view_admin" ON public.audit_logs;
CREATE POLICY "audit_view_admin" ON public.audit_logs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND app_role IN ('admin', 'super_admin')
    )
);

DROP POLICY IF EXISTS "audit_insert_service" ON public.audit_logs;
CREATE POLICY "audit_insert_service" ON public.audit_logs FOR INSERT
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_audit_actor      ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity     ON public.audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.audit_logs (created_at DESC);

-- ======================================
-- 4. Auto-audit trigger for bookings
-- ======================================
CREATE OR REPLACE FUNCTION public.log_booking_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.audit_logs (actor_id, action_type, entity_type, entity_id, old_data, new_data)
    VALUES (
        auth.uid(),
        TG_OP,
        'booking',
        COALESCE(NEW.id, OLD.id)::TEXT,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS booking_audit_trigger ON public.bookings;
CREATE TRIGGER booking_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.log_booking_change();

-- ======================================
-- 5. Payment transactions – RLS hardening
-- ======================================
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pt_select_own" ON public.payment_transactions;
CREATE POLICY "pt_select_own" ON public.payment_transactions FOR SELECT
USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "pt_admin_all" ON public.payment_transactions;
CREATE POLICY "pt_admin_all" ON public.payment_transactions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND app_role IN ('admin', 'super_admin')
    )
);

-- ======================================
-- 6. Analytics events table
-- ======================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_name  TEXT         NOT NULL,
    event_data  JSONB        DEFAULT '{}',
    page_url    TEXT,
    ip_address  TEXT,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "analytics_insert" ON public.analytics_events;
CREATE POLICY "analytics_insert" ON public.analytics_events FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "analytics_admin_select" ON public.analytics_events;
CREATE POLICY "analytics_admin_select" ON public.analytics_events FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND app_role IN ('admin', 'super_admin')
    )
);

CREATE INDEX IF NOT EXISTS idx_analytics_event ON public.analytics_events (event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_user  ON public.analytics_events (user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_ts    ON public.analytics_events (created_at DESC);

SELECT 'Migration 28: Production Hardening complete' AS status;
