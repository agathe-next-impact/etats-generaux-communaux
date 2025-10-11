"use client"

import { useState, useEffect } from "react"
import { ResourceCard } from "@/components/resource-card"
import { ResourceFilters } from "@/components/resource-filters"
import { Card, CardContent } from "@/components/ui/card"
import { getResources, type WordPressResource } from "@/lib/wordpress"
import { Highlighter } from "@/components/ui/highlighter"
import Image from "next/image"

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
        const fetchedResources = await getResources()
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
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 pt-[150px]">
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
    <div className="min-h-screen py-12 pt-[150px] relative overflow-hidden">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png"
        alt=""
        width={120}
        height={120}
        className="absolute top-20 left-[5%] opacity-20 pointer-events-none -rotate-12"
      />
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png"
        alt=""
        width={100}
        height={100}
        className="absolute top-[30%] right-[8%] opacity-15 pointer-events-none rotate-45"
      />
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-ortOMnxOuv7texPH3RxLJTGkLhXhuQ.png"
        alt=""
        width={80}
        height={80}
        className="absolute bottom-[20%] left-[10%] opacity-20 pointer-events-none rotate-12"
      />
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-ac6W7GEoGBcgE6fyqHJLr2EBOsnw7u.png"
        alt=""
        width={140}
        height={140}
        className="absolute bottom-[10%] right-[5%] opacity-15 pointer-events-none -rotate-6"
      />
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-iph3iRcbh4GzoswUQo87W7giQs9vrW.png"
        alt=""
        width={90}
        height={90}
        className="absolute top-[50%] left-[3%] opacity-10 pointer-events-none rotate-[25deg]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png"
            alt=""
            width={60}
            height={60}
            className="absolute -top-8 -left-4 opacity-30 pointer-events-none rotate-12"
          />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-ortOMnxOuv7texPH3RxLJTGkLhXhuQ.png"
            alt=""
            width={50}
            height={50}
            className="absolute -top-6 -right-6 opacity-25 pointer-events-none -rotate-12"
          />

          <h1 className="text-4xl md:text-5xl uppercase font-black text-foreground mb-4">
            <Highlighter
              action="underline"
              color="#E73628"
              strokeWidth={3}
              animationDuration={600}
              iterations={1}
              isView={true}
            >
              Ressources
            </Highlighter>
          </h1>
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
      </div>
    </div>
  )
}
