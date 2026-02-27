"use client"

import type { WordPressEvent } from "@/lib/wordpress"
import { EventCard } from "./event-card"

interface EventTimelineProps {
  events: WordPressEvent[]
}

export function EventTimeline({ events }: EventTimelineProps) {
  // Group events by month/year preserving order from input
  const groups: { title: string; events: WordPressEvent[] }[] = [];
  
  events.forEach((event) => {
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
      // Capitalize first letter (e.g. "février 2026")
      // Note: monthYear from toLocaleDateString might be lowercase in French
      const formattedTitle = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.title === formattedTitle) {
          lastGroup.events.push(event);
      } else {
          groups.push({ title: formattedTitle, events: [event] });
      }
  });

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Aucun événement à venir.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.title} className="relative">
          {/* Timeline Month Header */}
          <div className="sticky top-4 z-10 mb-6">
            <div className="bg-background/80 backdrop-blur-sm px-4 py-2 inline-block">
              <h2 className="text-xl font-semibold capitalize">{group.title}</h2>
              <p className="text-sm text-muted-foreground">
                {group.events.length} événement{group.events.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="relative pl-8">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-yellow-500"></div>

            <div className="space-y-6">
              {group.events.map((event) => (
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
