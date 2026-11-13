import { Calendar } from "lucide-react"
import { getEvents, getArchivePageTitles, type WordPressEvent } from "@/lib/wordpress"
import { EventTimeline } from "@/components/event-timeline"
import { Highlighter } from "@/components/ui/highlighter"
import Image from "next/image"

// Rendu serveur (contenu présent dans le HTML pour l'indexation), régénéré toutes les 60 s
export const revalidate = 60

/** Date d'un événement au format AAAA-MM-JJ (champ ACF « d/m/Y », sinon date WordPress). */
function getEventDay(event: WordPressEvent): string {
  if (event.acf?.date) {
    const [day, month, year] = event.acf.date.split("/")
    if (day && month && year) return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  }
  return (event.date || "").slice(0, 10)
}

/** Aujourd'hui à l'heure de Paris, au format AAAA-MM-JJ. */
function getTodayInParis(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date())
}

export default async function EventsPage() {
  const [events, pageTitles] = await Promise.all([
    getEvents().catch(() => [] as WordPressEvent[]),
    getArchivePageTitles().catch(() => null),
  ])

  const pageTitle = pageTitles?.page_evenements?.titre || "Événements"
  const pageSubtitle =
    pageTitles?.page_evenements?.["sous-titre"] ||
    "Découvrez tous nos événements, conférences, ateliers et manifestations."

  // Événements à venir (y compris aujourd'hui), du plus proche au plus lointain
  const today = getTodayInParis()
  const upcomingEvents = (events || [])
    .filter((event) => getEventDay(event) >= today)
    .sort((a, b) => getEventDay(a).localeCompare(getEventDay(b)))

  return (
    <div className="container mx-auto px-4 py-8 pt-37.5 relative">
      {/* Background decorative pictos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <Image
          src="/images/design-mode/picto200.png"
          alt=""
          width={120}
          height={120}
          className="absolute top-[5%] left-[8%] opacity-20 rotate-12"
        />
        <Image
          src="/images/design-mode/picto205.png"
          alt=""
          width={100}
          height={100}
          className="absolute top-[15%] right-[10%] opacity-15 -rotate-6"
        />
        <Image
          src="/images/design-mode/picto207.png"
          alt=""
          width={80}
          height={80}
          className="absolute top-[40%] left-[5%] opacity-25 rotate-45"
        />
        <Image
          src="/images/design-mode/picto204.png"
          alt=""
          width={140}
          height={140}
          className="absolute bottom-[20%] right-[8%] opacity-20 -rotate-12"
        />
        <Image
          src="/images/design-mode/picto203.png"
          alt=""
          width={90}
          height={90}
          className="absolute bottom-[10%] left-[12%] opacity-15 rotate-6"
        />
      </div>

      {/* Header */}
      <div className="mb-8 mt-36 relative">
        {/* Small decorative pictos to header corners */}
        <Image
          src="/images/design-mode/picto205.png"
          alt=""
          width={16}
          height={16}
          className="absolute -top-4 -right-4 opacity-60 rotate-12"
        />
        <Image
          src="/images/design-mode/picto207.png"
          alt=""
          width={16}
          height={16}
          className="absolute -top-4 -left-4 opacity-60 -rotate-12"
        />

        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-8 w-8 text-[#E73628]" />
          <h1 className="text-3xl font-black uppercase font-[family-name:var(--font-raleway)]">
            <Highlighter
              action="underline"
              color="#E73628"
              strokeWidth={4}
              animationDuration={600}
              iterations={1}
              isView={true}
            >
              {pageTitle}
            </Highlighter>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">{pageSubtitle}</p>
      </div>

      {/* Timeline */}
      <EventTimeline events={upcomingEvents} />
    </div>
  )
}
