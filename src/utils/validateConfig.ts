/**
 * Build-time Zod Validation for config.yaml
 *
 * Validates every field in config.yaml at Astro build time.
 * Catches invalid values before they silently corrupt CSS variables.
 *
 * Architecture:
 *   config.yaml  →  js-yaml.load()  →  validateConfig()  →  Astro / Vite
 *                      │                      │
 *                      │              ┌───────┴────────┐
 *                      │              │ ✅ pass → silent │
 *                      │              │ ❌ fail → throw  │
 *                      │              └────────────────┘
 *                      │
 *             No validation = silent CSS corruption
 */

import { z } from 'zod'

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/**
 * CSS length value pattern.
 *
 * Allowed:
 *   ""          — inherit / use default
 *   "0"         — zero (border: 0, etc.)
 *   "0.1rem"    — fractional rem
 *   "16px"      — integer px
 *   "-0.05em"   — negative em (capHeightOffset)
 *   "1536px"    — large px values (container max-width)
 *   "10px"      — blur values
 *
 * Not allowed:
 *   "abc"       — no unit
 *   "10 px"     — space before unit
 *   "10"        — number without unit (unless "0")
 */
const CSS_LENGTH_RE =
  /^(?:$|-?\d*\.?\d+(?:px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|s|ms)?)$/

/** Human-readable description of valid CSS length formats. */
const CSS_LENGTH_HINT =
  'Expected a CSS length like "0.1rem" / "16px" / "-0.05em", or "" to inherit'

/** Zod schema for a single CSS length field. */
function cssLength(fieldLabel: string) {
  return z
    .string()
    .regex(CSS_LENGTH_RE, `${fieldLabel}: ${CSS_LENGTH_HINT}`)
    .describe(fieldLabel)
}

/** Zod schema for an optional CSS length field (undefined → skipped, "" → inherit). */
function cssLengthOptional(fieldLabel: string) {
  return cssLength(fieldLabel).optional()
}

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

const alignmentEnum = z.enum(['left', 'center', 'right']).describe('alignment')

const dropdownDesktopColorModeEnum = z
  .enum(['theme', 'inverse'])
  .describe('desktop dropdown color mode')

const activeStyleEnum = z
  .enum(['wavy', 'underline', 'bold'])
  .describe('active link style')

// ---------------------------------------------------------------------------
// Section schemas
// ---------------------------------------------------------------------------

const siteConfigSchema = z
  .object({
    name: z.string().min(1, 'site.name is required'),
    titleSeparator: z.string(),
    trailingSlash: z.boolean({
      error: 'site.trailingSlash must be true or false',
    }),
    showDarkModeToggle: z.boolean({
      error: 'site.showDarkModeToggle must be true or false',
    }),
    showLauncher: z.boolean({
      error: 'site.showLauncher must be true or false',
    }),
    navigationAlignment: alignmentEnum.optional(),
    desktopNavigationMenuAlignment: alignmentEnum.optional(),
  })
  .strip()

const metadataConfigSchema = z
  .object({
    siteUrl: z.string().min(1, 'metadata.siteUrl is required'),
    title: z.string().min(1, 'metadata.title is required'),
    description: z.string().min(1, 'metadata.description is required'),
    author: z.string().min(1, 'metadata.author is required'),
    image: z.string().min(1, 'metadata.image is required'),
    favicon: z.string().min(1, 'metadata.favicon is required'),
  })
  .strip()

const brandingColorsSchema = z
  .object({
    primary: z.string().min(1, 'branding.colors.primary must not be empty'),
    secondary: z.string().min(1, 'branding.colors.secondary must not be empty'),
    neutral: z.string().min(1, 'branding.colors.neutral must not be empty'),
    outline: z.string().min(1, 'branding.colors.outline must not be empty'),
    info: z.string().min(1, 'branding.colors.info must not be empty'),
    success: z.string().min(1, 'branding.colors.success must not be empty'),
    warning: z.string().min(1, 'branding.colors.warning must not be empty'),
    error: z.string().min(1, 'branding.colors.error must not be empty'),
  })
  .strip()

