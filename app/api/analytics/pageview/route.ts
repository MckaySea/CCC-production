import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referrer, visitorId } = body;

    if (!path || !visitorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Skip tracking for admin and API routes
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const userAgent = request.headers.get("user-agent") || "";

    const { error } = await supabaseAdmin.from("page_views").insert({
      path,
      referrer: referrer || null,
      user_agent: userAgent,
      visitor_id: visitorId,
    });

    if (error) {
      console.error("Failed to record page view:", error);
      return NextResponse.json(
        { error: "Failed to record page view" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Page view tracking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
