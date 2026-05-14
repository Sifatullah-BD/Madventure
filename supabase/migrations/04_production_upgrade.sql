-- Production Upgrade: Additional tables and indexes for V3 architecture
-- Apply after 02_production_rbac_wallet_payment.sql and 03_security_inventory_notifications.sql

-- ---------------------------------------------------------------------------
-- Booking Items (normalized per booking)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings (id) ON DELETE CASCADE,
    item_type TEXT NOT NULL, -- e.g., 'tour', 'hotel', 'ticket'
    item_id TEXT NOT NULL,   -- reference to the entity (tour_id, hotel_id, etc.)
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON public.booking_items (booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_item ON public.booking_items (item_type, item_id);

-- ---------------------------------------------------------------------------
-- Booking Travelers (normalize traveler details per booking)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.booking_travelers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings (id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    age INTEGER,
    nid TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_travelers_booking_id ON public.booking_travelers (booking_id);

-- ---------------------------------------------------------------------------
-- Tour Schedules (departure slots) - alias for tour_departures (kept for backward compat)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tour_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id TEXT NOT NULL REFERENCES public.tours (id) ON DELETE CASCADE,
    departure_date DATE NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 30,
    booked_seats INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tour_schedules_tour ON public.tour_schedules (tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_schedules_date ON public.tour_schedules (departure_date);

ALTER TABLE public.tour_schedules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tour_schedules_select_public" ON public.tour_schedules;
CREATE POLICY "tour_schedules_select_public" ON public.tour_schedules FOR SELECT USING (true);

-- ---------------------------------------------------------------------------
-- Hotel Rooms and Inventory
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hotel_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id TEXT NOT NULL REFERENCES public.hotels (id) ON DELETE CASCADE,
    room_type TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 2,
    price_per_night NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hotel_rooms_hotel ON public.hotel_rooms (hotel_id);

CREATE TABLE IF NOT EXISTS public.hotel_room_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.hotel_rooms (id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hotel_room_inventory_room ON public.hotel_room_inventory (room_id);
CREATE INDEX IF NOT EXISTS idx_hotel_room_inventory_date ON public.hotel_room_inventory (date);

ALTER TABLE public.hotel_rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "hotel_rooms_select_public" ON public.hotel_rooms;
CREATE POLICY "hotel_rooms_select_public" ON public.hotel_rooms FOR SELECT USING (true);

ALTER TABLE public.hotel_room_inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "hotel_room_inventory_select_public" ON public.hotel_room_inventory;
CREATE POLICY "hotel_room_inventory_select_public" ON public.hotel_room_inventory FOR SELECT USING (true);

-- ---------------------------------------------------------------------------
-- Tour Agencies
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tour_agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    agency_name TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tour_agencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tour_agencies_select_public" ON public.tour_agencies FOR SELECT USING (true);
CREATE POLICY "tour_agencies_manage_own" ON public.tour_agencies FOR ALL USING (profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Wishlists, Forum, and Community
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    item_type TEXT NOT NULL, -- 'tour', 'hotel'
    item_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlist_manage_own" ON public.wishlists FOR ALL USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.forum_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "forum_threads_select_public" ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "forum_threads_insert_auth" ON public.forum_threads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "forum_threads_manage_own" ON public.forum_threads FOR UPDATE USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES public.forum_threads (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "forum_replies_select_public" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "forum_replies_insert_auth" ON public.forum_replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "forum_replies_manage_own" ON public.forum_replies FOR UPDATE USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.lost_found_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    item_type TEXT NOT NULL, -- 'lost', 'found'
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'resolved'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lost_found_select_public" ON public.lost_found_items FOR SELECT USING (true);
CREATE POLICY "lost_found_insert_auth" ON public.lost_found_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "lost_found_manage_own" ON public.lost_found_items FOR UPDATE USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- ALTER existing tables for production enhancements
-- ---------------------------------------------------------------------------
DO $$ 
BEGIN 
    -- Bookings enhancements
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='booking_code') THEN
        ALTER TABLE public.bookings ADD COLUMN booking_code TEXT UNIQUE;
        ALTER TABLE public.bookings ADD COLUMN subtotal NUMERIC(12,2);
        ALTER TABLE public.bookings ADD COLUMN tax_amount NUMERIC(12,2);
        ALTER TABLE public.bookings ADD COLUMN total_amount NUMERIC(12,2);
    END IF;

    -- Tours enhancements
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='slug') THEN
        ALTER TABLE public.tours ADD COLUMN slug TEXT UNIQUE;
        ALTER TABLE public.tours ADD COLUMN agency_id UUID REFERENCES public.tour_agencies(id);
        ALTER TABLE public.tours ADD COLUMN status TEXT DEFAULT 'active';
    END IF;

    -- Hotels enhancements
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='hotels' AND column_name='slug') THEN
        ALTER TABLE public.hotels ADD COLUMN slug TEXT UNIQUE;
        ALTER TABLE public.hotels ADD COLUMN owner_id UUID REFERENCES public.profiles(id);
        ALTER TABLE public.hotels ADD COLUMN star_rating INTEGER;
    END IF;

    -- Payment transactions enhancements
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_transactions' AND column_name='paid_at') THEN
        ALTER TABLE public.payment_transactions ADD COLUMN paid_at TIMESTAMPTZ;
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Hotel Booking Atomic RPC
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_hotel_booking_atomic(
    p_user_id UUID,
    p_hotel_id TEXT,
    p_room_id UUID,
    p_booking_date DATE,
    p_total_price NUMERIC,
    p_travelers JSONB,
    p_extras JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
    v_booking_id UUID;
    v_traveler JSONB;
BEGIN
    -- 1. Check and decrement inventory
    UPDATE public.hotel_room_inventory
    SET available = available - 1
    WHERE room_id = p_room_id AND date = p_booking_date AND available > 0;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No inventory available for the selected date and room type.';
    END IF;

    -- 2. Create the main booking
    INSERT INTO public.bookings (
        user_id, entity_id, entity_type, booking_date, total_price, status, payment_status, extras, booking_code
    ) VALUES (
        p_user_id, p_hotel_id, 'hotel', p_booking_date, p_total_price, 'pending', 'pending', p_extras, 'HOTEL-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8))
    ) RETURNING id INTO v_booking_id;

    -- 3. Insert into booking_items
    INSERT INTO public.booking_items (booking_id, item_type, item_id, quantity, price)
    VALUES (v_booking_id, 'hotel_room', p_room_id::text, 1, p_total_price);

    -- 4. Insert travelers
    FOR v_traveler IN SELECT * FROM jsonb_array_elements(p_travelers)
    LOOP
        INSERT INTO public.booking_travelers (booking_id, full_name, age, nid)
        VALUES (v_booking_id, v_traveler->>'name', (v_traveler->>'age')::integer, v_traveler->>'nid');
    END LOOP;

    RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- End of production upgrade migration
