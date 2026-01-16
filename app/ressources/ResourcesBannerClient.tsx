"use client";
import { useState, useEffect } from "react";
import { ResourceCard } from "@/components/resource-card";
import { ResourceSearchBar } from "@/components/resource-search-bar";
import { Card, CardContent } from "@/components/ui/card";
import { getResources, type WordPressResource } from "@/lib/wordpress";

export default function ResourcesBannerClient() {
  const [resources, setResources] = useState<WordPressResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<WordPressResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedResources = await getResources();
        setResources(fetchedResources);
        setFilteredResources(fetchedResources);
      } catch (err) {
        console.error("[v0] Error fetching resources:", err);
        setError("Erreur lors du chargement des ressources");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  const handleSearch = async (search: string) => {
    setIsLoading(true);
    try {
      let filtered = [...resources];
      if (search) {
        filtered = filtered.filter(
          (resource) =>
            resource.title.rendered.toLowerCase().includes(search.toLowerCase()) ||
            (resource.acf?.descriptif || "").toLowerCase().includes(search.toLowerCase())
        );
      }
      setFilteredResources(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
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
    );
  }

  return (
    <div className="space-y-8">
      <ResourceSearchBar onSearch={handleSearch} totalResources={filteredResources.length} />
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
  );
}