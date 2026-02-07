"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function generateVisitorId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  
  let visitorId = localStorage.getItem("ccc_visitor_id");
  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem("ccc_visitor_id", visitorId);
  }
  return visitorId;
}

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip tracking for admin and auth pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.startsWith("/api")) {
      return;
    }

    const trackPageView = async () => {
      try {
        const visitorId = getVisitorId();
        if (!visitorId) return;

        await fetch("/api/analytics/pageview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || null,
            visitorId,
          }),
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.error("Failed to track page view:", error);
      }
    };

    trackPageView();
  }, [pathname]);

  return null;
}
