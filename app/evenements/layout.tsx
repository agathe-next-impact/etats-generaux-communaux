import type { Metadata } from "next"

// La page /evenements est un composant client : ses métadonnées sont déclarées ici.
export const metadata: Metadata = {
  title: "Événements",
  description:
    "Agenda des États Généraux Communaux : réunions publiques, ateliers et rencontres citoyennes près de chez vous.",
  alternates: { canonical: "/evenements" },
}

export default function EvenementsLayout({ children }: { children: React.ReactNode }) {
  return children
}
