-- Add missing description column to tours table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS description TEXT;
