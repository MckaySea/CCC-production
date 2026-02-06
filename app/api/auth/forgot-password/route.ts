import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // 1. Check if user exists
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, username")
      .eq("email", email)
      .single();

    if (userError || !user) {
      // Security: Don't reveal if email exists. Fake a success delay.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json(
        { success: true, message: "If an account exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    // 2. Generate Token
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

    // 3. Save to DB
    const { error: insertError } = await supabaseAdmin
      .from("password_resets")
      .insert({
        email,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Reset token insert error:", insertError);
      return NextResponse.json(
        { success: false, message: "Failed to process request" },
        { status: 500 }
      );
    }

    // 4. Send Email via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App Password
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: `"CCC Esports" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - CCC Esports",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #10b981;">Password Reset Request</h2>
          <p>Hello ${user.username},</p>
          <p>We received a request to reset your password for your CCC Esports account.</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>Or click this link: <a href="${resetLink}">${resetLink}</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't ask for this, you can safely ignore this email.</p>
          <hr style="margin-top: 40px; border: 0; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #888;">CCC Esports Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "If an account exists, a reset link has been sent." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
