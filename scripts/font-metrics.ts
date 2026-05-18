/**
 * Font Metrics Measurement Tool
 *
 * Reads font files and calculates the cap-height offset needed for
 * perfect vertical alignment of text elements like badges, avatars, etc.
 *
 * This is a build-time only tool — no runtime JavaScript required!
 */

import opentype from 'opentype.js'
import fs from 'node:fs'
import path from 'node:path'

export interface FontMetrics {
  /** Cap height as a fraction of em (0-1 typically 0.5-0.8) */
  capHeightRatio: number
  /** Ascender as a fraction of em */
  ascenderRatio: number
  /** Descender as a fraction of em (typically negative) */
  descenderRatio: number
  /** x-height as a fraction of em */
  xHeightRatio: number
  /** Units per em */
  unitsPerEm: number
  /** Recommended capHeightOffset (fraction of em, negative to shift text down) */
  recommendedOffset: number
}

/**
 * Calculate optimal capHeightOffset based on font metrics
 *
 * The goal is to center the visual weight of uppercase letters
 * rather than the full bounding box.
 */
function calculateOptimalOffset(metrics: {
  capHeightRatio: number
  ascenderRatio: number
  descenderRatio: number
  xHeightRatio: number
}): number {
  // Calculate the visual center of uppercase letters
  // We want to shift the text so cap height is centered

  // Typical baseline offset adjustment (empirical)
  // Negative values push text down, positive up
  const idealCenterRatio = 0.5

  // Calculate current center of cap height relative to total bounding box
  const capTopFromBaseline = metrics.ascenderRatio
  const capBottomFromBaseline = metrics.ascenderRatio - metrics.capHeightRatio
  const capCenterFromBaseline = (capTopFromBaseline + capBottomFromBaseline) / 2

  // Total height from descender to ascender
  const totalHeight = metrics.ascenderRatio - metrics.descenderRatio

  // Where we want the cap center to be (relative to total height)
  const desiredCapCenter = totalHeight * idealCenterRatio + metrics.descenderRatio

  // Calculate the offset needed
  // Negative = push text down
  // Positive = push text up
  let offset = capCenterFromBaseline - desiredCapCenter

  // Apply some empirical adjustments based on common font characteristics
  // Fonts with larger x-heights often need slightly different tuning
  if (metrics.xHeightRatio > 0.5) {
    offset *= 0.9
  } else if (metrics.xHeightRatio < 0.45) {
    offset *= 1.1
  }

  // Clamp to reasonable range (-0.15 to 0.15)
  offset = Math.max(-0.15, Math.min(0.15, offset))

  return offset
}

/**
 * Read a font file and extract metrics
 */
export async function measureFont(fontPath: string): Promise<FontMetrics> {
  const buffer = fs.readFileSync(fontPath)
  const font = opentype.parse(buffer)

  const unitsPerEm = font.unitsPerEm

  // Get OS/2 table for more accurate metrics if available
  let capHeight = font.tables.os2?.sCapHeight
  let xHeight = font.tables.os2?.sxHeight

  // Fallback if OS/2 table doesn't have these values
  if (!capHeight || capHeight === 0) {
    // Measure 'H' glyph as reference for cap height
    const hGlyph = font.charToGlyph('H')
    if (hGlyph && hGlyph.path && hGlyph.path.boundingBox) {
      capHeight = hGlyph.path.boundingBox.y2
    } else {
      capHeight = font.ascender * 0.7 // Fallback estimate
    }
  }

  if (!xHeight || xHeight === 0) {
    // Measure 'x' glyph as reference for x-height
    const xGlyph = font.charToGlyph('x')
    if (xGlyph && xGlyph.path && xGlyph.path.boundingBox) {
      xHeight = xGlyph.path.boundingBox.y2
    } else {
      xHeight = font.ascender * 0.5 // Fallback estimate
    }
  }

  const capHeightRatio = capHeight / unitsPerEm
  const ascenderRatio = font.ascender / unitsPerEm
  const descenderRatio = font.descender / unitsPerEm
  const xHeightRatio = xHeight / unitsPerEm

  const recommendedOffset = calculateOptimalOffset({
    capHeightRatio,
    ascenderRatio,
    descenderRatio,
    xHeightRatio,
  })

  return {
    capHeightRatio,
    ascenderRatio,
    descenderRatio,
    xHeightRatio,
    unitsPerEm,
    recommendedOffset,
  }
}

/**
 * Find the appropriate font file for a given font config
 * Prefers variable fonts, then static fonts with body weight
 */
export function findFontFile(
  fontDir: string,
  weights: { body: number }
): string | null {
  if (!fs.existsSync(fontDir)) {
    return null
  }

  const files = fs.readdirSync(fontDir, { recursive: true })

  // First try to find a variable font
  const variableFonts = files.filter((f) =>
    typeof f === 'string' && /variable/i.test(f) && /\.(woff2|woff|ttf|otf)$/i.test(f)
  )

  if (variableFonts.length > 0) {
    const varFont = variableFonts[0]
    return typeof varFont === 'string' ? path.resolve(fontDir, varFont) : null
  }

  // Then try to find static font with body weight
  const weightHints: Record<number, string[]> = {
    100: ['thin', '100'],
    200: ['extralight', 'extra-light', '200'],
    300: ['light', '300'],
    400: ['regular', 'normal', '400'],
    500: ['medium', '500'],
    600: ['semibold', 'semi-bold', '600'],
    700: ['bold', '700'],
    800: ['extrabold', 'extra-bold', '800'],
    900: ['black', '900'],
  }

  const hints = weightHints[weights.body] || weightHints[400]

  for (const hint of hints) {
    for (const file of files) {
      if (typeof file !== 'string') continue
      if (
        file.toLowerCase().includes(hint) &&
        /\.(woff2|woff|ttf|otf)$/i.test(file)
      ) {
        return path.resolve(fontDir, file)
      }
    }
  }

  // Last resort: pick any font file
  const allFonts = files.filter(
    (f) => typeof f === 'string' && /\.(woff2|woff|ttf|otf)$/i.test(f)
  )

  if (allFonts.length > 0) {
    const f = allFonts[0]
    return typeof f === 'string' ? path.resolve(fontDir, f) : null
  }

  return null
}
