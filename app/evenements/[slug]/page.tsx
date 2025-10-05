import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getEvent, getEvents, stripHtml } from "@/lib/wordpress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EventCard } from "@/components/event-card"
import { ArrowLeft, MapPin, ExternalLink, Share2, Users } from "lucide-react"
import { Suspense } from "react"

interface EventPageProps {
  params: {
    slug: string
  }
}

async function RelatedEvents({ currentSlug }: { currentSlug: string }) {
  const relatedEvents = await getEvents()
  const filteredEvents = relatedEvents.filter((event) => event.slug !== currentSlug).slice(0, 3)

  if (filteredEvents.length === 0) return null

  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-foreground mb-8">Événements similaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}

function parseEventDate(dateStr: string): Date | null {
  if (!dateStr) return null

  // Handle d/m/Y format from ACF
  const parts = dateStr.split("/")
  if (parts.length === 3) {
    const [day, month, year] = parts
    return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
  }

  // Fallback to standard date parsing
  return new Date(dateStr)
}

function formatEventTime(timeStr: string): string {
  if (!timeStr) return ""

  // Handle g:i a format from ACF (e.g., "2:00 pm")
  return timeStr
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEvent(params.slug)

  if (!event) {
    notFound()
  }

  const eventTitle = event.title?.rendered || "Événement sans titre"
  const eventContent = event.content?.rendered || ""

  const featuredImage = event._embedded?.["wp:featuredmedia"]?.[0]
  const categories = event._embedded?.["wp:term"]?.[0] || []
  const eventDate = parseEventDate(event.acf?.date || "")
  const eventTime = formatEventTime(event.acf?.heure || "")
  const eventLocation = event.acf?.lieu
  const onlineLink = event.acf?.lien_vers_levenement_en_ligne

  // Determine if event is past, present, or future
  const now = new Date()
  const isUpcoming = eventDate && eventDate > now
  const isPast = eventDate && eventDate < now

  return (
    <article className="min-h-screen">
      {/* Event Header */}
      <header className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Back Button */}
            <Button asChild variant="ghost" size="sm" className="mb-4">
              <Link href="/evenements" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux événements
              </Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column - Featured Image */}
              {featuredImage && (
                <div className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={featuredImage.source_url || "/placeholder.svg"}
                    alt={featuredImage.alt_text || eventTitle}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Right Column - Event Info */}
              <div className="space-y-6">
                {/* Event Status & Categories */}
                <div className="flex flex-wrap items-center gap-2">
                  {isUpcoming && (
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      À venir
                    </Badge>
                  )}
                  {isPast && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
                      Passé
                    </Badge>
                  )}
                  {categories.map((category) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                    </Badge>
                  ))}
                </div>

                {/* Event Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight text-balance">
                  {eventTitle}
                </h1>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {onlineLink && (
                    <Button asChild>
                      <a href={onlineLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Rejoindre en ligne
                      </a>
                    </Button>
                  )}

                  {eventLocation && (
                    <Button asChild variant="outline">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Voir sur la carte
                      </a>
                    </Button>
                  )}

                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Détails de l'événement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {eventDate && (
                <div>
                  <strong>Date :</strong>{" "}
                  {eventDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}

              {eventTime && (
                <div>
                  <strong>Heure :</strong> {eventTime}
                </div>
              )}

              {eventLocation && (
                <div className="md:col-span-2">
                  <strong>Lieu :</strong> {eventLocation.address}
                </div>
              )}

              {categories.length > 0 && (
                <div className="md:col-span-2">
                  <strong>Type :</strong>{" "}
                  {categories.map((cat, index) => (
                    <span key={cat.id}>
                      {cat.name}
                      {index < categories.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {eventContent && (
          <div className="prose prose-lg max-w-none article-content prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary">
            <div dangerouslySetInnerHTML={{ __html: eventContent }} className="wordpress-content" />
          </div>
        )}
      </div>

      {/* Related Events */}
      <Suspense
        fallback={
          <section className="py-12 border-t border-border">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-black text-foreground mb-8">Événements similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted" />
                    <CardContent className="p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-6 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        }
      >
        <RelatedEvents currentSlug={params.slug} />
      </Suspense>
    </article>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: EventPageProps) {
  const event = await getEvent(params.slug)

  if (!event) {
    return {
      title: "Événement non trouvé",
    }
  }

  const eventDate = parseEventDate(event.acf?.date || "")

  const eventTitle = event.title?.rendered || "Événement"
  const eventExcerpt = event.excerpt?.rendered ? stripHtml(event.excerpt.rendered) : ""

  const description =
    event.acf?.description || (eventExcerpt ? eventExcerpt.substring(0, 160) : `Découvrez ${eventTitle}`)

  return {
    title: `${eventTitle} | Magazine Collectif`,
    description,
    openGraph: {
      title: eventTitle,
      description,
      type: "article",
      publishedTime: event.date,
      ...(eventDate && { modifiedTime: eventDate.toISOString() }),
    },
  }
}
