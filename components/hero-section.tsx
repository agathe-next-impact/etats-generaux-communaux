"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { Highlighter } from "@/components/ui/highlighter"
import { motion } from "motion/react"
import type { HomePageACF } from "@/lib/wordpress"

interface HeroSectionProps {
  acf: HomePageACF["section_hero"]
}

export function HeroSection({ acf }: HeroSectionProps) {
  if (!acf) return null

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
      <Image
        src="/images/design-mode/picto202.png"
        alt=""
        width={280}
        height={280}
        className="absolute left-1/4 top-2 -translate-x-1/2 z-0 opacity-80"
      />

      <motion.div
        className="absolute top-2 right-2 md:top-4 md:right-8 z-10 scale-75 md:scale-100"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 18,
          duration: 0.7,
        }}
      >
        {acf.cta_15?.url ? (
          <Link href={acf.cta_15.url} target={acf.cta_15.target || "_self"} className="group block">
            <div className="relative">
              <div className="bg-[#E73628] text-white px-4 py-3 md:px-6 md:py-4 rounded-lg shadow-xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300 border-4 border-white">
                <div className="text-center">
                  <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Appel du</div>
                  <div className="text-xl md:text-2xl font-black">15 octobre</div>
                  <div className="text-lg md:text-xl font-bold mb-2">2025</div>
                  <div className="flex items-center justify-center gap-1 text-[10px] md:text-xs font-bold uppercase tracking-wide border-t border-white/30 pt-2 mt-2">
                    <span>Lire l'appel</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#E73628]/20 rounded-lg transform rotate-3 -z-10 blur-sm" />
            </div>
          </Link>
        ) : (
          <div className="relative">
            <div className="bg-[#E73628] text-white px-4 py-3 md:px-6 md:py-4 rounded-lg shadow-xl transform rotate-3 border-4 border-white">
              <div className="text-center">
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Appel du</div>
                <div className="text-xl md:text-2xl font-black">15 octobre</div>
                <div className="text-lg md:text-xl font-bold">2025</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-[#E73628]/20 rounded-lg transform rotate-3 -z-10 blur-sm" />
          </div>
        )}
      </motion.div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-0">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl uppercase leading-tight text-foreground font-black">
              <Highlighter
                action="highlight"
                color="#F4E63C"
                strokeWidth={3}
                animationDuration={800}
                iterations={3}
                padding={8}
                isView={true}
              >
                {acf.titre}
              </Highlighter>
            </h1>
            {acf["sous-titre"] && (
              <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-medium max-w-2xl mx-auto">
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={3}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  {acf["sous-titre"]}
                </Highlighter>
              </p>
            )}
          </div>

          {acf.chapeau && (
            <div className="max-w-3xl mx-auto">
              <p className="magazine-subtitle text-base md:text-lg text-foreground/80 font-medium">{acf.chapeau}</p>
            </div>
          )}

          {(acf.cta_de_gauche?.libelle_de_gauche || acf.cta_de_droite?.libelle_de_droite) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {acf.cta_de_gauche?.libelle_de_gauche && (
                <Link
                  href={acf.cta_de_gauche.lien_de_gauche?.url || "#"}
                  target={acf.cta_de_gauche.lien_de_gauche?.target || "_self"}
                  className="inline-block"
                >
                  <Button size="lg" className="text-lg bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90">
                    <Highlighter
                      action="highlight"
                      color="#B4D19F"
                      strokeWidth={4}
                      animationDuration={600}
                      iterations={1}
                      padding={12}
                      isView={true}
                    >
                      {acf.cta_de_gauche.libelle_de_gauche}
                    </Highlighter>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              {acf.cta_de_droite?.libelle_de_droite && (
                <Link
                  href={acf.cta_de_droite.lien_de_droite?.url || "#"}
                  target={acf.cta_de_droite.lien_de_droite?.target || "_self"}
                  className="inline-block"
                >
                  <Button variant="outline" size="lg" className="border-foreground/20 bg-transparent">
                    <Highlighter
                      action="highlight"
                      color="#94BF7E"
                      strokeWidth={4}
                      animationDuration={600}
                      iterations={1}
                      padding={12}
                      isView={true}
                    >
                      {acf.cta_de_droite.libelle_de_droite}
                    </Highlighter>
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
