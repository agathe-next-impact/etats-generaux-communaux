import type React from "react"
import type { Metadata } from "next"
import { Raleway } from "next/font/google"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import { ScrollToTop } from "@/components/scroll-to-top"
import "./globals.css"

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "États Généraux Communaux",
    template: "%s | États Généraux Communaux",
  },
  description:
    "Les États Généraux Communaux : un mouvement citoyen pour construire ensemble un avenir durable. Découvrez nos événements, ressources et groupes locaux.",
  keywords: [
    "États Généraux Communaux",
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
  authors: [{ name: "États Généraux Communaux" }],
  creator: "États Généraux Communaux",
  publisher: "États Généraux Communaux",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://lesetatsgenereuxcommunaux.org",
    siteName: "États Généraux Communaux",
    title: "États Généraux Communaux",
    description:
      "Un mouvement citoyen pour construire ensemble un avenir durable. Découvrez nos événements, ressources et groupes locaux.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "États Généraux Communaux",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "États Généraux Communaux",
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
      </body>
    </html>
  )
}
