import themeConfig from '@config'

/**
 * Ensures a URL has or doesn't have a trailing slash based on the site configuration.
 * Only applies to internal relative paths (starting with '/').
 * Skips external URLs, root '/', URLs with file extensions, and URLs with fragments.
 *
 * @param href - The URL to process
 * @returns The URL with or without trailing slash based on config
 */
export function ensureTrailingSlash(href: string): string {
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

  if (!themeConfig.site.trailingSlash) {
    // trailingSlash: false — strip trailing slash if present
    if (href.endsWith('/') && href.length > 1) {
      return href.slice(0, -1)
    }
    return href
  }

  // trailingSlash: true — add trailing slash if not present
  if (href.endsWith('/')) {
    return href
  }

  return `${href}/`
}