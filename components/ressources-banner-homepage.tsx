import { getArchivePageTitles, getResources } from "@/lib/wordpress";
import { Highlighter } from "@/components/ui/highlighter";
import { ResourceCard } from "@/components/resource-card";
import Image from "next/image";
import Link from "next/dist/client/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default async function ResourcesBanner() {
  const pageTitles = await getArchivePageTitles();
  const title = pageTitles?.page_ressources_et_kits?.titre || "Ressources et kits";
  const subtitle = pageTitles?.page_ressources_et_kits?.["sous-titre"] || "Découvrez notre collection de guides, outils et documents pour accompagner votre engagement et vos actions collectives.";
  const resources = await getResources();

  return (
    <div className="min-h-screen py-12 pt-[150px] relative overflow-hidden">
      <Image
        src="/images/design-mode/picto200.png"
        alt=""
        width={120}
        height={120}
        className="absolute top-20 left-[5%] opacity-20 pointer-events-none -rotate-12"
      />
      <Image
        src="/images/design-mode/picto205.png"
        alt=""
        width={100}
        height={100}
        className="absolute top-[30%] right-[8%] opacity-15 pointer-events-none rotate-45"
      />
      <Image
        src="/images/design-mode/picto207.png"
        alt=""
        width={80}
        height={80}
        className="absolute bottom-[20%] left-[10%] opacity-20 pointer-events-none rotate-12"
      />
      <Image
        src="/images/design-mode/picto204.png"
        alt=""
        width={140}
        height={140}
        className="absolute bottom-[10%] right-[5%] opacity-15 pointer-events-none -rotate-6"
      />
      <Image
        src="/images/design-mode/picto203.png"
        alt=""
        width={90}
        height={90}
        className="absolute top-[50%] left-[3%] opacity-10 pointer-events-none rotate-[25deg]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 relative">
          <Image
            src="/images/design-mode/picto202.png"
            alt=""
            width={60}
            height={60}
            className="absolute -top-8 -left-4 opacity-30 pointer-events-none rotate-12"
          />
          <Image
            src="/images/design-mode/picto207.png"
            alt=""
            width={50}
            height={50}
            className="absolute -top-6 -right-6 opacity-25 pointer-events-none -rotate-12"
          />

          <h1 className="text-4xl md:text-5xl uppercase font-black text-foreground mb-4">
            <Highlighter
              action="underline"
              color="#E73628"
              strokeWidth={3}
              animationDuration={600}
              iterations={1}
              isView={true}
            >
              {title}
            </Highlighter>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.slice(0, 3).map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
        <div className="mt-10 text-center">
                <Link
                  href="/ressources"        
                  className="inline-block"
                >
                  <Button size="lg" className="text-lg">
                      Toutes les ressources et kits

                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
            </div>

        

      </div>
    </div>
  );
}

