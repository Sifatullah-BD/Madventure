-- Migration: PostGIS & Geo-Spatial Intelligence
-- Enables PostGIS extension and implements radius search logic

-- 1. Enable PostGIS Extension
-- NOTE: This requires superuser or specific permissions on Supabase
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Add Geography Column to Places and Hotels
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS location_point geography(POINT, 4326);
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS location_point geography(POINT, 4326);

-- 3. Update existing data to populate location_point
-- (Assuming latitude and longitude columns exist from previous migrations)
UPDATE public.places 
SET location_point = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

UPDATE public.hotels 
SET location_point = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 4. Create Spatial Index for high-performance geo-queries
CREATE INDEX IF NOT EXISTS places_geo_idx ON public.places USING GIST(location_point);
CREATE INDEX IF NOT EXISTS hotels_geo_idx ON public.hotels USING GIST(location_point);

-- 5. Function: Find Nearby Places/Hotels
-- Usage: SELECT * FROM find_nearby_places(90.4125, 23.8103, 5000); -- 5km radius
CREATE OR REPLACE FUNCTION find_nearby_places(
    lon float, 
    lat float, 
    radius_meters float
)
RETURNS SETOF public.places AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.places
    WHERE ST_DWithin(
        location_point,
        ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography,
        radius_meters
    )
    ORDER BY ST_Distance(
        location_point,
        ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography
    );
END;
$$ LANGUAGE plpgsql;
