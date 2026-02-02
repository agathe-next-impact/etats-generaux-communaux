"use client"

import Highlighter from "@/components/ui/highlighter"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import type { DemanderDoleancesPageACF } from "@/lib/wordpress"
import { transformWordPressUrls } from "@/lib/wordpress"

interface DemanderDoleancesClientProps {
  acf: DemanderDoleancesPageACF | null
}

export function DemanderDoleancesClient({ acf }: DemanderDoleancesClientProps) {
  console.warn("[v0] Demander les Doléances page ACF data:", acf ? "loaded" : "not found")

  const icons = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-iph3iRcbh4GzoswUQo87W7giQs9vrW.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-ac6W7GEoGBcgE6fyqHJLr2EBOsnw7u.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-ortOMnxOuv7texPH3RxLJTGkLhXhuQ.png",
  ]

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
            src="/images/design-mode/picto203.png"
            alt=""
            width={150}
            height={150}
            className="absolute right-[10%] top-24 z-0 opacity-15 -rotate-6"
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
                Demander les Doléances
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
          src="/images/design-mode/picto203.png"
          alt=""
          width={150}
          height={150}
          className="absolute right-[10%] top-24 z-0 opacity-15 -rotate-6"
        />
        <Image
          src="/images/design-mode/picto204.png"
          alt=""
          width={180}
          height={180}
          className="absolute left-[8%] bottom-32 z-0 opacity-25 rotate-45"
        />
        <Image
          src="/images/design-mode/picto205.png"
          alt=""
          width={160}
          height={160}
          className="absolute right-[20%] bottom-20 z-0 opacity-20 -rotate-12"
        />
        <Image
          src="/images/design-mode/picto207.png"
          alt=""
          width={140}
          height={140}
          className="absolute left-[25%] top-[60%] z-0 opacity-10 -rotate-30"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
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
        </div>
      </section>

      {/* Content Sections */}
      {acf.contenu && acf.contenu.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12">
              {acf.contenu.map((item, index) => (
                <Card
                  key={index}
                  className="border-4 border-[#F4E63C] hover:shadow-lg transition-all duration-300 bg-white relative overflow-visible"
                >
                  <CardContent className="p-8">
                    {item["sous-titre"] && (
                      <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 uppercase">
                        <Highlighter
                          action="underline"
                          color="#E73628"
                          strokeWidth={3}
                          animationDuration={600}
                          iterations={1}
                          isView={true}
                        >
                          {item["sous-titre"]}
                        </Highlighter>
                      </h2>
                    )}
                    {item.contenu && (
                      <div
                        className="text-foreground/90 leading-relaxed prose prose-lg max-w-none [&_a]:relative [&_a]:inline-block [&_a]:text-foreground [&_a]:font-semibold [&_a]:no-underline [&_a]:px-1 [&_a]:bg-[#F4E63C]/40 [&_a]:transition-all [&_a]:duration-300 hover:[&_a]:bg-[#F4E63C]/60 [&_a]:shadow-[0_2px_0_0_#F4E63C] hover:[&_a]:shadow-[0_3px_0_0_#F4E63C]"
                        dangerouslySetInnerHTML={{ __html: transformWordPressUrls(item.contenu) }}
                      />
                    )}
                  </CardContent>

                  <div className="absolute -top-6 -right-6 z-10">
                    <Image src={getRandomIcon(index) || "/placeholder.svg"} alt="" width={64} height={64} className="w-16 h-16 object-contain" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
