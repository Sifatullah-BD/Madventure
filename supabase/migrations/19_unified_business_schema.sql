-- Migration: Unified Business & Listing Schema
-- Supports Hotels, Restaurants, Guides, and Shops under a unified entity model.

-- 1. Businesses Table
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'HOTEL', 'RESTAURANT', 'TRANSPORT', 'GUIDE', 'SHOP'
    location TEXT,
    district TEXT,
    division TEXT,
    lat NUMERIC,
    lng NUMERIC,
    phone TEXT,
    whatsapp TEXT,
    facebook TEXT,
    website TEXT,
    images TEXT[],
    cover_image TEXT,
    price_range TEXT,
    amenities TEXT[],
    opening_hours TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    rating NUMERIC DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    booking_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses (category);
CREATE INDEX IF NOT EXISTS idx_businesses_district ON public.businesses (district);

-- 2. Listings Table (Sub-items of a business like Rooms or Tours)
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    price_unit TEXT, -- 'per_night', 'per_person', etc.
    availability BOOLEAN DEFAULT TRUE,
    max_guests INTEGER,
    images TEXT[],
    features TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS Policies
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on approved businesses" ON public.businesses
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Allow owners to manage their businesses" ON public.businesses
    FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Allow public select on listings" ON public.listings
    FOR SELECT USING (true);

CREATE POLICY "Allow business owners to manage listings" ON public.listings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE id = listings.business_id AND owner_id = auth.uid()
        )
    );
