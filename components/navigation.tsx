"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GlobalSearch } from "@/components/global-search"
import { Search, ChevronDown } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Navbar, NavBody, MobileNav, MobileNavMenu, MobileNavToggle, useNavbar } from "@/components/ui/resizable-navbar"

function NavItemWithBrush({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block font-semibold text-black group ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-0 -inset-x-1 -inset-y-0.5 bg-[#F4E63C] opacity-0 group-hover:opacity-60 transition-opacity duration-150 -z-10 rounded-sm"
        style={{
          clipPath:
            "polygon(0% 10%, 2% 8%, 5% 12%, 8% 6%, 12% 10%, 15% 5%, 18% 11%, 22% 7%, 25% 12%, 28% 8%, 32% 11%, 35% 6%, 38% 10%, 42% 8%, 45% 12%, 48% 7%, 52% 11%, 55% 9%, 58% 13%, 62% 8%, 65% 11%, 68% 7%, 72% 10%, 75% 6%, 78% 11%, 82% 8%, 85% 12%, 88% 7%, 92% 10%, 95% 8%, 98% 11%, 100% 9%, 100% 90%, 98% 92%, 95% 88%, 92% 94%, 88% 90%, 85% 95%, 82% 89%, 78% 93%, 75% 88%, 72% 94%, 68% 90%, 65% 95%, 62% 91%, 58% 94%, 55% 89%, 52% 93%, 48% 88%, 45% 92%, 42% 87%, 38% 91%, 35% 86%, 32% 90%, 28% 85%, 25% 89%, 22% 84%, 18% 88%, 15% 83%, 12% 87%, 8% 82%, 5% 86%, 2% 81%, 0% 85%)",
        }}
      />
    </span>
  )
}

function DropdownItemWithBrush({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <DropdownMenuItem asChild className="cursor-pointer p-0 focus:bg-transparent">
      <Link href={href} className="w-full block cursor-target">
        <span className="relative inline-block font-semibold text-black group w-full px-3 py-2">
          <span className="relative z-10">{children}</span>
          <span
            className="absolute inset-0 bg-[#F4E63C] opacity-0 group-hover:opacity-60 transition-opacity duration-150 -z-10 rounded-sm"
            style={{
              clipPath:
                "polygon(0% 10%, 2% 8%, 5% 12%, 8% 6%, 12% 10%, 15% 5%, 18% 11%, 22% 7%, 25% 12%, 28% 8%, 32% 11%, 35% 6%, 38% 10%, 42% 8%, 45% 12%, 48% 7%, 52% 11%, 55% 9%, 58% 13%, 62% 8%, 65% 11%, 68% 7%, 72% 10%, 75% 6%, 78% 11%, 82% 8%, 85% 12%, 88% 7%, 92% 10%, 95% 8%, 98% 11%, 100% 9%, 100% 90%, 98% 92%, 95% 88%, 92% 94%, 88% 90%, 85% 95%, 82% 89%, 78% 93%, 75% 88%, 72% 94%, 68% 90%, 65% 95%, 62% 91%, 58% 94%, 55% 89%, 52% 93%, 48% 88%, 45% 92%, 42% 87%, 38% 91%, 35% 86%, 32% 90%, 28% 85%, 25% 89%, 22% 84%, 18% 88%, 15% 83%, 12% 87%, 8% 82%, 5% 86%, 2% 81%, 0% 85%)",
            }}
          />
        </span>
      </Link>
    </DropdownMenuItem>
  )
}

function ContactButtonWithHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block font-semibold">
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-0 -inset-x-3 -inset-y-2 bg-[#B4D19F] opacity-80 -z-10 rounded-sm"
        style={{
          clipPath:
            "polygon(2% 5%, 5% 3%, 8% 6%, 12% 2%, 15% 7%, 18% 4%, 22% 8%, 25% 3%, 28% 6%, 32% 4%, 35% 8%, 38% 5%, 42% 9%, 45% 4%, 48% 7%, 52% 3%, 55% 8%, 58% 5%, 62% 9%, 65% 4%, 68% 7%, 72% 3%, 75% 8%, 78% 5%, 82% 9%, 85% 4%, 88% 7%, 92% 3%, 95% 6%, 98% 4%, 100% 7%, 100% 93%, 98% 96%, 95% 94%, 92% 97%, 88% 93%, 85% 96%, 82% 91%, 78% 95%, 75% 92%, 72% 97%, 68% 93%, 65% 96%, 62% 91%, 58% 95%, 55% 92%, 52% 97%, 48% 93%, 45% 96%, 42% 91%, 38% 95%, 35% 92%, 32% 96%, 28% 94%, 25% 97%, 22% 84%, 18% 96%, 15% 93%, 12% 98%, 8% 94%, 5% 97%, 2% 95%, 0% 93%)",
        }}
      />
    </span>
  )
}

