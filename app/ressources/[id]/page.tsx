import { notFound } from "next/navigation"
import { getResource } from "@/lib/wordpress"
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
      ? resource.content.rendered.replace(/<[^>]*>/g, "").substring(0, 160)
      : "Ressource disponible sur Magazine Collectif")

  return {
    title: `${resource.title.rendered} | Ressources - Magazine Collectif`,
    description,
  }
}
