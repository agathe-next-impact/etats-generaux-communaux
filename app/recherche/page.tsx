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
