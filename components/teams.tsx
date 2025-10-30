import { TeamCard } from "@/components/team-card"

const teams = [
  {
    game: "League of Legends",
    logo: "/league-of-legends-logo.png",
    players: [
      { name: 'Alex "Striker" Chen', role: "Top Lane", image: "/college-student-playing-league-of-legends-competit.jpg" },
      { name: 'Jordan "Flash" Kim', role: "Jungle", image: "/focused-esports-player-at-gaming-setup.jpg" },
      { name: 'Sam "Nexus" Rivera', role: "Mid Lane", image: "/competitive-gamer-with-headset.jpg" },
      { name: 'Taylor "Bolt" Johnson', role: "ADC", image: "/esports-player-in-team-jersey.jpg" },
      { name: 'Morgan "Shield" Lee', role: "Support", image: "/college-esports-team-member.jpg" },
    ],
  },
  {
    game: "Valorant",
    logo: "/valorant-logo.png",
    players: [
      { name: 'Casey "Phantom" Davis', role: "Duelist", image: "/valorant-player-at-tournament.jpg" },
      { name: 'Riley "Sage" Martinez', role: "Controller", image: "/focused-valorant-competitor.jpg" },
      { name: 'Avery "Viper" Thompson', role: "Sentinel", image: "/esports-player-with-gaming-mouse.jpg" },
      { name: 'Quinn "Jett" Anderson', role: "Initiator", image: "/college-student-at-gaming-competition.jpg" },
      { name: 'Drew "Omen" Wilson', role: "Flex", image: "/valorant-team-member-practicing.jpg" },
    ],
  },
  {
    game: "CS2",
    logo: "/counter-strike-2-logo.png",
    players: [
      { name: 'Blake "Ace" Foster', role: "AWPer", image: "/counter-strike-player-at-lan-event.jpg" },
      { name: 'Skylar "Clutch" Hayes', role: "Entry Fragger", image: "/cs2-competitive-player.jpg" },
      { name: 'Cameron "Smoke" Brooks', role: "Support", image: "/esports-team-captain.jpg" },
      { name: 'Reese "Flash" Cooper', role: "Lurker", image: "/focused-cs2-player.jpg" },
      { name: 'Peyton "IGL" Morgan', role: "In-Game Leader", image: "/placeholder.svg?height=400&width=400" },
    ],
  },
  {
    game: "Rocket League",
    logo: "/placeholder.svg?height=200&width=200",
    players: [
      { name: 'Kai "Boost" Sullivan', role: "Striker", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Sage "Aerial" Park', role: "Midfielder", image: "/placeholder.svg?height=400&width=400" },
      { name: 'River "Wall" Bennett', role: "Goalkeeper", image: "/placeholder.svg?height=400&width=400" },
    ],
  },
  {
    game: "Overwatch 2",
    logo: "/placeholder.svg?height=200&width=200",
    players: [
      { name: 'Phoenix "Tank" Cruz', role: "Tank", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Rowan "Heals" Price', role: "Support", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Ash "DPS" Reed', role: "Damage", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Ellis "Flex" Stone', role: "Flex", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Sage "Shot" Bell', role: "DPS", image: "/placeholder.svg?height=400&width=400" },
    ],
  },
  {
    game: "Apex Legends",
    logo: "/placeholder.svg?height=200&width=200",
    players: [
      { name: 'Nova "Wraith" James', role: "Fragger", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Zion "Gibby" Walsh', role: "Support", image: "/placeholder.svg?height=400&width=400" },
      { name: 'Echo "Path" Quinn', role: "Scout", image: "/placeholder.svg?height=400&width=400" },
    ],
  },
]

export function Teams() {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
            Our <span className="text-primary">Teams</span>
          </h2>
          <p className="text-lg text-muted-foreground">Meet the players representing our college</p>
        </div>

        <div className="space-y-24">
          {teams.map((team, index) => (
            <TeamCard key={index} team={team} />
          ))}
        </div>
      </div>
    </section>
  )
}
