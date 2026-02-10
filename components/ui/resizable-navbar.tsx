"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"

interface NavbarContextType {
  isScrolled: boolean
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

const NavbarContext = React.createContext<NavbarContextType | undefined>(undefined)

export function useNavbar() {
  const context = React.useContext(NavbarContext)
  if (!context) {
    throw new Error("Navbar components must be used within a Navbar")
  }
  return context
}

interface NavbarProps {
  children: React.ReactNode
  className?: string
}

export function Navbar({ children, className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    let lastScrollY = window.scrollY
    const SCROLL_DOWN_THRESHOLD = 60
    const SCROLL_UP_THRESHOLD = 20

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Use hysteresis: different thresholds for scrolling down vs up
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        if (currentScrollY > SCROLL_DOWN_THRESHOLD) {
          setIsScrolled(true)
        }
      } else {
        // Scrolling up
        if (currentScrollY <= SCROLL_UP_THRESHOLD) {
          setIsScrolled(false)
        }
      }

      lastScrollY = currentScrollY
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  return (
    <NavbarContext.Provider value={{ isScrolled, isMobileMenuOpen, setIsMobileMenuOpen }}>
      <motion.nav
        initial={false}
        animate={{
          width: isScrolled ? "95%" : "100%",
          maxWidth: isScrolled ? "1280px" : "100%",
          borderRadius: isScrolled ? "12px" : "0px",
          marginTop: isScrolled ? "41px" : "44px",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "0",
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
          type: "tween"
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border",
          isScrolled && "shadow-lg",
          className,
        )}
      >
        {children}
      </motion.nav>
    </NavbarContext.Provider>
  )
}

interface NavBodyProps {
  children: React.ReactNode
  className?: string
}

export function NavBody({ children, className }: NavBodyProps) {
  return (
    <div className={cn("max-w-7xl mx-auto px-2 sm:px-4 lg:px-8", className)}>
      <div className="flex items-center justify-between h-16 w-full gap-1 sm:gap-2">{children}</div>
    </div>
  )
}

interface NavItemsProps {
  items: Array<{ name: string; link: string }>
  className?: string
  onItemClick?: () => void
}

export function NavItems({ items, className, onItemClick }: NavItemsProps) {
  return (
    <div className={cn("hidden md:flex items-center space-x-8", className)}>
      {items.map((item) => (
        <a
          key={item.name}
          href={item.link}
          onClick={onItemClick}
          className="text-foreground hover:text-primary transition-colors font-medium"
        >
          {item.name}
        </a>
      ))}
    </div>
  )
}

interface MobileNavProps {
  children: React.ReactNode
  className?: string
}

export function MobileNav({ children, className }: MobileNavProps) {
  const { isMobileMenuOpen } = useNavbar()

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn("md:hidden border-t border-border overflow-hidden bg-white", className)}
        >
          <div className="py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface MobileNavMenuProps {
  children: React.ReactNode
  className?: string
}

export function MobileNavMenu({ children, className }: MobileNavMenuProps) {
  return <div className={cn("flex flex-col space-y-4", className)}>{children}</div>
}

interface MobileNavToggleProps {
  className?: string
}

export function MobileNavToggle({ className }: MobileNavToggleProps) {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useNavbar()

  return (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className={cn(
        "md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[44px] min-h-[44px]",
        className,
      )}
      aria-expanded={isMobileMenuOpen}
      aria-label="Toggle navigation menu"
      type="button"
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        {isMobileMenuOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12m-16.5 5.25h16.5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        )}
      </svg>
    </button>
  )
}

interface NavbarButtonProps {
  href?: string
  as?: React.ElementType
  children: React.ReactNode
  className?: string
  variant?: "primary" | "secondary" | "gradient"
  onClick?: () => void
}

export function NavbarButton({
  href,
  as: Component = "a",
  children,
  className,
  variant = "primary",
  onClick,
}: NavbarButtonProps) {
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    gradient: "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90",
  }

  const props = href ? { href } : {}

  return (
    <Component
      {...props}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </Component>
  )
}
