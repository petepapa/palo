import themeConfig from '@config'

/**
 * Ensures a URL has a trailing slash based on the site configuration.
 * Only applies to internal relative paths (starting with '/').
 * Skips external URLs, root '/', URLs with file extensions, and URLs with fragments.
 *
 * @param href - The URL to process
 * @returns The URL with or without trailing slash based on config
 */
export function ensureTrailingSlash(href: string): string {
  if (!themeConfig.site.trailingSlash) {
    return href
  }

  // Only process internal paths starting with '/'
  if (!href.startsWith('/')) {
    return href
  }

  // Skip root path
  if (href === '/') {
    return href
  }

  // Skip URLs with file extensions (e.g., /image.png, /file.pdf)
  if (/\.[a-zA-Z0-9]+$/.test(href)) {
    return href
  }

  // Skip URLs with fragments
  if (href.includes('#')) {
    return href
  }

  // Skip URLs that already end with trailing slash
  if (href.endsWith('/')) {
    return href
  }

  return `${href}/`
}