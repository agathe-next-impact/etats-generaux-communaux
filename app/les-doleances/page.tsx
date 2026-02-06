export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ 
    preview?: string;
    id?: string;
  }>;
}

import { getDoleancesPageData } from "@/lib/wordpress"
import { DoleancesClient } from "./doleances-client"

export default async function DoleancesPage() {
  const doleancesPageData = await getDoleancesPageData()
  const acf = doleancesPageData?.acf

  return <DoleancesClient acf={acf} />
}

export const metadata = {
  title: "Les Doléances",
  description:
    "Découvrez les axes de réflexion et les propositions citoyennes pour construire ensemble un avenir durable et solidaire.",
}
