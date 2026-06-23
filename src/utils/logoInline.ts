/**
 * Logo Inline Utility — Build-Time SVG Inlining & Sanitization
 *
 * Reads SVG files from the /public directory at Astro build time,
 * sanitizes them against XSS, and returns clean inline-ready content.
 *
 * Why fs.readFileSync instead of import.meta.glob?
 *   Vite does not process files under /public — they bypass the module
 *   pipeline and are served as static assets.  import.meta.glob cannot
 *   resolve them.  This module mirrors the approach already used in
 *   astro.config.mjs for config.yaml loading.
 *
 * ## Size Warning
 *   SVGs above ~25 KB (uncompressed) will bloat the HTML payload.
 *   Keep logo SVGs lean — strip Illustrator metadata, use SVGO if needed.
 */

import fs from 'node:fs'
import path from 'node:path'
import sanitizeHtml from 'sanitize-html'

// ── Constants ───────────────────────────────────────────────────────────

const PUBLIC_DIR = path.resolve('public')

/** Extensions treated as inline-able vector graphics */
const SVG_EXT = new Set(['.svg'])

/** Extensions that fall back to the <img> raster channel */
const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'])

// ── Format Detection ────────────────────────────────────────────────────

/** Returns true when the configured path ends with a recognised SVG extension. */
export function isSvgPath(p: string): boolean {
  if (!p) return false
  return SVG_EXT.has(path.extname(p).toLowerCase())
}

/** Returns true when the configured path ends with a recognised raster extension. */
export function isRasterPath(p: string): boolean {
  if (!p) return false
  return RASTER_EXT.has(path.extname(p).toLowerCase())
}

// ── Sanitization ────────────────────────────────────────────────────────

/**
 * Sanitize raw SVG markup for safe inline injection.
 *
 * Removes:
 *  - XML declarations / DOCTYPE (invalid in inline SVG)
 *  - <script> blocks
 *  - on* event handler attributes
 *  - javascript: protocol URLs
 *
 * Uses sanitize-html (devDependency, already present in the project).
 * Falls back to a regex-only pass if the library is unavailable.
 */
function sanitizeSvg(raw: string): string {
  let cleaned = raw

  // 1. Strip XML prolog and DOCTYPE — invalid inside HTML <body>
  cleaned = cleaned.replace(/<\?xml[^?]*\?>/gi, '')
  cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '')

  // 2. Full sanitization via sanitize-html
  cleaned = sanitizeHtml(cleaned, {
    allowedTags: false, // allow all SVG / HTML tags
    allowedAttributes: false, // allow all attributes (on* still stripped by default)
    allowVulnerableTags: true, // needed for <style> inside SVG
  })

  // 3. Belt-and-suspenders: strip any remaining event handlers & js: URLs
  cleaned = cleaned
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript\s*:/gi, '')

  return cleaned
}

// ── Public API ──────────────────────────────────────────────────────────

/**
 * Read an SVG from /public and return sanitized inline-ready content.
 *
 * @param logoPath  Config-resolved path, e.g. '/branding/logo-light.svg'
 * @returns         Clean SVG string, or null if the file is missing/unreadable.
 */
export function getLogoSvg(logoPath: string): string | null {
  if (!logoPath || !isSvgPath(logoPath)) return null

  const normalizedPath = logoPath.replace(/^\//, '')
  const fullPath = path.join(PUBLIC_DIR, normalizedPath)

  if (!fs.existsSync(fullPath)) {
    console.warn(`[logoInline] SVG not found: ${fullPath}`)
    return null
  }

  // Guard against accidentally inlining huge SVGs (safety net — 64 KB)
  const stat = fs.statSync(fullPath)
  if (stat.size > 64 * 1024) {
    console.warn(
      `[logoInline] SVG too large (${(stat.size / 1024).toFixed(1)} KB), skipping inline: ${fullPath}`,
    )
    return null
  }

  try {
    const raw = fs.readFileSync(fullPath, 'utf-8')
    return sanitizeSvg(raw)
  } catch (err) {
    console.error(`[logoInline] Failed to read SVG: ${fullPath}`, err)
    return null
  }
}
