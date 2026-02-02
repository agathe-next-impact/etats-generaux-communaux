export const dynamic = "force-dynamic"
import {
  PreviewProvider,
  PreviewBanner,
  PreviewContent,
  PreviewTitle,
  PreviewBody,
  PreviewMeta,
  PreviewFeaturedImage,
} from '@/components/preview';
import { fetchPreviewPost, fetchDraftPost, type WPPost } from '@/lib/wordpress-api';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ 
    preview?: string;
    id?: string;
  }>;
}

import { getDemanderDoleancesPageData } from "@/lib/wordpress"
import { DemanderDoleancesClient } from "./demander-doleances-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demander les Doléances - EGC",
  description: "Formulaire de demande des doléances citoyennes",
}

export default async function DemanderDoleancesPage() {
  const pageData = await getDemanderDoleancesPageData()

  return <DemanderDoleancesClient acf={pageData?.acf || null} />
}
