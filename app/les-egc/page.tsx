import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Users, MapPin, Calendar, FileText, Target, Heart } from "lucide-react"
import { getPageBySlug } from "@/lib/wordpress"
import Highlighter from "@/components/ui/highlighter"
import type { Metadata } from "next"

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

export async function generateMetadata(): Promise<Metadata> {
  const pageData = (await getPageBySlug("les-egc")) as EGCPageData

  const title = pageData?.acf?.hero_section?.title || "Les États Généraux Communaux"
  const description =
    pageData?.acf?.hero_section?.description ||
    "Construisons ensemble une République plus juste, écologique et démocratique. Découvrez les États Généraux Communaux."

  return {
    title: `${title} | Magazine Collectif`,
    description,
    openGraph: {
      title: `${title} | Magazine Collectif`,
      description,
      type: "website",
    },
  }
}

export default async function LesEGCPage() {
  const pageData = (await getPageBySlug("les-egc")) as EGCPageData

  if (!pageData?.acf) {
    return <div>Page non trouvée</div>
  }

  const { acf } = pageData
  const colors = ["#E73628", "#F4E63C", "#4AAD33"]

  return (
    <div className="min-h-screen pt-[150px]">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="mb-4">
                {acf.hero_section?.badge || "États Généraux Communaux"}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl uppercase text-foreground leading-tight font-black">
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={3}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  {acf.hero_section?.title || "Les États Généraux Communaux"}
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
                  {acf.hero_section?.subtitle || "Une initiative citoyenne pour l'avenir de nos communes"}
                </Highlighter>
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
              <h2 className="text-3xl md:text-4xl uppercase text-foreground font-black">
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={3}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  {acf.what_section?.title || "C'est quoi les EGC ?"}
                </Highlighter>
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
                  "/placeholder.svg" ||
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
                  "/placeholder.svg" ||
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
              <h2 className="text-3xl md:text-4xl uppercase text-foreground font-black">
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={3}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  {acf.who_section?.title || "C'est qui les EGC ?"}
                </Highlighter>
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
            <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4 font-black">
              <Highlighter
                action="underline"
                color="#E73628"
                strokeWidth={3}
                animationDuration={600}
                iterations={1}
                isView={true}
              >
                {acf.context_section?.title || "Le contexte"}
              </Highlighter>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {acf.context_section?.subtitle || "Les prochaines élections municipales"}
            </p>
          </div>

          <Card className="max-w-4xl mx-auto border-2" style={{ borderColor: "#E73628" }}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <Calendar className="h-8 w-8 flex-shrink-0 mt-1" style={{ color: "#E73628" }} />
                <div>
                  <h3 className="text-xl font-black mb-2 uppercase">
                    {acf.context_section?.election_title || "Élections municipales 2026"}
                  </h3>
                  <div className="text-muted-foreground leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: acf.context_section?.election_content || "" }} />
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: "#E7362810" }}>
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
            <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4 font-black">
              <Highlighter
                action="underline"
                color="#E73628"
                strokeWidth={3}
                animationDuration={600}
                iterations={1}
                isView={true}
              >
                {acf.why_commune_section?.title || "Pourquoi la commune ?"}
              </Highlighter>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(acf.why_commune_section?.cards || []).map((card, index) => {
              const IconComponent = getIconComponent(card.icon)
              return (
                <Card
                  key={index}
                  className="text-center border-2"
                  style={{ borderColor: colors[index % colors.length] }}
                >
                  <CardContent className="p-6">
                    <IconComponent
                      className="h-12 w-12 mx-auto mb-4"
                      style={{ color: colors[index % colors.length] }}
                    />
                    <h3 className="text-xl font-black mb-3 uppercase">{card.title}</h3>
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
            <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4 font-black">
              <Highlighter
                action="underline"
                color="#E73628"
                strokeWidth={3}
                animationDuration={600}
                iterations={1}
                isView={true}
              >
                {acf.how_to_act_section?.title || "Comment agir ?"}
              </Highlighter>
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
                    <IconComponent
                      className="h-8 w-8 flex-shrink-0 mt-1"
                      style={{ color: colors[index % colors.length] }}
                    />
                    <div>
                      <h3 className="text-xl font-black mb-2 uppercase">{objective.title}</h3>
                      <p className="text-muted-foreground">{objective.content}</p>
                    </div>
                  </div>
                )
              })}

              <div className="p-6 rounded-lg" style={{ backgroundColor: "#4AAD3310" }}>
                <p className="text-foreground font-medium">{acf.how_to_act_section?.highlight || ""}</p>
              </div>
            </div>

            <div className="relative">
              <Image
                src={
                  acf.how_to_act_section?.image?.url ||
                  "/placeholder.svg?height=400&width=600&query=assemblée citoyenne communale débat démocratique local" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
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
            <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4 font-black">
              <Highlighter
                action="underline"
                color="#E73628"
                strokeWidth={3}
                animationDuration={600}
                iterations={1}
                isView={true}
              >
                {acf.doleances_section?.title || "Les cahiers de doléances"}
              </Highlighter>
            </h2>
            <p className="text-lg text-muted-foreground">{acf.doleances_section?.subtitle || "Un trésor national"}</p>
          </div>

          <Card className="max-w-4xl mx-auto border-2" style={{ borderColor: "#F4E63C" }}>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-lg text-muted-foreground leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: acf.doleances_section?.content || "" }} />
                </div>
                <div className="p-6 rounded-lg" style={{ backgroundColor: "#F4E63C10" }}>
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
            <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4 font-black">
              <Highlighter
                action="underline"
                color="#E73628"
                strokeWidth={3}
                animationDuration={600}
                iterations={1}
                isView={true}
              >
                {acf.who_can_organize_section?.title || "Qui peut organiser une ACC ?"}
              </Highlighter>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(acf.who_can_organize_section?.actor_cards || []).map((card, index) => {
              const IconComponent = getIconComponent(card.icon)
              return (
                <Card
                  key={index}
                  className="text-center border-2"
                  style={{ borderColor: colors[index % colors.length] }}
                >
                  <CardContent className="p-6">
                    <IconComponent
                      className="h-10 w-10 mx-auto mb-3"
                      style={{ color: colors[index % colors.length] }}
                    />
                    <h3 className="font-black mb-2 uppercase">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="mt-12 max-w-4xl mx-auto border-2" style={{ borderColor: "#4AAD33" }}>
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-xl font-black mb-4 uppercase">
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
            <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4 font-black">
              <Highlighter
                action="underline"
                color="#E73628"
                strokeWidth={3}
                animationDuration={600}
                iterations={1}
                isView={true}
              >
                {acf.after_elections_section?.title || "Et après les élections municipales ?"}
              </Highlighter>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-2" style={{ borderColor: "#4AAD33" }}>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#4AAD33" }}
                  >
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <h3 className="text-xl font-black uppercase">
                    {acf.after_elections_section?.scenario_adopted_title || "Si le manifeste est adopté"}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {acf.after_elections_section?.scenario_adopted_content || ""}
                </p>
              </CardContent>
            </Card>
            <Card className="border-2" style={{ borderColor: "#F4E63C" }}>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#F4E63C" }}
                  >
                    <span className="text-white font-bold text-sm">?</span>
                  </div>
                  <h3 className="text-xl font-black uppercase">
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
            <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4 font-black">
              <Highlighter
                action="underline"
                color="#E73628"
                strokeWidth={3}
                animationDuration={600}
                iterations={1}
                isView={true}
              >
                {acf.link_egc_acc_section?.title || "Le lien entre EGC et ACC"}
              </Highlighter>
            </h2>
          </div>

          <Card className="max-w-4xl mx-auto border-2" style={{ borderColor: "#E73628" }}>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-lg text-muted-foreground leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: acf.link_egc_acc_section?.content || "" }} />
                </div>
                <div className="p-6 rounded-lg" style={{ backgroundColor: "#E7362810" }}>
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
            <h2 className="text-3xl md:text-4xl uppercase text-foreground mb-4 font-black">
              <Highlighter
                action="underline"
                color="#E73628"
                strokeWidth={3}
                animationDuration={600}
                iterations={1}
                isView={true}
              >
                {acf.help_section?.title || "Comment se faire aider ?"}
              </Highlighter>
            </h2>
          </div>

          <Card className="max-w-4xl mx-auto border-2" style={{ borderColor: "#F4E63C" }}>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-lg text-muted-foreground leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: acf.help_section?.content || "" }} />
                </div>

                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="text-xl font-black mb-4 text-center uppercase">Informations et contact</h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button variant="outline">
                      <Link href={acf.help_section?.website_url || "#"} target="_blank" rel="noopener noreferrer">
                        <Highlighter
                          action="highlight"
                          color="#B4D19F"
                          strokeWidth={4}
                          animationDuration={600}
                          iterations={1}
                          padding={12}
                          isView={true}
                        >
                          {acf.help_section?.website_text || "Visiter le site"}
                        </Highlighter>
                      </Link>
                    </Button>
                    <Button variant="outline">
                      <Link href={`tel:${acf.help_section?.phone || ""}`}>
                        <Highlighter
                          action="highlight"
                          color="#94BF7E"
                          strokeWidth={4}
                          animationDuration={600}
                          iterations={1}
                          padding={12}
                          isView={true}
                        >
                          {acf.help_section?.phone_text || "Nous appeler"}
                        </Highlighter>
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
            <h2 className="text-3xl md:text-4xl uppercase text-foreground font-black">
              <Highlighter
                action="underline"
                color="#E73628"
                strokeWidth={3}
                animationDuration={600}
                iterations={1}
                isView={true}
              >
                {acf.cta_section?.title || "Rejoignez le mouvement des EGC"}
              </Highlighter>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {acf.cta_section?.description || "L'avenir de nos communes se construit ensemble"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(acf.cta_section?.buttons || []).map((button, index) => (
                <Button key={index} variant="outline" size="lg">
                  <Link href={button.url || "#"}>
                    <Highlighter
                      action="highlight"
                      color={index % 2 === 0 ? "#B4D19F" : "#94BF7E"}
                      strokeWidth={4}
                      animationDuration={600}
                      iterations={1}
                      padding={12}
                      isView={true}
                    >
                      {button.text}
                    </Highlighter>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
