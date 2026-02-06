"use client"

import Link from "next/link"
import { ArrowRight, Gamepad2, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface GameData {
  id: string
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
}

export function GameSelection() {
  const [games, setGames] = useState<GameData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check cache first
    const cacheKey = "games-homepage"
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      // Use cache if less than 1 minute old
      if (Date.now() - timestamp < 1 * 60 * 1000) {
        setGames(data)
        setIsLoading(false)
        return
      }
    }

    // Fetch from API
    fetch("/api/games")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setGames(data.data)
          localStorage.setItem(cacheKey, JSON.stringify({ data: data.data, timestamp: Date.now() }))
        }
      })
      .catch((err) => console.error("Failed to fetch games:", err))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section id="games" className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
            Our <span className="text-primary">Games</span>
          </h2>
          <p className="text-lg text-muted-foreground">Choose a game to meet the team</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : games.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No games available yet. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Link
                key={game.slug}
                href={`/teams/${game.slug}`}
                className="group relative bg-card border-2 border-primary/20 rounded-lg overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
              >
                {/* Game Image */}
                {game.image_url ? (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={game.image_url}
                      alt={`${game.name} banner`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Gamepad2 className="w-16 h-16 text-primary/30" />
                  </div>
                )}
                
                {/* Game Info */}
                <div className="p-6">
                  <h3 className="text-xl font-black uppercase mb-2 group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {game.description || "Compete at the highest level of collegiate esports."}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Team <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
