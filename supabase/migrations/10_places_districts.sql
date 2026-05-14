-- Migration: Districts and Places Data
-- Migrates static JS data to live SQL tables

-- 1. Districts Table
CREATE TABLE IF NOT EXISTS public.districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    division VARCHAR(100) NOT NULL,
    spots JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Places Table (Popular Destinations)
CREATE TABLE IF NOT EXISTS public.places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_name VARCHAR(100) REFERENCES public.districts(name),
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    region VARCHAR(100),
    image TEXT,
    description TEXT,
    details TEXT,
    fare_chart JSONB DEFAULT '[]',
    hidden_spots JSONB DEFAULT '[]',
    food_hotels JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on districts" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Allow public read on places" ON public.places FOR SELECT USING (true);

-- 4. Seed Districts
-- (Abbreviated for demonstration, but including major ones)
INSERT INTO public.districts (name, division, spots) VALUES
('Dhaka', 'Dhaka Division', '["Lalbagh Fort", "Ahsan Manzil", "National Parliament House"]'),
('Cox''s Bazar', 'Chittagong Division', '["Sea Beach", "Himchari", "Inani", "Saint Martin''s Island"]'),
('Sylhet', 'Sylhet Division', '["Jaflong", "Ratargul", "Bisnakandi", "Shahjalal Mazar"]'),
('Rangamati', 'Chittagong Division', '["Sajek Valley", "Kaptai Lake", "Hanging Bridge"]'),
('Bandarban', 'Chittagong Division', '["Nilgiri", "Nilachal", "Boga Lake", "Keokradong"]'),
('Khulna', 'Khulna Division', '["Sundarbans", "Rupsha Bridge"]'),
('Patuakhali', 'Barishal Division', '["Kuakata Sea Beach", "Payra Port"]'),
('Noakhali', 'Chittagong Division', '["Nijhum Dwip", "Gandhi Ashram"]'),
('Moulvibazar', 'Sylhet Division', '["Sreemangal Tea Gardens", "Lawachara National Park"]'),
('Rajshahi', 'Rajshahi Division', '["Varendra Research Museum", "Bagha Mosque"]'),
('Bogra', 'Rajshahi Division', '["Mahasthangarh", "Momo Inn"]'),
('Mymensingh', 'Mymensingh Division', '["Shashi Lodge", "Birishiri"]');

-- 5. Seed Places
INSERT INTO public.places (name, district_name, location, region, image, description, details, fare_chart, hidden_spots, food_hotels) VALUES
('Cox''s Bazar', 'Cox''s Bazar', 'Cox''s Bazar', 'Chittagong Division', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'The world''s longest natural sea beach.', 'Cox''s Bazar is the tourist capital of Bangladesh.', '[{"vehicle": "Rickshaw", "rate": "30-50 BDT"}]', '["Mermaid Beach", "Radiant Fish World"]', '["Poushee", "Salt Bistro"]'),
('Sajek Valley', 'Rangamati', 'Rangamati', 'Chittagong Hill Tracts', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'The Queen of Hills.', 'Located in Baghaichhari Upazila. Famous for Ruilui Para.', '[{"vehicle": "Chander Gari", "rate": "8000-10000 BDT"}]', '["Hajachora Waterfall"]', '["Runmoy Resort"]'),
('Sundarbans', 'Khulna', 'Khulna', 'Khulna Division', 'https://images.unsplash.com/photo-1544228906-8d591e528b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'The largest mangrove forest.', 'UNESCO World Heritage site.', '[{"vehicle": "Boat Tour", "rate": "3000-5000 BDT"}]', '["Kotka Beach", "Hiran Point"]', '["Ship Catering"]'),
('Saint Martin''s Island', 'Cox''s Bazar', 'Bay of Bengal', 'Chittagong Division', 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'The only coral island.', 'Known for its crystal clear blue water.', '[{"vehicle": "Van Tour", "rate": "200-300 BDT"}]', '["Chera Dwip"]', '["Blue Marine"]');
