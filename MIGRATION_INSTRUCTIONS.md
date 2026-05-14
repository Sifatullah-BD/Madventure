# Database Migration Instructions

It appears that the Supabase tables (`divisions`, `districts`, `places`, `tours`) are missing or empty. Since I cannot execute SQL commands directly to create tables, you need to run the setup script manually in your Supabase Dashboard.

## Steps

1.  **Log in to Supabase Dashboard**: Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and select your project.
2.  **Open SQL Editor**: Click on the **SQL Editor** icon in the left sidebar.
3.  **New Query**: Click **New Query**.
4.  **Copy SQL**: Copy the content of the file `full_schema_setup.sql` located in your project root (`e:\Web Template\travel tracer\full_schema_setup.sql`).
    *   *Alternatively, copy the code block below:*

```sql
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

-- Add unique constraint to places table to allow upsert by name and district
ALTER TABLE places ADD CONSTRAINT places_name_district_unique UNIQUE (name, district_id);
```

5.  **Run Query**: Click the **Run** button.
6.  **Verify**: Ensure the query runs successfully without errors.

## After Running SQL

Once the tables are created, I can proceed to upload all the data using the script I prepared.

**Please notify me when you have run the SQL.**
