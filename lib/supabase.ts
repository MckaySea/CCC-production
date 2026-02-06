import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client with service role for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database types (Ensures type safety in your admin files)
export interface User {
  id: string;
  username: string;
  password: string;
  role: "USER" | "ADMIN";
  created_at: string;
  team_id?: string | null;
  profile_image?: string | null;
  bio?: string | null;
  preferred_role?: string | null;
  assigned_role?: string | null;
}
