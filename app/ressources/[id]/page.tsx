export const revalidate = 60
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ 
    preview?: string;
    id?: string;
  }>;
}

import { notFound } from "next/navigation"
import { getResource, stripHtml } from "@/lib/wordpress"
import ResourcePageClient from "./resource-client"

interface ResourcePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ResourcePage(props: ResourcePageProps) {
  const params = await props.params;
  const resource = await getResource(params.id)

  if (!resource) {
    notFound()
  }

  return <ResourcePageClient resource={resource} />
}

export async function generateMetadata(props: ResourcePageProps) {
  const params = await props.params;
  const resource = await getResource(params.id)

  if (!resource) {
    // Appelé ici (avant l'envoi de la réponse) pour que Next renvoie un vrai statut 404
    notFound()
  }

  const description =
    resource.acf?.descriptif ||
    (resource.content?.rendered
      ? stripHtml(resource.content.rendered).substring(0, 160)
      : "Ressource disponible sur le site des États Généraux Communaux")

  const featuredImage = resource._embedded?.["wp:featuredmedia"]?.[0]

  return {
    title: `${stripHtml(resource.title.rendered)} | Ressources`,
    description: stripHtml(description).substring(0, 160),
    alternates: { canonical: `/ressources/${params.id}` },
    openGraph: {
      title: resource.title.rendered,
      description,
      type: "article",
      publishedTime: resource.date,
      modifiedTime: resource.modified,
      images: featuredImage
        ? [
            {
              url: featuredImage.source_url,
              width: featuredImage.media_details?.width,
              height: featuredImage.media_details?.height,
              alt: featuredImage.alt_text || resource.title.rendered,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: resource.title.rendered,
      description,
      images: featuredImage ? [featuredImage.source_url] : undefined,
    },
  }
}
