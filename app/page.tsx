import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EventCard } from "@/components/event-card"
import { ResourceCard } from "@/components/resource-card"
import { ArticlesCarousel } from "@/components/articles-carousel"
import { MiniEventTimeline } from "@/components/mini-event-timeline"
import { EventsCarousel } from "@/components/events-carousel"
import { GoogleMap } from "@/components/google-map"
import { getPosts, getResources, getEvents, getLocalGroups } from "@/lib/wordpress"
import Link from "next/link"
import { ArrowRight, Users, BookOpen, MapPin, FileText, Mail } from "lucide-react"

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

async function FeaturedResources() {
  const resources = await getResources()
  const featuredResources = resources.slice(0, 3)

  if (featuredResources.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune ressource disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredResources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  )
}

async function ArticlesAndEvents() {
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
      // Sort by date descending (most recent first)
      const [dayA, monthA, yearA] = a.acf.date.split("/")
      const [dayB, monthB, yearB] = b.acf.date.split("/")
      const dateA = new Date(Number.parseInt(yearA), Number.parseInt(monthA) - 1, Number.parseInt(dayA))
      const dateB = new Date(Number.parseInt(yearB), Number.parseInt(monthB) - 1, Number.parseInt(dayB))
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 4) // Increased limit from 2 to 4 past events

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: "#4AAD33" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Articles Carousel */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-foreground mb-2">
                <span className="bg-[#E73628] text-white px-4 py-2">DERNIERS</span>
                <span> articles</span>
              </h2>
              <p className="text-muted-foreground">Les dernières réflexions et analyses</p>
            </div>
            <ArticlesCarousel posts={posts} />
          </div>

          {/* Right Column - Events Timeline */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-foreground mb-2">
                  <span className="bg-[#E73628] text-white px-4 py-2">DERNIERS</span>
                  <span> événements</span>
                </h2>
                <p className="text-muted-foreground">Les événements récents</p>
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
        </div>
      </div>
    </section>
  )
}

