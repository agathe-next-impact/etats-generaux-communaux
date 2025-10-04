"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getEventTypes, type WordPressTaxonomy } from "@/lib/wordpress"

interface EventFiltersProps {
  onFiltersChange: (filters: {
    search: string
    type: string
    status: string
  }) => void
}

export function EventFilters({ onFiltersChange }: EventFiltersProps) {
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [eventTypes, setEventTypes] = useState<WordPressTaxonomy[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadEventTypes() {
      try {
        const types = await getEventTypes()
        setEventTypes(types)
      } catch (error) {
        console.error("Error loading event types:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEventTypes()
  }, [])

  useEffect(() => {
    onFiltersChange({
      search,
      type: selectedType,
      status: selectedStatus,
    })
  }, [search, selectedType, selectedStatus, onFiltersChange])

  const clearFilters = () => {
    setSearch("")
    setSelectedType("all")
    setSelectedStatus("all")
  }

  const hasActiveFilters = search || selectedType !== "all" || selectedStatus !== "all"

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher un événement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Event Type Filter */}
        <div className="flex-1 min-w-[200px]">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Type d'événement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type.id} value={type.slug}>
                  {type.name} ({type.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex-1 min-w-[200px]">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les événements</SelectItem>
              <SelectItem value="upcoming">À venir</SelectItem>
              <SelectItem value="past">Passés</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Effacer
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Recherche: "{search}"
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch("")} />
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {eventTypes.find((t) => t.slug === selectedType)?.name || selectedType}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedType("all")} />
            </Badge>
          )}
          {selectedStatus !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Statut: {selectedStatus === "upcoming" ? "À venir" : "Passés"}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedStatus("all")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
