"use client"

import Highlighter from "@/components/ui/highlighter"
import { getDoleancesPageData } from "@/lib/wordpress"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { use } from "react"

export default function DoleancesClientPage() {
  const doleancesPageData = use(getDoleancesPageData())
  const acf = doleancesPageData?.acf

  console.warn("[v0] Les Doléances page ACF data:", acf ? "loaded" : "not found")
  console.warn("[v0] Les Doléances CTA data:", acf?.cta)

  const icons = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png", // picto 2
    "https://blob.v0.app/pCk88.png", // picto 3
    "https://blob.v0.app/pCk89.png", // picto 4
    "https://blob.v0.app/pCk90.png", // picto 5
  ]

  // Function to get a random icon based on index for consistency
  const getRandomIcon = (index: number) => {
    return icons[index % icons.length]
  }

  if (!acf) {
    return (
      <div className="min-h-screen pt-[150px]">
        <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
          <Image
            src="/images/design-mode/picto202.png"
            alt=""
            width={200}
            height={200}
            className="absolute left-[15%] top-12 z-0 opacity-20 rotate-12"
          />
          <Image
            src="https://blob.v0.app/pCk88.png"
            alt=""
            width={150}
            height={150}
            className="absolute right-[10%] top-24 z-0 opacity-15 -rotate-6"
          />
          <Image
            src="https://blob.v0.app/pCk89.png"
            alt=""
            width={180}
            height={180}
            className="absolute left-[8%] bottom-32 z-0 opacity-25 rotate-45"
          />
          <Image
            src="https://blob.v0.app/pCk90.png"
            alt=""
            width={160}
            height={160}
            className="absolute right-[20%] bottom-20 z-0 opacity-20 -rotate-12"
          />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl uppercase text-foreground leading-tight font-black mb-6">
              <Highlighter
                action="highlight"
                color="#F4E63C"
                strokeWidth={3}
                animationDuration={800}
                iterations={3}
                padding={8}
                isView={true}
              >
                Les Doléances
              </Highlighter>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-medium">
              Configurez les champs ACF dans WordPress pour afficher le contenu de cette page.
            </p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-[150px]">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <Image
          src="/images/design-mode/picto202.png"
          alt=""
          width={200}
          height={200}
          className="absolute left-[15%] top-12 z-0 opacity-20 rotate-12"
        />
        <Image
          src="https://blob.v0.app/pCk88.png"
          alt=""
          width={150}
          height={150}
          className="absolute right-[10%] top-24 z-0 opacity-15 -rotate-6"
        />
        <Image
          src="https://blob.v0.app/pCk89.png"
          alt=""
          width={180}
          height={180}
          className="absolute left-[8%] bottom-32 z-0 opacity-25 rotate-45"
        />
        <Image
          src="https://blob.v0.app/pCk90.png"
          alt=""
          width={160}
          height={160}
          className="absolute right-[20%] bottom-20 z-0 opacity-20 -rotate-12"
        />
        <Image
          src="/images/design-mode/picto202.png"
          alt=""
          width={140}
          height={140}
          className="absolute left-[25%] top-[60%] z-0 opacity-10 -rotate-30"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="space-y-8">
            {acf.titre && (
              <h1 className="text-4xl md:text-6xl lg:text-7xl uppercase text-foreground leading-tight font-black">
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
            )}
            {acf.chapeau && (
              <div className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-medium max-w-3xl mx-auto">
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={3}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  <div dangerouslySetInnerHTML={{ __html: acf.chapeau }} />
                </Highlighter>
              </div>
            )}

            {acf.cta && (acf.cta.texte_du_cta_gauche || acf.cta.texte_du_cta_droite) && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="text-lg bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90">
                  <Link
                    href={acf?.cta?.lien_du_cta_de_gauche?.url || "#"}
                    target={acf?.cta?.lien_du_cta_de_gauche?.target || "_self"}
                  >
                    <Highlighter
                      action="highlight"
                      color="#B4D19F"
                      strokeWidth={4}
                      animationDuration={600}
                      iterations={1}
                      padding={12}
                      isView={true}
                    >
                      {acf?.cta?.texte_du_cta_gauche || "CTA Gauche"}
                    </Highlighter>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-foreground/20 bg-transparent">
                  <Link
                    href={acf?.cta?.lien_du_cta_de_droite?.url || "#"}
                    target={acf?.cta?.lien_du_cta_de_droite?.target || "_self"}
                  >
                    <Highlighter
                      action="highlight"
                      color="#94BF7E"
                      strokeWidth={4}
                      animationDuration={600}
                      iterations={1}
                      padding={12}
                      isView={true}
                    >
                      {acf?.cta?.texte_du_cta_droite || "CTA Droite"}
                    </Highlighter>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Axes de réflexion */}
      {acf.axes && acf.axes.length > 0 && (
        <>
          {acf.axes.map((axe, axeIndex) => (
            <section key={axeIndex} className="py-16 bg-white border-t-2 border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                  {axe.titre && (
                    <h2 className="text-3xl md:text-4xl font-black uppercase font-[family-name:var(--font-raleway)] mb-4">
                      <Highlighter
                        action="underline"
                        color="#E73628"
                        strokeWidth={4}
                        animationDuration={600}
                        iterations={1}
                        isView={true}
                      >
                        {axe.titre}
                      </Highlighter>
                    </h2>
                  )}
                  {axe.chapeau && (
                    <div
                      className="text-muted-foreground text-lg leading-relaxed prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: axe.chapeau }}
                    />
                  )}
                </div>

                {/* Contenu de l'axe - Vignettes rouges */}
                {axe.contenu && axe.contenu.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {axe.contenu.map((item, itemIndex) => (
                      <Card
                        key={itemIndex}
                        className="border-2 border-[#E73628] hover:shadow-lg transition-all duration-300 bg-white relative overflow-visible"
                      >
                        <CardContent className="p-6">
                          {item.titre && (
                            <h3 className="text-xl font-black text-foreground mb-4 uppercase">
                              <Highlighter
                                action="underline"
                                color="#E73628"
                                strokeWidth={2}
                                animationDuration={600}
                                iterations={1}
                                isView={true}
                              >
                                {item.titre}
                              </Highlighter>
                            </h3>
                          )}
                          {item.texte && (
                            <div
                              className="text-muted-foreground leading-relaxed prose prose-sm"
                              dangerouslySetInnerHTML={{ __html: item.texte }}
                            />
                          )}
                        </CardContent>

                        <div className="absolute -top-6 -right-6 z-10">
                          <img
                            src={getRandomIcon(axeIndex * 100 + itemIndex) || "/placeholder.svg"}
                            alt=""
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Encadré Comment agir - Jaune */}
                {axe.encadre_comment_agir &&
                  (axe.encadre_comment_agir.titre_comment_agir || axe.encadre_comment_agir.contenu) && (
                    <div className="relative border-4 border-[#F4E63C] p-8 rounded-lg max-w-4xl mx-auto bg-white">
                      {axe.encadre_comment_agir.titre_comment_agir && (
                        <h3 className="text-2xl md:text-3xl font-black text-foreground mb-6 uppercase text-center">
                          {axe.encadre_comment_agir.titre_comment_agir}
                        </h3>
                      )}
                      {axe.encadre_comment_agir.contenu && (
                        <div
                          className="text-foreground leading-relaxed prose prose-lg max-w-none font-semibold"
                          dangerouslySetInnerHTML={{ __html: axe.encadre_comment_agir.contenu }}
                        />
                      )}

                      {/* Decorative icons overlapping bottom right border */}
                      <div className="absolute -bottom-8 -right-8 flex gap-2">
                        <img
                          src="/images/design-mode/picto200.png"
                          alt=""
                          className="w-16 h-16 object-contain"
                        />
                        <img src="https://blob.v0.app/pCk90.png" alt="" className="w-16 h-16 object-contain" />
                        <img src="https://blob.v0.app/pCk89.png" alt="" className="w-16 h-16 object-contain" />
                      </div>
                    </div>
                  )}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
