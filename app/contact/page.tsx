import { Highlighter } from "@/components/ui/highlighter"
import { Mail } from "lucide-react"
import { AnimatedContactHero } from "@/components/animated-contact-hero"

export const metadata = {
  title: "Contact",
  description:
    "Contactez Les États Généraux Communaux. Envoyez-nous un email pour toute question ou pour rejoindre le mouvement.",
}

export default function ContactPage() {
  const contactEmail = "lesetatsgenerauxcommunaux@gmail.com"

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 relative overflow-hidden">
      {/* Animated background pictos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/images/design-mode/picto%202.png"
          alt=""
          className="absolute left-[5%] top-[10%] w-16 h-16 object-contain opacity-20 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <img
          src="/images/design-mode/picto%201(1).png"
          alt=""
          className="absolute right-[8%] top-[15%] w-20 h-20 object-contain opacity-15 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <img
          src="/images/design-mode/picto%204.png"
          alt=""
          className="absolute left-[10%] bottom-[20%] w-24 h-24 object-contain opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <img
          src="/images/design-mode/picto%205(1).png"
          alt=""
          className="absolute right-[5%] bottom-[15%] w-16 h-16 object-contain opacity-20 animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <img
          src="/images/design-mode/picto%203.png"
          alt=""
          className="absolute left-[50%] top-[5%] w-12 h-12 object-contain opacity-15 animate-float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Animated Hero Section with Logo */}
        <AnimatedContactHero />

        {/* Contact Information */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-8 font-[family-name:var(--font-raleway)]">
            <Highlighter
              action="underline"
              color="#E73628"
              strokeWidth={4}
              animationDuration={600}
              iterations={1}
              isView={true}
            >
              Contactez-nous
            </Highlighter>
          </h2>

          <div className="max-w-2xl mx-auto">
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Pour toute question, suggestion ou pour rejoindre le mouvement des États Généraux Communaux, n'hésitez pas
              à nous écrire.
            </p>

            {/* Email Display */}
            <div className="bg-white border-4 border-[#4AAD33] rounded-lg p-8 shadow-lg relative overflow-hidden">
              {/* Decorative corner picto */}
              <div className="absolute -top-4 -right-4 z-10">
                <img src="/images/design-mode/picto%201(1).png" alt="" className="w-16 h-16 object-contain" />
              </div>

              <div className="flex items-center justify-center gap-4 mb-4">
                <Mail className="w-8 h-8 text-[#E73628]" />
                <h3 className="text-2xl font-bold uppercase font-[family-name:var(--font-raleway)]">Email</h3>
              </div>

              <a
                href={`mailto:${contactEmail}`}
                className="text-xl md:text-2xl font-semibold text-[#4AAD33] hover:text-[#E73628] transition-colors duration-300 break-all"
              >
                {contactEmail}
              </a>

              <p className="mt-6 text-sm text-muted-foreground">
                Cliquez sur l'adresse email pour nous envoyer un message directement depuis votre client de messagerie.
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-[#FFF9E6] border-2 border-[#FFD700] rounded-lg p-6">
                <img src="/images/design-mode/picto%202.png" alt="" className="w-12 h-12 object-contain mx-auto mb-4" />
                <h4 className="font-bold text-lg mb-2 uppercase font-[family-name:var(--font-raleway)]">
                  Rejoignez-nous
                </h4>
                <p className="text-sm text-muted-foreground">
                  Créez vos Etats Généraux Communaux et vos Assemblées citoyennes communales dans votre territoire.
                </p>
              </div>

              <div className="bg-[#FFE6E6] border-2 border-[#E73628] rounded-lg p-6">
                <img src="/images/design-mode/picto%204.png" alt="" className="w-12 h-12 object-contain mx-auto mb-4" />
                <h4 className="font-bold text-lg mb-2 uppercase font-[family-name:var(--font-raleway)]">
                  Posez vos questions
                </h4>
                <p className="text-sm text-muted-foreground">
                  Nous sommes là pour répondre à toutes vos interrogations sur notre mouvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
