import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, Rss } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white text-black border-t-4 border-[#E73628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo-egc.png"
                alt="États Généraux Communaux"
                width={120}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-black/80 leading-relaxed"></p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#E73628] hover:text-white">
                <Twitter className="h-4 w-4 text-black" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#E73628] hover:text-white">
                <Facebook className="h-4 w-4 text-black" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#E73628] hover:text-white">
                <Linkedin className="h-4 w-4 text-black" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#E73628] hover:text-white">
                <Rss className="h-4 w-4 text-black" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider font-[family-name:var(--font-raleway)]">Liens</h3>
            <div className="space-y-2">
              <Link href="/les-egc" className="block text-sm hover:text-[#E73628] transition-colors">
                Les Etats Generaux Communaux
              </Link>
              <Link href="https://lesdoleances.fr" className="block text-sm hover:text-[#E73628] transition-colors">
                Les Doléances
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-black/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-black/80">© 2025 Les Etats Généraux Communaux.</p>
            <div className="flex items-center space-x-4 text-sm">
              Réalisé par
              <Link href="https://next-impact.digital" className="hover:text-[#E73628] transition-colors">
                &nbsp;Next Impact
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fresque-VsYsqdaWmxKIfbwxBEhKS6ZEpRhGOE.png"
          alt="Fresque communautaire"
          width={1920}
          height={200}
          className="w-full h-auto"
          priority={false}
        />
      </div>
    </footer>
  )
}
