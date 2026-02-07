"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Gamepad2 } from "lucide-react";
import { ContactModal } from "./join-modal";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/esports-gaming-arena-with-dramatic-lighting.jpg"
            alt="Esports Arena"
            fill
            priority // Use 'priority' since it's above the fold
            className="object-cover opacity-40"
            sizes="100vw" // Helps Next.js calculate best image size
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div
              className={`relative w-32 h-32 md:w-40 md:h-40 transition-opacity duration-700 ${
                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
              style={{ transitionProperty: "opacity, transform" }}
            >
              <Image
                src="/ccc-esports-logo.png"
                alt="CCC Esports Logo"
                fill
                priority
                className="object-contain drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                // Key change: Set state when the image is fully loaded
                onLoadingComplete={() => setIsLoaded(true)}
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary uppercase tracking-wider">
              Collegiate Esports
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase mb-4 text-balance">
            <span className="block">Compete</span>
            <span className="block text-primary">Dominate</span>
            <span className="block">Win</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
            Join our competitive gaming community and represent your college in
            the biggest esports titles
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#games">
              <Button
                size="lg"
                className="text-lg font-bold uppercase tracking-wide cursor-pointer transition-transform hover:scale-105"
              >
                <Gamepad2 className="mr-2 h-5 w-5" />
                View Teams
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg font-bold uppercase tracking-wide bg-transparent cursor-pointer"
              onClick={() => setContactModalOpen(true)}
            >
              Contact Us
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      <ContactModal open={contactModalOpen} onOpenChange={setContactModalOpen} />
    </>
  );
}
