import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EventCard } from "@/components/event-card"
import { ArticlesCarousel } from "@/components/articles-carousel"
import { LocalGroupCard } from "@/components/local-group-card"
import { GoogleMap } from "@/components/google-map"
import { getPosts, getEvents, getLocalGroups, getHomePageData } from "@/lib/wordpress"
import type { HomePageACF } from "@/lib/wordpress"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Highlighter } from "@/components/ui/highlighter"
import { LatestNews } from "@/components/latest-news"
import { HorizontalTimeline } from "@/components/horizontal-timeline"
import { VerticalTimeline } from "@/components/vertical-timeline"
import { HeroSection } from "@/components/hero-section"
import { ElectionsMunicipalesSection } from "@/components/elections-municipales-section"

async function UpcomingEvents() {
  const events = await getEvents()

  // Filter for upcoming events (events with future dates)
  const upcomingEvents = events
    .filter((event) => {
      if (!event.acf?.date) return false

      const [day, month, year] = event.acf.date.split("/")
      const eventDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return eventDate >= today
    })
    .slice(0, 3) // Limit to 3 upcoming events

  // Don't render the section if no upcoming events
  if (upcomingEvents.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl text-foreground mb-4">
              <Highlighter
                action="underline"
                color="#E73628"
                strokeWidth={3}
                animationDuration={600}
                iterations={1}
                isView={true}
              >
                Événements à venir
              </Highlighter>
            </h2>
            <p className="text-muted-foreground text-lg">Les prochains rendez-vous pour s'engager ensemble</p>
          </div>
          <Button variant="outline">
            <Link href="/evenements">
              <Highlighter
                action="highlight"
                color="#B4D19F"
                strokeWidth={4}
                animationDuration={600}
                iterations={1}
                padding={12}
                isView={true}
              >
                Tous les événements
              </Highlighter>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}

async function ArticlesAndEvents({ acfData }: { acfData?: HomePageACF["section_actus_evenements"] }) {
  const { posts } = await getPosts({ per_page: 3, orderby: "date", order: "desc" })

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Articles Carousel */}
          {posts.length > 0 && (
            <div>
              <div className="mb-6">
                {acfData?.titre_actus && (
                  <h2 className="text-2xl md:text-3xl uppercase text-foreground mb-2">
                    <Highlighter
                      action="underline"
                      color="#E73628"
                      strokeWidth={3}
                      animationDuration={600}
                      iterations={1}
                      isView={true}
                    >
                      {acfData.titre_actus}
                    </Highlighter>
                  </h2>
                )}
                {acfData?.soustitre_actus && <p className="text-muted-foreground">{acfData.soustitre_actus}</p>}
              </div>
              <ArticlesCarousel posts={posts} />
            </div>
          )}

          <div>
            <div className="space-y-6">
              {/* Title */}
              <h2 className="text-2xl md:text-3xl uppercase text-foreground">
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
              </h2>

              {/* YouTube Video Embed */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-border">
                <iframe
                  src="https://www.youtube.com/embed/75DPKvfnGac"
                  title="Les Doléances - Documentaire"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Subtitle */}
              <p className="text-muted-foreground text-lg">
                le documentaire de Hélène Desplanques, reconnu d'utilité publique en 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

async function MapAndEventsSection({ acfData }: { acfData?: HomePageACF["section_groupes_evenements"] }) {
  const groups = await getLocalGroups()

  // Limit to 10 groups
  const displayGroups = groups.slice(0, 10)

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Map (2/3) */}
          <div className="lg:col-span-2">
            <div className="h-[500px] w-full overflow-hidden border shadow-lg">
              <GoogleMap groups={groups} />
            </div>
          </div>

          {/* Right Column - Local Groups (1/3) */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl uppercase text-foreground mb-2">
                <Highlighter
                  action="underline"
                  color="#E73628"
                  strokeWidth={3}
                  animationDuration={600}
                  iterations={1}
                  isView={true}
                >
                  Groupes locaux
                </Highlighter>
              </h2>
              <p className="text-muted-foreground">Rejoignez un collectif près de chez vous</p>
            </div>
            <div className="space-y-4">
              {displayGroups.map((group, index) => (
                <LocalGroupCard key={group.id} group={group} index={index} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                <Link href="/groupes-locaux">
                  <Highlighter
                    action="highlight"
                    color="#94BF7E"
                    strokeWidth={4}
                    animationDuration={600}
                    iterations={1}
                    padding={12}
                    isView={true}
                  >
                    Tous les groupes
                  </Highlighter>
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

async function LatestNewsSection() {
  const { posts } = await getPosts({ per_page: 6, orderby: "date", order: "desc" })

  if (posts.length === 0) {
    return null
  }

  return <LatestNews posts={posts} />
}

export default async function HomePage() {
  const homePageData = await getHomePageData()
  const acf = homePageData?.acf

  console.log("[v0] Homepage ACF data:", acf ? "loaded" : "not found")

  return (
    <div className="min-h-screen pt-[150px]">
      {acf?.section_hero && <HeroSection acf={acf.section_hero} />}
      {/* Section élections municipales sous le hero */}
      {acf?.section_municipales && (
        <Suspense>
          <ElectionsMunicipalesSection acfData={acf.section_municipales} />
        </Suspense>
      )}

      {/* Horizontal Timeline Section */}
      {((acf?.historique?.liste_des_liens && acf.historique.liste_des_liens.length > 0) ||
        (acf?.groupe_de_liens?.liste_des_liens && acf.groupe_de_liens.liste_des_liens.length > 0)) && (
        <HorizontalTimeline
          links={acf?.historique?.liste_des_liens || acf?.groupe_de_liens?.liste_des_liens || []}
          title={acf?.historique?.titre}
          subtitle={acf?.historique?.["sous-titre"]}
        />
      )}

      {/* Call to Action Section - Notre plaidoyer */}
      {acf?.section_manifeste && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              {acf.section_manifeste.titre && (
                <h2 className="text-3xl md:text-4xl uppercase text-foreground">
                  <Highlighter
                    action="underline"
                    color="#E73628"
                    strokeWidth={3}
                    animationDuration={600}
                    iterations={1}
                    isView={true}
                  >
                    {acf.section_manifeste.titre}
                  </Highlighter>
                </h2>
              )}
              {acf.section_manifeste.chapeau && (
                <p className="text-lg leading-relaxed font-medium">{acf.section_manifeste.chapeau}</p>
              )}
              {acf.section_manifeste.texte && (
                <div
                  className="leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: acf.section_manifeste.texte.replace(/\$\{/g, "&#36;{").replace(/\}\}/g, "&#125;}"),
                  }}
                />
              )}
              {(acf.section_manifeste.cta_de_gauche?.libelle_de_gauche ||
                acf.section_manifeste.cta_de_droite?.libelle_de_droite) && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {acf.section_manifeste.cta_de_gauche?.libelle_de_gauche && (
                    <Button size="lg" className="bg-white text-[var(--brand-red)] hover:bg-white/90">
                      <Link
                        href={acf.section_manifeste.cta_de_gauche.lien_de_gauche?.url || "#"}
                        target={acf.section_manifeste.cta_de_gauche.lien_de_gauche?.target || "_self"}
                      >
                        <Highlighter
                          action="highlight"
                          color="#B4D19F"
                          strokeWidth={4}
                          animationDuration={600}
                          iterations={1}
                          padding={12}
                          isView={true}
                        >
                          {acf.section_manifeste.cta_de_gauche.libelle_de_gauche}
                        </Highlighter>
                      </Link>
                    </Button>
                  )}
                  {acf.section_manifeste.cta_de_droite?.libelle_de_droite && (
                    <Button variant="outline" size="lg" className="border-white text-black bg-transparent">
                      <Link
                        href={acf.section_manifeste.cta_de_droite.lien_de_droite?.url || "#"}
                        target={acf.section_manifeste.cta_de_droite.lien_de_droite?.target || "_self"}
                      >
                        <Highlighter
                          action="highlight"
                          color="#94BF7E"
                          strokeWidth={4}
                          animationDuration={600}
                          iterations={1}
                          padding={12}
                          isView={true}
                        >
                          {acf.section_manifeste.cta_de_droite.libelle_de_droite}
                        </Highlighter>
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* EGC Timeline Section */}
      {acf?.historique_egc?.liste_des_liens && acf.historique_egc.liste_des_liens.length > 0 && (
        <VerticalTimeline
          links={acf.historique_egc.liste_des_liens}
          title={acf.historique_egc.titre}
          subtitle={acf.historique_egc["sous-titre"]}
        />
      )}

      {/* Articles and Events Section */}
      <Suspense
        fallback={
          <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-48 mb-6" />
                  <Card>
                    <div className="bg-muted h-64" />
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-muted rounded w-32" />
                        <div className="h-6 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-full" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-48 mb-6" />
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-20 bg-muted rounded" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        }
      >
        <ArticlesAndEvents acfData={acf?.section_actus_evenements} />
      </Suspense>

      <Suspense fallback={null}>
        <UpcomingEvents />
      </Suspense>

      {/* Map and Local Groups Section */}
      <Suspense
        fallback={
          <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 animate-pulse">
                  <div className="h-[500px] bg-muted rounded" />
                </div>
                <div className="lg:col-span-1 animate-pulse">
                  <div className="h-8 bg-muted rounded w-48 mb-6" />
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-20 bg-muted rounded" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        }
      >
        <MapAndEventsSection acfData={acf?.section_groupes_evenements} />
      </Suspense>
    </div>
  )
}
