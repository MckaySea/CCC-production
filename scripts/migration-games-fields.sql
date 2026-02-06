-- Migration: Add description and image_url to games table
-- Run this in Supabase SQL Editor

-- Add description column for game descriptions
ALTER TABLE games ADD COLUMN IF NOT EXISTS description TEXT;

-- Add image_url column for game banner/logo images
ALTER TABLE games ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'games';
