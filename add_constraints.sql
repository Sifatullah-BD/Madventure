-- Add unique constraint to places table to allow upsert by name and district
ALTER TABLE places ADD CONSTRAINT places_name_district_unique UNIQUE (name, district_id);
