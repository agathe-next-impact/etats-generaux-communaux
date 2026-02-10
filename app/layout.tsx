import type React from "react"
import type { Metadata } from "next"
import { Raleway } from "next/font/google"
import { Navigation } from "@/components/navigation"
import { Topbar } from "@/components/topbar"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import { ScrollToTop } from "@/components/scroll-to-top"
import "./globals.css"
import '@wordpress/block-library/build-style/style.css';
import TargetCursor from "@/components/TargetCursorClient"
import { ExitIntentPopup } from "@/components/ui/exit-intent-popup"

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["500", "600", "700", "800"],
  display: "swap",
})


export const metadata: Metadata = {
  title: {
    default: "Les états généraux communaux",
    template: "%s | Les états généraux communaux",
  },
  description:
    "Les États Généraux Communaux (EGC) : un mouvement citoyen qui porte la voix des territoires. Découvrez nos doléances, participez aux événements locaux, rejoignez les groupes citoyens et accédez à nos ressources pour construire ensemble un avenir démocratique et solidaire.",
  keywords: [
    "États Généraux Communaux",
    "EGC",
    "mouvement citoyen",
    "doléances",
    "démocratie participative",
    "engagement collectif",
    "territoires",
    "action collective",
    "groupes locaux",
    "événements citoyens",
    "ressources citoyennes",
  ],
  authors: [{ name: "Les États Généraux Communaux" }],
  creator: "Les États Généraux Communaux",
  publisher: "Les États Généraux Communaux",
  verification: {
    google: "wM4OUXQLnMdeS6tlxxOedyNYTuJntfmuQtamkProvdQ",
  },
  icons: {
    icon: "/images/logo-egc.png",
    shortcut: "/images/logo-egc.png",
    apple: "/images/logo-egc.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://lesetatsgenerauxcommunaux.org",
    siteName: "Les états généraux communaux",
    title: "Les états généraux communaux",
    description:
      "Un mouvement citoyen qui porte la voix des territoires. Découvrez nos doléances, participez aux événements locaux, rejoignez les groupes citoyens et accédez à nos ressources pour construire ensemble un avenir démocratique et solidaire.",
    images: [
      {
        url: "/images/logo-egc.png",
        width: 1200,
        height: 630,
        alt: "Les états généraux communaux",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Les états généraux communaux",
    description:
      "Un mouvement citoyen qui porte la voix des territoires. Découvrez nos doléances, participez aux événements locaux et rejoignez les groupes citoyens.",
    images: ["/images/logo-egc.png"],
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
    <html lang="fr" className={raleway.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
      {/* Exit Intent Popup */}
        <ExitIntentPopup
          title="Rejoignez notre newsletter !"
          description="Ne manquez rien des actualités des États Généraux Communaux. Inscrivez-vous à notre newsletter pour recevoir les dernières nouvelles, événements et ressources directement dans votre boîte mail."
          buttonText="S'inscrire"
          sensitivity={20}
          showOnce={true}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <Topbar />
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ScrollToTop />
        </Suspense>
        <TargetCursor /> 
      </body>
    </html>
  )
}