const fontWeightsSchema = z
  .object({
    body: z
      .number()
      .int('branding.font.weights.body must be an integer')
      .min(100, 'Font weight must be ≥ 100')
      .max(900, 'Font weight must be ≤ 900'),
    accent: z
      .number()
      .int('branding.font.weights.accent must be an integer')
      .min(100, 'Font weight must be ≥ 100')
      .max(900, 'Font weight must be ≤ 900'),
    heading: z
      .number()
      .int('branding.font.weights.heading must be an integer')
      .min(100, 'Font weight must be ≥ 100')
      .max(900, 'Font weight must be ≤ 900'),
  })
  .strip()

const fontConfigSchema = z
  .object({
    name: z.string().min(1, 'branding.font.name is required'),
    path: z.string().optional(),
    weights: fontWeightsSchema,
    capHeightOffset: cssLengthOptional('branding.font.capHeightOffset'),
  })
  .strip()

const brandingConfigSchema = z
  .object({
    logo: z.string(),
    logoSize: cssLengthOptional('branding.logoSize'),
    font: fontConfigSchema,
    colors: brandingColorsSchema,
  })
  .strip()

const navigationConfigSchema = z
  .object({
    fixedHeader: z
      .boolean({ error: 'navigation.fixedHeader must be true or false' })
      .optional(),
    headerBackgroundOpacity: z
      .number()
      .min(0, 'navigation.headerBackgroundOpacity must be ≥ 0')
      .max(1, 'navigation.headerBackgroundOpacity must be ≤ 1')
      .optional(),
    headerBackgroundBlur: cssLengthOptional('navigation.headerBackgroundBlur'),
    showMobileMenuLabel: z
      .boolean({ error: 'navigation.showMobileMenuLabel must be true or false' })
      .optional(),
    desktopMenuAlignment: alignmentEnum.optional(),
    dropdownDesktopColorMode: dropdownDesktopColorModeEnum.optional(),
    desktopFontSize: cssLengthOptional('navigation.desktopFontSize'),
    mobileFontSize: cssLengthOptional('navigation.mobileFontSize'),
    dropdownDesktopFontSize: cssLengthOptional(
      'navigation.dropdownDesktopFontSize',
    ),
    dropdownMobileFontSize: cssLengthOptional(
      'navigation.dropdownMobileFontSize',
    ),
    mainMenuLineHeightScale: z
      .number()
      .min(0.5, 'navigation.mainMenuLineHeightScale must be ≥ 0.5')
      .max(3, 'navigation.mainMenuLineHeightScale must be ≤ 3')
      .optional(),
    dropdownMenuLineHeightScale: z
      .number()
      .min(0.5, 'navigation.dropdownMenuLineHeightScale must be ≥ 0.5')
      .max(3, 'navigation.dropdownMenuLineHeightScale must be ≤ 3')
      .optional(),
    minHeight: cssLengthOptional('navigation.minHeight'),
    activeStyle: activeStyleEnum.optional(),
  })
  .strip()

const borderConfigSchema = z
  .object({
    globalWidth: cssLength('border.globalWidth'),
    buttonWidth: cssLengthOptional('border.buttonWidth'),
    cardWidth: cssLengthOptional('border.cardWidth'),
    accordionWidth: cssLengthOptional('border.accordionWidth'),
    tabsWidth: cssLengthOptional('border.tabsWidth'),
    avatarWidth: cssLengthOptional('border.avatarWidth'),
    badgeWidth: cssLengthOptional('border.badgeWidth'),
    formWidth: cssLengthOptional('border.formWidth'),
    notificationWidth: cssLengthOptional('border.notificationWidth'),
    paginationWidth: cssLengthOptional('border.paginationWidth'),
    toggleWidth: cssLengthOptional('border.toggleWidth'),
    mediaWidth: cssLengthOptional('border.mediaWidth'),
    surfaceWidth: cssLengthOptional('border.surfaceWidth'),
    dividerWidth: cssLengthOptional('border.dividerWidth'),
  })
  .strip()

const radiusConfigSchema = z
  .object({
    globalSize: cssLength('radius.globalSize'),
    buttonSize: cssLengthOptional('radius.buttonSize'),
    cardSize: cssLengthOptional('radius.cardSize'),
    mediaSize: cssLengthOptional('radius.mediaSize'),
    tabsSize: cssLengthOptional('radius.tabsSize'),
    avatarSize: cssLengthOptional('radius.avatarSize'),
    badgeSize: cssLengthOptional('radius.badgeSize'),
    formSize: cssLengthOptional('radius.formSize'),
    notificationSize: cssLengthOptional('radius.notificationSize'),
    paginationSize: cssLengthOptional('radius.paginationSize'),
    toggleSize: cssLengthOptional('radius.toggleSize'),
    surfaceSize: cssLengthOptional('radius.surfaceSize'),
  })
  .strip()

