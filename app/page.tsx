import { Hero } from "@/components/hero"
import { GameSelection } from "@/components/game-selection"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <Hero />
        <GameSelection />
        <About />
        <Footer />
      </main>
    </>
  )
}
