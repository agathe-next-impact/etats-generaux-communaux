import { NewsletterForm } from "./newsletter-form"

export const metadata = {
  title: "Inscription à la Newsletter | États Généraux Communaux",
  description:
    "Inscrivez-vous à notre newsletter pour recevoir les dernières actualités et informations sur les États Généraux Communaux.",
}

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F4E63C]/10">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 font-[family-name:var(--font-raleway)]">
            <span className="relative inline-block">
              <span className="relative z-10">Newsletter</span>
              <span
                className="absolute inset-0 -inset-x-4 -inset-y-2 bg-[#F4E63C] opacity-60 -z-10"
                style={{
                  clipPath:
                    "polygon(2% 5%, 5% 3%, 8% 6%, 12% 2%, 15% 7%, 18% 4%, 22% 8%, 25% 3%, 28% 6%, 32% 4%, 35% 8%, 38% 5%, 42% 9%, 45% 4%, 48% 7%, 52% 3%, 55% 8%, 58% 5%, 62% 9%, 65% 4%, 68% 7%, 72% 3%, 75% 8%, 78% 5%, 82% 9%, 85% 4%, 88% 7%, 92% 3%, 95% 6%, 98% 4%, 100% 7%, 100% 93%, 98% 96%, 95% 94%, 92% 97%, 88% 93%, 85% 96%, 82% 91%, 78% 95%, 75% 92%, 72% 97%, 68% 93%, 65% 96%, 62% 91%, 58% 95%, 55% 92%, 52% 97%, 48% 93%, 45% 96%, 42% 91%, 38% 95%, 35% 92%, 32% 96%, 28% 94%, 25% 97%, 22% 84%, 18% 96%, 15% 93%, 12% 98%, 8% 94%, 5% 97%, 2% 95%, 0% 93%)",
                }}
              />
            </span>
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Restez informé des dernières actualités, événements et initiatives des États Généraux Communaux.
            Inscrivez-vous à notre newsletter pour ne rien manquer.
          </p>
        </div>

        <NewsletterForm />

        <div className="mt-12 text-center text-sm text-gray-600">
          <p>
            En vous inscrivant, vous acceptez de recevoir nos communications par email. Vous pouvez vous désinscrire à
            tout moment.
          </p>
        </div>
      </div>
    </div>
  )
}
