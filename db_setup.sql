-- Enable Row Level Security
ALTER TABLE IF EXISTS divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS places ENABLE ROW LEVEL SECURITY;

-- Create Tables
CREATE TABLE IF NOT EXISTS divisions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bn_name TEXT,
  lat TEXT,
  long TEXT
);

CREATE TABLE IF NOT EXISTS districts (
  id TEXT PRIMARY KEY,
  division_id TEXT REFERENCES divisions(id),
  name TEXT NOT NULL,
  bn_name TEXT,
  lat TEXT,
  long TEXT,
  description TEXT,
  famous_food JSONB,
  hero_image TEXT,
  svg_map TEXT
);

CREATE TABLE IF NOT EXISTS tours (
  id TEXT PRIMARY KEY,
  agency_id TEXT,
  title TEXT NOT NULL,
  destination TEXT,
  duration TEXT,
  price NUMERIC,
  category TEXT,
  images TEXT[],
  itinerary JSONB,
  includes TEXT[],
  excludes TEXT[],
  destination_id TEXT,
  max_group_size INTEGER,
  start_date DATE,
  difficulty TEXT,
  image_url TEXT,
  type TEXT
);

CREATE TABLE IF NOT EXISTS places (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  region TEXT,
  image TEXT,
  description TEXT,
  details TEXT,
  fare_chart JSONB,
  hidden_spots TEXT[],
  food_hotels TEXT[],
  district_id TEXT,
  division_id TEXT,
  image_url TEXT,
  type TEXT
);

-- Create Policies (Public Read)
DROP POLICY IF EXISTS "Public Read Divisions" ON divisions;
CREATE POLICY "Public Read Divisions" ON divisions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Districts" ON districts;
CREATE POLICY "Public Read Districts" ON districts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Tours" ON tours;
CREATE POLICY "Public Read Tours" ON tours FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Places" ON places;
CREATE POLICY "Public Read Places" ON places FOR SELECT USING (true);

-- Insert Divisions
INSERT INTO divisions (id, name, bn_name, lat, long) VALUES
('1', 'Barishal', 'বরিশাল', '22.701002', '90.353451'),
('2', 'Chattogram', 'চট্টগ্রাম', '22.356851', '91.783182'),
('3', 'Dhaka', 'ঢাকা', '23.810332', '90.412518'),
('4', 'Khulna', 'খুলনা', '22.845641', '89.540328'),
('5', 'Rajshahi', 'রাজশাহী', '24.363589', '88.624135'),
('6', 'Rangpur', 'রংপুর', '25.743892', '89.275227'),
('7', 'Sylhet', 'সিলেট', '24.894929', '91.868706'),
('8', 'Mymensingh', 'ময়মনসিংহ', '24.747149', '90.420273')
ON CONFLICT (id) DO NOTHING;

-- Insert Districts (Sample - First 10 for brevity, user can add more if needed, or I can add all)
-- Adding all 64 districts would be long but I will add a representative set for each division
INSERT INTO districts (id, division_id, name, bn_name, lat, long) VALUES
('1', '3', 'Dhaka', 'ঢাকা', '23.7115253', '90.4111451'),
('2', '3', 'Faridpur', 'ফরিদপুর', '23.6070822', '89.8429406'),
('3', '3', 'Gazipur', 'গাজীপুর', '24.0022858', '90.4264283'),
('10', '8', 'Mymensingh', 'ময়মনসিংহ', '24.7471', '90.4203'),
('35', '1', 'Barishal', 'বরিশাল', '22.7010', '90.3535'),
('43', '2', 'Chattogram', 'চট্টগ্রাম', '22.335109', '91.834073'),
('45', '2', 'Cox''s Bazar', 'কক্স বাজার', '21.4272', '92.0058'),
('54', '7', 'Sylhet', 'সিলেট', '24.8897956', '91.8697894'),
('59', '4', 'Khulna', 'খুলনা', '22.815774', '89.568679'),
('24', '5', 'Rajshahi', 'রাজশাহী', '24.3745', '88.6042'),
('32', '6', 'Rangpur', 'রংপুর', '25.7558096', '89.244462')
ON CONFLICT (id) DO NOTHING;

