import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getLocalGroups } from "@/lib/wordpress"
import { MapPin, Mail, Phone, Globe, Users } from "lucide-react"
import Link from "next/link"
import { GoogleMap } from "@/components/google-map"
import { Highlighter } from "@/components/ui/highlighter"
import Image from "next/image"

export const metadata = {
  title: "Groupes Locaux | Magazine Collectif",
  description:
    "Découvrez les groupes locaux de notre réseau partout en France. Rejoignez une communauté engagée près de chez vous et participez aux actions citoyennes locales.",
  openGraph: {
    title: "Groupes Locaux | Magazine Collectif",
    description:
      "Découvrez les groupes locaux de notre réseau partout en France. Rejoignez une communauté engagée près de chez vous.",
    type: "website",
  },
}

async function LocalGroupsMap() {
  const groups = await getLocalGroups()

  console.log("[v0] Local groups loaded:", groups.length)

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun groupe local disponible pour le moment.</p>
      </div>
    )
  }

  const borderColors = ["#E73628", "#F4E63C", "#4AAD33"]
  const pictos = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png", // picto 1
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png", // picto 2
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-iph3iRcbh4GzoswUQo87W7giQs9vrW.png", // picto 3
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-ac6W7GEoGBcgE6fyqHJLr2EBOsnw7u.png", // picto 4
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png", // picto 5
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-ortOMnxOuv7texPH3RxLJTGkLhXhuQ.png", // picto 7
  ]

  return (
    <div className="space-y-8">
      {/* Map Section */}
      <div className="h-96 w-full rounded-lg overflow-hidden border-4" style={{ borderColor: "#E73628" }}>
        <GoogleMap groups={groups} />
      </div>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <Card
            key={group.id}
            className="group hover:shadow-lg transition-all duration-300 border-4 overflow-visible relative"
            style={{ borderColor: borderColors[index % borderColors.length] }}
          >
            <Image
              src={pictos[index % pictos.length] || "/placeholder.svg"}
              alt=""
              width={20}
              height={20}
              className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            />

            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle
                    className="text-lg group-hover:text-primary transition-colors font-black uppercase"
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    {group.acf?.nom_de_groupe || group.title.rendered}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{group.acf?.localisation?.address || "Localisation non définie"}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-2"
                  style={{ borderColor: "#4AAD33", color: "#4AAD33" }}
                >
                  <Users className="h-3 w-3 mr-1" />
                  Groupe local
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {group.acf?.descriptif || "Description du groupe local"}
              </p>

              {/* Contact Information */}
              <div className="space-y-2">
                {group.acf?.nom_de_contact && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{group.acf.nom_de_contact}</span>
                  </div>
                )}

                {group.acf?.email_de_contact && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${group.acf.email_de_contact}`} className="text-primary hover:underline">
                      {group.acf.email_de_contact}
                    </a>
                  </div>
                )}

                {group.acf?.telephone_de_contact && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${group.acf.telephone_de_contact}`} className="text-primary hover:underline">
                      {group.acf.telephone_de_contact}
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {group.acf?.site_web && (
                  <Highlighter
                    action="highlight"
                    color="#B4D19F"
                    strokeWidth={4}
                    animationDuration={600}
                    iterations={1}
                    padding={6}
                    isView={true}
                  >
                    <Button asChild variant="outline" size="sm">
                      <Link href={group.acf.site_web} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-1" />
                        Site web
                      </Link>
                    </Button>
                  </Highlighter>
                )}

                {group.acf?.email_de_contact && (
                  <Highlighter
                    action="highlight"
                    color="#94BF7E"
                    strokeWidth={4}
                    animationDuration={600}
                    iterations={1}
                    padding={6}
                    isView={true}
                  >
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`mailto:${group.acf.email_de_contact}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        Contacter
                      </Link>
                    </Button>
                  </Highlighter>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function LocalGroupsPage() {
  const pictos = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png", // picto 1
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png", // picto 2
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-iph3iRcbh4GzoswUQo87W7giQs9vrW.png", // picto 3
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-ac6W7GEoGBcgE6fyqHJLr2EBOsnw7u.png", // picto 4
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png", // picto 5
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-ortOMnxOuv7texPH3RxLJTGkLhXhuQ.png", // picto 7
  ]

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 relative">
          <Image
            src={pictos[0] || "/placeholder.svg"}
            alt=""
            width={80}
            height={80}
            className="absolute left-[5%] top-[10%] opacity-20 -rotate-12 pointer-events-none"
          />
          <Image
            src={pictos[1] || "/placeholder.svg"}
            alt=""
            width={60}
            height={60}
            className="absolute right-[8%] top-[5%] opacity-15 rotate-6 pointer-events-none"
          />
          <Image
            src={pictos[2] || "/placeholder.svg"}
            alt=""
            width={70}
            height={70}
            className="absolute left-[15%] bottom-[10%] opacity-10 rotate-12 pointer-events-none"
          />
          <Image
            src={pictos[4] || "/placeholder.svg"}
            alt=""
            width={50}
            height={50}
            className="absolute right-[12%] bottom-[15%] opacity-20 -rotate-6 pointer-events-none"
          />

          <h1 className="text-4xl md:text-5xl font-black uppercase" style={{ fontFamily: "Raleway, sans-serif" }}>
            <Highlighter
              action="underline"
              color="#E73628"
              strokeWidth={4}
              animationDuration={600}
              iterations={1}
              padding={8}
              isView={true}
            >
              Groupes Locaux
            </Highlighter>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez les groupes locaux de notre réseau partout en France. Rejoignez une communauté engagée près de
            chez vous et participez aux actions citoyennes locales.
          </p>
        </div>

        {/* Map and Groups */}
        <Suspense
          fallback={
            <div className="space-y-8">
              <div className="h-96 w-full rounded-lg bg-muted animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="space-y-2">
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="flex gap-2">
                        <div className="h-8 bg-muted rounded w-20" />
                        <div className="h-8 bg-muted rounded w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }
        >
          <LocalGroupsMap />
        </Suspense>
      </div>
    </div>
  )
}
