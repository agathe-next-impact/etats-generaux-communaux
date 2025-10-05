"use client"

import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import type { WordPressEvent } from "@/lib/wordpress"

interface MiniEventTimelineProps {
  events: WordPressEvent[]
}

export function MiniEventTimeline({ events }: MiniEventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun événement récent.</p>
      </div>
    )
  }

  return (
    <div className="relative pl-6">
      {/* Timeline Line */}
      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border"></div>

      <div className="space-y-6">
        {events.map((event) => {
          let eventDate: Date
          if (event.acf?.date) {
            const [day, month, year] = event.acf.date.split("/").map(Number)
            eventDate = new Date(year, month - 1, day)
          } else {
            eventDate = new Date(event.date)
          }

          const formattedDate = eventDate.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })

          return (
            <div key={event.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-5 top-2 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm"></div>

              {/* Event Content */}
              <Link
                href={`/evenements/${event.slug}`}
                className="block group hover:bg-muted/50 rounded-lg p-3 -ml-3 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={event.acf?.date || event.date}>{formattedDate}</time>
                  </div>

                  <h3 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {event.title.rendered}
                  </h3>

                  {event.acf?.lieu?.address && (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{event.acf.lieu.address}</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
