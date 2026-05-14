-- Migration: Tours and Schedules
-- Migrates mock tours to live SQL tables

-- 1. Tours Table
CREATE TABLE IF NOT EXISTS public.tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    destination VARCHAR(100),
    price NUMERIC(12,2) NOT NULL,
    duration VARCHAR(50),
    category VARCHAR(50), -- e.g. 'backpack', 'luxury', 'student'
    images TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on tours" ON public.tours FOR SELECT USING (true);

-- 3. Seed Tours (Student Backpack Trips under 2000 BDT)
INSERT INTO public.tours (title, description, destination, price, duration, category, is_featured, images) VALUES
('Sajek Valley Weekend', 'Experience the clouds at Sajek Valley.', 'Rangamati', 1950, '2 Days 1 Night', 'student', true, '{"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff"}'),
('Sylhet Tea Trail', 'Visit Jaflong and Ratargul Swamp Forest.', 'Sylhet', 1800, '3 Days 2 Nights', 'student', true, '{"https://images.unsplash.com/photo-1598556776374-2c358606f287"}'),
('Sundarbans Day Trip', 'Karamjal and Harbaria mangrove exploration.', 'Khulna', 1500, '1 Day', 'student', true, '{"https://images.unsplash.com/photo-1544228906-8d591e528b61"}'),
('Saint Martin Beach Camp', 'Camping at the coral island.', 'Cox''s Bazar', 2000, '2 Days 1 Night', 'student', true, '{"https://images.unsplash.com/photo-1540206351-d6465b3ac5c1"}');
