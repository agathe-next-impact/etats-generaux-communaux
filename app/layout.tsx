import type React from "react"
import type { Metadata } from "next"
import { Raleway } from "next/font/google"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import { ScrollToTop } from "@/components/scroll-to-top"
import TargetCursor from "@/components/target-cursor"
import "./globals.css"

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "États Généraux de la Conversion - Le Rhizome",
    template: "%s | États Généraux de la Conversion",
  },
  description:
    "Les États Généraux de la Conversion écologique et sociale (EGC) : un mouvement citoyen pour construire ensemble un avenir durable. Découvrez nos événements, ressources et groupes locaux.",
  keywords: [
    "États Généraux de la Conversion",
    "EGC",
    "conversion écologique",
    "conversion sociale",
    "mouvement citoyen",
    "engagement collectif",
    "transition écologique",
    "action collective",
    "groupes locaux",
    "événements citoyens",
  ],
  authors: [{ name: "États Généraux de la Conversion" }],
  creator: "États Généraux de la Conversion",
  publisher: "États Généraux de la Conversion",
  icons: {
    icon: "/images/logo-egc.png",
    shortcut: "/images/logo-egc.png",
    apple: "/images/logo-egc.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://etats-generaux-conversion.fr",
    siteName: "États Généraux de la Conversion",
    title: "États Généraux de la Conversion - Le Rhizome",
    description:
      "Un mouvement citoyen pour construire ensemble un avenir durable. Découvrez nos événements, ressources et groupes locaux.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "États Généraux de la Conversion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "États Généraux de la Conversion - Le Rhizome",
    description:
      "Un mouvement citoyen pour construire ensemble un avenir durable. Découvrez nos événements, ressources et groupes locaux.",
    images: ["/og-image.jpg"],
  },
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
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={raleway.variable}>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ScrollToTop />
        </Suspense>
        <TargetCursor targetSelector=".cursor-target" spinDuration={2} hideDefaultCursor={true} />
      </body>
    </html>
  )
}
