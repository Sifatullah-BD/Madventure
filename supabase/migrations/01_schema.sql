-- Migration 01: Core Entities Schema

-- Note: Ensure uuid-ossp extension is enabled in Supabase if gen_random_uuid() is missing in very old versions, 
-- but it is usually available by default in modern Postgres.

CREATE TABLE districts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    division TEXT NOT NULL,
    description TEXT,
    climate TEXT,
    best_time_to_visit TEXT,
    rating NUMERIC DEFAULT 0.0,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tours (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    district_id TEXT REFERENCES districts(id) ON DELETE CASCADE,
    duration TEXT,
    group_size_min INTEGER,
    group_size_max INTEGER,
    price_per_person NUMERIC NOT NULL,
    difficulty TEXT,
    featured_image TEXT,
    rating NUMERIC DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE hotels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    district_id TEXT REFERENCES districts(id) ON DELETE CASCADE,
    type TEXT,
    price_per_night NUMERIC NOT NULL,
    rating NUMERIC DEFAULT 0.0,
    amenities TEXT[],
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    district_id TEXT REFERENCES districts(id) ON DELETE CASCADE,
    cuisine_type TEXT,
    price_range TEXT,
    rating NUMERIC DEFAULT 0.0,
    is_halal BOOLEAN DEFAULT TRUE,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- usually UUID mapping to auth.users
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- 'tour' or 'hotel'
    booking_date DATE NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    photos TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Boilerplate Examples
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tours are visible to everyone" ON tours FOR SELECT USING (true);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create their own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid()::text = user_id);
