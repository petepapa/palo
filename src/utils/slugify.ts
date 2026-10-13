/**
 * Convert a string to a URL-friendly slug
 * Preserves Unicode letters (CJK, accented, etc.) and retains the
 * established separator behavior for existing tag URLs.
 * @param text - The text to convert to a slug
 * @returns A slugified string
 */
export function slugify(text: string): string {
  return text
    .normalize('NFC')
    .trim()
    .toLowerCase()
    // Convert every separator (spaces, punctuation, symbols, and underscores)
    // to one hyphen. This preserves legacy routes such as "UI/UX" -> "ui-ux".
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

export interface TagOption {
  label: string
  slug: string
}

/**
 * Build safe, unique tag navigation options from frontmatter labels.
 * Empty slugs are excluded and labels that resolve to the same URL share one
 * route, preventing broken links and duplicate static paths.
 */
export function getTagOptions(labels: readonly string[]): TagOption[] {
  const seenSlugs = new Set<string>()

  return [...new Set(labels)]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((label) => ({ label, slug: slugify(label) }))
    .filter((tag) => {
      if (!tag.slug || seenSlugs.has(tag.slug)) return false
      seenSlugs.add(tag.slug)
      return true
    })
}
