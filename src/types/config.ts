/**
 * Palo Framework Configuration Types
 *
 * This file defines the TypeScript interfaces for the YAML configuration.
 * While config.yaml itself is not type-checked, these types ensure:
 * - Autocompletion in IDEs when importing config in .astro/.ts files
 * - Type safety when accessing config properties in components
 */

export interface NavigationItemLink {
  type?: 'link'
  label: string
  href: string
  external?: boolean
  highlight?: boolean
  icon?: string
  excludeFromLauncher?: boolean
}

export interface NavigationItemDropdown {
  type: 'dropdown'
  label: string
  icon?: string
  items: {
    label: string
    href: string
    external?: boolean
  }[]
  excludeFromLauncher?: boolean
}

export type NavigationItem = NavigationItemLink | NavigationItemDropdown

export type NavListActiveStyle = 'bold' | 'underline' | 'both' | 'none'

export interface NavListConfig {
  activeStyle?: NavListActiveStyle
  horizontalGap?: string
  verticalScale?: number
}

export interface NavigationConfig {
  fixedHeader?: boolean
  headerBackgroundOpacity?: number
  headerBackgroundBlur?: string
  mobileMenuLabel?: boolean
  desktopMenuAlignment?: 'left' | 'center' | 'right'
  dropdownDesktopColorMode?: 'theme' | 'inverse'
  desktopFontSize?: string
  mobileFontSize?: string
  dropdownDesktopFontSize?: string
  dropdownMobileFontSize?: string
  mainMenuLineHeightScale?: number
  desktopDropdownLineHeightScale?: number
  mobileDropdownLineHeightScale?: number
  minHeight?: string
  activeStyle?: 'wavy' | 'underline' | 'bold' | 'boldwavy' | 'boldunderline'
  navList?: NavListConfig
}

export interface BorderConfig {
  global?: string
  button?: string
  card?: string
  accordion?: string
  tabs?: string
  avatar?: string
  badge?: string
  form?: string
  notification?: string
  pagination?: string
  toggle?: string
  media?: string
  surface?: string
  codeBlock?: string
  divider?: string
}

export interface RadiusConfig {
  global?: string
  button?: string
  card?: string
  media?: string
  tabs?: string
  avatar?: string
  badge?: string
  form?: string
  notification?: string
  pagination?: string
  toggle?: string
  surface?: string
  codeBlock?: string
}

export type SocialItemType = 'link' | 'email' | 'qrCode'

export interface SocialItem {
  label: string
  href?: string
  icon: string
  type?: SocialItemType
  external?: boolean
  qrCode?: string
}

export interface SiteConfig {
  name: string
  titleSeparator: string
  trailingSlash: boolean
  defaultTheme: 'auto' | 'light' | 'dark'
  darkModeToggle: boolean
  launcher: false | true | 'default' | 'gradientBorder'
  backToTop?: boolean
  backToTopText?: string
  enableCustomCursor?: boolean
  navigationAlignment?: 'left' | 'center' | 'right'
  desktopNavigationMenuAlignment?: 'left' | 'center' | 'right'
}

export interface MetadataConfig {
  siteUrl: string
  title: string
  description: string
  author: string
  image: string
  favicon: string
}

export interface BrandingColors {
  primary: string
  secondary: string
  neutral: string
  outline: string
  info: string
  success: string
  warning: string
  error: string
}

export interface BrandingFontWeights {
  body: number
  accent: number
  heading: number
}

export interface BrandingFontConfig {
  name: string
  weights: BrandingFontWeights
  capHeightOffset?: string
  path?: string
}

export interface BrandingConfig {
  logoLight?: string
  logoDark?: string
  logoSize?: string
  textLogo?: string
  font: BrandingFontConfig
  colors: BrandingColors
}

export interface LayoutConfig {
  containerMaxWidth: string
  fixedHeader: boolean
  headerBackgroundOpacity: number
  headerBackgroundBlur: string
}

export interface TypographyConfig {
  baseFontSize: string
  lineHeightScale: number
  navigationDesktopFontSize: string
  navigationMobileFontSize: string
  navigationDropdownDesktopFontSize: string
  navigationDropdownMobileFontSize: string
  mobileHeadingScale: number
  desktopHeadingScale: number
  headingLineHeightScale: number
  uppercaseDisplayText: boolean
  navigationActiveStyle: 'wavy' | 'underline' | 'bold' | 'boldwavy' | 'boldunderline'
}

// ================================================================
// 🧩 组件默认配置 / Component Defaults
// ================================================================

export interface PaloPageHeaderConfig {
  headingLevel?: string
  descClass?: string
  divider?: 'bottom' | 'top' | 'none'
}

