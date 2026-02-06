"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSent(true);
        toast.success("Reset link sent! Check your email.");
      } else {
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/40 bg-card/60 backdrop-blur-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Having trouble logging in?</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to get back into your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSent ? (
                <div className="text-center space-y-4 py-4">
                  <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Link Sent!</h3>
                  <p className="text-muted-foreground text-sm">
                    We've sent a password reset link to <strong>{email}</strong>.
                    <br />
                    It may take a few minutes to arrive.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setIsSent(false)}
                  >
                    Try another email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full font-bold" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      "Send Login Link"
                    )}
                  </Button>
                </form>
              )}
              
              <div className="mt-6 text-center">
                <Link 
                  href="/auth/signin" 
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Log In
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