-- Insert Tours
INSERT INTO tours (id, agency_id, title, destination, duration, price, category, images, itinerary, includes, excludes) VALUES
('EVT-2025-001', 'AGENCY_02', 'Mysterious Marayon Tong Camping', 'Bandarban', '2 Days, 3 Nights', 4500, 'Adventure', 
 ARRAY['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800'],
 '[{"day": 1, "title": "Journey to Bandarban", "description": "Night bus from Dhaka to Bandarban."}, {"day": 2, "title": "Trek to Marayon Tong", "description": "Morning breakfast and start trekking. Night stay at camp."}, {"day": 3, "title": "Return", "description": "Sunrise view, breakfast, and return journey."}]',
 ARRAY['Bus Ticket', 'All Meals', 'Tents', 'Guide'],
 ARRAY['Personal Expenses', 'Medicine']),

('EVT-2025-002', 'AGENCY_01', 'Sajek Valley Cloud Hunting', 'Sajek', '2 Days, 3 Nights', 6500, 'Relax',
 ARRAY['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&q=80&w=800'],
 '[{"day": 1, "title": "Dhaka to Khagrachari", "description": "Overnight journey."}, {"day": 2, "title": "Khagrachari to Sajek", "description": "Jeep ride to Sajek. Sunset at Helipad."}, {"day": 3, "title": "Alutila Cave & Return", "description": "Visit Alutila Cave and Risang Waterfall."}]',
 ARRAY['Jeep', 'Resort', '6 Meals', 'Entry Fees'],
 ARRAY['BBQ']),

('EVT-2025-003', 'AGENCY_03', 'Saint Martin''s Island Retreat', 'Saint Martin', '3 Days, 4 Nights', 8500, 'Relax',
 ARRAY['https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&q=80&w=800'],
 '[{"day": 1, "title": "Dhaka to Teknaf", "description": "Bus journey."}, {"day": 2, "title": "Ship to Island", "description": "Cruise to St. Martin. Beach time."}, {"day": 3, "title": "Chera Dwip", "description": "Visit Chera Dwip."}, {"day": 4, "title": "Return", "description": "Back to Dhaka."}]',
 ARRAY['Ship Ticket', 'Resort', 'All Meals'],
 ARRAY['Water Sports'])
ON CONFLICT (id) DO NOTHING;

-- Insert Places
INSERT INTO places (id, name, location, region, image, description, details, fare_chart, hidden_spots, food_hotels) VALUES
(1, 'Cox''s Bazar', 'Cox''s Bazar', 'Chittagong Division', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
 'The world''s longest natural sea beach, offering golden sands and amazing sunsets.',
 'Cox''s Bazar is the tourist capital of Bangladesh. Key spots include Laboni Beach, Sugandha Beach, and Inani Beach.',
 '[{"vehicle": "Rickshaw (Short Distance)", "rate": "30-50 BDT"}, {"vehicle": "CNG (Town Trip)", "rate": "150-200 BDT"}, {"vehicle": "Tomtom (Shared)", "rate": "10-20 BDT"}, {"vehicle": "Marine Drive CNG", "rate": "800-1200 BDT"}]',
 ARRAY['Mermaid Beach Resort', 'Radiant Fish World', 'Moheshkhali Island', '100 Feet Buddha', 'Darianagar Caves', 'Kana Rajar Guha'],
 ARRAY['Poushee Restaurant', 'Jhaubon Restaurant', 'Salt Bistro', 'Mermaid Café']),

(2, 'Saint Martin''s Island', 'Bay of Bengal', 'Chittagong Division', 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
 'The only coral island in Bangladesh, known for its crystal clear blue water and coconut groves.',
 'A small island in the northeastern part of the Bay of Bengal. Famous for Chera Dwip and coral reefs.',
 '[{"vehicle": "Van (Island Tour)", "rate": "200-300 BDT"}, {"vehicle": "Bicycle Rental", "rate": "40-50 BDT/hour"}]',
 ARRAY['Chera Dwip', 'West Beach', 'Humayun Ahmed''s House'],
 ARRAY['Blue Marine Restaurant', 'Narikel Jinjira Restaurant', 'Local Sea Fish BBQ Stalls']),

(4, 'Sajek Valley', 'Rangamati', 'Chittagong Hill Tracts', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
 'The Queen of Hills, famous for cloud-covered mountains and serene atmosphere.',
 'Located in Baghaichhari Upazila. Famous for Ruilui Para, Konglak Para, and sunrise views.',
 '[{"vehicle": "Chander Gari (Reserve)", "rate": "8000-10000 BDT"}, {"vehicle": "Bike Ride", "rate": "300-500 BDT"}]',
 ARRAY['Hajachora Waterfall', 'Risang Waterfall (Nearby)', 'Alutila Cave (Nearby)'],
 ARRAY['Runmoy Resort', 'Megh Machang', 'Chimbal Restaurant'])
ON CONFLICT (id) DO NOTHING;
