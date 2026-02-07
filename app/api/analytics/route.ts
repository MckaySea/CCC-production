import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get page views grouped by date
    const { data: dailyViews, error: dailyError } = await supabaseAdmin
      .from("page_views")
      .select("created_at, visitor_id")
      .gte("created_at", startDate.toISOString());

    if (dailyError) {
      console.error("Failed to fetch daily views:", dailyError);
      return NextResponse.json(
        { error: "Failed to fetch analytics" },
        { status: 500 }
      );
    }

    // Process daily views data
    const viewsByDate: Record<string, { views: number; visitors: Set<string> }> = {};
    dailyViews?.forEach((view) => {
      const date = new Date(view.created_at).toISOString().split("T")[0];
      if (!viewsByDate[date]) {
        viewsByDate[date] = { views: 0, visitors: new Set() };
      }
      viewsByDate[date].views++;
      viewsByDate[date].visitors.add(view.visitor_id);
    });

    const dailyData = Object.entries(viewsByDate)
      .map(([date, data]) => ({
        date,
        views: data.views,
        visitors: data.visitors.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Get top pages
    const { data: topPagesRaw, error: topError } = await supabaseAdmin
      .from("page_views")
      .select("path")
      .gte("created_at", startDate.toISOString());

    if (topError) {
      console.error("Failed to fetch top pages:", topError);
      return NextResponse.json(
        { error: "Failed to fetch analytics" },
        { status: 500 }
      );
    }

    // Count page views by path
    const pathCounts: Record<string, number> = {};
    topPagesRaw?.forEach((view) => {
      pathCounts[view.path] = (pathCounts[view.path] || 0) + 1;
    });

    const topPages = Object.entries(pathCounts)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Calculate totals
    const totalViews = dailyViews?.length || 0;
    const uniqueVisitors = new Set(dailyViews?.map((v) => v.visitor_id)).size;
    const avgViewsPerDay = days > 0 ? Math.round(totalViews / days) : 0;

    return NextResponse.json({
      dailyData,
      topPages,
      summary: {
        totalViews,
        uniqueVisitors,
        avgViewsPerDay,
        days,
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
