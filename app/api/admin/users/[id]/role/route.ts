import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase"; // Replaced prisma with supabaseAdmin

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Prevent changing your own role
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      );
    }

    // --- Supabase Query (Get current user role) ---
    const { data: user, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", id)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Toggle role
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    // --- Supabase Query (Update role) ---
    const { data: updatedUsers, error: updateError } = await supabaseAdmin
      .from("users")
      .update({ role: newRole })
      .eq("id", id)
      .select() // Add .select() to get the updated row back
      .single();

    if (updateError || !updatedUsers) {
      console.error("[v0] Supabase toggle role update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: updatedUsers });
  } catch (error) {
    console.error("[v0] Toggle role error:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
