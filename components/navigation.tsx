"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GlobalSearch } from "@/components/global-search"
import { Search, ChevronDown } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar"

export function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSearchClick = () => {
    router.push("/recherche")
  }

  return (
    <>
      <Navbar>
        <NavBody>
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo-egc.png"
              alt="États Généraux Communaux"
              width={120}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {/* Qui sommes nous ? - direct link */}
            <Link
              href="/les-egc"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent/50"
            >
              Qui sommes nous ?
            </Link>

            {/* S'organiser et agir - dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-sm font-normal text-foreground/80 hover:text-foreground hover:bg-accent/50"
                >
                  S'organiser et agir
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px]">
                <DropdownMenuItem asChild>
                  <Link href="/ressources" className="cursor-pointer text-sm">
                    Ressources
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/evenements" className="cursor-pointer text-sm">
                    Evénements
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* S'informer - dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-sm font-normal text-foreground/80 hover:text-foreground hover:bg-accent/50"
                >
                  S'informer
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px]">
                <DropdownMenuItem asChild>
                  <Link href="/blog" className="cursor-pointer text-sm">
                    Actus
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/a-propos" className="cursor-pointer text-sm">
                    A propos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Le rhizome - dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-sm font-normal text-foreground/80 hover:text-foreground hover:bg-accent/50"
                >
                  Le rhizome
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px]">
                <DropdownMenuItem asChild>
                  <Link href="/groupes-locaux" className="cursor-pointer text-sm">
                    Groupes locaux
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/soutiens" className="cursor-pointer text-sm">
                    Soutiens
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/participer" className="cursor-pointer text-sm">
                    Participer
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              onContextMenu={(e) => {
                e.preventDefault()
                handleSearchClick()
              }}
              className="gap-2 text-sm"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Rechercher</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <NavbarButton href="/contact" variant="secondary" as={Link}>
              Contact
            </NavbarButton>
            <NavbarButton href="/participer" variant="primary" as={Link}>
              Participer
            </NavbarButton>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSearchClick}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/participer">Participer</Link>
            </Button>
            <MobileNavToggle />
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavMenu>
            <Link href="/les-egc" className="text-foreground hover:text-primary transition-colors font-medium px-4">
              Qui sommes nous ?
            </Link>

            <div className="space-y-2 px-4">
              <div className="font-semibold text-sm text-muted-foreground">S'organiser et agir</div>
              <Link
                href="/ressources"
                className="block pl-4 text-sm text-foreground hover:text-primary transition-colors"
              >
                Ressources
              </Link>
              <Link
                href="/evenements"
                className="block pl-4 text-sm text-foreground hover:text-primary transition-colors"
              >
                Evénements
              </Link>
            </div>

            <div className="space-y-2 px-4">
              <div className="font-semibold text-sm text-muted-foreground">S'informer</div>
              <Link href="/blog" className="block pl-4 text-sm text-foreground hover:text-primary transition-colors">
                Actus
              </Link>
              <Link
                href="/a-propos"
                className="block pl-4 text-sm text-foreground hover:text-primary transition-colors"
              >
                A propos
              </Link>
            </div>

            <div className="space-y-2 px-4">
              <div className="font-semibold text-sm text-muted-foreground">Le rhizome</div>
              <Link
                href="/groupes-locaux"
                className="block pl-4 text-sm text-foreground hover:text-primary transition-colors"
              >
                Groupes locaux
              </Link>
              <Link
                href="/soutiens"
                className="block pl-4 text-sm text-foreground hover:text-primary transition-colors"
              >
                Soutiens
              </Link>
              <Link
                href="/participer"
                className="block pl-4 text-sm text-foreground hover:text-primary transition-colors"
              >
                Participer
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
