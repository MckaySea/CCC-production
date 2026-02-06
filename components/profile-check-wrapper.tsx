"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ProfileCompletionModal } from "./profile-completion-modal";

interface ProfileCheckWrapperProps {
  children: React.ReactNode;
}

export function ProfileCheckWrapper({ children }: ProfileCheckWrapperProps) {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      checkProfileCompletion();
    } else if (status === "unauthenticated") {
      setIsChecking(false);
    }
  }, [status, session]);

  const checkProfileCompletion = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      
      if (data.success && data.data) {
        // Show modal if profile is not completed
        if (!data.data.profile_completed) {
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error("Failed to check profile:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleComplete = () => {
    setShowModal(false);
    // Optionally refresh the page to update session data
    window.location.reload();
  };

  return (
    <>
      {children}
      {showModal && session?.user?.username && (
        <ProfileCompletionModal
          username={session.user.username}
          onComplete={handleComplete}
        />
      )}
    </>
  );
}