export interface PostHeaderConfig {
  headingLevel?: string
  descClass?: string
  coverImagePosition?: 'head' | 'background' | 'side'
  showBreadcrumbs?: boolean
  showShare?: boolean
  divider?: 'bottom' | 'top' | 'none'
}

export interface ComponentsConfig {
  paloPageHeader?: PaloPageHeaderConfig
  postHeader?: PostHeaderConfig
}

// ================================================================
// 📁 Portfolio / Projects 配置
// ================================================================

export interface PortfolioColumns {
  initial: number
  sm: number
  lg: number
  xl: number
}

export interface PortfolioPaginationConfig {
  pageSize: number
  sortBy: 'latest' | 'oldest' | 'alphabetical'
}

export interface PortfolioDefaults {
  showTags: boolean
  showStats: boolean
  layout: 'overlay' | 'standard'
  width: 'full' | 'container'
  gap: string
  columns: PortfolioColumns
  tagsHeading: string
  projectHeadingLevel: string
  projectDescClass: string
}

export interface PortfolioListPageConfig {
  title?: string
  subtitle?: string
  allLabel?: string
}

export interface PortfolioTypePageConfig {
  layout?: string
  width?: string
  gap?: string
  columns?: PortfolioColumns
}

export type PortfolioTagPageConfig = Record<string, never>

export interface PortfolioFeaturedComponentConfig {
  limit: number
  buttonAlign?: 'left' | 'center' | 'right'
  title?: string
  buttonText?: string
}

export interface PortfolioConfig {
  pagination?: PortfolioPaginationConfig
  defaults?: PortfolioDefaults
  listPage?: PortfolioListPageConfig
  typePage?: PortfolioTypePageConfig
  tagPage?: PortfolioTagPageConfig
  featuredComponent?: PortfolioFeaturedComponentConfig
}

// ================================================================
// 📝 Blog / Posts 配置
// ================================================================

export interface BlogPaginationConfig {
  pageSize: number
  sortBy: 'latest' | 'earliest'
}

export interface BlogDefaults {
  showTags: boolean
  showStats: boolean
  itemGap: string
  cardGap: string
  tagsHeading: string
  postHeadingLevel: string
  postDescClass: string
}

export interface BlogLatestComponentConfig {
  limit: number
  buttonAlign?: 'left' | 'center' | 'right'
  title?: string
  buttonText?: string
}

export interface BlogListPageConfig {
  title?: string
  subtitle?: string
  allLabel?: string
}

export interface BlogConfig {
  pagination?: BlogPaginationConfig
  defaults?: BlogDefaults
  listPage?: BlogListPageConfig
  latestComponent?: BlogLatestComponentConfig
}

// ================================================================
// ✉️ 联系表单 / Contact Form
// ================================================================

export interface ContactConfig {
  /** 接收表单通知的个人邮箱 */
  receiveEmail: string
  /** Resend 验证过的发件域名邮箱（留空则使用 receiveEmail） */
  resendFromEmail?: string
  /** Resend API key（线上留空，走 Vercel 环境变量 RESEND_API_KEY） */
  resendApiKey?: string
}

// ================================================================
// 🏛️ 根配置 / Root Config
// ================================================================

export interface PaloConfig {
  site: SiteConfig
  navigation?: NavigationConfig
  border?: BorderConfig
  radius?: RadiusConfig
  metadata: MetadataConfig
  branding: BrandingConfig
  layout: LayoutConfig
  typography: TypographyConfig
  components?: ComponentsConfig
  portfolio?: PortfolioConfig
  blog?: BlogConfig
  contact?: ContactConfig
}

/**
 * Helper: convert responsive columns object to Tailwind CSS column class string
 *
 * Uses standard class syntax (columns-{n}) to match the safety list declared in
 * tailwind.css (columns-5~12 with all responsive prefixes). Values 1-4 are
 * natively supported by Tailwind v4, values 5+ are covered by the safety list.
 *
 * e.g. { initial: 1, sm: 2, lg: 5, xl: 5 } => "columns-1 sm:columns-2 lg:columns-5 xl:columns-5"
 */
export function buildColumnsClass(columns: PortfolioColumns): string {
  const parts: string[] = []
  if (columns.initial !== undefined) parts.push(`columns-${columns.initial}`)
  if (columns.sm !== undefined) parts.push(`sm:columns-${columns.sm}`)
  if (columns.lg !== undefined) parts.push(`lg:columns-${columns.lg}`)
  if (columns.xl !== undefined) parts.push(`xl:columns-${columns.xl}`)
  return parts.join(' ')
}

