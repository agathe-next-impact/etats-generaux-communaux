"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { DoleancesPageACF } from "@/lib/wordpress"

interface BandeauSyntheseProps {
  data: DoleancesPageACF["bandeau_synthese"]
}

export function BandeauSynthese({ data }: BandeauSyntheseProps) {
  const hasContent =
    data &&
    (data.titre ||
      data.descriptif ||
      (data.image_couleur && typeof data.image_couleur === "object" && data.image_couleur.url) ||
      (data.image_noir_et_blanc && typeof data.image_noir_et_blanc === "object" && data.image_noir_et_blanc.url))

  if (!hasContent) {
    return null
  }

  const hasColorImage = data.image_couleur && typeof data.image_couleur === "object" && data.image_couleur.url
  const hasBWImage =
    data.image_noir_et_blanc && typeof data.image_noir_et_blanc === "object" && data.image_noir_et_blanc.url

  return (
    <section className="relative z-10 py-16 bg-gradient-to-br from-[#F4E63C]/10 via-white to-[#E73628]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Image with CTA */}
          {hasColorImage && (
            <div className="lg:col-span-3 flex flex-col items-center">
              <div className="relative w-full aspect-square max-w-[250px] mb-4 rounded-lg overflow-hidden shadow-lg border-4 border-[#E73628] hover:scale-105 transition-transform duration-300">
                <Image
                  src={data.image_couleur.url || "/placeholder.svg"}
                  alt={data.image_couleur.alt || "Image couleur"}
                  fill
                  className="object-cover"
                />
              </div>
              {data.lien_couleur?.url && (
                <Button asChild size="lg" className="bg-[#E73628] hover:bg-[#E73628]/90 text-white font-bold uppercase">
                  <Link href={data.lien_couleur.url} target={data.lien_couleur.target || "_self"}>
                    Ouvrir
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}

          {/* Center Content */}
          <div
            className={`${hasColorImage && hasBWImage ? "lg:col-span-6" : hasColorImage || hasBWImage ? "lg:col-span-9" : "lg:col-span-12"} text-center space-y-4`}
          >
            {data.titre && (
              <h2 className="text-3xl md:text-4xl font-black uppercase text-foreground leading-tight">{data.titre}</h2>
            )}
            {data.descriptif && (
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">{data.descriptif}</p>
            )}
          </div>

          {/* Right Image with CTA */}
          {hasBWImage && (
            <div className="lg:col-span-3 flex flex-col items-center">
              <div className="relative w-full aspect-square max-w-[250px] mb-4 rounded-lg overflow-hidden shadow-lg border-4 border-gray-400 hover:scale-105 transition-transform duration-300 grayscale">
                <Image
                  src={data.image_noir_et_blanc.url || "/placeholder.svg"}
                  alt={data.image_noir_et_blanc.alt || "Image noir et blanc"}
                  fill
                  className="object-cover"
                />
              </div>
              {data.lien_noir_et_blanc?.url && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-foreground/20 font-bold uppercase hover:bg-foreground/5 bg-transparent"
                >
                  <Link href={data.lien_noir_et_blanc.url} target={data.lien_noir_et_blanc.target || "_self"}>
                    Ouvrir
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
