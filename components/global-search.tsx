"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, FileText, Download, Play, Calendar, MapPin, ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/wordpress"

interface SearchResult {
  type: "article" | "resource" | "event"
  id: number
  title: string
  excerpt: string
  url: string
  date?: string
  category?: string
  fileType?: string
  location?: string
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

  const performSearch = async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return []

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        throw new Error("Search failed")
      }
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error("[v0] Search error:", error)
      return []
    }
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
    } else if (e.key === "Enter" && selectedIndex === -1 && query.trim()) {
      e.preventDefault()
      router.push(`/recherche?q=${encodeURIComponent(query)}`)
      onClose()
    }
  }

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url)
    onClose()
  }

  const handleViewAllResults = () => {
    router.push(`/recherche?q=${encodeURIComponent(query)}`)
    onClose()
  }

  const getResultIcon = (result: SearchResult) => {
    if (result.type === "article") {
      return <FileText className="h-4 w-4 text-primary" />
    } else if (result.type === "event") {
      return <Calendar className="h-4 w-4 text-[#4AAD33]" />
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

  const getResultTypeLabel = (result: SearchResult) => {
    if (result.type === "article") return "Article"
    if (result.type === "event") return "Événement"
    return result.fileType?.toUpperCase() || "Ressource"
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
                placeholder="Rechercher des articles, événements, ressources..."
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
                              {getResultTypeLabel(result)}
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
                            {result.location && (
                              <>
                                {(result.date || result.category) && <span>•</span>}
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {result.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  <div className="p-4 border-t">
                    <Button variant="outline" className="w-full bg-transparent" onClick={handleViewAllResults}>
                      Voir tous les résultats
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
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
                    </button>
                    ,{" "}
                    <button
                      onClick={() => {
                        router.push("/evenements")
                        onClose()
                      }}
                      className="text-primary hover:underline"
                    >
                      événements
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
