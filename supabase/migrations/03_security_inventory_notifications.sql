-- P1 Security + RLS | P2 Tour seat inventory (atomic) | P4 Audit | P5 Notification queue | P6 Analytics
-- Run after 02_production_rbac_wallet_payment.sql

-- ---------------------------------------------------------------------------
-- Staff helper (admin / super_admin / moderator)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE
            p.id = auth.uid()
            AND p.app_role IN ('admin', 'super_admin', 'moderator')
    );
$$;

-- ---------------------------------------------------------------------------
-- Tour departures: capacity + booked_seats (atomic updates via RPC only)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tour_departures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id TEXT NOT NULL REFERENCES public.tours (id) ON DELETE CASCADE,
    departure_date DATE NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 30,
    booked_seats INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT tour_departures_unique_slot UNIQUE (tour_id, departure_date),
    CONSTRAINT tour_departures_capacity_chk CHECK (
        capacity > 0
        AND booked_seats >= 0
        AND booked_seats <= capacity
    )
);

CREATE INDEX IF NOT EXISTS idx_tour_departures_tour ON public.tour_departures (tour_id);

ALTER TABLE public.tour_departures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tour_departures_select_public" ON public.tour_departures;
CREATE POLICY "tour_departures_select_public" ON public.tour_departures FOR SELECT USING (true);

-- No direct INSERT/UPDATE for clients — only SECURITY DEFINER RPCs

-- ---------------------------------------------------------------------------
-- Atomic tour booking: reserve seats + insert booking (single transaction)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_tour_booking_atomic(
    p_user_id TEXT,
    p_tour_id TEXT,
    p_booking_date DATE,
    p_total_price NUMERIC,
    p_seats INTEGER,
    p_extras JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    cap INTEGER;
    new_id UUID;
    merged JSONB;
BEGIN
    IF p_user_id IS DISTINCT FROM (auth.uid())::text THEN
        RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
    END IF;

    IF p_seats IS NULL OR p_seats < 1 OR p_seats > 99 THEN
        RAISE EXCEPTION 'invalid_seats' USING ERRCODE = '23514';
    END IF;

    SELECT COALESCE(NULLIF(group_size_max, 0), 30) INTO cap FROM public.tours WHERE id = p_tour_id;
    IF cap IS NULL THEN
        RAISE EXCEPTION 'tour_not_found' USING ERRCODE = '23503';
    END IF;

    INSERT INTO public.tour_departures (tour_id, departure_date, capacity, booked_seats)
    VALUES (p_tour_id, p_booking_date, cap, 0)
    ON CONFLICT (tour_id, departure_date) DO NOTHING;

    UPDATE public.tour_departures td
    SET booked_seats = td.booked_seats + p_seats
    WHERE
        td.tour_id = p_tour_id
        AND td.departure_date = p_booking_date
        AND td.booked_seats + p_seats <= td.capacity;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'capacity_exceeded' USING ERRCODE = '23514';
    END IF;

    merged := COALESCE(p_extras, '{}'::jsonb) || jsonb_build_object('seats', p_seats);

    INSERT INTO public.bookings (
        user_id,
        entity_id,
        entity_type,
        booking_date,
        total_price,
        status,
        payment_status,
        extras
    )
    VALUES (
        p_user_id,
        p_tour_id,
        'tour',
        p_booking_date,
        p_total_price,
        'pending',
        'pending',
        merged
    )
    RETURNING id INTO new_id;

    RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_tour_booking_atomic (TEXT, TEXT, DATE, NUMERIC, INTEGER, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_tour_booking_atomic (TEXT, TEXT, DATE, NUMERIC, INTEGER, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_tour_booking_atomic (TEXT, TEXT, DATE, NUMERIC, INTEGER, JSONB) TO service_role;

-- ---------------------------------------------------------------------------
-- Release inventory on payment failure / cancel (Edge service_role only)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.release_booking_inventory(p_booking_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    b RECORD;
    seats INTEGER;
BEGIN
    SELECT id, entity_type, entity_id, booking_date, extras INTO b
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    IF b.entity_type IS DISTINCT FROM 'tour' THEN
        RETURN;
    END IF;

    seats := COALESCE((b.extras ->> 'seats')::integer, 1);
    IF seats < 1 THEN
        seats := 1;
    END IF;

    UPDATE public.tour_departures td
    SET booked_seats = GREATEST(0, td.booked_seats - seats)
    WHERE
        td.tour_id = b.entity_id
        AND td.departure_date = b.booking_date;
END;
$$;

REVOKE ALL ON FUNCTION public.release_booking_inventory (UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.release_booking_inventory (UUID) TO service_role;

-- ---------------------------------------------------------------------------
-- Audit log (writes from Edge / service_role; staff can read)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- entity_id nullable for gateway-level failures before full row load

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs (created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_staff_select" ON public.audit_logs;
CREATE POLICY "audit_logs_staff_select" ON public.audit_logs FOR SELECT USING (public.is_staff ());

-- ---------------------------------------------------------------------------
-- Notification queue
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    action_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notification_queue_user ON public.notification_queue (user_id);
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON public.notification_queue (status);

ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notification_queue_select_own" ON public.notification_queue;
CREATE POLICY "notification_queue_select_own" ON public.notification_queue FOR SELECT USING (user_id = auth.uid()::text);

-- ---------------------------------------------------------------------------
-- Analytics events (client may insert own; staff may read all)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    properties JSONB NOT NULL DEFAULT '{}'::jsonb,
    user_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created ON public.analytics_events (name, created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "analytics_insert_authenticated" ON public.analytics_events;
CREATE POLICY "analytics_insert_authenticated" ON public.analytics_events FOR INSERT TO authenticated
WITH CHECK (
    user_id IS NULL
    OR user_id = auth.uid()::text
);

DROP POLICY IF EXISTS "analytics_select_own_or_staff" ON public.analytics_events;
CREATE POLICY "analytics_select_own_or_staff" ON public.analytics_events FOR SELECT USING (
    public.is_staff ()
    OR user_id = auth.uid()::text
);

-- ---------------------------------------------------------------------------
-- RLS: public catalog tables
-- ---------------------------------------------------------------------------
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "districts_select_public" ON public.districts;
CREATE POLICY "districts_select_public" ON public.districts FOR SELECT USING (true);

ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "hotels_select_public" ON public.hotels;
CREATE POLICY "hotels_select_public" ON public.hotels FOR SELECT USING (true);

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "restaurants_select_public" ON public.restaurants;
CREATE POLICY "restaurants_select_public" ON public.restaurants FOR SELECT USING (true);

-- ---------------------------------------------------------------------------
-- Reviews: public read, own write
-- ---------------------------------------------------------------------------
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_select_public" ON public.reviews;
CREATE POLICY "reviews_select_public" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "reviews_insert_own" ON public.reviews;
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "reviews_update_own" ON public.reviews;
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "reviews_delete_own" ON public.reviews;
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE TO authenticated USING (auth.uid()::text = user_id);

-- ---------------------------------------------------------------------------
-- Bookings + payment_transactions: staff read
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "bookings_select_staff" ON public.bookings;
CREATE POLICY "bookings_select_staff" ON public.bookings FOR SELECT USING (public.is_staff ());

DROP POLICY IF EXISTS "payment_transactions_select_staff" ON public.payment_transactions;
CREATE POLICY "payment_transactions_select_staff" ON public.payment_transactions FOR SELECT USING (public.is_staff ());

DROP POLICY IF EXISTS "profiles_select_staff" ON public.profiles;
CREATE POLICY "profiles_select_staff" ON public.profiles FOR SELECT USING (public.is_staff ());
