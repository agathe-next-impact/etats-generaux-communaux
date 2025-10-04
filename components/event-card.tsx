import { Calendar, Clock, MapPin, ExternalLink, Play } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { WordPressEvent } from "@/lib/wordpress"

interface EventCardProps {
  event: WordPressEvent
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = event.acf?.date ? parseDate(event.acf.date) : new Date(event.date)
  const isUpcoming = eventDate > new Date()
  const isPast = eventDate < new Date()

  // Parse date from d/m/Y format to Date object
  function parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split("/").map(Number)
    return new Date(year, month - 1, day)
  }

  const getStatusColor = () => {
    if (isPast) return "bg-gray-500"
    if (isUpcoming) return "bg-green-500"
    return "bg-blue-500"
  }

  const getEventTypeFromCategories = () => {
    if (event._embedded?.["wp:term"]?.[0]) {
      return event._embedded["wp:term"][0][0]?.name || "Événement"
    }
    return "Événement"
  }

  const getTypeColor = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("conférence")) return "bg-blue-100 text-blue-800"
    if (lowerType.includes("atelier")) return "bg-green-100 text-green-800"
    if (lowerType.includes("manifestation")) return "bg-red-100 text-red-800"
    if (lowerType.includes("formation")) return "bg-purple-100 text-purple-800"
    if (lowerType.includes("débat")) return "bg-orange-100 text-orange-800"
    return "bg-gray-100 text-gray-800"
  }

  const eventType = getEventTypeFromCategories()

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link href={`/evenements/${event.slug}`} scroll={true}>
              <CardTitle className="text-xl mb-2 text-balance hover:text-primary transition-colors cursor-pointer">
                {event.title.rendered}
              </CardTitle>
            </Link>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getTypeColor(eventType)}>{eventType}</Badge>
              <Badge className={`text-white ${getStatusColor()}`}>
                {isPast ? "Passé" : isUpcoming ? "À venir" : "En cours"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Time */}
        {event.acf?.date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{event.acf.date}</span>
            {event.acf?.heure && (
              <>
                <Clock className="h-4 w-4 ml-2" />
                <span>{event.acf.heure}</span>
              </>
            )}
          </div>
        )}

        {/* Location */}
        {event.acf?.lieu && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <div>
              <div className="font-medium">{event.acf.lieu.address}</div>
            </div>
          </div>
        )}

        {/* Description */}
        {event.acf?.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">{event.acf.description}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {event.acf?.lien_vers_levenement_en_ligne && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={event.acf.lien_vers_levenement_en_ligne}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Voir en ligne
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/evenements/${event.slug}`} scroll={true} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Détails
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