async function MapAndEventsSection() {
  const groups = await getLocalGroups()
  const events = await getEvents()

  const recentEvents = events
    .sort((a, b) => {
      // Sort by date descending (most recent first)
      if (!a.acf?.date || !b.acf?.date) return 0

      const [dayA, monthA, yearA] = a.acf.date.split("/")
      const [dayB, monthB, yearB] = b.acf.date.split("/")
      const dateA = new Date(Number.parseInt(yearA), Number.parseInt(monthA) - 1, Number.parseInt(dayA))
      const dateB = new Date(Number.parseInt(yearB), Number.parseInt(monthB) - 1, Number.parseInt(dayB))
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 5) // Show 5 most recent events

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: "#F4E63C" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Map (2/3) */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-foreground mb-2">
                <span className="bg-[#4AAD33] text-white px-4 py-2">CARTE</span>
                <span> des groupes locaux</span>
              </h2>
              <p className="text-muted-foreground">Trouvez un groupe près de chez vous</p>
            </div>
            <div className="h-[500px] w-full rounded-lg overflow-hidden border shadow-lg">
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
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-foreground mb-2">
                <span className="bg-[#E73628] text-white px-4 py-2">DERNIERS</span>
                <span> événements</span>
              </h2>
              <p className="text-muted-foreground">Les plus récents</p>
            </div>
            <div className="bg-card rounded-lg border p-6 shadow-lg">
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

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden" style={{ backgroundColor: "#4AAD33" }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl uppercase leading-tight text-white inline-block">
                <span className="bg-[#E73628] px-4 py-2">LES</span> <span>Etats Généraux Communaux</span>
              </h1>
              <p className="magazine-subtitle text-sm md:text-base text-foreground/80 max-w-2xl mx-auto font-medium">
                Engagement • Action Collective • Mouvement
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-foreground/90 leading-relaxed font-medium">
                Un espace dédié à l'engagement citoyen, aux initiatives collectives et aux mouvements qui transforment
                notre société. Découvrez des analyses, des témoignages et des ressources pour agir ensemble.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90">
                <Link href="/blog">
                  Découvrir les articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-foreground/20 hover:bg-foreground/5 bg-transparent">
                <Link href="/a-propos">En savoir plus</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 lg:py-16 border-b border-border" style={{ backgroundColor: "#E73628" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[50px]">
            <Link href="/groupes-locaux" className="group flex items-center transition-all duration-300">
              <div className="relative flex-shrink-0">
                {/* Yellow speech bubble */}
                <div className="w-32 h-32 rounded-3xl bg-[#F4E63C] flex items-center justify-center relative">
                  {/* Red exclamation marks */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-3 h-8 bg-[#E73628] rounded-full" />
                    <div className="w-3 h-8 bg-[#E73628] rounded-full" />
                  </div>
                  <Users className="w-12 h-12 text-[#E73628] mt-4" />
                  {/* Speech bubble tail */}
                  <div className="absolute -bottom-2 left-8 w-6 h-6 bg-[#F4E63C] transform rotate-45 rounded-sm" />
                </div>
              </div>
              <div className="bg-[#4AAD33] px-4 py-3 rounded -ml-8 z-10 shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-sm font-bold uppercase text-white whitespace-nowrap">Créer un groupe local</span>
              </div>
            </Link>

            <Link href="/blog" className="group flex items-center transition-all duration-300">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-3xl bg-[#F4E63C] flex items-center justify-center relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-3 h-8 bg-[#E73628] rounded-full" />
                    <div className="w-3 h-8 bg-[#E73628] rounded-full" />
                  </div>
                  <BookOpen className="w-12 h-12 text-[#E73628] mt-4" />
                  <div className="absolute -bottom-2 left-8 w-6 h-6 bg-[#F4E63C] transform rotate-45 rounded-sm" />
                </div>
              </div>
              <div className="bg-[#4AAD33] px-4 py-3 rounded -ml-8 z-10 shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-sm font-bold uppercase text-white whitespace-nowrap">Lire les articles</span>
              </div>
            </Link>

            <Link href="/evenements" className="group flex items-center transition-all duration-300">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-3xl bg-[#F4E63C] flex items-center justify-center relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-3 h-8 bg-[#E73628] rounded-full" />
                    <div className="w-3 h-8 bg-[#E73628] rounded-full" />
                  </div>
                  <MapPin className="w-12 h-12 text-[#E73628] mt-4" />
                  <div className="absolute -bottom-2 left-8 w-6 h-6 bg-[#F4E63C] transform rotate-45 rounded-sm" />
                </div>
              </div>
              <div className="bg-[#4AAD33] px-4 py-3 rounded -ml-8 z-10 shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-sm font-bold uppercase text-white whitespace-nowrap">Voir les événements</span>
              </div>
            </Link>

            <Link href="/ressources" className="group flex items-center transition-all duration-300">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-3xl bg-[#F4E63C] flex items-center justify-center relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-3 h-8 bg-[#E73628] rounded-full" />
                    <div className="w-3 h-8 bg-[#E73628] rounded-full" />
                  </div>
                  <FileText className="w-12 h-12 text-[#E73628] mt-4" />
                  <div className="absolute -bottom-2 left-8 w-6 h-6 bg-[#F4E63C] transform rotate-45 rounded-sm" />
                </div>
              </div>
              <div className="bg-[#4AAD33] px-4 py-3 rounded -ml-8 z-10 shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-sm font-bold uppercase text-white whitespace-nowrap">
                  Consulter les ressources
                </span>
              </div>
            </Link>

            <Link href="/contact" className="group flex items-center transition-all duration-300">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-3xl bg-[#F4E63C] flex items-center justify-center relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-3 h-8 bg-[#E73628] rounded-full" />
                    <div className="w-3 h-8 bg-[#E73628] rounded-full" />
                  </div>
                  <Mail className="w-12 h-12 text-[#E73628] mt-4" />
                  <div className="absolute -bottom-2 left-8 w-6 h-6 bg-[#F4E63C] transform rotate-45 rounded-sm" />
                </div>
              </div>
              <div className="bg-[#4AAD33] px-4 py-3 rounded -ml-8 z-10 shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-sm font-bold uppercase text-white whitespace-nowrap">Nous contacter</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Articles and Events Section */}
      <Suspense
        fallback={
          <section className="py-16 lg:py-24 bg-background">
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
        <ArticlesAndEvents />
      </Suspense>

      {/* Map and Events Section */}
      <Suspense
        fallback={
          <section className="py-16 lg:py-24 bg-background">
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
        <MapAndEventsSection />
      </Suspense>

      <Suspense fallback={null}>
        <UpcomingEvents />
      </Suspense>

      {/* Resources Preview Section */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: "var(--brand-green)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase mb-4 text-white">
                <span className="bg-[#E73628] px-4 py-2">RESSOURCES</span>
                <span> utiles</span>
              </h2>
              <p className="text-white/90 text-lg font-medium">
                Guides, outils et documents pour accompagner votre engagement
              </p>
            </div>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              <Link href="/ressources">
                Toutes les ressources
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-muted rounded" />
                          <div className="h-4 bg-muted rounded w-2/3" />
                          <div className="h-6 bg-muted rounded w-16" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <FeaturedResources />
          </Suspense>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: "var(--brand-red)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-white inline-block">
              <span className="bg-[#E73628] px-4 py-2">REJOIGNEZ</span>
              <span> le mouvement</span>
            </h2>
            <p className="text-lg text-white/90 leading-relaxed font-medium">
              L'engagement collectif commence par des actions individuelles. Découvrez comment vous pouvez contribuer au
              changement et rejoindre une communauté engagée pour un avenir meilleur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-[var(--brand-red)] hover:bg-white/90">
                <Link href="/blog">Lire nos articles</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <Link href="/a-propos">Notre démarche</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
