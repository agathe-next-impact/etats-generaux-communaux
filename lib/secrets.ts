import { createHash, timingSafeEqual } from "crypto"

/**
 * Compare un secret fourni à la valeur attendue en temps constant.
 * Retourne false si l'une des deux valeurs est absente.
 */
export function safeCompareSecret(provided: string | null | undefined, expected: string | undefined): boolean {
  if (!provided || !expected) return false
  // Hachage préalable : longueurs égales, aucune fuite sur la longueur du secret
  const a = createHash("sha256").update(provided).digest()
  const b = createHash("sha256").update(expected).digest()
  return timingSafeEqual(a, b)
}
