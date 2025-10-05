import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Users, MapPin, Calendar, FileText, Target, Heart } from "lucide-react"
import { getPageBySlug } from "@/lib/wordpress"

export const metadata = {
  title: "Les États Généraux Communaux - EGC",
  description:
    "Découvrez les États Généraux Communaux : une initiative citoyenne pour construire ensemble l'avenir de nos communes et d'une République plus juste, écologique et démocratique.",
}

interface EGCPageData {
  acf: {
    hero_section: {
      badge: string
      title: string
      subtitle: string
      description: string
    }
    what_section: {
      title: string
      content: string
      image: {
        url: string
        alt: string
      }
    }
    who_section: {
      title: string
      content: string
      image: {
        url: string
        alt: string
      }
    }
    context_section: {
      title: string
      subtitle: string
      election_title: string
      election_content: string
      highlight: string
    }
    why_commune_section: {
      title: string
      cards: Array<{
        icon: string
        title: string
        content: string
      }>
    }
    how_to_act_section: {
      title: string
      subtitle: string
      action_points: Array<{
        icon: string
        title: string
        content: string
      }>
      highlight: string
      image: {
        url: string
        alt: string
      }
    }
    doleances_section: {
      title: string
      subtitle: string
      content: string
      highlight: string
    }
    who_can_organize_section: {
      title: string
      actor_cards: Array<{
        icon: string
        title: string
        description: string
      }>
      condition_title: string
      condition_content: string
    }
    after_elections_section: {
      title: string
      scenario_adopted_title: string
      scenario_adopted_content: string
      scenario_not_adopted_title: string
      scenario_not_adopted_content: string
    }
    link_egc_acc_section: {
      title: string
      content: string
      highlight: string
    }
    help_section: {
      title: string
      content: string
      website_url: string
      website_text: string
      phone: string
      phone_text: string
    }
    cta_section: {
      title: string
      description: string
      buttons: Array<{
        text: string
        url: string
        style: string
      }>
    }
  }
}

function getIconComponent(iconName: string) {
  const icons: { [key: string]: any } = {
    MapPin,
    Heart,
    Users,
    Target,
    FileText,
    Calendar,
  }
  return icons[iconName] || Users
}

