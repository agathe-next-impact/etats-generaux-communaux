"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import type { WordPressEvent } from "@/lib/wordpress"

interface EventsCarouselProps {
  events: WordPressEvent[]
}

export function EventsCarousel({ events }: EventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length)
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun événement disponible pour le moment.</p>
      </div>
    )
  }

  const currentEvent = events[currentIndex]

  // Parse date from d/m/Y format to Date object
  function parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split("/").map(Number)
    return new Date(year, month - 1, day)
  }

  const eventDate = currentEvent.acf?.date ? parseDate(currentEvent.acf.date) : new Date(currentEvent.date)
  const isUpcoming = eventDate > new Date()

  const getEventTypeFromCategories = () => {
    if (currentEvent._embedded?.["wp:term"]?.[0]) {
      return currentEvent._embedded["wp:term"][0][0]?.name || "Événement"
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
    <div className="relative">
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <Link href={`/evenements/${currentEvent.slug}`}>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={getTypeColor(eventType)}>{eventType}</Badge>
                <Badge className={`text-white ${isUpcoming ? "bg-green-500" : "bg-gray-500"}`}>
                  {isUpcoming ? "À venir" : "Passé"}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {currentEvent.title.rendered}
              </h3>

              {/* Date and Time */}
              {currentEvent.acf?.date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>{currentEvent.acf.date}</span>
                  {currentEvent.acf?.heure && (
                    <>
                      <Clock className="h-4 w-4 ml-2 flex-shrink-0" />
                      <span>{currentEvent.acf.heure}</span>
                    </>
                  )}
                </div>
              )}

              {/* Location */}
              {currentEvent.acf?.lieu && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{currentEvent.acf.lieu.address}</span>
                </div>
              )}

              {/* Description */}
              {currentEvent.acf?.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">{currentEvent.acf.description}</p>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>

      {/* Navigation Controls */}
      {events.length > 1 && (
        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" size="icon" onClick={prevSlide} className="h-10 w-10 bg-transparent">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Aller à l'événement ${index + 1}`}
              />
            ))}
          </div>

          <Button variant="outline" size="icon" onClick={nextSlide} className="h-10 w-10 bg-transparent">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
