---
title: "Config Everything You Like"
description: Complete reference for src/config.yaml — site, branding, navigation, typography, borders, components, portfolio, blog, and contact. One file controls Palo without code changes.
publishDate: 2026-06-03
author:
  name: "Pete"
  image: "/branding/avatar.png"
  bio: "PetePa.com"
tags: ['Configuration', 'Palo Theme', 'Web Design', 'YAML']
coverImage: ./cover.png
coverImagePosition: head
breadcrumbs: true
customBreadcrumbLabels:
  "blog": "Blog"
  "current": ""
joinLastBreadcrumb: false
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
divider: both
toc: true
views: 1842
---

### Introduction

Palo centralizes almost all site-wide design and behavior in **`src/config.yaml`**. Colors, typography, navigation chrome, list pagination, page headers, and the contact form email settings all live here — no component edits required.

Palo 将几乎所有全站设计与行为集中在 **`src/config.yaml`** 中。颜色、排版、导航样式、列表分页、页头默认值、联系表单邮件等均可在此配置，无需改组件代码。

**File:** `src/config.yaml`  
**Validation:** checked at build/dev startup via `validateConfig()` — invalid values throw with field paths  
**After editing:** restart `npm run dev` to reload config

---

### Top-Level Map

| Section | Controls |
|---------|----------|
| `site` | Name, theme, launcher, footer back-to-top, cursor, scrollbar |
| `metadata` | SEO title, description, OG image, favicon, canonical URL |
| `branding` | Logo, text logo, colors, custom font |
| `navigation` | Fixed header, blur, menu alignment, active styles, nav lists |
| `layout` | Container max width |
| `typography` | Root font size, heading scale, uppercase display text |
| `border` | Global + per-component border widths |
| `radius` | Global + per-component corner radius |
| `components` | `PaloPageHeader` & `PostHeader` defaults |
| `portfolio` | Project lists, pagination, masonry layout, FeaturedProjects |
| `blog` | Post lists, pagination, LatestPosts defaults |
| `contact` | Resend email form settings |

**Not in config.yaml:** menu item structure and social links → `src/navigation.ts`. See [Navigation Configuration](/blog/20260609-navigation-configuration).

**不在 config.yaml 中：** 菜单项结构与社交链接 → `src/navigation.ts`。见 [Navigation Configuration](/blog/20260609-navigation-configuration)。

---

### `site`

Basic identity and feature toggles.

```yaml
site:
  name: Palo
  titleSeparator: '|'         # "About | Palo"
  trailingSlash: false        # false → /about  |  true → /about/
  defaultTheme: auto          # auto | light | dark
  darkModeToggle: true
  launcher: 'gradientBorder'  # default | compact | gradientBorder | off
  launcherIcon: 'ph:magnifying-glass'
  backToTop: true
  backToTopText: 'Back to Top'
  enableCustomCursor: true    # Circular inverted cursor + hover scale
  hideScrollbar: true
```

| Key | Values | Effect |
|-----|--------|--------|
| `name` | string | Site name in header, titles, text logo fallback |
| `titleSeparator` | string | Browser tab title separator |
| `trailingSlash` | boolean | URL trailing slash policy site-wide |
| `defaultTheme` | `auto` \| `light` \| `dark` | Initial color scheme |
| `darkModeToggle` | boolean | Show theme toggle in header |
| `launcher` | enum | Cmd+K / Ctrl+K quick launcher style; `off` disables |
| `launcherIcon` | Phosphor icon id | Launcher button icon |
| `backToTop` | boolean | Footer "back to top" link |
| `backToTopText` | string | Link label text |
| `enableCustomCursor` | boolean | Custom circular cursor |
| `hideScrollbar` | boolean | Hide document scrollbar |

---

### `metadata`

SEO and social sharing defaults.

```yaml
metadata:
  siteUrl: 'https://palo.petepa.com/'
  title: 'Palo — The Astro Theme for Creative Portfolios'
  description: 'Palo is a minimalist Astro theme…'
  author: Pete Lee
  image: '/branding/social-preview-image.gif'
  favicon: '/branding/favicon.svg'
```

| Key | Description |
|-----|-------------|
| `siteUrl` | Canonical site URL (sitemap, OG tags) |
| `title` | Default `<title>` and OG title |
| `description` | Default meta description |
| `author` | Site author name |
| `image` | Default OG/Twitter preview image (`/public/…`) |
| `favicon` | Tab icon path (`/public/…`) |

