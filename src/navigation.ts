import type { NavigationItem, SocialItem } from './types/config'
import { projectTypes } from './projectTypes'

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
    type: 'dropdown',
    items: [
      { label: 'All projects', href: '/portfolio' },
      ...projectTypes.map((projectType) => ({
        label: `${projectType.label} (${projectType.ratioLabel})`,
        href: `/portfolio/type/${projectType.id}`,
      })),
    ],
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
    href: 'https://github.com/petepapa/palo',
    icon: 'ph:github-logo',
    external: true,
    excludeFromLauncher: true,
  },
]

/**
 * Social media links shown in the launcher and related UI.
 */
export const socialConfig = {
  title: 'Keep in touch :-)',
  items: [
    {
      label: '**YouTube: **@petepatv',
      href: 'https://www.youtube.com/@petepatv',
      icon: 'ph:youtube-logo',
      type: 'link',
      external: true,
    },
    {
      label: '**Douyin: **@petepa',
      icon: 'ph:tiktok-logo',
      type: 'qrCode',
      qrCode: '/branding/douyin.JPG',
    },
    
    {
      label: '**GitHub: **@petepapa',
      href: 'https://github.com/petepapa',
      icon: 'ph:github-logo',
      type: 'link',
      external: true,
    },
    {
      label: '**Email: **hello@petepa.com',
      href: 'mailto:hello@petepa.com',
      icon: 'ph:envelope',
      type: 'email',
    },
  ],
}

export const socialItems = socialConfig.items
