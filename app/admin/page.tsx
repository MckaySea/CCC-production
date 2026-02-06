import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase"; // Replaced prisma with supabaseAdmin
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  // --- Supabase Query (Get all users) ---
  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("id, username, role, created_at, profile_image, bio, preferred_role, assigned_role, full_name, email, phone_number, profile_completed")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch users error:", error);
    // Handle error gracefully
    return <div>Error loading users.</div>;
  }

  // Map data to match the component's expected structure if column names differ
  const dashboardUsers = users.map((user) => ({
    id: user.id,
    username: user.username,
    role: user.role,
    createdAt: user.created_at,
    profile_image: user.profile_image,
    bio: user.bio,
    preferred_role: user.preferred_role,
    assigned_role: user.assigned_role,
    full_name: user.full_name,
    email: user.email,
    phone_number: user.phone_number,
    profile_completed: user.profile_completed,
  }));

  return (
    <AdminDashboard users={dashboardUsers} currentUserId={session.user.id} />
  );
}
