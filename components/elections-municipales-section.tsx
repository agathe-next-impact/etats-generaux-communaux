import { ArticlesCarousel } from "./articles-carousel";
import { Card } from "@/components/ui/card";
import { Highlighter } from "@/components/ui/highlighter";
import type { HomePageACF } from "@/lib/wordpress";
import { getPosts } from "@/lib/wordpress";
import React from "react";

interface Props {
  acfData?: HomePageACF["section_municipales"];
}

export async function ElectionsMunicipalesSection({ acfData }: Props) {
  // Récupère les articles qui ont la catégorie 'elections-municipales' (même si plusieurs catégories)
  // Utilise le paramètre 'categories' avec le slug, qui doit fonctionner si l'API WordPress est bien configurée
  // Si besoin, récupère l'ID de la catégorie par son slug
  let categoryId = undefined;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/categories?slug=elections-municipales`
    );
    if (res.ok) {
      const cats = await res.json();
      if (Array.isArray(cats) && cats.length > 0) {
        categoryId = cats[0].id;
      }
    }
  } catch {}
  const { posts } = await getPosts({
    per_page: 6,
    categories: categoryId ? String(categoryId) : "elections-municipales",
    orderby: "date",
    order: "desc",
  });
  const hasVideo = acfData?.video;
  const hasArticles = posts && posts.length > 0;
  if (!hasVideo && !hasArticles) return null;

  console.log('[ElectionsMunicipalesSection] acfData.video:', acfData?.video);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne gauche - Diaporama articles */}
        {acfData?.titre_actus && (
          <div>
                <h2 className="text-2xl md:text-3xl uppercase text-foreground mb-2">
                  <Highlighter
                    action="underline"
                    color="#E73628"
                    strokeWidth={3}
                    animationDuration={600}
                    iterations={1}
                    isView={true}
                  >
                    {acfData.titre_actus}
                  </Highlighter>
                </h2>
              {acfData?.soustitre_actus && (
                <p className="text-muted-foreground">
                  {acfData.soustitre_actus}
                </p>
              )}
            {hasArticles && <ArticlesCarousel posts={posts} />}</div>
              )}
          {/* Colonne droite - Vidéo */}
          
        {hasVideo &&  (
          <div>
            <div className="mb-6 space-y-4">
                    {acfData.titre_video && (
                        <h2 className="text-2xl md:text-3xl uppercase text-foreground mb-2">
                        <Highlighter
                            action="underline"
                            color="#E73628"
                            strokeWidth={3}
                            animationDuration={600}
                            iterations={1}
                            isView={true}
                        >
                            {acfData.titre_video}
                        </Highlighter>
                        </h2>
                    )}
                    {acfData.soustitre_video && (
                        <p className="text-muted-foreground">
                        {acfData.soustitre_video}
                        </p>
                    )}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-border">
                  {acfData!.video!.includes("iframe") && (
                    <div
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: acfData!.video! }}
                    />)}
                </div>
              

            </div>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
