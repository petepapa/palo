# Architecture — Accessible Astro Starter / Palo Framework

## High-Level Architecture

```
astro.config.mjs
    ├── defineConfig()
    │   ├── site: yamlConfig.metadata.siteUrl
    │   ├── trailingSlash: yamlConfig.site.trailingSlash
    │   ├── integrations: [compress, icon, mdx, sitemap]
    │   └── vite: enhanceConfigForWorkspace(viteConfig)
    │
    src/config.yaml  ←── Single source of truth for all site settings
    │
    ├── site.*          — Site name, trailing slash, dark mode toggle
    ├── metadata.*      — SEO metadata (title, description, author, image)
    ├── branding.*      — Logo path, font family, colors (OKLCH)
    ├── layout.*        — Container max width
    └── typography.*    — Font scales, line height, uppercase settings
```

## Configuration System

The project has been refactored to use **`src/config.yaml` as the single source of truth** for all site customization. The YAML file is:

1. **Parsed at build-time** in `astro.config.mjs` via `js-yaml` for Astro config settings
2. **Importable at runtime** in `.astro`/`.ts` files via the `@config` alias
3. **Mapped to CSS custom properties** by the `<DefaultLayout>` component's inline `<style is:global>` block

### Config Flow

```
src/config.yaml
    │
    ├── astro.config.mjs (build-time)
    │   └── site URL, trailing slash settings
    │
    ├── @config alias (runtime imports)
    │   ├── Components consume config properties directly
    │   └── Types defined in src/types/config.ts
    │
    └── DefaultLayout.astro (CSS injection)
        └── Injects brand colors, font family, layout max-width, fluid font sizes
            into :root CSS custom properties
```

## Styling Architecture

The project uses a **hybrid approach** combining Tailwind CSS v4 with SCSS utility classes:

### Tailwind CSS v4 (`src/styles/tailwind.css`)
- Entry point: `@import "tailwindcss" source(none)`
- Source scanning: `@source '../../src/**/*.{astro,...}'`
- Dark mode variant: `@custom-variant dark (&:where(.darkmode, .darkmode *))`
- Theme tokens mapped to CSS custom properties (e.g., `--color-primary: var(--brand-primary)`)
- Semantic class names only (no raw color values)

### SCSS (`src/assets/scss/`)
- Base layer: reset, root (custom properties), font, list, breakpoint, general, kbd, mixins, utility
- Components layer: button styles
- SCSS functions resolve CSS custom properties computed by config-driven styles

### CSS Custom Properties (`_root.scss`)
- Comprehensive design token system:
  - Brand color palette (5 levels each for primary, secondary)
  - Neutral palette (9 levels)
  - Component library tokens (default, primary, secondary, info, success, warning, error)
  - Color scheme (foreground, background, link, border)
  - Fluid typography scale (Utopia method)
  - Fluid spacing scale
  - Grid system (12-column, max-width 90rem)
  - Border radius, elevations, z-index, aspect ratios
  - Animation speeds and timing
  - `light-dark()` CSS function for built-in dark/light mode

### Fluid Typography Generation
- **Utopia method** implemented in `DefaultLayout.astro`:
  - Mobile scale and desktop scale from `config.yaml`
  - `clamp()` function generated for levels -2 through 8
  - Injected directly into `:root` via `<style is:global>`
- Overrides static values in `_root.scss` at runtime

## Component Architecture

### Page Structure
```
DefaultLayout (global wrapper)
├── SEO (<head> metadata via astro-seo)
├── ClientRouter (View Transitions)
├── Header
│   ├── SkipLink
│   ├── HighContrast (hidden)
│   ├── ReducedMotion (hidden)
│   ├── Navigation
│   │   ├── Logo
│   │   ├── NavigationItems (desktop + mobile)
│   │   ├── ResponsiveToggle
│   │   └── LauncherTrigger
│   └── LauncherConfig
├── <main> slot (page content)
└── Footer
```

### Component Categories

| Category | Components | Source |
|----------|-----------|--------|
| Layout | DefaultLayout, MarkdownLayout | `src/layouts/` |
| Navigation | Navigation, NavigationItems, ResponsiveToggle, Logo | `src/components/` |
| Content | Hero, Feature, FeaturedPosts, FeaturedProjects, ContentMedia, BreakoutImage, BlockQuote, PageHeader, Counter, CallToAction | `src/components/` |
| Accessibility | HighContrast, ReducedMotion, SkipLink, DarkMode | `accessible-astro-components` |
| UI | Accordion, AccordionItem, Avatar, AvatarGroup, Badge, Breadcrumb, Button, Card, Table, Tag, Notification, etc. | `accessible-astro-components` |
| Forms | Contact form | `src/pages/contact.astro` |
| Launcher | LauncherTrigger, LauncherConfig, Launcher | `accessible-astro-launcher` |
| SEO | SiteMeta, SocialShares, SEO | `astro-seo` + custom |
| Utilities | ColorContrast, Slugify, TrailingSlash | `src/components/`, `src/utils/` |

## Routing Structure

```
/                            → index.astro (Homepage)
/blog                        → [...page].astro (Blog pagination)
/blog/[post]                 → [post].astro (Individual blog post)
/portfolio                   → [...page].astro (Portfolio pagination)
/portfolio/[project]         → [project].astro (Individual project)
/portfolio/tag/[tag]         → [...page].astro (Tag-filtered portfolio)
/contact                     → contact.astro (Contact form)
/thank-you                   → thank-you.astro (Form success)
/accessible-components       → accessible-components.astro (Showcase)
/accessible-launcher         → accessible-launcher.astro (Launcher demo)
/color-contrast-checker      → color-contrast-checker.astro
/accessibility-statement     → accessibility-statement.mdx
/markdown-page               → markdown-page.md
/mdx-page                    → mdx-page.mdx
/404                         → 404.astro (Custom 404)
/sitemap                     → sitemap.astro (XML sitemap)
```

## Content Collections

- **Projects**: MDX files in `src/content/projects/` (7 projects)
- Schema defined in `src/content.config.ts` with Zod validation:
  - `title` (string, required)
  - `author` (string, required)
  - `description` (string, required)
  - `tags` (array of strings, default [])
- Blog posts are **Astro files** in `src/pages/blog/` (not content collections)

## Path Aliases

```
@config         → ./src/config.yaml
@components     → ./src/components
@layouts        → ./src/layouts
@assets         → ./src/assets
@content        → ./src/content
@pages          → ./src/pages
@public         → ./public
@post-images   → ./public/posts
@project-images → ./public/projects
@utils          → ./src/utils
```

## Dark Mode System

- Toggled by `.darkmode` class on `<html>`/`<body>` element
- Uses `light-dark()` CSS function for automatic color switching
- `<DarkMode />` component from accessible-astro-components
- Dark variant in Tailwind: `&:where(.darkmode, .darkmode *)`
- CSS custom properties use `light-dark(bg, fg)` pairs
- Pixel pulse colors separated for button/link glow animations

## Accessibility Launcher

- Floating widget (`accessible-astro-launcher`) with:
  - Font size adjustment
  - Line spacing adjustment
  - Dark mode toggle
  - High contrast toggle
  - Reduced motion toggle
  - Screen reader optimization
- Trigger component in Navigation, config component in Header