import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@supabase/supabase-js";

// Supabase client for server-side data fetching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping from URL slugs to game names in database
const slugToGameName: Record<string, string> = {
  "league-of-legends": "League of Legends",
  "valorant": "Valorant",
  "cs2": "CS2",
  "rocket-league": "Rocket League",
  "overwatch-2": "Overwatch 2",
  "apex-legends": "Apex Legends",
};

// Static descriptions for each game
const gameDescriptions: Record<string, string> = {
  "League of Legends": "Our League of Legends team competes in the collegiate circuit, showcasing strategic gameplay and mechanical prowess in the world's most popular MOBA.",
  "Valorant": "Our Valorant squad brings tactical precision and agent mastery to every match, competing at the highest level of collegiate play.",
  "CS2": "Our Counter-Strike 2 roster combines veteran experience with fresh talent, executing flawless strategies in the most competitive FPS.",
  "Rocket League": "Our Rocket League team showcases incredible aerial mechanics and team coordination in this high-octane vehicular soccer game.",
  "Overwatch 2": "Our Overwatch 2 roster demonstrates exceptional hero synergy and adaptability across all roles in this dynamic team-based shooter.",
  "Apex Legends": "Our Apex Legends squad excels in fast-paced battle royale action with superior positioning and legend composition strategies.",
};

interface Player {
  id: string;
  username: string;
  profile_image: string | null;
  bio: string | null;
  assigned_role: string | null;
}

interface Team {
  id: string;
  name: string;
  users: Player[];
}

interface Game {
  id: string;
  name: string;
  teams: Team[];
}

export function generateStaticParams() {
  return Object.keys(slugToGameName).map((slug) => ({
    slug,
  }));
}

async function getGameData(slug: string): Promise<Game | null> {
  const gameName = slugToGameName[slug];
  if (!gameName) return null;

  const { data, error } = await supabase
    .from("games")
    .select(`
      id,
      name,
      teams (
        id,
        name,
        users (
          id,
          username,
          profile_image,
          bio,
          assigned_role
        )
      )
    `)
    .eq("name", gameName)
    .single();

  if (error || !data) {
    console.error("Failed to fetch game data:", error);
    return null;
  }

  return data as Game;
}

export default async function TeamPage({ params }: { params: { slug: string } }) {
  const gameName = slugToGameName[params.slug];
  
  if (!gameName) {
    notFound();
  }

  const game = await getGameData(params.slug);

  // Collect all players from all teams for this game
  const allPlayers: Player[] = game?.teams?.flatMap(team => team.users || []) || [];

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
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">{gameName}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {gameDescriptions[gameName]}
                </p>
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

            {allPlayers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No players assigned to this game yet. Check back soon!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="group bg-card border-2 border-primary/20 rounded-lg overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={player.profile_image || "/placeholder.svg?height=400&width=400"}
                        alt={player.username}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black uppercase mb-1 group-hover:text-primary transition-colors">
                        {player.username}
                      </h3>
                      {player.assigned_role && (
                        <p className="text-sm text-primary font-semibold">{player.assigned_role}</p>
                      )}
                      {player.bio && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {player.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
