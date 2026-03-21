import { ArticlesCarousel } from "./articles-carousel";
import { Highlighter } from "@/components/ui/highlighter";
import type { HomePageACF } from "@/lib/wordpress";
import { getPosts } from "@/lib/wordpress";
import { sanitizeHtml } from "@/lib/sanitize";
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
  const hasWebinaire = acfData?.video_webinaire;
  const hasArticles = posts && posts.length > 0;
  if (!hasVideo && !hasWebinaire && !hasArticles) return null;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Colonne 1 (4/12) - Dernière actualité */}
          <div className="lg:col-span-4">
            {acfData?.titre_actus && (
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
            )}
            {acfData?.soustitre_actus && (
              <p className="text-muted-foreground mb-4">
                {acfData.soustitre_actus}
              </p>
            )}
            {hasArticles && <ArticlesCarousel posts={posts} />}
          </div>

          {/* Colonnes 2+3 (8/12) - Vidéos avec titre commun */}
          {(hasVideo || hasWebinaire) && (
            <div className="lg:col-span-8">
              {acfData?.titre_video && (
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
              {acfData?.soustitre_video && (
                <p className="text-muted-foreground mb-4">
                  {acfData.soustitre_video}
                </p>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
                {/* Short (2/8 = 2/12 du total) */}
                {hasVideo && (
                  <div className="lg:col-span-2">
                    <div className="relative w-full aspect-[9/16] rounded-2xl shadow-lg overflow-hidden">
                      {acfData!.video!.includes("iframe") && (
                        <div
                          className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(acfData!.video!) }}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Webinaire (6/8 = 6/12 du total) */}
                {hasWebinaire && (
                  <div className="lg:col-span-6">
                    <div className="relative w-full aspect-video rounded-2xl shadow-lg overflow-hidden">
                      {acfData!.video_webinaire!.includes("iframe") && (
                        <div
                          className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(acfData!.video_webinaire!) }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
