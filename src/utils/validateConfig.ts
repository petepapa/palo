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

const TEXT_SIZE_TOKEN_RE =
  /^(?:$|(?:var\()?--?(?:text-(?:xs|sm|base|md|lg|xl|[2-9]xl)|font-size-?-?(?:[0-9]|1[0-3]))\)?|(?:text-)?(?:xs|sm|base|md|lg|xl|[2-9]xl)|font-size-?-?(?:[0-9]|1[0-3]))$/

const TEXT_SIZE_TOKEN_HINT =
  'Also accepts text size tokens like "base", "3xl", "text-3xl", or "--text-3xl"'

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

function cssLengthOrTextSizeToken(fieldLabel: string) {
  return z
    .string()
    .refine(
      (value) => CSS_LENGTH_RE.test(value) || TEXT_SIZE_TOKEN_RE.test(value),
      `${fieldLabel}: ${CSS_LENGTH_HINT}. ${TEXT_SIZE_TOKEN_HINT}.`,
    )
    .describe(fieldLabel)
}

function cssLengthOrTextSizeTokenOptional(fieldLabel: string) {
  return cssLengthOrTextSizeToken(fieldLabel).optional()
}

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

const alignmentEnum = z.enum(['left', 'center', 'right']).describe('alignment')

const dropdownDesktopColorModeEnum = z
  .enum(['theme', 'inverse'])
  .describe('desktop dropdown color mode')

const activeStyleEnum = z
  .enum(['wavy', 'underline', 'bold', 'boldwavy', 'boldunderline'])
  .describe('active link style')

const navListActiveStyleEnum = z
  .enum(['bold', 'underline', 'both', 'none'])
  .describe('secondary nav list active style')

const defaultThemeEnum = z
  .enum(['auto', 'light', 'dark'])
  .describe('default theme mode')

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
    defaultTheme: defaultThemeEnum,
    darkModeToggle: z.boolean({
      error: 'site.darkModeToggle must be true or false',
    }),
    launcher: z.enum(['default', 'compact', 'gradientBorder', 'off']),
    launcherIcon: z.string().optional(),
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
    logoLight: z.string().optional(),
    logoDark: z.string().optional(),
    logoSize: cssLengthOrTextSizeTokenOptional('branding.logoSize'),
    textLogo: z.string().optional(),
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
    mobileMenuLabel: z
      .boolean({ error: 'navigation.mobileMenuLabel must be true or false' })
      .optional(),
    desktopMenuAlignment: alignmentEnum.optional(),
    dropdownDesktopColorMode: dropdownDesktopColorModeEnum.optional(),
    desktopFontSize: cssLengthOrTextSizeTokenOptional('navigation.desktopFontSize'),
    mobileFontSize: cssLengthOrTextSizeTokenOptional('navigation.mobileFontSize'),
    dropdownDesktopFontSize: cssLengthOrTextSizeTokenOptional(
      'navigation.dropdownDesktopFontSize',
    ),
    dropdownMobileFontSize: cssLengthOrTextSizeTokenOptional(
      'navigation.dropdownMobileFontSize',
    ),
    mainMenuLineHeightScale: z
      .number()
      .min(0.5, 'navigation.mainMenuLineHeightScale must be ≥ 0.5')
      .max(3, 'navigation.mainMenuLineHeightScale must be ≤ 3')
      .optional(),
    desktopDropdownLineHeightScale: z
      .number()
      .min(0.5, 'navigation.desktopDropdownLineHeightScale must be ≥ 0.5')
      .max(3, 'navigation.desktopDropdownLineHeightScale must be ≤ 3')
      .optional(),
    mobileDropdownLineHeightScale: z
      .number()
      .min(0.5, 'navigation.mobileDropdownLineHeightScale must be ≥ 0.5')
      .max(3, 'navigation.mobileDropdownLineHeightScale must be ≤ 3')
      .optional(),
    minHeight: cssLengthOptional('navigation.minHeight'),
    activeStyle: activeStyleEnum.optional(),
    navList: z
      .object({
        activeStyle: navListActiveStyleEnum.optional(),
        horizontalGap: z.string().optional(),
        verticalScale: z
          .number()
          .min(0, 'navigation.navList.verticalScale must be ≥ 0')
          .max(5, 'navigation.navList.verticalScale must be ≤ 5')
          .optional(),
      })
      .strip()
      .optional(),
  })
  .strip()

const borderConfigSchema = z
  .object({
    global: cssLength('border.global'),
    button: cssLengthOptional('border.button'),
    card: cssLengthOptional('border.card'),
    accordion: cssLengthOptional('border.accordion'),
    tabs: cssLengthOptional('border.tabs'),
    avatar: cssLengthOptional('border.avatar'),
    badge: cssLengthOptional('border.badge'),
    form: cssLengthOptional('border.form'),
    notification: cssLengthOptional('border.notification'),
    pagination: cssLengthOptional('border.pagination'),
    toggle: cssLengthOptional('border.toggle'),
    media: cssLengthOptional('border.media'),
    surface: cssLengthOptional('border.surface'),
    codeBlock: cssLengthOptional('border.codeBlock'),
    modal: cssLengthOptional('border.modal'),
    divider: cssLengthOptional('border.divider'),
  })
  .strip()

