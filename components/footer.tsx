import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Facebook, Linkedin, Rss } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="magazine-title text-xl font-semibold">Magazine Collectif</span>
            </div>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              Un média indépendant dédié à l'engagement citoyen, à l'action collective et aux mouvements qui
              transforment notre société.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Rss className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Navigation</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm hover:text-primary transition-colors">
                Accueil
              </Link>
              <Link href="/blog" className="block text-sm hover:text-primary transition-colors">
                Articles
              </Link>
              <Link href="/ressources" className="block text-sm hover:text-primary transition-colors">
                Ressources
              </Link>
              <Link href="/a-propos" className="block text-sm hover:text-primary transition-colors">
                À propos
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Thématiques</h3>
            <div className="space-y-2">
              <Link href="/blog?category=engagement" className="block text-sm hover:text-primary transition-colors">
                Engagement citoyen
              </Link>
              <Link href="/blog?category=ecologie" className="block text-sm hover:text-primary transition-colors">
                Écologie
              </Link>
              <Link href="/blog?category=social" className="block text-sm hover:text-primary transition-colors">
                Justice sociale
              </Link>
              <Link href="/blog?category=democratie" className="block text-sm hover:text-primary transition-colors">
                Démocratie
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm text-secondary-foreground/80">
              Recevez nos derniers articles et ressources directement dans votre boîte mail.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/60"
              />
              <Button size="sm" className="w-full">
                S'abonner
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-secondary-foreground/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-foreground/80">© 2025 Magazine Collectif. Tous droits réservés.</p>
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/mentions-legales" className="hover:text-primary transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="hover:text-primary transition-colors">
                Confidentialité
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