export default async function LesEGCPage() {
  const pageData = (await getPageBySlug("les-egc")) as EGCPageData

  if (!pageData?.acf) {
    return <div>Page non trouvée</div>
  }

  const { acf } = pageData

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="mb-4">
                {acf.hero_section?.badge || "États Généraux Communaux"}
              </Badge>
              <h1 className="magazine-title text-4xl md:text-6xl lg:text-7xl font-light text-foreground">
                {acf.hero_section?.title || "Les États Généraux Communaux"}
              </h1>
              <p className="magazine-subtitle text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                {acf.hero_section?.subtitle || "Une initiative citoyenne pour l'avenir de nos communes"}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {acf.hero_section?.description ||
                  "Construisons ensemble une République plus juste, écologique et démocratique"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What are EGC Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                {acf.what_section?.title || "C'est quoi les EGC ?"}
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: acf.what_section?.content || "" }} />
              </div>
            </div>
            <div className="relative">
              <Image
                src={
                  acf.what_section?.image?.url ||
                  "/placeholder.svg?height=400&width=600&query=assemblée citoyenne village français démocratie participative" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={acf.what_section?.image?.alt || "Assemblée citoyenne"}
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <Image
                src={
                  acf.who_section?.image?.url ||
                  "/placeholder.svg?height=400&width=600&query=citoyens français engagement collectif associations" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={acf.who_section?.image?.alt || "Citoyens engagés"}
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                {acf.who_section?.title || "C'est qui les EGC ?"}
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: acf.who_section?.content || "" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Context Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {acf.context_section?.title || "Le contexte"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {acf.context_section?.subtitle || "Les prochaines élections municipales"}
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <Calendar className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {acf.context_section?.election_title || "Élections municipales 2026"}
                  </h3>
                  <div className="text-muted-foreground leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: acf.context_section?.election_content || "" }} />
                  </div>
                </div>
              </div>
              <div className="bg-primary/5 p-6 rounded-lg">
                <p className="text-foreground font-medium">{acf.context_section?.highlight || ""}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why the commune Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {acf.why_commune_section?.title || "Pourquoi la commune ?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(acf.why_commune_section?.cards || []).map((card, index) => {
              const IconComponent = getIconComponent(card.icon)
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                    <p className="text-muted-foreground">{card.content}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How to act Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {acf.how_to_act_section?.title || "Comment agir ?"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {acf.how_to_act_section?.subtitle || "En organisant une Assemblée Citoyenne Communale"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {(acf.how_to_act_section?.action_points || []).map((objective, index) => {
                const IconComponent = getIconComponent(objective.icon)
                return (
                  <div key={index} className="flex items-start gap-4">
                    <IconComponent className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{objective.title}</h3>
                      <p className="text-muted-foreground">{objective.content}</p>
                    </div>
                  </div>
                )
              })}

              <div className="bg-secondary/10 p-6 rounded-lg">
                <p className="text-foreground font-medium">{acf.how_to_act_section?.highlight || ""}</p>
              </div>
            </div>

            <div className="relative">
              <Image
                src={
                  acf.how_to_act_section?.image?.url ||
                  "/placeholder.svg?height=400&width=600&query=assemblée citoyenne communale débat démocratique local" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={acf.how_to_act_section?.image?.alt || "Assemblée citoyenne communale"}
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cahiers de doléances Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {acf.doleances_section?.title || "Les cahiers de doléances"}
            </h2>
            <p className="text-lg text-muted-foreground">{acf.doleances_section?.subtitle || "Un trésor national"}</p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-lg text-muted-foreground leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: acf.doleances_section?.content || "" }} />
                </div>
                <div className="bg-primary/5 p-6 rounded-lg">
                  <p className="text-foreground font-medium">{acf.doleances_section?.highlight || ""}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Who can organize Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {acf.who_can_organize_section?.title || "Qui peut organiser une ACC ?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(acf.who_can_organize_section?.actor_cards || []).map((card, index) => {
              const IconComponent = getIconComponent(card.icon)
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <IconComponent className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="mt-12 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">
                  {acf.who_can_organize_section?.condition_title || "Condition sine qua non"}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {acf.who_can_organize_section?.condition_content || ""}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* After elections Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {acf.after_elections_section?.title || "Et après les élections municipales ?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold">
                    {acf.after_elections_section?.scenario_adopted_title || "Si le manifeste est adopté"}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {acf.after_elections_section?.scenario_adopted_content || ""}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">?</span>
                  </div>
                  <h3 className="text-xl font-semibold">
                    {acf.after_elections_section?.scenario_not_adopted_title || "Si le manifeste n'est pas adopté"}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {acf.after_elections_section?.scenario_not_adopted_content || ""}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Link EGC and ACC Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {acf.link_egc_acc_section?.title || "Le lien entre EGC et ACC"}
            </h2>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-lg text-muted-foreground leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: acf.link_egc_acc_section?.content || "" }} />
                </div>
                <div className="bg-primary/5 p-6 rounded-lg">
                  <p className="text-foreground font-medium text-center">{acf.link_egc_acc_section?.highlight || ""}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to get help Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {acf.help_section?.title || "Comment se faire aider ?"}
            </h2>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-lg text-muted-foreground leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: acf.help_section?.content || "" }} />
                </div>

                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-4 text-center">Informations et contact</h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button asChild>
                      <Link href={acf.help_section?.website_url || "#"} target="_blank" rel="noopener noreferrer">
                        {acf.help_section?.website_text || "Visiter le site"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline">
                      <Link href={`tel:${acf.help_section?.phone || ""}`}>
                        {acf.help_section?.phone_text || "Nous appeler"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              {acf.cta_section?.title || "Rejoignez le mouvement des EGC"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {acf.cta_section?.description || "L'avenir de nos communes se construit ensemble"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(acf.cta_section?.buttons || []).map((button, index) => (
                <Button key={index} asChild size="lg" variant={button.style === "primary" ? "default" : "outline"}>
                  <Link href={button.url || "#"}>{button.text}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
