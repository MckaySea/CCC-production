import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthSessionProvider } from "@/components/session-provider"
import { ProfileCheckWrapper } from "@/components/profile-check-wrapper"
import { PageViewTracker } from "@/components/page-view-tracker"
import { Toaster } from "sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ccc-esports.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CCC Esports | Clovis Community College Esports",
    template: "%s | CCC Esports - Clovis Community College",
  },
  description:
    "Official esports program of Clovis Community College (CCC). Join our competitive gaming teams in League of Legends, Valorant, CS2, Overwatch 2, and more. Clovis Community Esports - where students compete at the collegiate level.",
  keywords: [
    "CCC Esports",
    "Clovis Community College Esports",
    "Clovis Community Esports",
    "Clovis esports",
    "Clovis Community College gaming",
    "CCC gaming",
    "Fresno esports",
    "Fresno State esports",
    "Fresno State University esports",
    "Central Valley esports",
    "California community college esports",
    "college esports",
    "collegiate gaming",
    "esports team",
    "League of Legends",
    "Valorant",
    "CS2",
    "Overwatch 2",
    "competitive gaming",
    "esports recruitment",
    "college gaming club",
  ],
  authors: [{ name: "CCC Esports" }],
  creator: "CCC Esports",
  publisher: "CCC Esports",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "CCC Esports - Clovis Community College",
    title: "CCC Esports | Clovis Community College Esports",
    description:
      "Official esports program of Clovis Community College. Join our competitive teams in League of Legends, Valorant, CS2, Overwatch 2, and more. Clovis Community Esports.",
    images: [
      {
        url: "/ccc-esports-logo.png",
        width: 512,
        height: 512,
        alt: "CCC Esports - Clovis Community College Esports Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CCC Esports | Clovis Community College Esports",
    description:
      "Official esports program of Clovis Community College. Join our competitive teams in League of Legends, Valorant, CS2, and more. Clovis Community Esports.",
    images: ["/ccc-esports-logo.png"],
    creator: "@cccesports",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "esports",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#10b981" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthSessionProvider>
          <PageViewTracker />
          <ProfileCheckWrapper>
            {children}
          </ProfileCheckWrapper>
        </AuthSessionProvider>
        <Toaster richColors position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}

