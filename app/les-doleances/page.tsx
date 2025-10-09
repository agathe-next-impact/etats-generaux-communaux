import Highlighter from "@/components/ui/highlighter"
import { getDoleancesPageData } from "@/lib/wordpress"
import { Card, CardContent } from "@/components/ui/card"

export default async function DoleancesPage() {
  const doleancesPageData = await getDoleancesPageData()
  const acf = doleancesPageData?.acf

  console.log("[v0] Les Doléances page ACF data:", acf ? "loaded" : "not found")

  const icons = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-GTeirEZCZvI67Ke1C2izBtH9COkEKd.png", // picto 2
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-wKp6eBacwzvpayn3cHRheoohDr7ySL.png", // picto 3
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-Uuj5KcGGEXhXdpNX9GaK9oSJZthC8G.png", // picto 4
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%206-GMw1ewUd1JNSHzQ5n0bwAWyLt8lwRz.png", // picto 6
  ]

  // Function to get a random icon based on index for consistency
  const getRandomIcon = (index: number) => {
    return icons[index % icons.length]
  }

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
                Les Doléances
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

  return (
    <div className="min-h-screen pt-[150px]">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {acf.titre && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl uppercase text-foreground leading-tight font-black">
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={3}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  {acf.titre}
                </Highlighter>
              </h1>
            )}
            {acf.chapeau && (
              <div
                className="text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto prose prose-lg"
                dangerouslySetInnerHTML={{ __html: acf.chapeau }}
              />
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
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-ICHB7cWddege8JtlWxAOuhDFO1YX19.png"
                          alt=""
                          className="w-16 h-16 object-contain"
                        />
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-3TREKNW3pkwjRwzPbqP2ksaTo0u3Dd.png"
                          alt=""
                          className="w-16 h-16 object-contain"
                        />
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-4ThXo4CWq8LTSpIsZdzroZKR1mWEZQ.png"
                          alt=""
                          className="w-16 h-16 object-contain"
                        />
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

export const metadata = {
  title: "Les Doléances",
  description:
    "Découvrez les axes de réflexion et les propositions citoyennes pour construire ensemble un avenir durable et solidaire.",
}
