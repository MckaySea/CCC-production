import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET - Fetch current user's profile
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, username, profile_image, bio, preferred_role, assigned_role, team_id")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("[PROFILE API] ❌ Fetch failed:", error.message);
      return NextResponse.json(
        { success: false, message: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: any) {
    console.error("[PROFILE API] 🛑 Error:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update current user's profile (bio, preferred_role, profile_image URL)
 */
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bio, preferred_role, profile_image } = body;

    // Validate bio length (150 char max for short description)
    if (bio && bio.length > 150) {
      return NextResponse.json(
        { success: false, message: "Bio must be 150 characters or less" },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {};
    if (bio !== undefined) updateData.bio = bio;
    if (preferred_role !== undefined) updateData.preferred_role = preferred_role;
    if (profile_image !== undefined) updateData.profile_image = profile_image;

    const { data, error } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", session.user.id)
      .select("id, username, profile_image, bio, preferred_role")
      .single();

    if (error) {
      console.error("[PROFILE API] ❌ Update failed:", error.message);
      return NextResponse.json(
        { success: false, message: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Profile updated successfully", data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[PROFILE API] 🛑 Error:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
