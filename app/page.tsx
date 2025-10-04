import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EventCard } from "@/components/event-card"
import { ResourceCard } from "@/components/resource-card"
import { getPosts, getResources, getEvents, formatDate, stripHtml } from "@/lib/wordpress"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

async function LatestArticles() {
  const { posts } = await getPosts({ per_page: 3, orderby: "date", order: "desc" })

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun article disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[600px]">
      {/* Left column - Featured article (full height) */}
      <div className="h-full">
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
          <Link href={`/blog/${posts[0].slug}`} className="flex flex-col h-full">
            <div className="relative h-80 overflow-hidden flex-shrink-0">
              {posts[0]._embedded?.["wp:featuredmedia"]?.[0] ? (
                <Image
                  src={posts[0]._embedded["wp:featuredmedia"][0].source_url || "/placeholder.svg"}
                  alt={posts[0]._embedded["wp:featuredmedia"][0].alt_text || posts[0].title.rendered}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Pas d'image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Categories overlay */}
              {posts[0]._embedded?.["wp:term"]?.[0]?.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {posts[0]._embedded["wp:term"][0].slice(0, 2).map((category) => (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="bg-primary/90 text-primary-foreground hover:bg-primary"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <CardContent className="p-8 flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <time dateTime={posts[0].date}>{formatDate(posts[0].date)}</time>
                  {posts[0]._embedded?.author?.[0] && (
                    <>
                      <span>•</span>
                      <span>{posts[0]._embedded.author[0].name}</span>
                    </>
                  )}
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold leading-tight group-hover:text-primary transition-colors">
                  {posts[0].title.rendered}
                </h3>

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {stripHtml(posts[0].excerpt.rendered).substring(0, 200)}...
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Right column - Two smaller articles stacked with equal heights */}
      <div className="flex flex-col gap-6 h-full">
        {posts.slice(1, 3).map((post) => (
          <div key={post.id} className="flex-1">
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                <div className="relative h-32 overflow-hidden flex-shrink-0">
                  {post._embedded?.["wp:featuredmedia"]?.[0] ? (
                    <Image
                      src={post._embedded["wp:featuredmedia"][0].source_url || "/placeholder.svg"}
                      alt={post._embedded["wp:featuredmedia"][0].alt_text || post.title.rendered}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Pas d'image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Categories overlay */}
                  {post._embedded?.["wp:term"]?.[0]?.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {post._embedded["wp:term"][0].slice(0, 1).map((category) => (
                        <Badge
                          key={category.id}
                          variant="secondary"
                          className="bg-primary/90 text-primary-foreground hover:bg-primary text-xs"
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      {post._embedded?.author?.[0] && (
                        <>
                          <span>•</span>
                          <span>{post._embedded.author[0].name}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {post.title.rendered}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {stripHtml(post.excerpt.rendered).substring(0, 120)}...
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

async function UpcomingEvents() {
  const events = await getEvents()

  // Filter for upcoming events (events with future dates)
  const upcomingEvents = events
    .filter((event) => {
      if (!event.acf?.date) return false

      // Parse the date from ACF (d/m/Y format)
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
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Événements à venir</h2>
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

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="magazine-title text-4xl md:text-6xl lg:text-7xl font-light text-foreground">
                Les Etats Généraux Communaux
              </h1>
              <p className="magazine-subtitle text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Engagement • Action Collective • Mouvement
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Un espace dédié à l'engagement citoyen, aux initiatives collectives et aux mouvements qui transforment
                notre société. Découvrez des analyses, des témoignages et des ressources pour agir ensemble.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base">
                <Link href="/blog">
                  Découvrir les articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base bg-transparent">
                <Link href="/a-propos">En savoir plus</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Derniers articles</h2>
              <p className="text-muted-foreground text-lg">
                Les dernières réflexions et analyses sur l'engagement collectif
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/blog">
                Voir tous les articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[600px]">
                {/* Left column - Featured article (full height) */}
                <div className="h-full">
                  <Card className="animate-pulse">
                    <div className="bg-muted h-80" />
                  </Card>
                </div>

                {/* Right column - Two smaller articles stacked with equal heights */}
                <div className="flex flex-col gap-6 h-full">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex-1">
                      <Card className="animate-pulse">
                        <div className="bg-muted h-32" />
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <LatestArticles />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={null}>
        <UpcomingEvents />
      </Suspense>

      {/* Resources Preview Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Ressources utiles</h2>
              <p className="text-muted-foreground text-lg">
                Guides, outils et documents pour accompagner votre engagement
              </p>
            </div>
            <Button asChild variant="outline">
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
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">Rejoignez le mouvement</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              L'engagement collectif commence par des actions individuelles. Découvrez comment vous pouvez contribuer au
              changement et rejoindre une communauté engagée pour un avenir meilleur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/blog">Lire nos articles</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/a-propos">Notre démarche</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
