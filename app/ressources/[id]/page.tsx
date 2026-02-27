export const dynamic = "force-dynamic"
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
  params: {
    id: string
  }
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const resource = await getResource(params.id)

  if (!resource) {
    notFound()
  }

  return <ResourcePageClient resource={resource} />
}

export async function generateMetadata({ params }: ResourcePageProps) {
  const resource = await getResource(params.id)

  if (!resource) {
    return {
      title: "Ressource non trouvée",
    }
  }

  const description =
    resource.acf?.descriptif ||
    (resource.content?.rendered
      ? stripHtml(resource.content.rendered).substring(0, 160)
      : "Ressource disponible sur Magazine Collectif")

  const featuredImage = resource._embedded?.["wp:featuredmedia"]?.[0]

  return {
    title: `${resource.title.rendered} | Ressources - Magazine Collectif`,
    description,
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
