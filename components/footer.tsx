import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Facebook, Linkedin, Rss } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#E73628] text-white border-t-4 border-[#F4E63C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#F4E63C] rounded-full flex items-center justify-center">
                <span className="text-[#E73628] font-bold text-sm">M</span>
              </div>
              <span className="magazine-title text-xl font-semibold uppercase">Magazine Collectif</span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              Un média indépendant dédié à l'engagement citoyen, à l'action collective et aux mouvements qui
              transforment notre société.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#F4E63C] hover:text-[#E73628]">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#F4E63C] hover:text-[#E73628]">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#F4E63C] hover:text-[#E73628]">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#F4E63C] hover:text-[#E73628]">
                <Rss className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider font-[family-name:var(--font-raleway)]">
              Navigation
            </h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm hover:text-[#F4E63C] transition-colors">
                Accueil
              </Link>
              <Link href="/blog" className="block text-sm hover:text-[#F4E63C] transition-colors">
                Articles
              </Link>
              <Link href="/ressources" className="block text-sm hover:text-[#F4E63C] transition-colors">
                Ressources
              </Link>
              <Link href="/a-propos" className="block text-sm hover:text-[#F4E63C] transition-colors">
                À propos
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider font-[family-name:var(--font-raleway)]">
              Thématiques
            </h3>
            <div className="space-y-2">
              <Link href="/blog?category=engagement" className="block text-sm hover:text-[#F4E63C] transition-colors">
                Engagement citoyen
              </Link>
              <Link href="/blog?category=ecologie" className="block text-sm hover:text-[#F4E63C] transition-colors">
                Écologie
              </Link>
              <Link href="/blog?category=social" className="block text-sm hover:text-[#F4E63C] transition-colors">
                Justice sociale
              </Link>
              <Link href="/blog?category=democratie" className="block text-sm hover:text-[#F4E63C] transition-colors">
                Démocratie
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider font-[family-name:var(--font-raleway)]">
              Newsletter
            </h3>
            <p className="text-sm text-white/90">
              Recevez nos derniers articles et ressources directement dans votre boîte mail.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#F4E63C]"
              />
              <Button size="sm" className="w-full bg-[#4AAD33] hover:bg-[#44843F] text-white border-none">
                S'abonner
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/90">© 2025 Magazine Collectif. Tous droits réservés.</p>
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/mentions-legales" className="hover:text-[#F4E63C] transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="hover:text-[#F4E63C] transition-colors">
                Confidentialité
              </Link>
              <Link href="/participer" className="hover:text-[#F4E63C] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
