import { getParticiperPageData } from "@/lib/wordpress"
import { Highlighter } from "@/components/ui/highlighter"
import { ParticiperForm } from "./participer-form"

export const metadata = {
  title: "Participer",
  description:
    "Rejoignez le mouvement des États Généraux de la Conversion. Contactez-nous pour participer à nos actions citoyennes et contribuer à la transition écologique et sociale.",
}

export default async function ParticiperPage() {
  const pageData = await getParticiperPageData()

  const titre = pageData?.acf?.titre || "Participer"
  const chapeau = pageData?.acf?.chapeau || "Rejoignez-nous et participez à nos actions citoyennes."
  const emailDestination = pageData?.acf?.adresse_mail_denvoi_du_formulaire || "contact@example.com"

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png"
          alt=""
          className="absolute left-[5%] top-[10%] w-16 h-16 object-contain opacity-20 rotate-12"
        />
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png"
          alt=""
          className="absolute right-[8%] top-[15%] w-20 h-20 object-contain opacity-15 -rotate-6"
        />
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-ac6W7GEoGBcgE6fyqHJLr2EBOsnw7u.png"
          alt=""
          className="absolute left-[10%] bottom-[20%] w-24 h-24 object-contain opacity-10 rotate-45"
        />
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png"
          alt=""
          className="absolute right-[5%] bottom-[15%] w-16 h-16 object-contain opacity-20 -rotate-12"
        />
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-iph3iRcbh4GzoswUQo87W7giQs9vrW.png"
          alt=""
          className="absolute left-[50%] top-[5%] w-12 h-12 object-contain opacity-15 rotate-90"
        />
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mb-6 font-[family-name:var(--font-raleway)]">
            <Highlighter
              action="underline"
              color="#E73628"
              strokeWidth={4}
              animationDuration={600}
              iterations={1}
              isView={true}
            >
              {titre}
            </Highlighter>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{chapeau}</p>
        </div>

        {/* Contact Form */}
        <ParticiperForm emailDestination={emailDestination} />
      </div>
    </div>
  )
}
