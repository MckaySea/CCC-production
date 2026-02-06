-- First-Time Profile Completion Migration
-- Run this in Supabase SQL Editor

-- Add new profile fields for user contact info
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;

-- Comment: After running this migration, existing users will have profile_completed = FALSE
-- and will be prompted to complete their profile on next login.
