import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase"; // Replaced prisma with supabaseAdmin

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    // --- Supabase Query (Check if user already exists) ---
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Supabase Query (Create user) ---
    const { data: createdUser, error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        username: username,
        password: hashedPassword,
        role: "USER",
      })
      .select() // Return the created row
      .single();

    if (insertError || !createdUser) {
      console.error("[v0] Supabase registration error:", insertError);
      return NextResponse.json(
        { error: "Failed to register user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: createdUser.id,
          username: createdUser.username,
          role: createdUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[v0] Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
