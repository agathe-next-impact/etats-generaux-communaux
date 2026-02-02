"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import SocialLinks from "@/components/social-links"
import { ChevronDown } from "lucide-react"
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
        <span className="relative inline-block font-semibold text-black group w-full px-3 py-2 text-base">
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
            <Link href="/les-egc" className="text-base text-black transition-colors px-3 py-2 rounded-md cursor-target">
              <NavItemWithBrush>Notre ambition</NavItemWithBrush>
            </Link>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-base text-black hover:bg-transparent relative group cursor-target"
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
                <DropdownItemWithBrush href="/ressources">Ressources</DropdownItemWithBrush>
                <DropdownItemWithBrush href="/groupes-locaux">Groupes locaux</DropdownItemWithBrush>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-base text-black hover:bg-transparent relative group cursor-target"
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
                <DropdownItemWithBrush href="/newsletter">Newsletter</DropdownItemWithBrush>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/a-propos" className="text-base text-black transition-colors px-3 py-2 rounded-md cursor-target">
              <NavItemWithBrush>A propos</NavItemWithBrush>
            </Link>

          </div>

          <div className="hidden md:flex items-center space-x-2">
            <SocialLinks />
            <Link href="/contact" className="inline-block">
              <Button
                variant="outline"
                size="sm"
                className="border-transparent hover:bg-transparent bg-transparent cursor-target text-red-600 font-bold uppercase underline underline-offset-4 underline-yellow-400"
              >
                Contact
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center flex-shrink-0">
            <MobileNavToggle />
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavMenu
            className="bg-white"
            // @ts-expect-error: safe-area-inset utility not available in Tailwind, so we use inline style below
            // style prop removed, padding added to className
            // Add padding via className using Tailwind and fallback for safe-area-inset
            style={undefined}
          >


            {/* Main Navigation */}
            <div className="px-4 space-y-1">
              <Link
                href="/les-egc"
                className="block px-4 py-3 text-base font-bold text-foreground hover:bg-[#F4E63C]/30 rounded-lg transition-all group relative overflow-hidden"
              >
                <span className="relative z-10 font-semibold text-[#E73628] uppercase tracking-wider">Notre ambition</span>
                <span className="absolute inset-0 bg-[#F4E63C] opacity-0 group-hover:opacity-20 transition-opacity rounded-lg" />
              </Link>

              {/* S'organiser & Agir Section */}
              <div className="py-2">
                <div className="px-4 py-2 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-[#E73628] to-transparent" />
                  <span className="text-xs font-bold text-[#E73628] uppercase tracking-wider">S'organiser & Agir</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-[#E73628] to-transparent" />
                </div>
                <div className="space-y-1 mt-2">
                  <Link
                    href="/les-doleances"
                    className="block px-6 py-2.5 text-base font-semibold text-foreground hover:text-[#E73628] hover:bg-[#B4D19F]/20 rounded-lg transition-all relative group"
                  >
                    <span className="relative z-10">Les Doléances</span>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#44843F] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href="/ressources"
                    className="block px-6 py-2.5 text-base font-semibold text-foreground hover:text-[#E73628] hover:bg-[#B4D19F]/20 rounded-lg transition-all relative group"
                  >
                    <span className="relative z-10">Ressources</span>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#44843F] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href="/groupes-locaux"
                    className="block px-6 py-2.5 text-base font-semibold text-foreground hover:text-[#E73628] hover:bg-[#B4D19F]/20 rounded-lg transition-all relative group"
                  >
                    <span className="relative z-10">Groupes locaux</span>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#44843F] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </div>

              {/* S'informer Section */}
              <div className="py-2">
                <div className="px-4 py-2 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-[#E73628] to-transparent" />
                  <span className="text-xs font-bold text-[#E73628] uppercase tracking-wider">S'informer</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-[#E73628] to-transparent" />
                </div>
                <div className="space-y-1 mt-2">
                  <Link
                    href="/evenements"
                    className="block px-6 py-2.5 text-base font-semibold text-foreground hover:text-[#E73628] hover:bg-[#B4D19F]/20 rounded-lg transition-all relative group"
                  >
                    <span className="relative z-10">Evénements</span>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#44843F] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href="/blog"
                    className="block px-6 py-2.5 text-base font-semibold text-foreground hover:text-[#E73628] hover:bg-[#B4D19F]/20 rounded-lg transition-all relative group"
                  >
                    <span className="relative z-10">Actus</span>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#44843F] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href="/newsletter"
                    className="block px-6 py-2.5 text-base font-semibold text-foreground hover:text-[#E73628] hover:bg-[#B4D19F]/20 rounded-lg transition-all relative group"
                  >
                    <span className="relative z-10">Newsletter</span>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#44843F] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </div>

              {/* A propos - lien direct comme dans le desktop */}
              <Link
                href="/a-propos"
                className="block px-4 py-3 text-base font-bold text-foreground hover:bg-[#F4E63C]/30 rounded-lg transition-all group relative overflow-hidden"
              >
                <span className="relative z-10 font-semibold text-[#E73628] uppercase tracking-wider">A propos</span>
                <span className="absolute inset-0 bg-[#F4E63C] opacity-0 group-hover:opacity-20 transition-opacity rounded-lg" />
              </Link>
            </div>

            {/* Réseaux sociaux mobile */}
            <div className="px-4 pt-4 pb-2 flex gap-3">
              <SocialLinks />
            </div>

            {/* CTA Button - Contact */}
            <div className="px-4 pt-6 pb-8 mt-4 border-t-2 border-[#E73628]/20">
              <Link href="/contact" className="block">
                <div className="relative group overflow-hidden rounded-lg">
                  <div className="absolute inset-0" />
                  <div className="relative z-10 px-6 py-4 text-center">
                    <span className="text-lg font-bold text-[#E73628] uppercase">Contact</span>
                  </div>
                </div>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </>
  )
}
