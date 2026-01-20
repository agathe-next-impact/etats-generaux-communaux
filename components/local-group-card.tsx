import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import Link from "next/link"
import type { WordPressLocalGroup } from "@/lib/wordpress"
import Image from "next/image"

interface LocalGroupCardProps {
  group: WordPressLocalGroup & {
    acf?: {
      nom_de_groupe?: string
      localisation?: {
        address?: string
        lat?: number
        lng?: number
      }
      descriptif?: string
      nom_de_contact?: string
      email_de_contact?: string
      telephone_de_contact?: string
      site_web?: string
    }
  }
  index: number
}

export function LocalGroupCard({ group, index }: LocalGroupCardProps) {
  // Extract city from address (assuming format: "Street, PostalCode City, Country")
  const getCity = (address?: string) => {
    if (!address) return "Ville inconnue"
    const parts = address.split(",")
    if (parts.length >= 2) {
      // Get the part before the last comma (usually "PostalCode City")
      const cityPart = parts[parts.length - 2].trim()
      // Remove postal code (assuming it's at the start)
      return cityPart.replace(/^\d+\s*/, "")
    }
    return address
  }

  // Alternate border colors based on index
  const borderColors = ["border-l-[#E73628]", "border-l-[#F4E63C]", "border-l-[#4AAD33]"]
  const borderColor = borderColors[index % borderColors.length]

  const groupName = group.acf?.nom_de_groupe || group.title.rendered
  const city = getCity(group.acf?.localisation?.address)
  const description = group.acf?.descriptif || ""

  const pictos = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%201-YFeeOd4CBQ2S2bGA4pPLgNc6hMYIPd.png", // picto 1
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%202-XT3JEJBM0RTr1nZ4p7W1zXmIKbvoE1.png", // picto 2
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%203-iph3iRcbh4GzoswUQo87W7giQs9vrW.png", // picto 3
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%204-ac6W7GEoGBcgE6fyqHJLr2EBOsnw7u.png", // picto 4
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%205-1otn1kQK9Cg25uM98EKKPTXzxXhRq2.png", // picto 5
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/picto%207-ortOMnxOuv7texPH3RxLJTGkLhXhuQ.png", // picto 7
  ]

  return (
    <Link href="/groupes-locaux" className="block group">
      <Card
        className={`border-l-4 ${borderColor} hover:shadow-lg transition-shadow duration-300 overflow-visible relative`}
      >
        <Image
          src={pictos[index % pictos.length] || "/placeholder.svg"}
          alt=""
          width={48}
          height={48}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
        />

        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#E73628]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground mb-1 group-hover:text-[#E73628] transition-colors line-clamp-1">
                {groupName}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {city}
              </p>
              {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
