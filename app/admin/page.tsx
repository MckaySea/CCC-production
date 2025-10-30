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
    .select("id, username, role, created_at") // Columns from your Supabase 'users' table
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
    createdAt: user.created_at, // Use created_at from Supabase
  }));

  return (
    <AdminDashboard users={dashboardUsers} currentUserId={session.user.id} />
  );
}
