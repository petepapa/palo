import type { NavigationItem, SocialItem } from './types/config'

/**
 * Navigation menu items for the site.
 * Supports regular links and dropdown menus.
 */
export const navigationItems: NavigationItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
  },
  {
    label: 'Features',
    type: 'dropdown',
    items: [
      { label: 'Accessibility statement', href: '/accessibility-statement' },
      { label: 'Accessible components', href: '/accessible-components' },
      { label: 'Accessible launcher', href: '/accessible-launcher' },
      { label: 'Color contrast checker', href: '/color-contrast-checker' },
      { label: 'Markdown page', href: '/markdown-page' },
      { label: 'MDX page', href: '/mdx-page' },
      { label: '404 page', href: '/404' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
  },
  {
    label: 'Go to our GitHub page, opens in new tab',
    href: 'https://github.com/incluud/accessible-astro-starter',
    icon: 'ph:github-logo',
    external: true,
    excludeFromLauncher: true,
  },
]

/**
 * Social media links shown in the launcher and related UI.
 */
export const socialItems: SocialItem[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/incluud/',
    icon: 'ph:github-logo',
  },
  {
    label: 'Bluesky',
    href: 'https://bsky.app/profile/incluud.dev',
    icon: 'ph:chat-dots',
  },
  {
    label: 'Open Collective',
    href: 'https://opencollective.com/incluud',
    icon: 'ph:hands-praying',
  },
]