Individual pages override via layout props or frontmatter.

---

### `branding`

Visual identity: logo, colors, typography.

```yaml
branding:
  logoLight: '/branding/logo-light.svg'
  logoDark: '/branding/logo-dark.svg'
  textLogo: 'Pa**lo**'       # **bold** / *accent* weight syntax
  logoSize: '40px'           # Font size (text) or height (image)

  colors:
    primary: '#ff4b00'
    secondary: '#632a1b'
    neutral: '#75878a'
    outline: '#ffffff'       # Keyboard focus ring
    info: '#177cb0'
    success: '#00bc12'
    warning: '#ffa631'
    error: '#f00056'

  font:
    name: 'League Spartan'
    path: '/fonts/League_Spartan/'
    weights:
      body: 300
      accent: 500            # Nav, buttons, labels
      heading: 600
    capHeightOffset: '-0.10em'  # Form control / label alignment
```

| Logo rule | Behavior |
|-----------|----------|
| Both `logoLight` + `logoDark` empty | Text logo from `textLogo` or `site.name` |
| Paths filled | Image logo swaps by theme |

Colors map to CSS custom properties site-wide. State colors (`info`, `success`, `warning`, `error`) drive buttons, badges, and form validation.

---

### `navigation`

Header appearance. **Menu items** are in `src/navigation.ts`.

```yaml
navigation:
  fixedHeader: true
  minHeight: '6rem'
  headerBackgroundOpacity: 0.45
  headerBackgroundBlur: 10px
  mobileMenuLabel: false

  desktopMenuAlignment: 'center'    # left | center | right
  dropdownDesktopColorMode: 'inverse'  # theme | inverse

  desktopFontSize: 'lg'
  dropdownDesktopFontSize: 'md'
  mobileFontSize: 'xl'
  dropdownMobileFontSize: 'lg'
  mainMenuLineHeightScale: 1.25
  desktopDropdownLineHeightScale: 0.85
  mobileDropdownLineHeightScale: 1

  activeStyle: 'boldwavy'   # wavy | underline | bold | boldwavy | boldunderline

  navList:
    activeStyle: 'both'     # bold | underline | both | none
    horizontalGap: 'gap-4'  # Tag filter bars
    verticalScale: 0.6      # TOC / footer list spacing multiplier
```

| `activeStyle` | Effect |
|---------------|--------|
| `wavy` | Wavy underline on current link |
| `underline` | Solid underline |
| `bold` | Bold weight |
| `boldwavy` | Bold + wavy underline |
| `boldunderline` | Bold + solid underline |

`navList` styles secondary horizontal/vertical nav blocks: blog/portfolio tag filters, table of contents, footer link lists.

---

### `layout`

```yaml
layout:
  containerMaxWidth: '1536px'
```

Max width for `.container` content areas.

---

### `typography`

```yaml
typography:
  baseFontSize: '16px'
  lineHeightScale: 1.0
  uppercaseDisplayText: true
  mobileHeadingScale: 1.25
  desktopHeadingScale: 1.65
  headingLineHeightScale: 0.85
```

| Key | Effect |
|-----|--------|
| `baseFontSize` | Root `1rem` size |
| `lineHeightScale` | Body line-height multiplier |
| `uppercaseDisplayText` | Force headings / display UI to uppercase |
| `mobileHeadingScale` | Heading size ratio on small screens |
| `desktopHeadingScale` | Heading size ratio on large screens |
| `headingLineHeightScale` | Fine-tune heading line height |

Heading sizes follow a geometric scale: `h1 = 1rem × scale⁵`, `h2 = 1rem × scale⁴`, … `h6`.

---

### `border`

Global default + per-component overrides. **Empty string `''` = inherit global.**

```yaml
border:
  global: '0.1rem'
  button: ''
  form: '0.075rem'
  card: ''
  accordion: ''
  tabs: ''
  badge: '0.075rem'
  avatar: ''
  notification: ''
  pagination: '0.1rem'
  toggle: '0.1rem'
  media: '0'
  surface: '0.1rem'
  codeBlock: '0'
  modal: '0.075rem'
  divider: '0.075rem'
```

---

### `radius`

Same inheritance pattern as `border`.

