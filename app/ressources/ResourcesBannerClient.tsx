"use client";
import { useState, useEffect, useCallback } from "react";
import { ResourceCard } from "@/components/resource-card";
import { ResourceSearchBar } from "@/components/resource-search-bar";
import { ResourceCategoryBadges } from "@/components/resource-category-badges";
import { Card, CardContent } from "@/components/ui/card";
import { type WordPressResource, type WordPressTaxonomy } from "@/lib/wordpress";

export default function ResourcesBannerClient() {
  const [resources, setResources] = useState<WordPressResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<WordPressResource[]>([]);
  const [categories, setCategories] = useState<WordPressTaxonomy[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSearch, setCurrentSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Appel via API route Next.js (proxy sécurisé côté serveur)
        const response = await fetch("/api/resources");
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }
        const fetchedResources = await response.json();
        setResources(fetchedResources);
        setFilteredResources(fetchedResources);

        // Extract categories from resources
        const allCategories = new Map<number, WordPressTaxonomy>();
        fetchedResources.forEach((resource: WordPressResource) => {
           const terms = resource._embedded?.["wp:term"]?.[0]; // 0 is categories
           if (terms) {
             terms.forEach((term: any) => {
               if (!allCategories.has(term.id)) {
                 allCategories.set(term.id, {
                   id: term.id,
                   name: term.name,
                   slug: term.slug,
                   count: 0 
                 });
               }
               const cat = allCategories.get(term.id)!;
               cat.count++;
             });
           }
        });
        setCategories(Array.from(allCategories.values()).sort((a, b) => b.count - a.count));

      } catch (err) {
        console.error("[v0] Error fetching resources:", err);
        setError("Erreur lors du chargement des ressources");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  const applyFilters = useCallback(() => {
      let filtered = [...resources];
      
      if (currentSearch) {
        filtered = filtered.filter(
          (resource) =>
            resource.title.rendered.toLowerCase().includes(currentSearch.toLowerCase()) ||
            (resource.acf?.descriptif || "").toLowerCase().includes(currentSearch.toLowerCase())
        );
      }

      if (selectedCategory) {
         filtered = filtered.filter(resource => {
            const terms = resource._embedded?.["wp:term"]?.[0];
            return terms?.some((t: any) => t.slug === selectedCategory);
         });
      }

      setFilteredResources(filtered);
  }, [resources, currentSearch, selectedCategory]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearch = (search: string) => {
    setCurrentSearch(search);
  };
  
  const handleCategorySelect = (categorySlug: string | null) => {
     setSelectedCategory(categorySlug);
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
      <div className="space-y-4">
        {/*<ResourceSearchBar onSearch={handleSearch} totalResources={filteredResources.length} />*/}
        <ResourceCategoryBadges 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect}
          isLoading={isLoading}
        />
      </div>

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