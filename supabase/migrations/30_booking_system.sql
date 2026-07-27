-- Booking System Architecture (Transactional Flow)

-- 1. tour_schedules
CREATE TABLE IF NOT EXISTS tour_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    available_seats INTEGER,
    booked_seats INTEGER DEFAULT 0,
    price_override NUMERIC(12,2),
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. hotel_room_inventory
CREATE TABLE IF NOT EXISTS hotel_room_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES hotel_rooms(id) ON DELETE CASCADE,
    inventory_date DATE,
    available_rooms INTEGER,
    booked_rooms INTEGER DEFAULT 0,
    blocked_rooms INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. booking_items
CREATE TABLE IF NOT EXISTS booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    item_type VARCHAR(20),
    reference_id UUID,
    schedule_id UUID,
    quantity INTEGER,
    unit_price NUMERIC(12,2),
    total_price NUMERIC(12,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. booking_travelers
CREATE TABLE IF NOT EXISTS booking_travelers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    age INTEGER,
    gender VARCHAR(20),
    phone VARCHAR(30),
    emergency_contact VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies

ALTER TABLE tour_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_room_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_travelers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tour schedules" ON tour_schedules FOR SELECT USING (true);
CREATE POLICY "Public can view hotel inventory" ON hotel_room_inventory FOR SELECT USING (true);

CREATE POLICY "Users can view own booking items" ON booking_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_items.booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY "Users can insert own booking items" ON booking_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_items.booking_id AND bookings.user_id = auth.uid())
);

CREATE POLICY "Users can view own booking travelers" ON booking_travelers FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_travelers.booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY "Users can insert own booking travelers" ON booking_travelers FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_travelers.booking_id AND bookings.user_id = auth.uid())
);

-- RPC for Transactional Booking
CREATE OR REPLACE FUNCTION create_tour_booking(
    p_user_id UUID,
    p_tour_id UUID,
    p_schedule_id UUID,
    p_quantity INTEGER,
    p_unit_price NUMERIC,
    p_travelers JSONB,
    p_notes TEXT
) RETURNS UUID AS $$
DECLARE
    v_booking_id UUID;
    v_total_price NUMERIC;
    v_available INTEGER;
    v_booked INTEGER;
BEGIN
    -- Check availability
    SELECT available_seats, booked_seats INTO v_available, v_booked 
    FROM tour_schedules WHERE id = p_schedule_id FOR UPDATE;
    
    IF v_available - v_booked < p_quantity THEN
        RAISE EXCEPTION 'Not enough seats available';
    END IF;

    -- Calculate total
    v_total_price := p_unit_price * p_quantity;

    -- Create Booking
    INSERT INTO bookings (user_id, booking_type, booking_status, payment_status, subtotal, total_amount, notes)
    VALUES (p_user_id, 'tour', 'pending', 'pending', v_total_price, v_total_price, p_notes)
    RETURNING id INTO v_booking_id;

    -- Create Booking Item
    INSERT INTO booking_items (booking_id, item_type, reference_id, schedule_id, quantity, unit_price, total_price)
    VALUES (v_booking_id, 'tour', p_tour_id, p_schedule_id, p_quantity, p_unit_price, v_total_price);

    -- Create Travelers
    -- Assuming p_travelers is an array of objects [{full_name, age, gender, phone}]
    INSERT INTO booking_travelers (booking_id, full_name, age, gender, phone)
    SELECT v_booking_id, 
           (elem->>'full_name')::VARCHAR, 
           (elem->>'age')::INTEGER, 
           (elem->>'gender')::VARCHAR, 
           (elem->>'phone')::VARCHAR
    FROM jsonb_array_elements(p_travelers) AS elem;

    -- Update inventory
    UPDATE tour_schedules 
    SET booked_seats = booked_seats + p_quantity
    WHERE id = p_schedule_id;

    RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