```yaml
radius:
  global: '0.75rem'
  button: ''
  form: ''
  card: '1.5rem'
  media: ''
  tabs: '1rem'
  badge: '0.25rem'
  notification: ''
  avatar: ''
  pagination: '0.5rem'
  toggle: '0.5rem'
  surface: ''
  codeBlock: '0.25rem'
  modal: '1rem'
```

---

### `components`

Defaults for page headers when frontmatter / props are empty.

#### `components.paloPageHeader`

List pages, static pages, MDX `pageHeader:` blocks.

```yaml
components:
  paloPageHeader:
    headingLevel: "h1"
    descClass: "text-lg"
    alignV: "center"           # top | center | bottom
    alignH: "left"             # left | center | right
    divider: "bottom"          # top | bottom | both | none
    useContainer: true
    fullscreen: false
    topNavigationTheme: ""     # '' | dark | light
    class: ""
```

See [PaloPageHeader Component](/blog/20260608-palo-page-header-component).

#### `components.postHeader`

Blog post and portfolio project detail pages.

```yaml
components:
  postHeader:
    headingLevel: "h2"
    descClass: "text-lg"
    coverImagePosition: "head"   # top | head | bottom | none
    divider: "both"
    showBreadcrumbs: true
    showShare: true              # Share block below article (page layout)
```

See [PostHeader Component](/blog/20260603-postheader-component).

---

### `portfolio`

Portfolio lists, tag/type filters, and `FeaturedProjects`.

```yaml
portfolio:
  pagination:
    pageSize: 10
    sortBy: "latest"    # latest | oldest | alphabetical

  defaults:
    showTags: true
    showStats: true
    layout: "overlay"       # overlay | standard
    width: "full"           # full | container
    gap: "gap-5"
    columns:
      initial: 1            # < 640px
      sm: 2                 # ≥ 640px
      lg: 3                 # ≥ 1024px
      xl: 3                 # ≥ 1280px
    tagsHeading: "h5"
    projectHeadingLevel: "h5"
    projectDescClass: "text-base"

  listPage:
    title: "All Projects"
    subtitle: "A visual summary of every project…"
    allLabel: 'All Projects'

  typePage:
    layout: "standard"
    width: "container"
    gap: "gap-6"
    columns: {}             # {} = inherit defaults.columns

  tagPage:
    layout: "overlay"
    width: "container"
    gap: "gap-5"
    columns: {}

  featuredComponent:
    limit: 10
    buttonAlign: right      # left | center | right
    title: "Featured Projects"
    buttonText: "View All Projects"
```

**Inheritance:** `listPage` / `typePage` / `tagPage` override `defaults` per route. Empty `columns: {}` keeps responsive column counts from `defaults`.

See [Projects List and FeaturedProjects](/blog/20260607-projects-list-and-featuredprojects-component).

---

### `blog`

Blog list, tag pages, and `LatestPosts`.

```yaml
blog:
  pagination:
    pageSize: 10
    sortBy: "latest"        # latest | earliest

  defaults:
    showTags: true
    showStats: true
    itemGap: "gap-24"       # Vertical gap between PostCards
    cardGap: "gap-8 md:gap-16"
    tagsHeading: "h5"
    postHeadingLevel: "h3"
    postDescClass: "text-base"

  listPage:
    title: "Blog"
    subtitle: "Latest articles on web development…"
    allLabel: 'All Posts'

  latestComponent:
    limit: 5
    buttonAlign: right
    title: "Latest Posts"
    buttonText: "View All Posts"
```

**Inheritance:** `/blog` reads `listPage` → `defaults` → hard-coded fallbacks. Tag pages use `defaults` (plus `listPage.allLabel` for the "All" filter).

`/blog` 列表页：`listPage` → `defaults` → 硬编码兜底。标签页继承 `defaults`（「全部」按钮文字来自 `listPage.allLabel`）。

See [Blog List and LatestPosts](/blog/20260607-blog-list-and-latestposts-component).

---

### `contact`

Resend-powered contact form (`/contact`).

```yaml
contact:
  receiveEmail: "contact@petepa.com"
  resendFromEmail: "hello@palo.petepa.com"   # Verified sender; empty → receiveEmail
  resendApiKey: ""                           # Local dev only; production uses RESEND_API_KEY env
```

