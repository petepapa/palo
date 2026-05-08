# System Patterns — Accessible Astro Starter / Palo Framework

## Architectural Patterns

### 1. Single Source of Truth (YAML Config)
All site customization flows from `src/config.yaml`:
- **Build-time**: `astro.config.mjs` reads YAML for site URL, trailing slash
- **Runtime**: Components import via `@config` alias
- **CSS**: `DefaultLayout.astro` injects config values into `:root` CSS custom properties
- **Types**: `src/types/config.ts` provides TypeScript interfaces for all config fields

**Rule**: Never hardcode site-specific values in components. Always reference config or CSS custom properties.

### 2. CSS Custom Property Token System
Design tokens are defined as CSS custom properties in `_root.scss` and consumed throughout:
```
Brand colors   → --brand-primary, --brand-secondary, etc.
Color palette  → --color-primary-100 through --color-primary-500
Neutral scale  → --color-neutral-100 through --color-neutral-900
Component      → --color-default-bg, --color-primary-text, etc.
Layout         → --grid-max-width, --grid-gutter, --grid-columns
Typography     → --font-size--2 through --font-size-8
Spacing        → --space-5xs through --space-5xl
Effects        → --elevation-1 through --elevation-5, --radius-xs through --radius-h
Animation      → --animation-speed-fast, --cubic-bezier, etc.
```

**Rule**: Use `var(--token-name)` in SCSS/Tailwind, never raw values.

### 3. Fluid Typography & Spacing
- **Utopia method** for clamp-based fluid scaling
- Config-driven: `mobileHeadingScale`, `desktopHeadingScale` in `config.yaml`
- Generated in `DefaultLayout.astro` at build time
- **Rule**: Never use fixed units (`px`, `rem` without `clamp()`) for font sizes and spacing

### 4. Dark/Light Mode via `light-dark()`
- `.darkmode` class toggled on root element
- CSS uses `light-dark(lightValue, darkValue)` for automatic switching
- No separate dark theme files needed

### 5. Component Composition Pattern
Components import from `accessible-astro-components` package for UI widgets, and create custom wrappers/containers in `src/components/`:
- **Page components** → `src/pages/` (routing + composition)
- **Layout components** → `src/layouts/` (page shell)
- **Feature components** → `src/components/` (Hero, FeaturedPosts, etc.)
- **Third-party UI** → `accessible-astro-components` (Accordion, Avatar, Badge, etc.)

### 6. Navigation Active Style Configuration
The active navigation item indicator is configurable via `typography.navigationActiveStyle` in `src/config.yaml`:
- `wavy` (default): Wavy underline for hover, focus, and active states
- `underline`: Solid underline for all interaction states
- `bold`: Solid underline on hover/focus, bold heading weight (`--font-weight-heading`) for active state with no underline

The value is passed to the `#main-navigation` element as a `data-nav-active-style` attribute, and SCSS selectors target this attribute to apply the correct styles.

### 7. Workspace Development Pattern
`scripts/workspace-config.js` detects symlinked packages and enables:
- Auto-reload on package changes
- Filesystem access to parent directories
- Symlink preservation in Vite

### 8. Form Alignment Pattern (Font-Independent)
Checkbox/radio indicators and their label text must be vertically centered regardless of font choice.
A dedicated `_form.scss` partial handles this with:
- `display: flex; align-items: center` on the group container
- `translate: 0 var(--font-cap-height-offset)` on the input for per-font micro-adjustment
- `text-transform: none` on labels to exclude them from global `uppercaseDisplayText`
- `line-height: var(--text-base--line-height)` on label `<span>` to respect config-driven line-height scale
The translate offset is configurable via `config.yaml → branding.font.capHeightOffset` (default: `-0.05em`).

## Code Organization

### File Naming
- **Components**: PascalCase (e.g., `Navigation.astro`, `FeaturedPosts.astro`)
- **Pages**: kebab-case for static, `[...param].astro` for dynamic routes
- **SCSS partials**: underscore-prefixed (e.g., `_root.scss`, `_mixins.scss`)
- **Content**: kebab-case (e.g., `project-01.mdx`, `accessibility-statement.mdx`)

### Import Pattern
```
// Third-party packages (no alias)
import { Accordion, Button } from 'accessible-astro-components'

// Local files (use alias)
import Navigation from '@components/Navigation.astro'
import themeConfig from '@config'
```

## Accessibility Patterns

### 1. Skip Link
First focusable element on every page, jumps to `#main-content`.

### 2. Navigation Keyboard Support
- Arrow keys for navigation between menu items
- Enter/Space to open dropdowns
- Escape to close dropdowns
- Tab to move through interactive elements
- Visible focus indicators on all interactive elements

### 3. Color Contrast
- All text meets WCAG AA 4.5:1 minimum contrast ratio
- Large text meets 3:1 minimum
- Non-text elements meet 3:1 minimum
- Interactive color contrast checker available at `/color-contrast-checker`

### 4. Reduced Motion
All animations wrapped in `@media (prefers-reduced-motion: no-preference)`:
```css
@media (prefers-reduced-motion: no-preference) {
  transition-behavior: allow-discrete;
  transition-duration: var(--animation-speed-fast);
  transition-property: display, opacity, translate;
  transition-timing-function: var(--cubic-bezier);
}
```

### 5. ARIA Usage
- Only when native HTML semantics are insufficient
- `aria-current="page"` for active navigation items
- `aria-expanded` for dropdown toggles
- `aria-hidden="true"` for decorative icons
- `aria-label` for screen-reader-only descriptions when needed

## Content Patterns

### Blog Posts
- Created as `.astro` files in `src/pages/blog/`
- Frontmatter includes: `title`, `description`, `publishDate`, `author`, `image`, `tags`
- Pagination via `[...page].astro`
- Images stored in `public/posts/`

### Portfolio Projects
- Created as `.mdx` files in `src/content/projects/`
- Zod-validated frontmatter: `title`, `author`, `description`, `tags`
- Tag filtering via `/portfolio/tag/[tag]/[...page].astro`
- Images stored in `public/projects/`

## Build & Development Patterns

### Development
```bash
npm run dev      # Start dev server at localhost:4321
npm start        # Same as dev
```

### Production
```bash
npm run build    # Build static site to ./dist/
npm run preview  # Preview production build
```

### Code Quality
```bash
npx eslint .     # Lint with a11y-focused rules
npx prettier --write .  # Auto-format
npx tsc --noEmit # Type-check
```

### Commit Convention
`type(scope): subject` where types include: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `a11y`

## Tag System for Portfolio

Tags are used for portfolio filtering:
- Defined in project MDX frontmatter
- Dynamic route: `/portfolio/tag/[tag]/[...page].astro`
- Tags are visible on project cards and individual project pages
- No global tag registry — tags emerge from content