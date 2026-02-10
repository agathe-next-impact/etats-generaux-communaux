"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { type WordPressEvent } from "@/lib/wordpress"
import { EventTimeline } from "@/components/event-timeline"
import { Highlighter } from "@/components/ui/highlighter"
import Image from "next/image"

export default function EventsPage() {
  const [events, setEvents] = useState<WordPressEvent[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<WordPressEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageTitle, setPageTitle] = useState("Événements")
  const [pageSubtitle, setPageSubtitle] = useState(
    "Découvrez tous nos événements, conférences, ateliers et manifestations.",
  )

  // Load events
  useEffect(() => {
    async function loadEvents() {
      try {
        // Appel via API route Next.js (proxy sécurisé côté serveur)
        const response = await fetch("/api/events")
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`)
        }
        const { events: eventsData, pageTitles } = await response.json()

        
        setEvents(eventsData)

        if (pageTitles?.page_evenements) {
          if (pageTitles.page_evenements.titre) {
            setPageTitle(pageTitles.page_evenements.titre)
          }
          if (pageTitles.page_evenements["sous-titre"]) {
            setPageSubtitle(pageTitles.page_evenements["sous-titre"])
          }
        }
      } catch (error) {
        
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Filter upcoming events and sort by date
  useEffect(() => {
    // Helper to get event timestamp
    const getEventTimestamp = (event: WordPressEvent) => {
      if (event.acf?.date) {
        // Parse date from d/m/Y format
        const [day, month, year] = event.acf.date.split("/").map(Number)
        const eventDate = new Date(year, month - 1, day)
        // Set to midnight for date-only comparison
        eventDate.setHours(0, 0, 0, 0)
        return eventDate.getTime()
      }
      // For WordPress date, extract only the date part (at midnight)
      const wpDate = new Date(event.date)
      wpDate.setHours(0, 0, 0, 0)
      return wpDate.getTime()
    }

    // Set pivot at the start of today (midnight)
    const now = new Date()
    const todayAtMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayTimestamp = todayAtMidnight.getTime()

    // Filter upcoming events only
    const filtered = events.filter((event) => {
      const eventTimestamp = getEventTimestamp(event)
      return eventTimestamp >= todayTimestamp
    })

    // Sort by date (nearest to farthest aka ascending)
    filtered.sort((a, b) => {
      return getEventTimestamp(a) - getEventTimestamp(b)
    })

    setUpcomingEvents(filtered)
  }, [events])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des événements...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-37.5 relative">
      {/* Background decorative pictos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <Image
          src="/images/design-mode/picto200.png"
          alt=""
          width={120}
          height={120}
          className="absolute top-[5%] left-[8%] opacity-20 rotate-12"
        />
        <Image
          src="/images/design-mode/picto205.png"
          alt=""
          width={100}
          height={100}
          className="absolute top-[15%] right-[10%] opacity-15 -rotate-6"
        />
        <Image
          src="/images/design-mode/picto207.png"
          alt=""
          width={80}
          height={80}
          className="absolute top-[40%] left-[5%] opacity-25 rotate-45"
        />
        <Image
          src="/images/design-mode/picto204.png"
          alt=""
          width={140}
          height={140}
          className="absolute bottom-[20%] right-[8%] opacity-20 -rotate-12"
        />
        <Image
          src="/images/design-mode/picto203.png"
          alt=""
          width={90}
          height={90}
          className="absolute bottom-[10%] left-[12%] opacity-15 rotate-6"
        />
      </div>

      {/* Header */}
      <div className="mb-8 mt-36 relative">
        {/* Small decorative pictos to header corners */}
        <Image
          src="/images/design-mode/picto205.png"
          alt=""
          width={16}
          height={16}
          className="absolute -top-4 -right-4 opacity-60 rotate-12"
        />
        <Image
          src="/images/design-mode/picto207.png"
          alt=""
          width={16}
          height={16}
          className="absolute -top-4 -left-4 opacity-60 -rotate-12"
        />

        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-8 w-8 text-[#E73628]" />
          <h1 className="text-3xl font-black uppercase font-[family-name:var(--font-raleway)]">
            <Highlighter
              action="underline"
              color="#E73628"
              strokeWidth={4}
              animationDuration={600}
              iterations={1}
              isView={true}
            >
              {pageTitle}
            </Highlighter>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">{pageSubtitle}</p>
      </div>

      {/* Timeline */}
      <EventTimeline events={upcomingEvents} />
    </div>
  )
}