| Key | Description |
|-----|-------------|
| `receiveEmail` | Where form submissions are delivered |
| `resendFromEmail` | Resend verified from-address |
| `resendApiKey` | Optional local API key; leave empty on Vercel (use env var) |

---

### Inheritance Pattern

Portfolio and blog use the same mental model:

```
scene override (listPage / typePage / tagPage / latestComponent)
        ↓
defaults (visual gene base)
        ↓
hard-coded fallback in .astro page
```

Change `defaults` once → all list surfaces sync. Override a single scene when one route needs different layout.

改 `defaults` 一次 → 所有列表页同步。单个路由需要不同布局时，在对应 scene 块 override。

Component headers (`PaloPageHeader`, `PostHeader`) follow:

```
frontmatter / prop  →  components.* config  →  component fallback
```

---

### Practical Examples

#### Minimal personal site

```yaml
site:
  name: 'Alex Chen'
  defaultTheme: light
  darkModeToggle: false
  launcher: off

branding:
  colors:
    primary: '#1a1a1a'
    secondary: '#632a1b'
    neutral: '#75878a'

typography:
  uppercaseDisplayText: false
  desktopHeadingScale: 1.3
```

#### Creative studio

```yaml
site:
  name: 'Neon Studio'
  defaultTheme: dark
  launcher: gradientBorder

branding:
  colors:
    primary: '#ff00ff'
    secondary: '#00ffff'

navigation:
  activeStyle: wavy
  headerBackgroundBlur: 20px

radius:
  global: '0'
  card: '0'
```

#### Compact blog homepage

```yaml
blog:
  latestComponent:
    limit: 3
    title: "From the blog"
    buttonText: "All posts"
  defaults:
    itemGap: "gap-12"
```

#### Corporate / no launcher

```yaml
site:
  name: 'TechCorp'
  launcher: off

navigation:
  activeStyle: underline
  desktopMenuAlignment: left
```

---

### Tips

1. **Restart dev after edits** — config is loaded at startup, not hot-reloaded
2. **Build validates config** — typos in enum values fail fast with field paths
3. **Leave `''` to inherit** — border/radius component keys empty = use `global`
4. **Split concerns** — structure in `navigation.ts`, chrome in `config.yaml`
5. **Use scene overrides sparingly** — prefer `defaults` for consistency
6. **Test both themes** — check `primary`, `neutral`, and `outline` in light and dark

1. **改 config 后重启 dev** — 启动时加载，不支持热更新
2. **构建时会校验 config** — 枚举值拼写错误会立即报错
3. **`''` 表示继承** — border/radius 组件键留空 = 使用 `global`
4. **职责分离** — 结构在 `navigation.ts`，外观在 `config.yaml`
5. **scene override 少量使用** — 优先改 `defaults` 保持一致
6. **测试深浅色主题** — 检查 `primary`、`neutral`、`outline` 对比度

---

### Accessibility

- `branding.colors.outline` — keyboard focus ring color
- Semantic state colors — consistent meaning for alerts and form feedback
- `defaultTheme: auto` — respects `prefers-color-scheme`
- Typography scales — readable heading hierarchy across viewports
- Config-driven heading levels — `h1` on list pages, `h2` on detail pages (adjustable)

---

### Troubleshooting

#### Config change not visible

Restart `npm run dev`.

#### Build fails on config

Read the validation error paths — common issues: invalid `launcher` value (use `off` not `false`), bad email in `contact.receiveEmail`, CSS length without unit.

#### Portfolio columns not updating

Ensure Tailwind column classes exist for your values (1–12). Partial `columns:` merges per breakpoint; `{}` inherits all.

#### Blog sort unexpected

`blog.pagination.sortBy` only accepts `latest` \| `earliest`. Portfolio uses `oldest` (not `earliest`).

---

### Conclusion

`config.yaml` is Palo's single design control plane: **site identity**, **branding**, **navigation chrome**, **typography & borders**, **component header defaults**, **portfolio & blog list behavior**, and **contact email**. Pair it with `src/navigation.ts` for menu structure and with per-page frontmatter for one-off overrides.

`config.yaml` 是 Palo 的单一设计控制面：**站点身份**、**品牌**、**导航外观**、**排版与描边**、**组件页头默认值**、**作品集与博客列表行为**、**联系表单邮件**。配合 `src/navigation.ts` 管理菜单结构，配合 frontmatter 做单页 override。

Happy configuring!
