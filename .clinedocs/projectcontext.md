# Project Context — Accessible Astro Starter / Palo Framework

## Overview

The **Accessible Astro Starter** (v5.1.0) is a ready-to-use, SEO and accessibility-focused Astro starter template with blog and portfolio functionality. It serves as the flagship starter theme of the **Accessible Astro ecosystem**, demonstrating all components from the `accessible-astro-components` library.

- **Homepage**: https://accessible-astro-starter.incluud.dev/
- **Repository**: https://github.com/incluud/accessible-astro-starter
- **License**: MIT

## Target Audience

Developers building blogs, portfolios, or content-focused websites who need WCAG 2.2 AA compliance out of the box.

## Key Features

- Blog with pagination
- Project portfolio with tag filtering
- MDX content support
- Contact form with validation
- Interactive color contrast checker
- Component showcase page
- Dark mode support
- Accessible launcher (floating accessibility widget)
- Social sharing
- Sitemap generation
- Full i18n-ready structure
- SEO metadata via `astro-seo`

## Accessibility (WCAG 2.2 AA)

This project follows WCAG 2.2 AA standards and serves as a reference implementation:

- Semantic HTML throughout
- Full keyboard navigation with visible focus indicators
- Proper heading hierarchy (h1-h6)
- Form labels and error messages
- ARIA used only when native HTML is insufficient
- `prefers-reduced-motion` respected for all animations
- Skip link for keyboard users
- Screen-reader-friendly navigation with dropdown support
- Accessibility statement page

## Color System

- **Modern OKLCH** color space with automatic palette generation
- `light-dark()` CSS function for built-in dark/light mode
- Semantic color tokens: `primary`, `secondary`, `neutral`, `outline`
- Component library tokens for Button, Badge, Notification, etc.
- Dark mode toggled by `.darkmode` class on root element

## Related Projects

Part of the Accessible Astro ecosystem:

- **accessible-astro-components**: Component library (dependency)
- **accessible-astro-dashboard**: Dashboard theme with auth
- **accessible-astro-docs**: Documentation site

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| astro | ^6.1.1 | Framework (SSG) |
| tailwindcss | ^4.2.2 | CSS utility framework |
| accessible-astro-components | ^5.2.0 | Core accessible component library |
| accessible-astro-launcher | ^2.0.0 | Floating accessibility launcher |
| astro-seo | ^1.1.0 | SEO metadata management |
| @astrojs/mdx | ^5.0.3 | MDX content support |
| @astrojs/sitemap | ^3.7.2 | XML sitemap generation |
| astro-icon | ^1.1.5 | Icon system (Lucide icons) |
| sass | ^1.98.0 | SCSS preprocessing |
| js-yaml | ^4.1.1 | YAML config parsing |
| eslint-plugin-jsx-a11y | ^6.10.2 | Accessibility linting |

## Build Output

- **Mode**: Static Site Generation (SSG)
- **Output**: `./dist/`
- **Server**: Starts at `http://localhost:4321`
- **Node**: >=22.12.0