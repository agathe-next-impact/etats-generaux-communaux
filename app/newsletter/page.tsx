export const dynamic = "force-dynamic"
import { NewsletterForm } from "./newsletter-form"
import { getArchivePageTitles } from "@/lib/wordpress"
import Image from "next/image"
import Highlighter from "@/components/ui/highlighter"

export const metadata = {
  title: "Inscription à la Newsletter | États Généraux Communaux",
  description:
    "Inscrivez-vous à notre newsletter pour recevoir les dernières actualités et informations sur les États Généraux Communaux.",
}

export default async function NewsletterPage() {
  const archiveTitles = await getArchivePageTitles()
  const newsletterData = archiveTitles?.page_newsletter

  // Use ACF data or fallback to default values
  const titre = newsletterData?.titre || "Newsletter"
  const sousTitre =
    newsletterData?.["sous-titre"] ||
    "Restez informé des dernières actualités, événements et initiatives des États Généraux Communaux. Inscrivez-vous à notre newsletter pour ne rien manquer."

  const pictos = {
    picto1: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png",
    picto2: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png",
    picto3: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-iph3iRcbh4GzoswUQo87W7giQs9vrW.png",
    picto4: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-ac6W7GEoGBcgE6fyqHJLr2EBOsnw7u.png",
    picto5: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png",
  }

  return (
    <div className="min-h-screen pt-[150px]">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <Image
          src={pictos.picto2 || "/placeholder.svg"}
          alt=""
          width={120}
          height={120}
          className="absolute left-[5%] top-[10%] opacity-20 rotate-12 pointer-events-none"
        />
        <Image
          src={pictos.picto5 || "/placeholder.svg"}
          alt=""
          width={100}
          height={100}
          className="absolute right-[8%] top-[15%] opacity-15 -rotate-6 pointer-events-none"
        />
        <Image
          src={pictos.picto3 || "/placeholder.svg"}
          alt=""
          width={80}
          height={80}
          className="absolute left-[10%] bottom-[20%] opacity-25 rotate-45 pointer-events-none"
        />
        <Image
          src={pictos.picto4 || "/placeholder.svg"}
          alt=""
          width={90}
          height={90}
          className="absolute right-[12%] bottom-[10%] opacity-20 -rotate-12 pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight font-[family-name:var(--font-raleway)]">
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={3}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  {titre}
                </Highlighter>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-medium">
                <Highlighter
                  action="underline"
                  color="#F4E63C"
                  strokeWidth={2}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  {sousTitre}
                </Highlighter>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterForm />

          <div className="mt-12 text-center text-sm text-gray-600">
            <p>
              En vous inscrivant, vous acceptez de recevoir nos communications par email. Vous pouvez vous désinscrire à
              tout moment.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
