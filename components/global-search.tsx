"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, FileText, Download, Play } from "lucide-react"
import { formatDate } from "@/lib/wordpress"

interface SearchResult {
  type: "article" | "resource"
  id: number
  title: string
  excerpt: string
  url: string
  date?: string
  category?: string
  fileType?: string
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Mock search function - replace with actual WordPress API calls
  const performSearch = async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return []

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock results - replace with actual API calls
    const mockArticles: SearchResult[] = [
      {
        type: "article",
        id: 1,
        title: "L'engagement citoyen à l'ère numérique",
        excerpt:
          "Comment les nouvelles technologies transforment les formes d'engagement et de mobilisation citoyenne.",
        url: "/blog/engagement-citoyen-numerique",
        date: "2024-12-15",
        category: "Numérique",
      },
      {
        type: "article",
        id: 2,
        title: "Les mouvements écologistes en France",
        excerpt: "Analyse des principales organisations écologistes françaises et de leurs stratégies d'action.",
        url: "/blog/mouvements-ecologistes-france",
        date: "2024-12-10",
        category: "Écologie",
      },
    ]

    const mockResources: SearchResult[] = [
      {
        type: "resource",
        id: 1,
        title: "Guide de l'engagement citoyen",
        excerpt: "Un guide complet pour comprendre les différentes formes d'engagement citoyen.",
        url: "/ressources/1",
        fileType: "pdf",
      },
      {
        type: "resource",
        id: 2,
        title: "Webinaire : Organiser une action collective",
        excerpt: "Enregistrement d'un webinaire sur les meilleures pratiques pour organiser une action collective.",
        url: "/ressources/2",
        fileType: "video",
      },
    ]

    // Filter results based on query
    const filteredArticles = mockArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const filteredResources = mockResources.filter(
      (resource) =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return [...filteredArticles, ...filteredResources]
  }

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true)
        const searchResults = await performSearch(query)
        setResults(searchResults)
        setSelectedIndex(-1)
        setIsLoading(false)
      } else {
        setResults([])
        setSelectedIndex(-1)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      const selectedResult = results[selectedIndex]
      router.push(selectedResult.url)
      onClose()
    }
  }

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url)
    onClose()
  }

  const getResultIcon = (result: SearchResult) => {
    if (result.type === "article") {
      return <FileText className="h-4 w-4 text-primary" />
    } else {
      switch (result.fileType) {
        case "pdf":
          return <FileText className="h-4 w-4 text-red-600" />
        case "video":
          return <Play className="h-4 w-4 text-blue-600" />
        default:
          return <Download className="h-4 w-4 text-green-600" />
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto px-4">
        <Card className="shadow-2xl border-2">
          <CardContent className="p-0">
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Rechercher des articles, ressources..."
                className="border-0 focus-visible:ring-0 text-lg"
              />
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Results */}
            <div ref={resultsRef} className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Recherche en cours...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                        index === selectedIndex ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getResultIcon(result)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground truncate">{result.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {result.type === "article" ? "Article" : result.fileType?.toUpperCase() || "Ressource"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{result.excerpt}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {result.date && <span>{formatDate(result.date)}</span>}
                            {result.category && (
                              <>
                                {result.date && <span>•</span>}
                                <span>{result.category}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground mb-2">Aucun résultat trouvé</p>
                  <p className="text-sm text-muted-foreground">
                    Essayez avec d'autres mots-clés ou parcourez nos{" "}
                    <button
                      onClick={() => {
                        router.push("/blog")
                        onClose()
                      }}
                      className="text-primary hover:underline"
                    >
                      articles
                    </button>{" "}
                    et{" "}
                    <button
                      onClick={() => {
                        router.push("/ressources")
                        onClose()
                      }}
                      className="text-primary hover:underline"
                    >
                      ressources
                    </button>
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">Commencez à taper pour rechercher</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="text-xs">
                      engagement
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      action collective
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      mouvement social
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      guide
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Utilisez ↑↓ pour naviguer, Entrée pour sélectionner</span>
                <span>Échap pour fermer</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
