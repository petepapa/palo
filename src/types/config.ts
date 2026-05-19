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

export interface NavigationConfig {
  fixedHeader?: boolean
  headerBackgroundOpacity?: number
  headerBackgroundBlur?: string
  showMobileMenuLabel?: boolean
  desktopMenuAlignment?: 'left' | 'center' | 'right'
  desktopFontSize?: string
  mobileFontSize?: string
  dropdownDesktopFontSize?: string
  dropdownMobileFontSize?: string
  mainMenuLineHeightScale?: number
  dropdownMenuLineHeightScale?: number
  minHeight?: string
  activeStyle?: 'wavy' | 'underline' | 'bold'
}

export interface BorderConfig {
  globalWidth?: string
  buttonWidth?: string
  cardWidth?: string
  accordionWidth?: string
  tabsWidth?: string
  avatarWidth?: string
  badgeWidth?: string
  formWidth?: string
  notificationWidth?: string
  paginationWidth?: string
  toggleWidth?: string
  surfaceWidth?: string
  dividerWidth?: string
}

export interface RadiusConfig {
  globalSize?: string
  buttonSize?: string
  cardSize?: string
  mediaSize?: string
  tabsSize?: string
  avatarSize?: string
  badgeSize?: string
  formSize?: string
  notificationSize?: string
  paginationSize?: string
  toggleSize?: string
  surfaceSize?: string
}

export interface SocialItem {
  label: string
  href: string
  icon: string
}

export interface SiteConfig {
  name: string
  titleSeparator: string
  trailingSlash: boolean
  showDarkModeToggle: boolean
  showLauncher: boolean
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
  logo: string
  logoTextFontSize?: string
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
  navigationActiveStyle: 'wavy' | 'underline' | 'bold'
}

export interface PaloConfig {
  site: SiteConfig
  navigation?: NavigationConfig
  border?: BorderConfig
  radius?: RadiusConfig
  metadata: MetadataConfig
  branding: BrandingConfig
  layout: LayoutConfig
  typography: TypographyConfig
}
