import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, Target, Heart, ArrowRight, Mail } from "lucide-react"
import { UnderlinedH1, UnderlinedH2 } from "@/components/ui/underlined-heading"
import Highlighter from "@/components/ui/highlighter" // Import Highlighter component

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-[150px]">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-sm px-4 py-2">
                Notre démarche
              </Badge>
              <UnderlinedH1 className="text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
                Un magazine pour l'action collective
              </UnderlinedH1>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Magazine Collectif est né de la conviction que l'engagement citoyen et l'action collective sont essentiels
              pour construire une société plus juste et durable. Nous créons un espace de réflexion, de partage et
              d'inspiration pour tous ceux qui souhaitent agir.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <UnderlinedH2 className="text-3xl md:text-4xl text-foreground mb-4">Notre mission</UnderlinedH2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trois piliers fondamentaux guident notre action quotidienne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-4">Rassembler</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Créer des ponts entre les initiatives citoyennes, les mouvements sociaux et les individus engagés pour
                  favoriser la collaboration et l'entraide.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-4">Éclairer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Analyser les enjeux contemporains, décrypter les mécanismes de l'action collective et partager les
                  bonnes pratiques pour un engagement efficace.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-4">Inspirer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mettre en lumière les initiatives qui transforment notre société et donner envie d'agir à travers des
                  témoignages authentiques et des récits inspirants.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <UnderlinedH2 className="text-3xl md:text-4xl text-foreground mb-6">Nos valeurs</UnderlinedH2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Notre approche éditoriale s'appuie sur des valeurs fortes qui guident chacune de nos publications et
                  orientent notre vision de l'engagement collectif.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-black text-foreground mb-2">Indépendance éditoriale</h3>
                    <p className="text-muted-foreground">
                      Nous maintenons une ligne éditoriale libre et indépendante, sans influence de partis politiques ou
                      d'intérêts économiques particuliers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-black text-foreground mb-2">Diversité des voix</h3>
                    <p className="text-muted-foreground">
                      Nous donnons la parole à une pluralité d'acteurs : citoyens, associations, chercheurs, militants,
                      pour refléter la richesse des engagements.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-accent rounded-full mt-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-black text-foreground mb-2">Accessibilité</h3>
                    <p className="text-muted-foreground">
                      Nos contenus sont conçus pour être accessibles au plus grand nombre, avec un langage clair et des
                      ressources pratiques pour passer à l'action.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-black text-foreground mb-2">Constructivité</h3>
                    <p className="text-muted-foreground">
                      Au-delà de l'analyse critique, nous privilégions les approches constructives et les solutions
                      concrètes pour transformer les défis en opportunités d'action.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">Ensemble</h3>
                  <p className="text-muted-foreground">
                    {"L'action collective commence par la rencontre et le partage d'expériences"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <UnderlinedH2 className="text-3xl md:text-4xl text-foreground mb-4">Notre équipe</UnderlinedH2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une équipe passionnée et engagée, issue de différents horizons professionnels et militants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary">MR</span>
                </div>
                <h3 className="font-black text-foreground mb-2">Marie Rousseau</h3>
                <p className="text-sm text-muted-foreground mb-3">Rédactrice en chef</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Journaliste spécialisée dans les questions sociales et environnementales, ancienne correspondante pour
                  plusieurs médias associatifs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-secondary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-secondary">AD</span>
                </div>
                <h3 className="font-black text-foreground mb-2">Antoine Dubois</h3>
                <p className="text-sm text-muted-foreground mb-3">Responsable éditorial</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sociologue de formation, spécialiste des mouvements sociaux contemporains et des nouvelles formes
                  d'engagement citoyen.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-accent">CL</span>
                </div>
                <h3 className="font-black text-foreground mb-2">Clara Lefebvre</h3>
                <p className="text-sm text-muted-foreground mb-3">Coordinatrice communauté</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Experte en communication digitale et animation de communautés, elle facilite les échanges entre nos
                  lecteurs et contributeurs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <UnderlinedH2 className="text-3xl md:text-4xl text-foreground mb-4">Notre histoire</UnderlinedH2>
            <p className="text-lg text-muted-foreground">{"L'aventure Magazine Collectif a commencé en 2023"}</p>
          </div>

          <div className="space-y-8">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="text-xs px-3 py-1">
                    2023
                  </Badge>
                  <div className="flex-1">
                    <h3 className="font-black text-foreground mb-2">Naissance du projet</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Face au besoin croissant d'espaces de réflexion sur l'engagement citoyen, nous avons lancé
                      Magazine Collectif avec l'ambition de créer un média indépendant dédié à l'action collective.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="text-xs px-3 py-1">
                    2024
                  </Badge>
                  <div className="flex-1">
                    <h3 className="font-black text-foreground mb-2">Développement de la communauté</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Grâce à nos premiers articles et ressources, nous avons rassemblé une communauté de lecteurs
                      engagés. Lancement de notre section ressources et de nos premiers partenariats avec des
                      associations locales.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="text-xs px-3 py-1">
                    2025
                  </Badge>
                  <div className="flex-1">
                    <h3 className="font-black text-foreground mb-2">Expansion et nouveaux projets</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Lancement de notre nouvelle plateforme numérique et développement de nouveaux formats : podcasts,
                      webinaires et ateliers pratiques pour accompagner concrètement l'engagement citoyen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div>
              <UnderlinedH2 className="text-3xl md:text-4xl text-foreground mb-4">Rejoignez-nous</UnderlinedH2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Vous partagez nos valeurs ? Vous souhaitez contribuer ou simplement échanger avec notre équipe ? Nous
                serions ravis de vous rencontrer.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="mailto:contact@magazine-collectif.fr" className="flex items-center gap-2">
                  <Highlighter
                    action="highlight"
                    color="#60A847"
                    strokeWidth={2}
                    animationDuration={600}
                    iterations={1}
                    padding={4}
                    isView={true}
                  >
                    <Mail className="h-4 w-4" />
                    Nous contacter
                  </Highlighter>
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/blog" className="flex items-center gap-2">
                  <Highlighter
                    action="highlight"
                    color="#94BF7E"
                    strokeWidth={2}
                    animationDuration={600}
                    iterations={1}
                    padding={4}
                    isView={true}
                  >
                    Découvrir nos articles
                    <ArrowRight className="h-4 w-4" />
                  </Highlighter>
                </Link>
              </Button>
            </div>

            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Magazine Collectif - Un média indépendant pour l'action collective
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export const metadata = {
  title: "À propos - Magazine Collectif",
  description:
    "Découvrez la mission, les valeurs et l'équipe de Magazine Collectif, un média indépendant dédié à l'engagement citoyen et à l'action collective.",
}
