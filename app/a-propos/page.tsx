import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Highlighter from "@/components/ui/highlighter"
import { getAboutPageData } from "@/lib/wordpress"

export default async function AboutPage() {
  const aboutPageData = await getAboutPageData()
  const acf = aboutPageData?.acf

  console.log("[v0] About page ACF data:", acf ? "loaded" : "not found")

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
              Configurez les champs ACF dans WordPress pour afficher le contenu de cette page.
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
              {acf.fondateurs.map((fondateur, index) => (
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
                    {fondateur.logo?.url ? (
                      <div className="w-24 h-24 mx-auto mb-4 relative">
                        <Image
                          src={fondateur.logo.url || "/placeholder.svg"}
                          alt={fondateur.logo.alt || fondateur.nom || "Logo"}
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
              ))}
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
              {acf.partenaires.map((partenaire, index) => (
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
                    {partenaire.logo?.url ? (
                      <div className="w-32 h-32 mx-auto mb-4 relative">
                        <Image
                          src={partenaire.logo.url || "/placeholder.svg"}
                          alt={partenaire.logo.alt || partenaire.nom || "Logo"}
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
              ))}
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
