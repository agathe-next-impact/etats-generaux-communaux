/**
 * URL publique canonique du site (avec protocole, sans slash final).
 * Le domaine nu redirige vers www : c'est donc www qui fait foi.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.lesetatsgenerauxcommunaux.org").replace(/\/$/, "")
