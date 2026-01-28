import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Highlighter from "@/components/ui/highlighter"
import { getAboutPageData, getHomePageData } from "@/lib/wordpress"
import { getArchivePageTitles } from "@/lib/wordpress"
import { HorizontalTimeline } from "@/components/horizontal-timeline"
import { VerticalTimeline } from "@/components/vertical-timeline"

export default async function AboutPage() {
  const aboutPageData = await getAboutPageData()
  const acf = aboutPageData?.acf
  const hompageData = await getHomePageData()
  const acfHomepage = hompageData?.acf
  const archivePageTitles = await getArchivePageTitles()
  

  if (!acf) {
    return (
      <div className="min-h-screen pt-[150px]">
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl uppercase text-foreground leading-tight font-black">
              <Highlighter
                action="underline"
                color="#E73628"
                strokeWidth={3}
                animationDuration={600}
                iterations={1}
                isView={true}
              >
                À propos
              </Highlighter>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
             
            </p>
          </div>
        </section>
      </div>
    )
  }

  const colors = ["#E73628", "#F4E63C", "#4AAD33"]
  const pictos = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png", // picto 1
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png", // picto 2
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-iph3iRcbh4GzoswUQo87W7giQs9vrW.png", // picto 3
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-ac6W7GEoGBcgE6fyqHJLr2EBOsnw7u.png", // picto 4
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png", // picto 5
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-ortOMnxOuv7texPH3RxLJTGkLhXhuQ.png", // picto 7
  ]

  return (
    <div className="min-h-screen pt-[150px]">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        <Image
          src={pictos[1] || "/placeholder.svg"}
          alt=""
          width={120}
          height={120}
          className="absolute left-[5%] top-[10%] opacity-20 rotate-12 pointer-events-none"
        />
        <Image
          src={pictos[4] || "/placeholder.svg"}
          alt=""
          width={100}
          height={100}
          className="absolute right-[8%] top-[15%] opacity-15 -rotate-6 pointer-events-none"
        />
        <Image
          src={pictos[2] || "/placeholder.svg"}
          alt=""
          width={80}
          height={80}
          className="absolute left-[10%] bottom-[20%] opacity-25 rotate-45 pointer-events-none"
        />
        <Image
          src={pictos[3] || "/placeholder.svg"}
          alt=""
          width={90}
          height={90}
          className="absolute right-[12%] bottom-[10%] opacity-20 -rotate-12 pointer-events-none"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-8">
            <div className="space-y-4">
              {acf.titre_principal && (
                <h1 className="text-4xl md:text-5xl lg:text-6xl uppercase text-foreground leading-tight font-black">
                  <Highlighter
                    action="underline"
                    color="#E73628"
                    strokeWidth={3}
                    animationDuration={600}
                    iterations={1}
                    isView={true}
                  >
                    {acf.titre_principal}
                  </Highlighter>
                </h1>
              )}
              {acf["sous-titre_principal"] && (
                <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-medium">
                  <Highlighter
                    action="underline"
                    color="#F4E63C"
                    strokeWidth={2}
                    animationDuration={600}
                    iterations={1}
                    isView={true}
                  >
                    {acf["sous-titre_principal"]}
                  </Highlighter>
                </p>
              )}
            </div>
            {acf.chapeau && (
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">{acf.chapeau}</p>
            )}
          </div>
        </div>
      </section>

      {/* Horizontal Timeline Section */}
      {((acfHomepage?.historique?.liste_des_liens && acfHomepage.historique.liste_des_liens.length > 0) ||
        (acfHomepage?.groupe_de_liens?.liste_des_liens && acfHomepage.groupe_de_liens.liste_des_liens.length > 0)) && (
        <HorizontalTimeline
          links={acfHomepage?.historique?.liste_des_liens || acfHomepage?.groupe_de_liens?.liste_des_liens || []}
          title={acfHomepage?.historique?.titre}
          subtitle={acfHomepage?.historique?.["sous-titre"]}
        />
      )}

      {/* Call to Action Section - Notre plaidoyer */}
      {acfHomepage?.section_manifeste && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              {acfHomepage.section_manifeste.titre && (
                <h2 className="text-3xl md:text-4xl uppercase text-foreground">
                  <Highlighter
                    action="underline"
                    color="#E73628"
                    strokeWidth={3}
                    animationDuration={600}
                    iterations={1}
                    isView={true}
                  >
                    {acfHomepage.section_manifeste.titre}
                  </Highlighter>
                </h2>
              )}
              {acfHomepage.section_manifeste.chapeau && (
                <p className="text-lg leading-relaxed font-medium">{acfHomepage.section_manifeste.chapeau}</p>
              )}
              {acfHomepage.section_manifeste.texte && (
                <div
                  className="leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: acfHomepage.section_manifeste.texte.replace(/\$\{/g, "&#36;{").replace(/\}\}/g, "&#125;}"),
                  }}
                />
              )}
              {(acfHomepage.section_manifeste.cta_de_gauche?.libelle_de_gauche ||
                acfHomepage.section_manifeste.cta_de_droite?.libelle_de_droite) && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {acfHomepage.section_manifeste.cta_de_gauche?.libelle_de_gauche && (
                    <Button size="lg" className="bg-white text-[var(--brand-red)] hover:bg-white/90">
                      <Link
                        href={acfHomepage.section_manifeste.cta_de_gauche.lien_de_gauche?.url || "#"}
                        target={acfHomepage.section_manifeste.cta_de_gauche.lien_de_gauche?.target || "_self"}
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
                          {acfHomepage.section_manifeste.cta_de_gauche.libelle_de_gauche}
                        </Highlighter>
                      </Link>
                    </Button>
                  )}
                  {acfHomepage.section_manifeste.cta_de_droite?.libelle_de_droite && (
                    <Button variant="outline" size="lg" className="border-white text-black bg-transparent">
                      <Link
                        href={acfHomepage.section_manifeste.cta_de_droite.lien_de_droite?.url || "#"}
                        target={acfHomepage.section_manifeste.cta_de_droite.lien_de_droite?.target || "_self"}
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
                          {acfHomepage.section_manifeste.cta_de_droite.libelle_de_droite}
                        </Highlighter>
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* EGC Timeline Section */}
      {acfHomepage?.historique_egc?.liste_des_liens && acfHomepage.historique_egc.liste_des_liens.length > 0 && (
        <VerticalTimeline
          links={acfHomepage.historique_egc.liste_des_liens}
          title={acfHomepage.historique_egc.titre}
          subtitle={acfHomepage.historique_egc["sous-titre"]}
        />
      )}

      {/* Fondateurs Section */}
      {acf.fondateurs && acf.fondateurs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4 font-black">
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={3}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  Fondateurs
                </Highlighter>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Les personnes à l'origine de notre projet
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {acf.fondateurs.map((fondateur, index) => {
                const cardContent = (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-all duration-300 border-2 relative overflow-visible"
                    style={{ borderColor: colors[index % colors.length] }}
                  >
                    <Image
                      src={pictos[index % pictos.length] || "/placeholder.svg"}
                      alt=""
                      width={32}
                      height={32}
                      className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                    />
                    <CardContent className="p-6">
                      {fondateur.warno?.url ? (
                        <div className="w-24 h-24 mx-auto mb-4 relative">
                          <Image
                            src={fondateur.warno.url || "/placeholder.svg"}
                            alt={fondateur.warno.alt || fondateur.nom || "Logo"}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                          style={{ backgroundColor: `${colors[index % colors.length]}10` }}
                        >
                          <span className="text-2xl font-semibold" style={{ color: colors[index % colors.length] }}>
                            {fondateur.nom?.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {fondateur.nom && (
                        <h3 className="font-black text-foreground mb-2 uppercase text-lg">{fondateur.nom}</h3>
                      )}
                      {fondateur.descriptif && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{fondateur.descriptif}</p>
                      )}
                    </CardContent>
                  </Card>
                )

                return fondateur.lien ? (
                  <Link
                    key={index}
                    href={fondateur.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-transform hover:scale-105"
                  >
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Partenaires Section */}
      {acf.partenaires && acf.partenaires.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4 font-black">
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={3}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  Partenaires
                </Highlighter>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Les organisations qui nous accompagnent dans notre mission
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {acf.partenaires.map((partenaire, index) => {
                const cardContent = (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-all duration-300 border-2 relative overflow-visible"
                    style={{ borderColor: colors[index % colors.length] }}
                  >
                    <Image
                      src={pictos[(index + 3) % pictos.length] || "/placeholder.svg"}
                      alt=""
                      width={32}
                      height={32}
                      className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                    />
                    <CardContent className="p-6">
                      {partenaire.warno?.url ? (
                        <div className="w-32 h-32 mx-auto mb-4 relative">
                          <Image
                            src={partenaire.warno.url || "/placeholder.svg"}
                            alt={partenaire.warno.alt || partenaire.nom || "Logo"}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                          style={{ backgroundColor: `${colors[index % colors.length]}10` }}
                        >
                          <span className="text-2xl font-semibold" style={{ color: colors[index % colors.length] }}>
                            {partenaire.nom?.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {partenaire.nom && (
                        <h3 className="font-black text-foreground mb-2 uppercase text-lg">{partenaire.nom}</h3>
                      )}
                      {partenaire.descriptif && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{partenaire.descriptif}</p>
                      )}
                    </CardContent>
                  </Card>
                )

                return partenaire.lien ? (
                  <Link
                    key={index}
                    href={partenaire.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-transform hover:scale-105"
                  >
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export const metadata = {
  title: "À propos",
  description:
    "Découvrez les fondateurs et partenaires des États Généraux de la Conversion écologique et sociale, un mouvement citoyen pour construire ensemble un avenir durable.",
}
