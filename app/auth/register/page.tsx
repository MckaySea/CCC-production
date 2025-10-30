"use client";

import type React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Registration successful but sign in failed. Please sign in manually."
        );
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("[v0] Registration error:", error);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    // Base container with dark background
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/ccc-esports-logo.png"
            alt="CCC Esports Logo"
            width={120}
            height={120}
            // Strong green drop shadow for neon/gaming effect
            className="drop-shadow-[0_0_25px_rgba(74,222,128,0.7)]"
          />
          {/* Aggressive, uppercase title matching the Hero's typography */}
          <h1 className="text-4xl font-black uppercase text-center tracking-wider">
            ENLIST <span className="text-primary">TODAY</span>
          </h1>
          <p className="text-muted-foreground text-center text-sm">
            Create your player profile and join the collegiate fight.
          </p>
        </div>

        {/* Card with primary color border and subtle shadow for a premium feel */}
        <Card className="border-primary/30 shadow-2xl shadow-primary/10 transition-all hover:shadow-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">New Recruit</CardTitle>
            <CardDescription>
              Enter your details to create your competitive account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {" "}
              {/* Increased spacing */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your Epic Gamer Tag or Collegiate ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  // Sleek, dark input with primary color focus ring
                  className="bg-secondary/30 border-primary/20 focus-visible:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Secure Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  // Sleek, dark input with primary color focus ring
                  className="bg-secondary/30 border-primary/20 focus-visible:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  // Sleek, dark input with primary color focus ring
                  className="bg-secondary/30 border-primary/20 focus-visible:ring-primary focus:border-primary transition-colors"
                />
              </div>
              {error && (
                <p className="text-sm font-semibold text-destructive">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                // Strong primary button styling, matching the Hero's CTA
                className="w-full text-lg font-bold uppercase tracking-wide h-12 transition-transform hover:scale-[1.01] shadow-lg shadow-primary/30"
                disabled={isLoading}
              >
                {isLoading ? "INITIATING..." : "CREATE ACCOUNT"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already a veteran? </span>
              <Link
                href="/auth/signin"
                className="font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground/80 hover:text-primary transition-colors"
          >
            ← Back to Home Base
          </Link>
        </div>
      </div>
    </div>
  );
}
