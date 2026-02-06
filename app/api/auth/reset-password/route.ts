import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Token and new password are required" },
        { status: 400 }
      );
    }

    // 1. Find valid token
    const { data: resetRecord, error: findError } = await supabaseAdmin
      .from("password_resets")
      .select("id, email, expires_at")
      .eq("token", token)
      .single();

    if (findError || !resetRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // 2. Check expiration
    if (new Date(resetRecord.expires_at) < new Date()) {
      // Delete expired token
      await supabaseAdmin.from("password_resets").delete().eq("id", resetRecord.id);
      return NextResponse.json(
        { success: false, message: "Token has expired" },
        { status: 400 }
      );
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update user password
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ password: hashedPassword })
      .eq("email", resetRecord.email);

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json(
        { success: false, message: "Failed to update password" },
        { status: 500 }
      );
    }

    // 5. Delete used token
    await supabaseAdmin.from("password_resets").delete().eq("id", resetRecord.id);

    return NextResponse.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
