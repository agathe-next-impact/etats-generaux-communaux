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
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
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
