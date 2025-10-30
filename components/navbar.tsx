"use client";

import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, User, Shield } from "lucide-react";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const games = [
    { name: "League of Legends", slug: "league-of-legends" },
    { name: "Valorant", slug: "valorant" },
    { name: "CS2", slug: "cs2" },
    { name: "Rocket League", slug: "rocket-league" },
    { name: "Overwatch 2", slug: "overwatch-2" },
    { name: "Apex Legends", slug: "apex-legends" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/#"
            scroll={true}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
              <Image
                src="/ccc-esports-logo.png"
                alt="CCC Esports Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-black uppercase tracking-tight hidden sm:block">
              <span className="text-primary">CCC</span> Esports
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-semibold hover:text-primary transition-colors"
            >
              Home
            </Link>
            <div className="relative group">
              <button className="text-sm font-semibold hover:text-primary transition-colors">
                Teams
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-primary/20 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {games.map((game) => (
                  <Link
                    key={game.slug}
                    href={`/teams/${game.slug}`}
                    className="block px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {game.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/#about"
              className="text-sm font-semibold hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/sponsors"
              className="text-sm font-semibold hover:text-primary transition-colors"
            >
              Sponsors
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-sm font-semibold hover:text-primary transition-colors"
              >
                Admin
              </Link>
            )}

            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-primary/20">
              <a
                href="https://discord.gg/cccesports"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
                aria-label="Discord"
              >
                <SiDiscord className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/cccesports"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/cccesports"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>

            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {session.user.username}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {session.user.role === "ADMIN" && (
                          <Shield className="w-3 h-3" />
                        )}
                        {session.user.role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/20 hover:bg-primary/40  hover:text-white bg-transparent h"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-primary/20">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold hover:text-primary transition-colors"
              >
                Home
              </Link>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">
                  Teams
                </p>
                {games.map((game) => (
                  <Link
                    key={game.slug}
                    href={`/teams/${game.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block pl-4 text-sm hover:text-primary transition-colors"
                  >
                    {game.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/#about"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/sponsors"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold hover:text-primary transition-colors"
              >
                Sponsors
              </Link>
              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold hover:text-primary transition-colors"
                >
                  Admin
                </Link>
              )}

              {session ? (
                <div className="pt-4 border-t border-primary/20 space-y-2">
                  <p className="text-sm font-semibold">
                    {session.user.username}
                    {session.user.role === "ADMIN" && (
                      <Badge variant="default" className="ml-2 text-xs">
                        ADMIN
                      </Badge>
                    )}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="w-full border-primary/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/20 bg-transparent text-sm font-semibold hover:text-primary transition-colors"
                  >
                    Sign In
                  </Button>
                </Link>
              )}

              <div className="flex items-center gap-6 pt-4 border-t border-primary/20">
                <a
                  href="https://discord.gg/cccesports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label="Discord"
                >
                  <SiDiscord className="w-6 h-6" />
                </a>
                <a
                  href="https://instagram.com/cccesports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://facebook.com/cccesports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
