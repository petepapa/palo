/**
 * Convert a string to a URL-friendly slug
 * Preserves Unicode letters (CJK, accented, etc.) so non-ASCII
 * labels like Chinese tags produce usable slugs instead of "".
 * @param text - The text to convert to a slug
 * @returns A slugified string
 */
export function slugify(text: string): string {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      // Keep Unicode letters/numbers (incl. Han) and hyphens, drop the rest
      .replace(/[^\p{L}\p{N}-]+/gu, '')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '')
  )
}
