"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const games = [
  {
    name: "League of Legends",
    slug: "league-of-legends",
    logo: "/league-of-legends-logo.png",
    description: "5v5 MOBA domination",
    playerCount: 5,
  },
  {
    name: "Valorant",
    slug: "valorant",
    logo: "/valorant-logo.png",
    description: "Tactical FPS excellence",
    playerCount: 5,
  },
  {
    name: "CS2",
    slug: "cs2",
    logo: "/counter-strike-2-logo.png",
    description: "Classic competitive shooter",
    playerCount: 5,
  },
  {
    name: "Rocket League",
    slug: "rocket-league",
    logo: "/placeholder.svg?height=200&width=200",
    description: "Supersonic acrobatic rocket-powered cars",
    playerCount: 3,
  },
  {
    name: "Overwatch 2",
    slug: "overwatch-2",
    logo: "/placeholder.svg?height=200&width=200",
    description: "Hero-based team shooter",
    playerCount: 5,
  },
  {
    name: "Apex Legends",
    slug: "apex-legends",
    logo: "/placeholder.svg?height=200&width=200",
    description: "Battle royale legends",
    playerCount: 3,
  },
]

export function GameSelection() {
  return (
    <section id="games" className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
            Our <span className="text-primary">Games</span>
          </h2>
          <p className="text-lg text-muted-foreground">Choose a game to meet the team</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/teams/${game.slug}`}
              className="group relative bg-card border-2 border-primary/20 rounded-lg p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <Image
                    src={game.logo || "/placeholder.svg"}
                    alt={`${game.name} logo`}
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase mb-2 group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">{game.description}</p>
                  <p className="text-xs text-primary font-semibold">{game.playerCount} Players</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View Team <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
