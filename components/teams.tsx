"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Player {
  id: string;
  username: string;
  profile_image?: string | null;
  bio?: string | null;
  assigned_role?: string | null;
}

interface Team {
  id: string;
  name: string;
  users: Player[];
}

interface Game {
  id: string;
  name: string;
  max_players_per_team: number;
  teams: Team[];
}

export function Teams() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("/api/teams-games");
        const data = await res.json();
        
        if (data.success) {
          // Filter to only show games with teams that have players
          const gamesWithPlayers = data.data.filter((game: Game) => 
            game.teams.some((team: Team) => team.users && team.users.length > 0)
          );
          setGames(gamesWithPlayers);
        } else {
          setError(data.message || "Failed to fetch teams");
        }
      } catch (err) {
        setError("Failed to load teams");
        console.error("Failed to fetch teams:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 px-4 bg-secondary/30">
        <div className="container mx-auto flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error || games.length === 0) {
    return null; // Don't show section if no teams with players
  }

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
          {games.map((game) => (
            <div key={game.id} className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-3xl md:text-4xl font-black uppercase">{game.name}</h3>
              </div>

              {game.teams.map((team) => (
                <div key={team.id} className="mb-8">
                  {game.teams.length > 1 && (
                    <h4 className="text-xl font-bold mb-4 text-primary">{team.name}</h4>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {team.users.map((player) => (
                      <Card
                        key={player.id}
                        className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300"
                      >
                        <div className="aspect-[3/4] relative overflow-hidden">
                          <img
                            src={player.profile_image || "/placeholder.svg?height=400&width=300"}
                            alt={player.username}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />

                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            {player.assigned_role && (
                              <div className="text-xs uppercase tracking-wider text-primary font-mono mb-1">
                                {player.assigned_role}
                              </div>
                            )}
                            <div className="font-bold text-lg leading-tight text-balance">
                              {player.username}
                            </div>
                            {player.bio && (
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {player.bio}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
