"use client"

import { useState, useEffect } from "react"
import { ResourceCard } from "@/components/resource-card"
import { ResourceFilters } from "@/components/resource-filters"
import { Card, CardContent } from "@/components/ui/card"
import { getResources, type WordPressResource } from "@/lib/wordpress"

export default function ResourcesPage() {
  const [resources, setResources] = useState<WordPressResource[]>([])
  const [filteredResources, setFilteredResources] = useState<WordPressResource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("[v0] Fetching resources from WordPress CPT...")
        const fetchedResources = await getResources()
        console.log("[v0] Fetched resources:", fetchedResources.length, "resources")
        setResources(fetchedResources)
        setFilteredResources(fetchedResources)
      } catch (err) {
        console.error("[v0] Error fetching resources:", err)
        setError("Erreur lors du chargement des ressources")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [])

  const handleFilterChange = async (filters: { search: string; category: string; sort: string }) => {
    setIsLoading(true)

    try {
      console.log("[v0] Applying filters:", filters)

      // Build API parameters for taxonomy filtering
      const apiParams: { categories?: string; search?: string } = {}

      if (filters.category !== "all") {
        apiParams.categories = filters.category
      }
      if (filters.search) {
        apiParams.search = filters.search
      }

      // Fetch filtered resources from WordPress API
      const filteredData = await getResources(apiParams)
      console.log("[v0] Resources fetched with filters:", filteredData.length, "resources")

      // Apply client-side sorting
      const sorted = [...filteredData].sort((a, b) => {
        switch (filters.sort) {
          case "title":
            return a.title.rendered.localeCompare(b.title.rendered)
          case "title_desc":
            return b.title.rendered.localeCompare(a.title.rendered)
          case "date_asc":
            return a.id - b.id
          default: // date (newest first)
            return b.id - a.id
        }
      })

      setFilteredResources(sorted)
      console.log("[v0] Filtered resources:", sorted.length, "results")
    } catch (err) {
      console.error("[v0] Error filtering resources:", err)
      let filtered = [...resources]

      // Apply search filter
      if (filters.search) {
        filtered = filtered.filter(
          (resource) =>
            resource.title.rendered.toLowerCase().includes(filters.search.toLowerCase()) ||
            (resource.acf?.descriptif || "").toLowerCase().includes(filters.search.toLowerCase()),
        )
      }

      // Apply category filter using embedded taxonomy data
      if (filters.category !== "all") {
        filtered = filtered.filter((resource) => {
          if (resource._embedded?.["wp:term"]) {
            // Check if resource has the selected category in embedded terms
            const terms = resource._embedded["wp:term"]
            return terms.some((termGroup) => termGroup.some((term) => term.slug === filters.category))
          }
          return false
        })
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (filters.sort) {
          case "title":
            return a.title.rendered.localeCompare(b.title.rendered)
          case "title_desc":
            return b.title.rendered.localeCompare(a.title.rendered)
          case "date_asc":
            return a.id - b.id
          default: // date (newest first)
            return b.id - a.id
        }
      })

      setFilteredResources(filtered)
      console.log("[v0] Client-side filtered resources:", filtered.length, "results")
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">Ressources</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre collection de guides, outils et documents pour accompagner votre engagement et vos actions
            collectives.
          </p>
        </div>

        <div className="space-y-8">
          <ResourceFilters onFilterChange={handleFilterChange} totalResources={filteredResources.length} />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-16" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-muted rounded flex-1" />
                      <div className="h-8 w-8 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-foreground mb-2">Aucune ressource trouvée</h3>
              <p className="text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <section className="mt-16 py-12 bg-muted/30 rounded-lg">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Vous avez une ressource à partager ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nous sommes toujours à la recherche de nouvelles ressources pour enrichir notre collection. Contactez-nous
              si vous souhaitez contribuer.
            </p>
            <div className="pt-4">
              <a
                href="mailto:contact@magazine-collectif.fr"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
