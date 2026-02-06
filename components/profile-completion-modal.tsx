"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Camera, Loader2, Upload, Sparkles } from "lucide-react";
import Image from "next/image";

const PREFERRED_ROLES = [
  "Duelist", "Controller", "Sentinel", "Initiator",
  "Support", "Tank", "DPS", "Healer", "Flex", "IGL",
  "Entry Fragger", "AWPer", "Lurker",
  "Top Lane", "Jungle", "Mid Lane", "ADC",
  "Striker", "Midfielder", "Goalkeeper",
  "Fragger", "Scout",
];

interface ProfileCompletionModalProps {
  username: string;
  onComplete: () => void;
}

export function ProfileCompletionModal({ username, onComplete }: ProfileCompletionModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [preferredRole, setPreferredRole] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setProfileImage(data.url);
        toast.success("Image uploaded! ✨");
      } else {
        toast.error(data.message || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const validateStep1 = () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!profileImage) {
      toast.error("Please upload a profile picture");
      return false;
    }
    if (!bio.trim()) {
      toast.error("Please add a short description about yourself");
      return false;
    }
    if (!preferredRole) {
      toast.error("Please select your preferred role");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          phone_number: phoneNumber,
          profile_image: profileImage,
          bio: bio,
          preferred_role: preferredRole,
          profile_completed: true,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Profile completed! Welcome to CCC Esports! 🎮");
        onComplete();
      } else {
        toast.error(data.message || "Failed to save profile");
      }
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <Card className="border-primary/30">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-black">Welcome, {username}!</CardTitle>
            <p className="text-muted-foreground">
              {step === 1 
                ? "Let's set up your profile. First, some contact info."
                : "Almost done! Now let's make your profile shine."}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      For club records only, not shown publicly
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>

                  <Button onClick={handleNext} className="w-full mt-6">
                    Continue →
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Profile Image */}
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 bg-muted cursor-pointer group hover:border-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : profileImage ? (
                        <>
                          <Image src={profileImage} alt="Profile" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                          <span className="text-xs text-muted-foreground mt-1">Upload *</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label>
                      Short Description *
                      <span className="text-muted-foreground font-normal ml-2">
                        ({bio.length}/150)
                      </span>
                    </Label>
                    <Textarea
                      placeholder="A few words about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value.slice(0, 150))}
                      maxLength={150}
                      rows={2}
                      className="bg-muted/50 resize-none"
                    />
                  </div>

                  {/* Preferred Role */}
                  <div className="space-y-2">
                    <Label>Preferred Role *</Label>
                    <Select value={preferredRole} onValueChange={setPreferredRole}>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select your preferred role" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREFERRED_ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      ← Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Complete Profile 🎮"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