const radiusConfigSchema = z
  .object({
    global: cssLength('radius.global'),
    button: cssLengthOptional('radius.button'),
    card: cssLengthOptional('radius.card'),
    media: cssLengthOptional('radius.media'),
    tabs: cssLengthOptional('radius.tabs'),
    avatar: cssLengthOptional('radius.avatar'),
    badge: cssLengthOptional('radius.badge'),
    form: cssLengthOptional('radius.form'),
    notification: cssLengthOptional('radius.notification'),
    pagination: cssLengthOptional('radius.pagination'),
    toggle: cssLengthOptional('radius.toggle'),
    surface: cssLengthOptional('radius.surface'),
    codeBlock: cssLengthOptional('radius.codeBlock'),
    modal: cssLengthOptional('radius.modal'),
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
// Component defaults schemas
// ---------------------------------------------------------------------------

const paloPageHeaderConfigSchema = z
  .object({
    headingLevel: z.string().optional(),
    descClass: z.string().optional(),
    divider: z.enum(['top', 'bottom', 'both', 'none']).optional(),
  })
  .strip()

const postHeaderConfigSchema = z
  .object({
    headingLevel: z.string().optional(),
    descClass: z.string().optional(),
    coverImagePosition: z.enum(['head', 'background', 'side']).optional(),
    showBreadcrumbs: z.boolean().optional(),
    showShare: z.boolean().optional(),
    divider: z.enum(['top', 'bottom', 'both', 'none']).optional(),
  })
  .strip()

const componentsConfigSchema = z
  .object({
    paloPageHeader: paloPageHeaderConfigSchema.optional(),
    postHeader: postHeaderConfigSchema.optional(),
  })
  .strip()

// ---------------------------------------------------------------------------
// Portfolio / Projects schemas
// ---------------------------------------------------------------------------

const portfolioColumnsSchema = z
  .object({
    initial: z.number().int().min(1).max(12).optional(),
    sm: z.number().int().min(1).max(12).optional(),
    lg: z.number().int().min(1).max(12).optional(),
    xl: z.number().int().min(1).max(12).optional(),
  })
  .strip()

const portfolioPaginationSchema = z
  .object({
    pageSize: z.number().int().min(1).optional(),
    sortBy: z.enum(['latest', 'oldest', 'alphabetical']).optional(),
  })
  .strip()

const portfolioDefaultsSchema = z
  .object({
    showTags: z.boolean().optional(),
    showStats: z.boolean().optional(),
    layout: z.enum(['overlay', 'standard']).optional(),
    width: z.enum(['full', 'container']).optional(),
    gap: z.string().optional(),
    columns: portfolioColumnsSchema.optional(),
    tagsHeading: z.string().optional(),
    projectHeadingLevel: z.string().optional(),
    projectDescClass: z.string().optional(),
  })
  .strip()

const portfolioTypePageSchema = z
  .object({
    layout: z.string().optional(),
    width: z.string().optional(),
    gap: z.string().optional(),
    columns: portfolioColumnsSchema.optional(),
  })
  .strip()

const portfolioListPageSchema = z
  .object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
  })
  .strip()

const portfolioTagPageSchema = z
  .object({})
  .strip()

const portfolioFeaturedComponentSchema = z
  .object({
    limit: z.number().int().min(1).optional(),
    buttonAlign: z.enum(['left', 'center', 'right']).optional(),
    title: z.string().optional(),
    buttonText: z.string().optional(),
  })
  .strip()

const portfolioConfigSchema = z
  .object({
    pagination: portfolioPaginationSchema.optional(),
    defaults: portfolioDefaultsSchema.optional(),
    listPage: portfolioListPageSchema.optional(),
    typePage: portfolioTypePageSchema.optional(),
    tagPage: portfolioTagPageSchema.optional(),
    featuredComponent: portfolioFeaturedComponentSchema.optional(),
  })
  .strip()

// ---------------------------------------------------------------------------
// Blog / Posts schemas
// ---------------------------------------------------------------------------

const blogPaginationSchema = z
  .object({
    pageSize: z.number().int().min(1).optional(),
    sortBy: z.enum(['latest', 'earliest']).optional(),
  })
  .strip()

const blogDefaultsSchema = z
  .object({
    showTags: z.boolean().optional(),
    showStats: z.boolean().optional(),
    itemGap: z.string().optional(),
    cardGap: z.string().optional(),
    tagsHeading: z.string().optional(),
    postHeadingLevel: z.string().optional(),
    postDescClass: z.string().optional(),
  })
  .strip()

const blogLatestComponentSchema = z
  .object({
    limit: z.number().int().min(1).optional(),
    buttonAlign: z.enum(['left', 'center', 'right']).optional(),
    title: z.string().optional(),
    buttonText: z.string().optional(),
  })
  .strip()

const blogConfigSchema = z
  .object({
    pagination: blogPaginationSchema.optional(),
    defaults: blogDefaultsSchema.optional(),
    listPage: z.object({}).strip().optional(),
    latestComponent: blogLatestComponentSchema.optional(),
  })
  .strip()

// ---------------------------------------------------------------------------
// Contact form schema
// ---------------------------------------------------------------------------

const contactConfigSchema = z
  .object({
    receiveEmail: z.string().email('contact.receiveEmail must be a valid email address'),
    resendFromEmail: z
      .string()
      .email('contact.resendFromEmail must be a valid email address or ""')
      .or(z.literal(''))
      .optional(),
    resendApiKey: z.string().optional(),
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
    components: componentsConfigSchema.optional(),
    portfolio: portfolioConfigSchema.optional(),
    blog: blogConfigSchema.optional(),
    contact: contactConfigSchema.optional(),
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
      const zIssue = issue as { received?: string; expected?: string }
      const received = zIssue.received
      const expected = zIssue.expected
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
