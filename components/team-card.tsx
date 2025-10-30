import { Card } from "@/components/ui/card"

interface Player {
  name: string
  role: string
  image: string
}

interface Team {
  game: string
  logo: string
  players: Player[]
}

export function TeamCard({ team }: { team: Team }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <img src={team.logo || "/placeholder.svg"} alt={`${team.game} logo`} className="w-16 h-16 object-contain" />
        <h3 className="text-3xl md:text-4xl font-black uppercase">{team.game}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {team.players.map((player, index) => (
          <Card
            key={index}
            className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300"
          >
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={player.image || "/placeholder.svg"}
                alt={player.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-xs uppercase tracking-wider text-primary font-mono mb-1">{player.role}</div>
                <div className="font-bold text-lg leading-tight text-balance">{player.name}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
