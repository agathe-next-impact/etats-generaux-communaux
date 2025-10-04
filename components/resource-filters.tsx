"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"
import { getResourceCategories, type WordPressTaxonomy } from "@/lib/wordpress"

interface ResourceFiltersProps {
  onFilterChange: (filters: {
    search: string
    category: string
    sort: string
  }) => void
  totalResources: number
}

export function ResourceFilters({ onFilterChange, totalResources }: ResourceFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const [categories, setCategories] = useState<WordPressTaxonomy[]>([])
  const [isLoadingTaxonomies, setIsLoadingTaxonomies] = useState(true)

  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        setIsLoadingTaxonomies(true)
        const categoriesData = await getResourceCategories()
        setCategories(categoriesData)
        console.log("[v0] Taxonomies loaded:", categoriesData.length, "categories")
      } catch (error) {
        console.error("[v0] Error loading taxonomies:", error)
      } finally {
        setIsLoadingTaxonomies(false)
      }
    }

    fetchTaxonomies()
  }, [])

  const handleFilterChange = () => {
    const filters = {
      search: searchQuery,
      category: selectedCategory,
      sort: sortBy,
    }
    console.log("[v0] Filter change triggered:", filters)
    onFilterChange(filters)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    handleFilterChange()
  }

  const handleCategoryChange = (category: string) => {
    console.log("[v0] Category changed to:", category)
    setSelectedCategory(category)
    const filters = {
      search: searchQuery,
      category: category,
      sort: sortBy,
    }
    onFilterChange(filters)
  }

  const handleSortChange = (sort: string) => {
    console.log("[v0] Sort changed to:", sort)
    setSortBy(sort)
    const filters = {
      search: searchQuery,
      category: selectedCategory,
      sort: sort,
    }
    onFilterChange(filters)
  }

  const clearFilters = () => {
    console.log("[v0] Clearing all filters")
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("date")
    onFilterChange({ search: "", category: "all", sort: "date" })
  }

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || sortBy !== "date"

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Rechercher dans les ressources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-12"
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Filters Toggle (Mobile) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {totalResources} ressource{totalResources !== 1 ? "s" : ""}
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Filtres actifs
            </Badge>
          )}
        </div>

        <Button variant="outline" size="sm" onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="md:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Filters */}
      <div className={`space-y-4 ${isFiltersOpen ? "block" : "hidden md:block"}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Select value={selectedCategory} onValueChange={handleCategoryChange} disabled={isLoadingTaxonomies}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingTaxonomies ? "Chargement..." : "Toutes les catégories"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="flex-1">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Plus récentes</SelectItem>
                <SelectItem value="date_asc">Plus anciennes</SelectItem>
                <SelectItem value="title">Titre A-Z</SelectItem>
                <SelectItem value="title_desc">Titre Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2 bg-transparent"
            >
              <X className="h-4 w-4" />
              Effacer
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Recherche: "{searchQuery}"
                <button
                  onClick={() => {
                    setSearchQuery("")
                    const filters = {
                      search: "",
                      category: selectedCategory,
                      sort: sortBy,
                    }
                    onFilterChange(filters)
                  }}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Catégorie: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <button
                  onClick={() => {
                    setSelectedCategory("all")
                    const filters = {
                      search: searchQuery,
                      category: "all",
                      sort: sortBy,
                    }
                    onFilterChange(filters)
                  }}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
