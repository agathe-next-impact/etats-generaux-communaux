/** @type {import('next').NextConfig} */

// En-têtes de sécurité appliqués à toutes les pages.
// Pas encore de Content-Security-Policy complète (GA, Clarity, Maps, YouTube à inventorier) :
// seule la protection contre l'intégration du site dans une iframe tierce est posée.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
]

const nextConfig = {
  poweredByHeader: false,
  // Vérification TypeScript réactivée : le build échoue désormais en cas d'erreur de type
  images: {
    // Optimisation Next/Vercel (AVIF/WebP, redimensionnement) limitée aux deux sources réelles
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400, // 31 jours : les médias WordPress et Blob ne changent pas d'URL
    remotePatterns: [
      { protocol: "https", hostname: "admin.lesetatsgenerauxcommunaux.org", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com" },
      // Vignettes de la façade YouTube (servies depuis le domaine du site)
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

export default nextConfig
