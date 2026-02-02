export const dynamic = "force-dynamic"
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
