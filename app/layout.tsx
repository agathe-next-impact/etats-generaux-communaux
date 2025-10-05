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
  weight: ["500", "600", "700", "800"], // Added weight 800 for bold button text
  display: "swap",
})

export const metadata: Metadata = {
  title: "Magazine Collectif - Engagement et Action Collective",
  description: "Un magazine en ligne dédié à l'engagement citoyen, l'action collective et les mouvements sociaux.",
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
