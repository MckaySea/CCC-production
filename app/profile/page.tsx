"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { User, Camera, Loader2, Save, Upload, Mail, Phone, UserCheck } from "lucide-react";
import Image from "next/image";

// Common esports roles for preferred role selection
const PREFERRED_ROLES = [
  "Duelist", "Controller", "Sentinel", "Initiator",
  "Support", "Tank", "DPS", "Healer", "Flex", "IGL",
  "Entry Fragger", "AWPer", "Lurker",
  "Top Lane", "Jungle", "Mid Lane", "ADC",
  "Striker", "Midfielder", "Goalkeeper",
  "Fragger", "Scout",
];

interface ProfileData {
  id: string;
  username: string;
  profile_image: string | null;
  bio: string | null;
  preferred_role: string | null;
  assigned_role: string | null;
  team_id: string | null;
  email: string | null;
  phone_number: string | null;
  full_name: string | null;
  profile_completed: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  // Form state
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      
      if (data.success) {
        setProfile(data.data);
        setProfileImage(data.data.profile_image || "");
        setBio(data.data.bio || "");
        setPreferredRole(data.data.preferred_role || "");
        setEmail(data.data.email || "");
        setPhoneNumber(data.data.phone_number || "");
        setFullName(data.data.full_name || "");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

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
    toast.info("Uploading image...");

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
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (bio.length > 150) {
      toast.error("Description must be 150 characters or less");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_image: profileImage || null,
          bio: bio || null,
          preferred_role: preferredRole || null,
          email: email || null,
          phone_number: phoneNumber || null,
          full_name: fullName || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Profile updated successfully! ✨");
        setProfile(data.data);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 bg-background">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-primary/20">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl font-black uppercase flex items-center justify-center gap-3">
                  <User className="w-8 h-8 text-primary" />
                  Your Profile
                </CardTitle>
                <p className="text-muted-foreground">
                  Customize how you appear on team pages
                </p>
              </CardHeader>

              <CardContent className="space-y-8 pt-6">
                {/* Profile Image Preview - Clickable */}
                <div className="flex flex-col items-center gap-4">
                  <div 
                    className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 bg-muted cursor-pointer group hover:border-primary transition-colors"
                    onClick={handleImageClick}
                  >
                    {isUploading ? (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : profileImage ? (
                      <>
                        <Image
                          src={profileImage}
                          alt="Profile preview"
                          fill
                          className="object-cover"
                          onError={() => setProfileImage("")}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Camera className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">
                          Click to upload
                        </span>
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
                  <p className="text-sm text-muted-foreground">
                    @{profile?.username}
                  </p>
                </div>

                {/* Profile Image URL Input - Alternative method */}
                <div className="space-y-2">
                  <Label htmlFor="profileImage">
                    Or paste an image URL
                  </Label>
                  <Input
                    id="profileImage"
                    type="url"
                    placeholder="https://example.com/your-image.jpg"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    className="bg-muted/50"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Short Description
                    <span className="text-muted-foreground font-normal ml-2">
                      ({bio.length}/150)
                    </span>
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="A few words about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 150))}
                    maxLength={150}
                    rows={3}
                    className="bg-muted/50 resize-none"
                  />
                </div>

                {/* Preferred Role */}
                <div className="space-y-2">
                  <Label htmlFor="preferredRole">Preferred Role</Label>
                  <Select value={preferredRole} onValueChange={setPreferredRole}>
                    <SelectTrigger id="preferredRole" className="bg-muted/50">
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
                  <p className="text-xs text-muted-foreground">
                    This helps admins know your preference when assigning roles
                  </p>
                </div>

                {/* Contact Info Section */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-primary" />
                    Contact Information
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This info is for club records only and won't be shown publicly.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-muted/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
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
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-muted/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Assigned Role (Read-only) */}
                {profile?.assigned_role && (
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-primary">
                      Assigned Role: {profile.assigned_role}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This is set by team admins
                    </p>
                  </div>
                )}

                {/* Save Button */}
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full gap-2 py-6 text-lg font-bold"
                  size="lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
