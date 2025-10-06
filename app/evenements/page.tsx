"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar } from "lucide-react"
import { getEvents, type WordPressEvent } from "@/lib/wordpress"
import { EventFilters } from "@/components/event-filters"
import { EventTimeline } from "@/components/event-timeline"
import { Highlighter } from "@/components/ui/highlighter"

export default function EventsPage() {
  const [events, setEvents] = useState<WordPressEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<WordPressEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
        const eventsData = await getEvents()
        console.log("[v0] Events loaded:", eventsData.length)
        setEvents(eventsData)
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
    <div className="container mx-auto px-4 py-8 pt-[150px]">
      {/* Header */}
      <div className="mb-8">
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
              Événements
            </Highlighter>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Découvrez tous nos événements, conférences, ateliers et manifestations.
        </p>
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
