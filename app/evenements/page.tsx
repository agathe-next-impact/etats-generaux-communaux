"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar } from "lucide-react"
import { getEvents, getArchivePageTitles, type WordPressEvent } from "@/lib/wordpress"
import { EventFilters } from "@/components/event-filters"
import { EventTimeline } from "@/components/event-timeline"
import { Highlighter } from "@/components/ui/highlighter"
import Image from "next/image"

export default function EventsPage() {
  const [events, setEvents] = useState<WordPressEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<WordPressEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageTitle, setPageTitle] = useState("Événements")
  const [pageSubtitle, setPageSubtitle] = useState(
    "Découvrez tous nos événements, conférences, ateliers et manifestations.",
  )
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "all",
  })

  // Load events
  useEffect(() => {
    async function loadEvents() {
      try {
        console.log("[v0] Loading events...")
        const [eventsData, pageTitles] = await Promise.all([getEvents(), getArchivePageTitles()])

        console.log("[v0] Events loaded:", eventsData.length)
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
        console.error("[v0] Error loading events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...events]

    // Text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.rendered.toLowerCase().includes(searchLower) ||
          event.content.rendered.toLowerCase().includes(searchLower) ||
          event.acf?.description?.toLowerCase().includes(searchLower) ||
          event.acf?.lieu?.address?.toLowerCase().includes(searchLower),
      )
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((event) => {
        // Get event type from categories in _embedded data
        const eventCategories = event._embedded?.["wp:term"]?.[0] || []
        return eventCategories.some((category) => category.slug === filters.type)
      })
    }

    // Status filter
    if (filters.status !== "all") {
      const now = new Date()
      filtered = filtered.filter((event) => {
        let eventDate: Date
        if (event.acf?.date) {
          // Parse date from d/m/Y format
          const [day, month, year] = event.acf.date.split("/").map(Number)
          eventDate = new Date(year, month - 1, day)
        } else {
          eventDate = new Date(event.date)
        }

        if (filters.status === "upcoming") {
          return eventDate > now
        } else if (filters.status === "past") {
          return eventDate < now
        }
        return true
      })
    }

    console.log("[v0] Filtered events:", filtered.length, "from", events.length, "total")
    console.log("[v0] Applied filters:", filters)
    setFilteredEvents(filtered)
  }, [events, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    console.log("[v0] Filters changed:", newFilters)
    setFilters(newFilters)
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des événements...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-[150px] relative">
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
      <div className="mb-8 relative">
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

      {/* Filters */}
      <div className="mb-8">
        <EventFilters onFiltersChange={handleFiltersChange} />
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredEvents.length} événement{filteredEvents.length > 1 ? "s" : ""} trouvé
          {filteredEvents.length > 1 ? "s" : ""}
          {filters.search || filters.type !== "all" || filters.status !== "all" ? ` sur ${events.length} total` : ""}
        </p>
      </div>

      {/* Timeline */}
      <EventTimeline events={filteredEvents} />
    </div>
  )
}
