import { Calendar, Clock, MapPin, ExternalLink, Play } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { WordPressEvent } from "@/lib/wordpress"
import Image from "next/image"

interface EventCardProps {
  event: WordPressEvent
}

export function EventCard({ event }: EventCardProps) {
  // Parse date from d/m/Y format to Date object
  function parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split("/").map(Number)
    return new Date(year, month - 1, day)
  }

  // Set pivot at the start of today (midnight)
  const now = new Date()
  const todayAtMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayTimestamp = todayAtMidnight.getTime()

  let eventTimestamp: number
  if (event.acf?.date) {
    let eventDate = parseDate(event.acf.date)
    // Set to midnight for date-only comparison
    eventDate.setHours(0, 0, 0, 0)
    eventTimestamp = eventDate.getTime()
  } else {
    // For WordPress date, extract only the date part (at midnight)
    const wpDate = new Date(event.date)
    wpDate.setHours(0, 0, 0, 0)
    eventTimestamp = wpDate.getTime()
  }

  const isUpcoming = eventTimestamp >= todayTimestamp
  const isPast = eventTimestamp < todayTimestamp

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
    if (lowerType.includes("conférence")) return "bg-[#E73628] text-white"
    if (lowerType.includes("atelier")) return "bg-[#4AAD33] text-white"
    if (lowerType.includes("manifestation")) return "bg-[#F4E63C] text-black"
    if (lowerType.includes("formation")) return "bg-[#94BF7E] text-black"
    if (lowerType.includes("débat")) return "bg-[#44843F] text-white"
    return "bg-gray-100 text-gray-800"
  }

  const eventType = getEventTypeFromCategories()

  const pictos = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-iph3iRcbh4GzoswUQo87W7giQs9vrW.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-ac6W7GEoGBcgE6fyqHJLr2EBOsnw7u.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-ortOMnxOuv7texPH3RxLJTGkLhXhuQ.png",
  ]
  const pictoIndex = event.id % pictos.length
  const pictoUrl = pictos[pictoIndex]

  return (
    <Card className="w-full hover:shadow-lg transition-shadow border border-[#E73628] relative overflow-visible">
      <Image
        src={pictoUrl || "/placeholder.svg"}
        alt=""
        width={48}
        height={48}
        className="absolute -top-3 -right-3 z-10 opacity-80"
      />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link href={`/evenements/${event.slug}`} scroll={true}>
              <CardTitle
                className="text-xl mb-2 text-balance hover:text-[#E73628] transition-colors cursor-pointer font-black uppercase"
                style={{ fontFamily: "Raleway, sans-serif" }}
              >
                {event.title.rendered}
              </CardTitle>
            </Link>
            <div className="flex flex-wrap gap-2 mb-3">
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
        <div className="flex flex-col items-start gap-6">
          {event.acf?.lien_vers_levenement_en_ligne && (
            <Button size="xs" asChild>
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
          <Button size="xs" asChild>
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
