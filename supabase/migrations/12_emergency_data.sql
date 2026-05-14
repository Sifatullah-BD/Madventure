-- Migration: Emergency Services
-- Migrates mock emergency data to live SQL tables

-- 1. Emergency Services Table
CREATE TABLE IF NOT EXISTS public.emergency_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id UUID REFERENCES districts(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- 'mechanic', 'pharmacy', 'hospital', 'police'
    address TEXT,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_open_24h BOOLEAN DEFAULT FALSE,
    specialities TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.emergency_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on emergency_services" ON public.emergency_services FOR SELECT USING (true);

-- 3. Seed some data (Generic for now, focusing on Cox's Bazar as example)
-- We need to find a district ID first, but for the seed we can just insert and let user add more.
-- Actually, I'll insert some sample ones.
INSERT INTO public.emergency_services (name, type, address, phone, is_open_24h, specialities) VALUES
('Cox''s Bazar General Hospital', 'hospital', 'Hospital Road, Cox''s Bazar', '01711-000000', true, '{"ICU", "Emergency", "Surgery"}'),
('Tourist Police Cox''s Bazar', 'police', 'Beach Point, Cox''s Bazar', '01711-111111', true, '{"Security", "Assistance"}'),
('City Pharmacy', 'pharmacy', 'Main Road, Cox''s Bazar', '01711-222222', true, '{"Medicine", "First Aid"}'),
('Bike Care Point', 'mechanic', 'Kolatoli, Cox''s Bazar', '01711-333333', false, '{"Engine", "Tyre", "Bike"}');
