"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"
import type { WordPressCategory } from "@/lib/wordpress"

interface BlogFiltersProps {
  categories: WordPressCategory[]
  totalPosts: number
}

export function BlogFilters({ categories, totalPosts }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "date")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const updateURL = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams)

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value)
      } else {
        newSearchParams.delete(key)
      }
    })

    // Reset to first page when filters change
    newSearchParams.delete("page")

    router.push(`/blog?${newSearchParams.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL({ search: searchQuery, category: selectedCategory, sort: sortBy })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    updateURL({ search: searchQuery, category, sort: sortBy })
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    updateURL({ search: searchQuery, category: selectedCategory, sort })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSortBy("date")
    router.push("/blog")
  }

  const hasActiveFilters = searchQuery || selectedCategory || sortBy !== "date"

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Rechercher dans les articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-12 border border-[#E73628] focus-visible:ring-[#E73628]"
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-[#E73628]/10"
        >
          <Search className="h-4 w-4 text-[#E73628]" />
        </Button>
      </form>

      {/* Filters Toggle (Mobile) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {totalPosts} article{totalPosts !== 1 ? "s" : ""}
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs bg-[#F4E63C] text-black hover:bg-[#F4E63C]/80">
              Filtres actifs
            </Badge>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="md:hidden border-[#E73628] text-[#E73628] hover:bg-[#E73628]/10"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Filters */}
      <div className={`space-y-4 ${isFiltersOpen ? "block" : "hidden md:block"}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="border border-[#F4E63C] focus:ring-[#F4E63C]">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="flex-1">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="border border-[#4AAD33] focus:ring-[#4AAD33]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Plus récents</SelectItem>
                <SelectItem value="date_asc">Plus anciens</SelectItem>
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
              className="flex items-center gap-2 bg-transparent border-[#E73628] text-[#E73628] hover:bg-[#E73628]/10"
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
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-[#4AAD33] text-white hover:bg-[#4AAD33]/80"
              >
                Recherche: "{searchQuery}"
                <button
                  onClick={() => {
                    setSearchQuery("")
                    updateURL({ search: "", category: selectedCategory, sort: sortBy })
                  }}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-[#F4E63C] text-black hover:bg-[#F4E63C]/80"
              >
                {categories.find((c) => c.id.toString() === selectedCategory)?.name}
                <button
                  onClick={() => {
                    setSelectedCategory("")
                    updateURL({ search: searchQuery, category: "", sort: sortBy })
                  }}
                  className="ml-1 hover:bg-black/20 rounded-full p-0.5"
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
