"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { WordPressTaxonomy } from "@/lib/wordpress"

interface ResourceCategoryBadgesProps {
  categories: WordPressTaxonomy[]
  selectedCategory: string | null
  onSelectCategory: (categorySlug: string | null) => void
  isLoading?: boolean
}

export function ResourceCategoryBadges({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading = false,
}: ResourceCategoryBadgesProps) {
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-muted animate-pulse rounded-full flex-shrink-0" />
        ))}
      </div>
    )
  }

  if (categories.length === 0) return null

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide flex-wrap">
      <Badge
        variant="outline"
        className={cn(
          "cursor-pointer px-4 py-2 text-sm font-medium transition-colors rounded-full hover:bg-primary/90 hover:text-white whitespace-nowrap",
          selectedCategory === null
            ? "bg-red-600 text-primary-foreground border-red-600"
            : "bg-background text-foreground border-border hover:border-red-600"
        )}
        onClick={() => onSelectCategory(null)}
      >
        Tout voir
      </Badge>

      {categories.map((category) => (
        <Badge
          key={category.id}
          variant="outline"
          className={cn(
            "cursor-pointer px-4 py-2 text-sm font-medium transition-colors rounded-full hover:bg-red-600 hover:text-white whitespace-nowrap",
            selectedCategory === category.slug
              ? "bg-red-600 text-primary-foreground border-red-600"
              : "bg-background text-foreground border border-red-600 hover:border-red-600"
          )}
          onClick={() => onSelectCategory(
             selectedCategory === category.slug ? null : category.slug
          )}
        >
          {category.name}
          <span className="ml-2 text-xs opacity-70">
            {category.count}
          </span>
        </Badge>
      ))}
    </div>
  )
}
