import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getLocalGroups } from "@/lib/wordpress"
import { MapPin, Mail, Phone, Globe, Users } from "lucide-react"
import Link from "next/link"
import { GoogleMap } from "@/components/google-map"
import { UnderlinedH1 } from "@/components/ui/underlined-heading"

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

  return (
    <div className="space-y-8">
      {/* Map Section */}
      <div className="h-96 w-full rounded-lg overflow-hidden border">
        <GoogleMap groups={groups} />
      </div>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {group.acf?.nom_de_groupe || group.title.rendered}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{group.acf?.localisation?.address || "Localisation non définie"}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
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
                  <Button asChild variant="outline" size="sm">
                    <Link href={group.acf.site_web} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-1" />
                      Site web
                    </Link>
                  </Button>
                )}

                {group.acf?.email_de_contact && (
                  <Button asChild size="sm">
                    <Link href={`mailto:${group.acf.email_de_contact}`}>
                      <Mail className="h-4 w-4 mr-1" />
                      Contacter
                    </Link>
                  </Button>
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
  return (
    <div className="min-h-screen py-12 pt-[150px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <UnderlinedH1 className="magazine-title text-4xl md:text-5xl text-foreground">Groupes Locaux</UnderlinedH1>
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
