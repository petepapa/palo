const trimSlash = (value: string): string => value.replace(/^\/+|\/+$/g, '')

/**
 * Single source of truth for internal path normalization.
 * '/' stays '/', all other internal routes are normalized by trailingSlash policy.
 */
export function normalizePath(path: string, trailingSlash = __PALO_TRAILING_SLASH__): string {
  if (!path || path === '/') {
    return '/'
  }

  const cleaned = trimSlash(path)
  if (!cleaned) {
    return '/'
  }

  const normalized = `/${cleaned}`
  return trailingSlash ? `${normalized}/` : normalized
}

/**
 * Build an internal path from segments, matching framework trailingSlash strategy.
 */
export function createPath(...params: string[]): string {
  const path = params
    .map((segment) => trimSlash(segment))
    .filter(Boolean)
    .join('/')

  return normalizePath(path)
}

/**
 * Normalize an internal href while preserving query/hash and static files.
 */
export function ensureTrailingSlash(href: string): string {
  if (!href.startsWith('/')) {
    return href
  }

  const [beforeHash, hash = ''] = href.split('#')
  const [pathname, query = ''] = beforeHash.split('?')

  // Skip static file paths such as /image.png or /fonts/app.woff2
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return href
  }

  const normalizedPath = normalizePath(pathname)
  const queryPart = query ? `?${query}` : ''
  const hashPart = hash ? `#${hash}` : ''
  return `${normalizedPath}${queryPart}${hashPart}`
}

/**
 * Canonical URL normalization to avoid mixed slash variants in SEO output.
 */
export function getCanonical(path = '', site = ''): string {
  const normalizedPath = normalizePath(path)
  const trimmedSite = String(site ?? '').trim()
  if (!trimmedSite) {
    return normalizedPath
  }
  return String(new URL(normalizedPath, trimmedSite))
}