function MobileMenuController() {
  const pathname = usePathname()
  const { setIsMobileMenuOpen } = useNavbar()

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname, setIsMobileMenuOpen])

  return null
}

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
      <Navbar className="bg-white border-b-2 border-[#E73628]">
        <MobileMenuController />

        <NavBody>
          <Link
            href="/"
            className="flex items-center space-x-2 cursor-target flex-shrink-0 max-w-[140px] sm:max-w-none"
          >
            <Image
              src="/images/logo-egc.png"
              alt="États Généraux Communaux"
              width={180}
              height={72}
              className="h-7 sm:h-8 md:h-10 w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/les-egc" className="text-sm text-black transition-colors px-3 py-2 rounded-md cursor-target">
              <NavItemWithBrush>Notre ambition</NavItemWithBrush>
            </Link>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-sm text-black hover:bg-transparent relative group cursor-target"
                >
                  <NavItemWithBrush>
                    <span className="flex items-center gap-1">
                      S'organiser & Agir
                      <ChevronDown className="h-3.5 w-3.5" />
                    </span>
                  </NavItemWithBrush>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px] border-2 border-[#E73628] bg-white">
                <DropdownItemWithBrush href="/les-doleances">Les Doléances</DropdownItemWithBrush>
                <DropdownItemWithBrush href="/ressources">Assemblées citoyennes communales</DropdownItemWithBrush>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-sm text-black hover:bg-transparent relative group cursor-target"
                >
                  <NavItemWithBrush>
                    <span className="flex items-center gap-1">
                      S'informer
                      <ChevronDown className="h-3.5 w-3.5" />
                    </span>
                  </NavItemWithBrush>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px] border-2 border-[#E73628] bg-white">
                <DropdownItemWithBrush href="/evenements">Evénements</DropdownItemWithBrush>
                <DropdownItemWithBrush href="/blog">Actus</DropdownItemWithBrush>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-sm text-black hover:bg-transparent relative group cursor-target"
                >
                  <NavItemWithBrush>
                    <span className="flex items-center gap-1">
                      Faire Rhizome
                      <ChevronDown className="h-3.5 w-3.5" />
                    </span>
                  </NavItemWithBrush>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px] border-2 border-[#E73628] bg-white">
                <DropdownItemWithBrush href="/a-propos">A propos</DropdownItemWithBrush>
                <DropdownItemWithBrush href="/groupes-locaux">Groupes communaux</DropdownItemWithBrush>
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
              className="gap-2 text-sm font-semibold hover:bg-[#F4E63C]/20 hover:text-[#E73628] cursor-target"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Rechercher</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-transparent hover:bg-transparent bg-transparent cursor-target"
            >
              <Link href="/contact">
                <ContactButtonWithHighlight>Participer</ContactButtonWithHighlight>
              </Link>
            </Button>
          </div>

          <div className="md:hidden flex items-center flex-shrink-0">
            <MobileNavToggle />
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavMenu
            className="px-2"
            style={{
              paddingLeft: "max(1rem, env(safe-area-inset-left))",
              paddingRight: "max(1rem, env(safe-area-inset-right))",
            }}
          >
            <Link
              href="/les-egc"
              className="text-foreground hover:text-[#E73628] transition-colors font-semibold px-4 py-2 block"
            >
              Notre ambition
            </Link>

            <div className="space-y-2 px-4 py-2">
              <div className="font-bold text-sm text-[#44843F] uppercase">S'organiser & Agir</div>
              <Link
                href="/les-doleances"
                className="block pl-4 py-1 text-sm text-foreground hover:text-[#E73628] transition-colors font-medium"
              >
                Les Doléances
              </Link>
              <Link
                href="/ressources"
                className="block pl-4 py-1 text-sm text-foreground hover:text-[#E73628] transition-colors font-medium"
              >
                Assemblées citoyennes communales
              </Link>
            </div>

            <div className="space-y-2 px-4 py-2">
              <div className="font-bold text-sm text-[#44843F] uppercase">S'informer</div>
              <Link
                href="/evenements"
                className="block pl-4 py-1 text-sm text-foreground hover:text-[#E73628] transition-colors font-medium"
              >
                Evénements
              </Link>
              <Link
                href="/blog"
                className="block pl-4 py-1 text-sm text-foreground hover:text-[#E73628] transition-colors font-medium"
              >
                Actus
              </Link>
            </div>

            <div className="space-y-2 px-4 py-2">
              <div className="font-bold text-sm text-[#44843F] uppercase">Faire Rhizome</div>
              <Link
                href="/a-propos"
                className="block pl-4 py-1 text-sm text-foreground hover:text-[#E73628] transition-colors font-medium"
              >
                A propos
              </Link>
              <Link
                href="/groupes-locaux"
                className="block pl-4 py-1 text-sm text-foreground hover:text-[#E73628] transition-colors font-medium"
              >
                Groupes communaux
              </Link>
            </div>

            <div className="px-4 pt-4 pb-2 border-t border-gray-200">
              <Link href="/contact" className="block w-full">
                <div className="text-center py-3">
                  <ContactButtonWithHighlight>
                    <span className="text-base font-semibold">Participer</span>
                  </ContactButtonWithHighlight>
                </div>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
