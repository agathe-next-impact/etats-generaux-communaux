import sanitize from "sanitize-html"

/**
 * Sanitize HTML content from WordPress to prevent XSS attacks.
 * Allows safe HTML tags (formatting, links, images) but removes scripts and event handlers.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ""
  return sanitize(html, {
    allowedTags: [
      ...sanitize.defaults.allowedTags,
      "img", "iframe", "h1", "h2", "figure", "figcaption",
    ],
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      iframe: ["src", "allow", "allowfullscreen", "frameborder", "scrolling", "width", "height"],
      img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
      a: ["href", "name", "target", "rel"],
      "*": ["class", "id", "style"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  })
}

/**
 * Escape HTML special characters to prevent injection in email templates or plain text contexts.
 */
export function escapeHtml(text: string): string {
  if (!text) return ""
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Validate that a URL uses a safe protocol (http or https only).
 * Returns the URL if valid, or null if potentially dangerous.
 */
export function validateUrl(url: string): string | null {
  if (!url || !url.trim()) return null
  try {
    const parsed = new URL(url, "https://placeholder.com")
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return url
    }
    return null
  } catch {
    return null
  }
}
