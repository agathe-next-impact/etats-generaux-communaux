import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

// Next ajoute lui-même <meta name="robots" content="noindex"> aux pages 404
export const metadata: Metadata = {
  title: "Page introuvable",
}

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 pt-32 pb-16">
      <div className="max-w-xl text-center space-y-6">
        <p className="text-6xl font-black text-[#E73628]">404</p>
        <h1 className="text-3xl md:text-4xl font-black uppercase">Page introuvable</h1>
        <p className="text-muted-foreground text-lg">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">Lire les actualités</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
