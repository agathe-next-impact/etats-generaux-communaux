import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, Rss } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white text-black border-t-4 border-[#E73628] relative overflow-hidden">
      {/* Decorative background pictos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png"
          alt=""
          width={40}
          height={40}
          className="absolute top-8 left-12 opacity-10 rotate-12"
        />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png"
          alt=""
          width={32}
          height={32}
          className="absolute top-16 right-24 opacity-15 -rotate-6"
        />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-iph3iRcbh4GzoswUQo87W7giQs9vrW.png"
          alt=""
          width={36}
          height={36}
          className="absolute bottom-32 left-1/4 opacity-12 rotate-45"
        />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-ac6W7GEoGBcgE6fyqHJLr2EBOsnw7u.png"
          alt=""
          width={28}
          height={28}
          className="absolute top-24 right-1/3 opacity-10 -rotate-12"
        />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png"
          alt=""
          width={44}
          height={44}
          className="absolute bottom-24 right-16 opacity-15 rotate-20"
        />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-ortOMnxOuv7texPH3RxLJTGkLhXhuQ.png"
          alt=""
          width={38}
          height={38}
          className="absolute top-12 left-1/3 opacity-12 -rotate-15"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 relative">
            {/* Small picto on top left corner of brand section */}
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png"
              alt=""
              width={24}
              height={24}
              className="absolute -top-3 -left-3 opacity-20 rotate-12 z-10"
            />
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
          <div className="space-y-4 relative">
            {/* Small picto on top right corner of navigation section */}
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png"
              alt=""
              width={20}
              height={20}
              className="absolute -top-2 -right-2 opacity-20 -rotate-6 z-10"
            />
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
        <div className="mt-8 pt-8 border-t border-black/20 relative">
          {/* Small picto on bottom right corner */}
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png"
            alt=""
            width={28}
            height={28}
            className="absolute -bottom-4 -right-4 opacity-15 rotate-20 z-10"
          />
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
