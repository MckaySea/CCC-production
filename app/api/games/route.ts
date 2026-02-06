import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to create URL-friendly slug from game name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * GET - Fetch all games for navigation (lightweight endpoint)
 * Returns only name and slug for dropdown menus
 * Cached and revalidated every 5 minutes
 */
export async function GET() {
  try {
    const { data: games, error } = await supabase
      .from("games")
      .select("id, name, description, image_url")
      .order("name", { ascending: true });

    if (error) {
      console.error("[GAMES NAV API] ❌ Fetch failed:", error.message);
      return NextResponse.json(
        { success: false, message: "Failed to fetch games" },
        { status: 500 }
      );
    }

    // Transform to include slugs
    const gamesWithSlugs = games.map((game) => ({
      id: game.id,
      name: game.name,
      slug: createSlug(game.name),
      description: game.description,
      image_url: game.image_url,
    }));

    // Return with cache headers - cache for 5 minutes, stale-while-revalidate for 10
    return NextResponse.json(
      { success: true, data: gamesWithSlugs },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error: any) {
    console.error("[GAMES NAV API] 🛑 Error:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
