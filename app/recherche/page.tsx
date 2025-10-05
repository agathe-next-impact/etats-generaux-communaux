"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, Calendar, Download, Play, MapPin, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
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

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [searchInput, setSearchInput] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "article" | "event" | "resource">("all")

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        throw new Error("Search failed")
      }
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("[v0] Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setQuery(searchInput)
      router.push(`/recherche?q=${encodeURIComponent(searchInput)}`)
      performSearch(searchInput)
    }
  }

  const filteredResults = activeTab === "all" ? results : results.filter((result) => result.type === activeTab)

  const articleCount = results.filter((r) => r.type === "article").length
  const eventCount = results.filter((r) => r.type === "event").length
  const resourceCount = results.filter((r) => r.type === "resource").length

  const getResultIcon = (result: SearchResult) => {
    if (result.type === "article") {
      return <FileText className="h-5 w-5 text-primary" />
    } else if (result.type === "event") {
      return <Calendar className="h-5 w-5 text-[#4AAD33]" />
    } else {
      switch (result.fileType) {
        case "video":
          return <Play className="h-5 w-5 text-blue-600" />
        default:
          return <Download className="h-5 w-5 text-[#F4E63C]" />
      }
    }
  }

  const getResultTypeLabel = (result: SearchResult) => {
    if (result.type === "article") return "Article"
    if (result.type === "event") return "Événement"
    return "Ressource"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search */}
      <section className="py-12 lg:py-16 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase text-white inline-block mb-4">
              <span className="bg-[#E73628] px-4 py-2">Recherche</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Trouvez des articles, événements et ressources sur l'engagement citoyen
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-12 h-14 text-lg"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90">
                Rechercher
              </Button>
            </div>
          </form>

          {query && (
            <p className="mt-4 text-sm text-muted-foreground">
              Résultats pour : <span className="font-semibold text-foreground">{query}</span>
            </p>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Recherche en cours...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-lg font-medium">
                  {results.length} résultat{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
                <TabsList className="mb-8">
                  <TabsTrigger value="all">Tous ({results.length})</TabsTrigger>
                  <TabsTrigger value="article">Articles ({articleCount})</TabsTrigger>
                  <TabsTrigger value="event">Événements ({eventCount})</TabsTrigger>
                  <TabsTrigger value="resource">Ressources ({resourceCount})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-6">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((result) => (
                      <Card key={`${result.type}-${result.id}`} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <Link href={result.url} className="group">
                            <div className="flex items-start gap-4">
                              <div className="mt-1 flex-shrink-0">{getResultIcon(result)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline" className="text-xs">
                                        {getResultTypeLabel(result)}
                                      </Badge>
                                      {result.category && (
                                        <Badge variant="secondary" className="text-xs">
                                          {result.category}
                                        </Badge>
                                      )}
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                                      {result.title}
                                    </h3>
                                  </div>
                                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                                </div>

                                <p className="text-muted-foreground mb-3 line-clamp-2">{result.excerpt}</p>

                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                  {result.date && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {formatDate(result.date)}
                                    </span>
                                  )}
                                  {result.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {result.location}
                                    </span>
                                  )}
                                  {result.fileType && (
                                    <Badge variant="outline" className="text-xs">
                                      {result.fileType.toUpperCase()}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-lg text-muted-foreground mb-2">Aucun résultat dans cette catégorie</p>
                      <Button variant="outline" onClick={() => setActiveTab("all")}>
                        Voir tous les résultats
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          ) : query ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Aucun résultat trouvé</h2>
                <p className="text-muted-foreground mb-6">Nous n'avons pas trouvé de résultats pour "{query}"</p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <p className="text-sm text-muted-foreground font-medium">Suggestions :</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Vérifiez l'orthographe de vos mots-clés</li>
                  <li>• Essayez des termes plus généraux</li>
                  <li>• Utilisez des synonymes</li>
                </ul>

                <div className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">Ou parcourez nos contenus :</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button asChild variant="outline">
                      <Link href="/blog">
                        <FileText className="h-4 w-4 mr-2" />
                        Articles
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/evenements">
                        <Calendar className="h-4 w-4 mr-2" />
                        Événements
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/ressources">
                        <Download className="h-4 w-4 mr-2" />
                        Ressources
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Commencez votre recherche</h2>
              <p className="text-muted-foreground mb-6">
                Entrez des mots-clés pour trouver des articles, événements et ressources
              </p>

              <div className="max-w-md mx-auto">
                <p className="text-sm text-muted-foreground mb-4">Suggestions de recherche :</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["engagement", "action collective", "mouvement social", "écologie", "démocratie"].map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchInput(term)
                        setQuery(term)
                        router.push(`/recherche?q=${encodeURIComponent(term)}`)
                        performSearch(term)
                      }}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
