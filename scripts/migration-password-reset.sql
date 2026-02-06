-- Password Reset Functionality Migration
-- Run this in Supabase SQL Editor

-- 1. Create table for password reset tokens
CREATE TABLE IF NOT EXISTS password_resets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON password_resets(email);

-- 3. Security: Enable RLS (though mostly accessed via service role)
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Only allow service role (server-side) to access this table
-- Use service role key in your API routes to interact with this table
CREATE POLICY "Service role can do anything" 
ON password_resets
TO service_role
USING (true)
WITH CHECK (true);
