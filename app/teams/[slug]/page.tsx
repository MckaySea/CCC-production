import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const teamsData = {
  "league-of-legends": {
    game: "League of Legends",
    logo: "/league-of-legends-logo.png",
    description:
      "Our League of Legends team competes in the collegiate circuit, showcasing strategic gameplay and mechanical prowess in the world's most popular MOBA.",
    players: [
      {
        name: 'Alex "Striker" Chen',
        role: "Top Lane",
        image: "/college-student-playing-league-of-legends-competit.jpg",
      },
      { name: 'Jordan "Flash" Kim', role: "Jungle", image: "/focused-esports-player-at-gaming-setup.jpg" },
      { name: 'Sam "Nexus" Rivera', role: "Mid Lane", image: "/competitive-gamer-with-headset.jpg" },
      { name: 'Taylor "Bolt" Johnson', role: "ADC", image: "/esports-player-in-team-jersey.jpg" },
      { name: 'Morgan "Shield" Lee', role: "Support", image: "/college-esports-team-member.jpg" },
    ],
  },
  valorant: {
    game: "Valorant",
    logo: "/valorant-logo.png",
    description:
      "Our Valorant squad brings tactical precision and agent mastery to every match, competing at the highest level of collegiate play.",
    players: [
      { name: 'Casey "Phantom" Davis', role: "Duelist", image: "/valorant-player-at-tournament.jpg" },
      { name: 'Riley "Sage" Martinez', role: "Controller", image: "/focused-valorant-competitor.jpg" },
      { name: 'Avery "Viper" Thompson', role: "Sentinel", image: "/esports-player-with-gaming-mouse.jpg" },
      { name: 'Quinn "Jett" Anderson', role: "Initiator", image: "/college-student-at-gaming-competition.jpg" },
      { name: 'Drew "Omen" Wilson', role: "Flex", image: "/valorant-team-member-practicing.jpg" },
    ],
  },
  cs2: {
    game: "CS2",
    logo: "/counter-strike-2-logo.png",
    description:
      "Our Counter-Strike 2 roster combines veteran experience with fresh talent, executing flawless strategies in the most competitive FPS.",
    players: [
      { name: 'Blake "Ace" Foster', role: "AWPer", image: "/counter-strike-player-at-lan-event.jpg" },
      { name: 'Skylar "Clutch" Hayes', role: "Entry Fragger", image: "/cs2-competitive-player.jpg" },
      { name: 'Cameron "Smoke" Brooks', role: "Support", image: "/esports-team-captain.jpg" },
      { name: 'Reese "Flash" Cooper', role: "Lurker", image: "/focused-cs2-player.jpg" },
      { name: 'Peyton "IGL" Morgan', role: "In-Game Leader", image: "/placeholder.svg?height=400&width=400" },
    ],
  },
  "rocket-league": {
    game: "Rocket League",
    logo: "/placeholder.svg?height=200&width=200",
    description:
      "Our Rocket League team showcases incredible aerial mechanics and team coordination in this high-octane vehicular soccer game.",
    players: [
      { name: 'Kai "Boost" Sullivan', role: "Striker", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Sage "Aerial" Park', role: "Midfielder", image: "/placeholder.svg?height=400&width=400" },
      { name: 'River "Wall" Bennett', role: "Goalkeeper", image: "/placeholder.svg?height=400&width=400" },
    ],
  },
  "overwatch-2": {
    game: "Overwatch 2",
    logo: "/placeholder.svg?height=200&width=200",
    description:
      "Our Overwatch 2 roster demonstrates exceptional hero synergy and adaptability across all roles in this dynamic team-based shooter.",
    players: [
      { name: 'Phoenix "Tank" Cruz', role: "Tank", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Rowan "Heals" Price', role: "Support", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Ash "DPS" Reed', role: "Damage", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Ellis "Flex" Stone', role: "Flex", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Sage "Shot" Bell', role: "DPS", image: "/placeholder.svg?height=400&width=400" },
    ],
  },
  "apex-legends": {
    game: "Apex Legends",
    logo: "/placeholder.svg?height=200&width=200",
    description:
      "Our Apex Legends squad excels in fast-paced battle royale action with superior positioning and legend composition strategies.",
    players: [
      { name: 'Nova "Wraith" James', role: "Fragger", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Zion "Gibby" Walsh', role: "Support", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Echo "Path" Quinn', role: "Scout", image: "/placeholder.svg?height=400&width=400" },
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(teamsData).map((slug) => ({
    slug,
  }))
}

export default function TeamPage({ params }: { params: { slug: string } }) {
  const team = teamsData[params.slug as keyof typeof teamsData]

  if (!team) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Games
            </Link>

            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <Image
                  src={team.logo || "/placeholder.svg"}
                  alt={`${team.game} logo`}
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">{team.game}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">{team.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Players Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-12 text-center">
              Meet the <span className="text-primary">Roster</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.players.map((player, index) => (
                <div
                  key={index}
                  className="group bg-card border-2 border-primary/20 rounded-lg overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={player.image || "/placeholder.svg"}
                      alt={player.name}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-black uppercase mb-1 group-hover:text-primary transition-colors">
                      {player.name}
                    </h3>
                    <p className="text-sm text-primary font-semibold">{player.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
