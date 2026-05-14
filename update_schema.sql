-- Run these commands one by one or all together

-- Update Districts Table
ALTER TABLE districts ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE districts ADD COLUMN IF NOT EXISTS famous_food JSONB;
ALTER TABLE districts ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE districts ADD COLUMN IF NOT EXISTS svg_map TEXT;

-- Update Places Table
ALTER TABLE places ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update Tours Table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS max_group_size INTEGER;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS difficulty TEXT;
