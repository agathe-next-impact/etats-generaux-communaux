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

import type { Metadata } from "next"
import SearchPageClient from "./SearchPageClient"

export const metadata: Metadata = {
  title: "Recherche | Magazine Collectif",
  description:
    "Trouvez des articles, événements et ressources sur l'engagement citoyen. Recherchez dans notre base de contenus pour découvrir des initiatives locales et nationales.",
  openGraph: {
    title: "Recherche | Magazine Collectif",
    description: "Trouvez des articles, événements et ressources sur l'engagement citoyen.",
    type: "website",
  },
}

export default function SearchPage() {
  return <SearchPageClient />
}
