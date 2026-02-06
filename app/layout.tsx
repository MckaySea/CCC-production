import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthSessionProvider } from "@/components/session-provider"
import { ProfileCheckWrapper } from "@/components/profile-check-wrapper"
import { Toaster } from "sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ccc-esports.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CCC Esports | Collegiate Competitive Gaming",
    template: "%s | CCC Esports",
  },
  description:
    "Official website of CCC Esports - Compete at the highest level of collegiate esports. Join our teams in League of Legends, Valorant, CS2, and more.",
  keywords: [
    "CCC Esports",
    "college esports",
    "collegiate gaming",
    "esports team",
    "League of Legends",
    "Valorant",
    "CS2",
    "competitive gaming",
    "esports recruitment",
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
    siteName: "CCC Esports",
    title: "CCC Esports | Collegiate Competitive Gaming",
    description:
      "Compete at the highest level of collegiate esports. Join our teams in League of Legends, Valorant, CS2, and more.",
    images: [
      {
        url: "/ccc-esports-logo.png",
        width: 512,
        height: 512,
        alt: "CCC Esports Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CCC Esports | Collegiate Competitive Gaming",
    description:
      "Compete at the highest level of collegiate esports. Join our teams in League of Legends, Valorant, CS2, and more.",
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

