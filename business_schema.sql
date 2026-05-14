-- =============================================
-- Madventure Local Business Marketplace Schema
-- For Supabase (PostgreSQL)
-- =============================================

-- ENUM types
CREATE TYPE business_category AS ENUM (
    'HOTEL', 'RESTAURANT', 'TRANSPORT', 
    'GUIDE', 'SHOP', 'EVENT', 'EMERGENCY'
);

CREATE TYPE price_unit AS ENUM (
    'per_night', 'per_day', 'per_trip', 'per_person', 'fixed'
);

CREATE TYPE booking_status AS ENUM (
    'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'
);

CREATE TYPE payment_status AS ENUM (
    'UNPAID', 'PAID', 'REFUNDED'
);

-- =============================================
-- 1. Businesses
-- =============================================
CREATE TABLE businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category business_category NOT NULL,
    
    -- Location
    location TEXT NOT NULL,         -- "Cox's Bazar, Chittagong Division"
    district TEXT NOT NULL,         -- "Cox's Bazar"
    division TEXT,                  -- "Chittagong Division"
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    
    -- Contact
    phone TEXT,
    whatsapp TEXT,
    facebook TEXT,
    website TEXT,
    
    -- Media
    images TEXT[] DEFAULT '{}',
    cover_image TEXT,
    
    -- Business details
    price_range TEXT,              -- "৳500 - ৳1500"
    amenities TEXT[] DEFAULT '{}',
    opening_hours TEXT,
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    rejection_reason TEXT,
    
    -- Stats (denormalized for performance)
    rating FLOAT DEFAULT 0,
    review_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    booking_count INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. Business Listings (rooms, services, etc.)
-- =============================================
CREATE TABLE business_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    price_unit price_unit DEFAULT 'fixed',
    availability BOOLEAN DEFAULT TRUE,
    max_guests INT DEFAULT 1,
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. Business Bookings
-- =============================================
CREATE TABLE business_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES business_listings(id) ON DELETE SET NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    check_in DATE,
    check_out DATE,
    guests INT DEFAULT 1,
    total_price DECIMAL(10, 2),
    
    status booking_status DEFAULT 'PENDING',
    payment_status payment_status DEFAULT 'UNPAID',
    special_requests TEXT,
    
    user_name TEXT,
    user_phone TEXT,
    user_email TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. Business Reviews
-- =============================================
CREATE TABLE business_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images TEXT[] DEFAULT '{}',
    
    user_name TEXT,
    user_avatar TEXT,
    
    owner_response TEXT,
    owner_response_at TIMESTAMPTZ,
    
    is_verified_booking BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_district ON businesses(district);
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_approved ON businesses(is_approved);
CREATE INDEX idx_businesses_rating ON businesses(rating DESC);
CREATE INDEX idx_listings_business ON business_listings(business_id);
CREATE INDEX idx_bookings_business ON business_bookings(business_id);
CREATE INDEX idx_bookings_user ON business_bookings(user_id);
CREATE INDEX idx_reviews_business ON business_reviews(business_id);

-- =============================================
-- RLS Policies
-- =============================================
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved businesses
CREATE POLICY "Public can read approved businesses"
    ON businesses FOR SELECT
    USING (is_approved = TRUE);

-- Owners can manage their own business
CREATE POLICY "Owners can manage own business"
    ON businesses FOR ALL
    USING (auth.uid() = owner_id);

-- Public can read listings of approved businesses
CREATE POLICY "Public can read listings"
    ON business_listings FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM businesses 
        WHERE businesses.id = business_listings.business_id 
        AND businesses.is_approved = TRUE
    ));

-- Public can read reviews
CREATE POLICY "Public can read reviews"
    ON business_reviews FOR SELECT TO anon, authenticated
    USING (TRUE);

-- Authenticated users can create reviews
CREATE POLICY "Users can create reviews"
    ON business_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);
