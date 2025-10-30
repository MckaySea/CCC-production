import { Users, Trophy, Target } from "lucide-react"

export function About() {
  const stats = [
    { icon: Users, label: "Active Players", value: "50+" },
    { icon: Trophy, label: "Championships", value: "12" },
    { icon: Target, label: "Games", value: "6" },
  ]

  return (
    <section id="about" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">
            About Our <span className="text-primary">Club</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We are a competitive esports organization representing our college in major gaming tournaments. Our teams
            compete at the highest level across multiple titles, fostering teamwork, strategy, and excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
            >
              <stat.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-black mb-2">{stat.value}</div>
              <div className="text-sm uppercase tracking-wider text-muted-foreground font-mono">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