const layoutConfigSchema = z
  .object({
    containerMaxWidth: cssLength('layout.containerMaxWidth'),
  })
  .strip()

const typographyConfigSchema = z
  .object({
    baseFontSize: cssLength('typography.baseFontSize'),
    lineHeightScale: z
      .number()
      .min(0.1, 'typography.lineHeightScale must be ≥ 0.1')
      .max(5, 'typography.lineHeightScale must be ≤ 5'),
    navigationDesktopFontSize: cssLengthOptional(
      'typography.navigationDesktopFontSize',
    ),
    navigationMobileFontSize: cssLengthOptional(
      'typography.navigationMobileFontSize',
    ),
    navigationDropdownDesktopFontSize: cssLengthOptional(
      'typography.navigationDropdownDesktopFontSize',
    ),
    navigationDropdownMobileFontSize: cssLengthOptional(
      'typography.navigationDropdownMobileFontSize',
    ),
    mobileHeadingScale: z
      .number()
      .min(0.5, 'typography.mobileHeadingScale must be ≥ 0.5')
      .max(5, 'typography.mobileHeadingScale must be ≤ 5'),
    desktopHeadingScale: z
      .number()
      .min(0.5, 'typography.desktopHeadingScale must be ≥ 0.5')
      .max(5, 'typography.desktopHeadingScale must be ≤ 5'),
    headingLineHeightScale: z
      .number()
      .min(0.1, 'typography.headingLineHeightScale must be ≥ 0.1')
      .max(5, 'typography.headingLineHeightScale must be ≤ 5'),
    uppercaseDisplayText: z.boolean({
      error: 'typography.uppercaseDisplayText must be true or false',
    }),
    navigationActiveStyle: activeStyleEnum.optional(),
  })
  .strip()

// ---------------------------------------------------------------------------
// Top-level schema
// ---------------------------------------------------------------------------

export const paloConfigSchema = z
  .object({
    site: siteConfigSchema,
    metadata: metadataConfigSchema,
    branding: brandingConfigSchema,
    layout: layoutConfigSchema,
    typography: typographyConfigSchema,
    navigation: navigationConfigSchema.optional(),
    border: borderConfigSchema.optional(),
    radius: radiusConfigSchema.optional(),
  })
  .strip()

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validate a parsed config.yaml object against the Palo schema.
 *
 * On success, returns silently (the config is valid).
 * On failure, throws a descriptive Error listing every invalid field path.
 *
 * @param config - The raw object from js-yaml.load()
 * @throws {Error} with a multi-line message detailing every validation error
 *
 * @example
 * ```js
 * import yaml from 'js-yaml'
 * import fs from 'node:fs'
 * import { validateConfig } from './src/utils/validateConfig.ts'
 *
 * const raw = fs.readFileSync('src/config.yaml', 'utf-8')
 * const config = yaml.load(raw)
 * validateConfig(config) // throws if invalid, silent if OK
 * ```
 */
export function validateConfig(config: unknown): void {
  const result = paloConfigSchema.safeParse(config)

  if (result.success) {
    return
  }

  const issues = result.error.issues
  const lines: string[] = [
    `\n❌ config.yaml validation failed with ${issues.length} error${issues.length > 1 ? 's' : ''}:`,
    '',
  ]

  for (const issue of issues) {
    const path = issue.path.length > 0 ? issue.path.join('.') : '(root)'
    const code = issue.code
    let message = issue.message

    // Add contextual hints for common mistakes
    if (code === 'invalid_type') {
      const received = (issue as any).received
      const expected = (issue as any).expected
      message = `Expected ${expected}, received ${received}`
    }

    lines.push(`  • ${path}: ${message}`)
  }

  lines.push('')
  lines.push('  Fix the errors above in src/config.yaml and rebuild.')
  lines.push('')

  throw new Error(lines.join('\n'))
}

// Re-export the inferred type for consumers that want type-safety
export type PaloConfig = z.infer<typeof paloConfigSchema>
