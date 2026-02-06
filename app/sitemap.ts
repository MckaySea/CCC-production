import { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ccc-esports.com"

// Helper to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/sponsors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  // Dynamic game/team pages
  let gamePages: MetadataRoute.Sitemap = []
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: games } = await supabase
      .from("games")
      .select("name")
      .order("name", { ascending: true })

    if (games) {
      gamePages = games.map((game) => ({
        url: `${siteUrl}/teams/${createSlug(game.name)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch games", error)
  }

  return [...staticPages, ...gamePages]
}
