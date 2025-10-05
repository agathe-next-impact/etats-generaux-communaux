import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EventCard } from "@/components/event-card"
import { ArticlesCarousel } from "@/components/articles-carousel"
import { MiniEventTimeline } from "@/components/mini-event-timeline"
import { EventsCarousel } from "@/components/events-carousel"
import { GoogleMap } from "@/components/google-map"
import { LatestNews } from "@/components/latest-news"
import { getPosts, getEvents, getLocalGroups, getHomePageData } from "@/lib/wordpress"
import type { HomePageACF } from "@/lib/wordpress"
import Link from "next/link"
import { ArrowRight, Users } from "lucide-react"
import Image from "next/image"

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
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Événements à venir</h2>
            <p className="text-muted-foreground text-lg">Les prochains rendez-vous pour s'engager ensemble</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/evenements">
              Tous les événements
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
  const events = await getEvents()

  const pastEvents = events
    .filter((event) => {
      if (!event.acf?.date) return false

      const [day, month, year] = event.acf.date.split("/")
      const eventDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return eventDate < today
    })
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.acf.date.split("/")
      const [dayB, monthB, yearB] = b.acf.date.split("/")
      const dateA = new Date(Number.parseInt(yearA), Number.parseInt(monthA) - 1, Number.parseInt(dayA))
      const dateB = new Date(Number.parseInt(yearB), Number.parseInt(monthB) - 1, Number.parseInt(dayB))
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 4)

  if (posts.length === 0 && pastEvents.length === 0) {
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
                  <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-foreground mb-2">
                    <span className="bg-[#E73628] text-white px-4 py-2">{acfData.titre_actus}</span>
                  </h2>
                )}
                {acfData?.soustitre_actus && <p className="text-muted-foreground">{acfData.soustitre_actus}</p>}
              </div>
              <ArticlesCarousel posts={posts} />
            </div>
          )}

          {/* Right Column - Events Timeline */}
          {pastEvents.length > 0 && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  {acfData?.titre_evenements && (
                    <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-foreground mb-2">
                      <span className="bg-[#E73628] text-white px-4 py-2">{acfData.titre_evenements}</span>
                    </h2>
                  )}
                  {acfData?.soustitre_evenements && (
                    <p className="text-muted-foreground">{acfData.soustitre_evenements}</p>
                  )}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/evenements">
                    Tous
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
              <MiniEventTimeline events={pastEvents} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

async function MapAndEventsSection({ acfData }: { acfData?: HomePageACF["section_groupes_evenements"] }) {
  const groups = await getLocalGroups()
  const events = await getEvents()

  const recentEvents = events
    .sort((a, b) => {
      if (!a.acf?.date || !b.acf?.date) return 0

      const [dayA, monthA, yearA] = a.acf.date.split("/")
      const [dayB, monthB, yearB] = b.acf.date.split("/")
      const dateA = new Date(Number.parseInt(yearA), Number.parseInt(monthA) - 1, Number.parseInt(dayA))
      const dateB = new Date(Number.parseInt(yearB), Number.parseInt(monthB) - 1, Number.parseInt(dayB))
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 5)

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Map (2/3) */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              {acfData?.titre_groupes_locaux && (
                <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-foreground mb-2">
                  <span className="bg-[#4AAD33] text-white px-4 py-2">{acfData.titre_groupes_locaux}</span>
                </h2>
              )}
              {acfData?.soustitre_groupes_locaux && (
                <p className="text-muted-foreground">{acfData.soustitre_groupes_locaux}</p>
              )}
            </div>
            <div className="h-[500px] w-full overflow-hidden border shadow-lg">
              <GoogleMap groups={groups} />
            </div>
            <div className="mt-4 text-center">
              <Button asChild variant="outline">
                <Link href="/groupes-locaux">
                  Voir tous les groupes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Events (1/3) */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              {acfData?.titre_evenements && (
                <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-foreground mb-2">
                  <span className="bg-[#E73628] text-white px-4 py-2">{acfData.titre_evenements}</span>
                </h2>
              )}
              {acfData?.soustitre_evenements && <p className="text-muted-foreground">{acfData.soustitre_evenements}</p>}
            </div>
            <div className="bg-card border p-6 shadow-lg">
              <EventsCarousel events={recentEvents} />
            </div>
            <div className="mt-4 text-center">
              <Button asChild variant="outline" size="sm">
                <Link href="/evenements">
                  Tous les événements
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
    <div className="min-h-screen">
      {/* Hero Section */}
      {acf?.section_hero && (
        <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl uppercase leading-tight text-white inline-block">
                  <span className="bg-[#E73628] px-4 py-2">{acf.section_hero.titre}</span>
                </h1>
                {acf.section_hero["sous-titre"] && (
                  <p className="magazine-subtitle text-sm md:text-base text-foreground/80 max-w-2xl mx-auto font-medium">
                    {acf.section_hero["sous-titre"]}
                  </p>
                )}
              </div>

              {acf.section_hero.chapeau && (
                <div className="max-w-3xl mx-auto">
                  <p className="text-lg md:text-xl text-foreground/90 leading-relaxed font-medium">
                    {acf.section_hero.chapeau}
                  </p>
                </div>
              )}

              {(acf.section_hero.cta_de_gauche?.libelle_de_gauche ||
                acf.section_hero.cta_de_droite?.libelle_de_droite) && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {acf.section_hero.cta_de_gauche?.libelle_de_gauche && (
                    <Button
                      asChild
                      size="lg"
                      className="text-base bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90"
                    >
                      <Link
                        href={acf.section_hero.cta_de_gauche.lien_de_gauche?.url || "#"}
                        target={acf.section_hero.cta_de_gauche.lien_de_gauche?.target || "_self"}
                      >
                        {acf.section_hero.cta_de_gauche.libelle_de_gauche}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {acf.section_hero.cta_de_droite?.libelle_de_droite && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-foreground/20 hover:bg-foreground/5 bg-transparent"
                    >
                      <Link
                        href={acf.section_hero.cta_de_droite.lien_de_droite?.url || "#"}
                        target={acf.section_hero.cta_de_droite.lien_de_droite?.target || "_self"}
                      >
                        {acf.section_hero.cta_de_droite.libelle_de_droite}
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      {acf?.groupe_de_liens?.liste_des_liens && acf.groupe_de_liens.liste_des_liens.length > 0 && (
        <section className="py-12 lg:py-16 border-b border-border bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[50px]">
              {acf.groupe_de_liens.liste_des_liens.map((link, index) => (
                <Link
                  key={index}
                  href={link.lien?.url || "#"}
                  target={link.lien?.target || "_self"}
                  className="group flex items-center transition-all duration-300"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-3xl bg-[#F4E63C] flex items-center justify-center relative">
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
                        <div className="w-3 h-8 bg-[#E73628] rounded-full" />
                        <div className="w-3 h-8 bg-[#E73628] rounded-full" />
                      </div>
                      {link.icone?.url ? (
                        <Image
                          src={link.icone.url || "/placeholder.svg"}
                          alt={link.icone.alt || ""}
                          width={48}
                          height={48}
                          className="mt-4"
                        />
                      ) : (
                        <Users className="w-12 h-12 text-[#E73628] mt-4" />
                      )}
                      <div className="absolute -bottom-2 left-8 w-6 h-6 bg-[#F4E63C] transform rotate-45 rounded-sm" />
                    </div>
                  </div>
                  <div className="bg-[#4AAD33] px-4 py-3 rounded -ml-8 z-10 shadow-lg group-hover:shadow-xl transition-shadow">
                    <span className="text-sm font-bold uppercase text-white whitespace-nowrap">{link.libelle}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest News Section */}
      <Suspense
        fallback={
          <section className="py-16 lg:py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-8 bg-muted rounded w-64 mb-12 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="bg-muted h-48" />
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-muted rounded w-32" />
                        <div className="h-6 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-3/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        }
      >
        <LatestNewsSection />
      </Suspense>

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

      {/* Map and Events Section */}
      <Suspense
        fallback={
          <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 animate-pulse">
                  <div className="h-8 bg-muted rounded w-64 mb-6" />
                  <div className="h-[500px] bg-muted rounded-lg" />
                </div>
                <div className="lg:col-span-1 animate-pulse">
                  <div className="h-8 bg-muted rounded w-48 mb-6" />
                  <div className="h-[500px] bg-muted rounded-lg" />
                </div>
              </div>
            </div>
          </section>
        }
      >
        <MapAndEventsSection acfData={acf?.section_groupes_evenements} />
      </Suspense>

      <Suspense fallback={null}>
        <UpcomingEvents />
      </Suspense>

      {/* Call to Action Section */}
      {acf?.section_manifeste && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              {acf.section_manifeste.titre && (
                <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-white inline-block">
                  <span className="bg-[#E73628] px-4 py-2">{acf.section_manifeste.titre}</span>
                </h2>
              )}
              {acf.section_manifeste.chapeau && (
                <p className="text-lg leading-relaxed font-medium">{acf.section_manifeste.chapeau}</p>
              )}
              {acf.section_manifeste.texte && (
                <div
                  className="leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: acf.section_manifeste.texte }}
                />
              )}
              {(acf.section_manifeste.cta_de_gauche?.libelle_de_gauche ||
                acf.section_manifeste.cta_de_droite?.libelle_de_droite) && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {acf.section_manifeste.cta_de_gauche?.libelle_de_gauche && (
                    <Button asChild size="lg" className="bg-white text-[var(--brand-red)] hover:bg-white/90">
                      <Link
                        href={acf.section_manifeste.cta_de_gauche.lien_de_gauche?.url || "#"}
                        target={acf.section_manifeste.cta_de_gauche.lien_de_gauche?.target || "_self"}
                      >
                        {acf.section_manifeste.cta_de_gauche.libelle_de_gauche}
                      </Link>
                    </Button>
                  )}
                  {acf.section_manifeste.cta_de_droite?.libelle_de_droite && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 bg-transparent"
                    >
                      <Link
                        href={acf.section_manifeste.cta_de_droite.lien_de_droite?.url || "#"}
                        target={acf.section_manifeste.cta_de_droite.lien_de_droite?.target || "_self"}
                      >
                        {acf.section_manifeste.cta_de_droite.libelle_de_droite}
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
