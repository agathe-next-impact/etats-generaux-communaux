"use client"

import type { WordPressEvent } from "@/lib/wordpress"
import { EventCard } from "./event-card"

interface EventTimelineProps {
  events: WordPressEvent[]
}

export function EventTimeline({ events }: EventTimelineProps) {
  // Group events by month/year
  const groupedEvents = events.reduce(
    (groups, event) => {
      let eventDate: Date
      if (event.acf?.date) {
        // Parse date from d/m/Y format
        const [day, month, year] = event.acf.date.split("/").map(Number)
        eventDate = new Date(year, month - 1, day)
      } else {
        eventDate = new Date(event.date)
      }

      const monthYear = eventDate.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
      })

      if (!groups[monthYear]) {
        groups[monthYear] = []
      }
      groups[monthYear].push(event)
      return groups
    },
    {} as Record<string, WordPressEvent[]>,
  )

  // Sort groups by date (most recent first)
  const sortedGroups = Object.entries(groupedEvents).sort(([a], [b]) => {
    const dateA = new Date(a + " 1")
    const dateB = new Date(b + " 1")
    return dateB.getTime() - dateA.getTime()
  })

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Aucun événement trouvé.</p>
        <p className="text-sm text-muted-foreground mt-2">Essayez de modifier vos critères de recherche.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {sortedGroups.map(([monthYear, monthEvents]) => (
        <div key={monthYear} className="relative">
          {/* Timeline Month Header */}
          <div className="sticky top-4 z-10 mb-6">
            <div className="bg-background/80 backdrop-blur-sm px-4 py-2 inline-block">
              <h2 className="text-xl font-semibold capitalize">{monthYear}</h2>
              <p className="text-sm text-muted-foreground">
                {monthEvents.length} événement{monthEvents.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="relative pl-8">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-[1] bg-yellow-500"></div>

            <div className="space-y-6">
              {monthEvents
                .sort((a, b) => {
                  let dateA: Date, dateB: Date

                  if (a.acf?.date) {
                    const [day, month, year] = a.acf.date.split("/").map(Number)
                    dateA = new Date(year, month - 1, day)
                  } else {
                    dateA = new Date(a.date)
                  }

                  if (b.acf?.date) {
                    const [day, month, year] = b.acf.date.split("/").map(Number)
                    dateB = new Date(year, month - 1, day)
                  } else {
                    dateB = new Date(b.date)
                  }

                  return dateB.getTime() - dateA.getTime()
                })
                .map((event, index) => (
                  <div key={event.id} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[21px] top-6 w-3 h-3 bg-red-500 rounded-full border border-background"></div>

                    {/* Event Card */}
                    <div className="ml-4">
                      <EventCard event={event} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
