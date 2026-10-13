---
title: PaloPageHeader Component
description: Page headers for list pages, static pages, and MDX frontmatter — title, subtitle, bg media, alignment, dividers, navigation theme, and config.yaml defaults.
publishDate: 2026-06-08
author:
  name: "Pete"
  image: "/branding/avatar.png"
  bio: "PetePa.com"
tags: ['Components', 'Palo Theme', 'Page Headers', 'Web Design']
coverImage: ./cover.jpg
coverImagePosition: head
breadcrumbs: true
customBreadcrumbLabels:
  "blog": "博客"
  "current": ""
joinLastBreadcrumb: false
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
divider: true
toc: true
views: 1900
---

### Introduction

`PaloPageHeader` is Palo’s page-level hero for **list pages** (Blog, Portfolio), **static pages** (Contact, Sitemap), and **MDX/Markdown pages** via frontmatter. It renders a semantic `<section>` with a configurable heading, optional HTML subtitle, and optional background media.

`PaloPageHeader` 是 Palo 的页面级头部组件，用于**列表页**（Blog、Portfolio）、**静态页**（Contact、Sitemap）以及通过 frontmatter 配置的 **MDX/Markdown 页面**。它输出语义化 `<section>`，包含可配置的标题、可选 HTML 副标题和背景媒体。

Component path: `src/components/PaloPageHeader.astro`

---

### Quick Start

```astro
---
import PaloPageHeader from '@components/PaloPageHeader.astro'
---

<PaloPageHeader
  title="Blog"
  subtitle="Latest news and updates"
/>
```

Global defaults live in `config.yaml` → `components.paloPageHeader`. Any prop left empty (`''`) or omitted falls back to those defaults.

全局默认值在 `config.yaml` → `components.paloPageHeader`。留空（`''`）或未传入的 prop 会回退到 config 默认值。

See [Config: Everything You Like](/blog/20260603-config-everything-you-like) for the full `paloPageHeader` block.

---

### Where It Appears

| Page type | Example | How configured |
|-----------|---------|----------------|
| Blog list | `/blog` | Page `.astro` + config defaults |
| Portfolio list | `/portfolio` | Page `.astro` + config defaults |
| Static pages | `/contact`, `/accessible-components` | Inline props (often `''` to inherit config) |
| MDX/Markdown | Any page using `MarkdownLayout` | Frontmatter `pageHeader:` object |

---

### Parameters

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | *(required)* | Main heading text |
| `subtitle` | `string` | — | Description; basic HTML allowed |
| `fullscreen` | `boolean` | config / `false` | Full viewport height |
| `contentColor` | `string` | `''` | Text color CSS value |
| `topNavigationTheme` | `'' \| 'dark' \| 'light'` | config / `''` | Header nav + button theme override |
| `alignV` | `'top' \| 'center' \| 'bottom'` | config / `'center'` | Vertical content alignment |
| `alignH` | `'left' \| 'center' \| 'right'` | config / `'left'` | Horizontal text + flex alignment |
| `divider` | `'top' \| 'bottom' \| 'both' \| 'none' \| ''` | config / `'bottom'` | Border divider placement |
| `headingLevel` | `string` | config / `'h1'` | Heading tag (`h1`–`h6`) via `Heading` component |
| `descClass` | `string` | config / `'text-lg'` | Tailwind classes on subtitle `<p>` |
| `useContainer` | `boolean` | config / `true` | Wrap content in `.container` |
| `class` | `string` | config / `''` | Classes on root `<section>` |
| `bg` | object | see below | Background media + overlay |

#### `bg` object

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `image` | `string` | `''` | Background image path (`/public/…` or `@assets/…`) |
| `video` | `string` | `''` | Background video path (MP4 in `/public/`) |
| `color` | `string` | `''` | Solid background color |
| `fixed` | `boolean` | `false` | Fixed viewport background (parallax-style) |
| `overlayOpacity` | `number` | `0` | Black overlay `0`–`1` over image/video |

```astro
<PaloPageHeader
  title="Nature"
  subtitle="Exploring the outdoors"
  contentColor="#ffffff"
  topNavigationTheme="dark"
  bg={{
    image: '/branding/hero-bg.png',
    fixed: false,
    overlayOpacity: 0.4,
  }}
/>
```

> **Note:** Background props are nested under `bg`, not flat on the component root.
>
> **注意：** 背景相关 prop 嵌套在 `bg` 对象内，不是组件根级的平铺 prop。

---

### Title & Subtitle

The title renders through `accessible-astro-components` `Heading` at `headingLevel` (default `h1`).

```astro
<PaloPageHeader
  title="Our Services"
  subtitle="Check out our <strong>amazing features</strong> and <a href='/contact'>contact us</a>"
  descClass="text-lg text-neutral-600"
/>
```

Subtitle HTML is sanitized — allowed tags: `b`, `i`, `em`, `strong`, `a`, `span`, `br`. Links support `href`, `title`, `target`, `rel`.

副标题 HTML 经 sanitize 过滤——允许 `b`、`i`、`em`、`strong`、`a`、`span`、`br`。

---

### Display Mode (`fullscreen`)

| Value | CSS class | Behavior |
|-------|-----------|----------|
| `false` *(default)* | `palo-page-header--standard` | Grid section with nav-aware padding |
| `true` | `section-fullscreen` | Full viewport height (`100dvh`) |

```astro
<PaloPageHeader
  title="Welcome"
  subtitle="We're glad you're here"
  fullscreen={true}
  alignV="center"
/>
```

Standard mode automatically adds top padding: `nav min-height + page-header-padding-block`, so content clears the fixed header.

标准模式自动添加顶部内边距（导航栏高度 + padding-block），内容不会被固定顶栏遮挡。

---

### Alignment (`alignV` / `alignH`)

`alignV` controls vertical grid alignment; `alignH` controls both `text-align` and flex cross-axis alignment.

| `alignV` | Effect |
|----------|--------|
| `top` | Content at top |
| `center` | Content centered *(default)* |
| `bottom` | Content at bottom |

| `alignH` | Effect |
|----------|--------|
| `left` | Left-aligned *(default)* |
| `center` | Center-aligned |
| `right` | Right-aligned |

```astro
<PaloPageHeader
  title="Center Aligned"
  subtitle="Title and subtitle centered"
  fullscreen={true}
  alignV="center"
  alignH="center"
/>
```

There is no separate `textAlign` prop — use `alignH`.

没有独立的 `textAlign` prop——用 `alignH` 控制。

---

### Background Media

#### Image

Background images render via `ContentImage` with progressive loading:

- **Non-PNG:** dominant-color placeholder while loading, then fades out
- **PNG:** no color placeholder (preserves transparency)

```astro
<PaloPageHeader
  title="City Life"
  subtitle="Urban adventures"
  contentColor="#ffffff"
  bg={{
    image: '/branding/hero-bg.png',
    overlayOpacity: 0.5,
  }}
  topNavigationTheme="dark"
/>
```

#### Video

Videos autoplay **muted**, **loop**, with `playsinline`. Always pair with `overlayOpacity` for text contrast.

```astro
<PaloPageHeader
  title="Innovation"
  subtitle="Forward-thinking solutions"
  contentColor="#ffffff"
  bg={{
    video: '/videos/hero.mp4',
    overlayOpacity: 0.5,
  }}
/>
```

#### Solid Color

```astro
<PaloPageHeader
  title="Design"
  subtitle="Creating beautiful experiences"
  bg={{ color: '#3b82f6' }}
  contentColor="#ffffff"
/>
```

#### Fixed Background (`bg.fixed`)

When `bg.fixed: true`, the background media is `position: fixed` covering the viewport. Dividers repaint as pseudo-elements above the fixed layer.

```astro
<PaloPageHeader
  title="Parallax Header"
  subtitle="Background stays fixed while scrolling"
  fullscreen={true}
  bg={{
    image: '/branding/hero-bg.png',
    fixed: true,
    overlayOpacity: 0.6,
  }}
  contentColor="#ffffff"
/>
```

---

### Navigation Theme (`topNavigationTheme`)

Sets `data-top-navigation-theme` on the section, which drives:

- Site header logo variant (light/dark)
- Button colors inside the page header (filled + outlined)

| Value | Auto background | Auto text color |
|-------|----------------|-----------------|
| `'dark'` | `--color-neutral-900` | `--color-neutral-100` |
| `'light'` | `--color-neutral-100` | `--color-neutral-900` |
| `''` | From `bg.color` or transparent | From `contentColor` or inherit |

Explicit `bg.color` / `contentColor` always override the auto values.

显式传入 `bg.color` / `contentColor` 会覆盖自动推导的颜色。

```astro
<PaloPageHeader
  title="Dark Header"
  subtitle="Light navigation on dark background"
  topNavigationTheme="dark"
/>
```

Pass `hasHero={true}` on `DefaultLayout` when using a themed header so the layout coordinates nav styling.

使用主题头部时，在 `DefaultLayout` 上传 `hasHero={true}`，让布局协调导航样式。

---

### Dividers (`divider`)

| Value | Effect |
|-------|--------|
| `'bottom'` *(default)* | Border below section |
| `'top'` | Border above section |
| `'both'` | Borders above and below |
| `'none'` | No dividers |
| `''` | Falls back to `config.yaml` default |

```astro
<PaloPageHeader title="Blog Post" subtitle="With top divider" divider="top" />
<PaloPageHeader title="Docs" subtitle="Bordered both sides" divider="both" />
<PaloPageHeader title="Clean" subtitle="No borders" divider="none" />
```

---

### Container (`useContainer`)

| Value | Layout |
|-------|--------|
| `true` *(default)* | Content in `.container` |
| `false` | Full-width with `--grid-gutter` horizontal padding |

```astro
<PaloPageHeader
  title="Full Width"
  subtitle="Edge-to-edge content area"
  useContainer={false}
/>
```

---

### Padding & Custom Classes

There is no `padding` prop. Control spacing two ways:

没有 `padding` prop。两种方式控制间距：

1. **`class` on root** — Tailwind utilities override defaults (they sit in `@layer utilities`, above base padding):

```astro
<PaloPageHeader
  title="Compact"
  subtitle="Less vertical space"
  class="py-8"
/>
```

2. **CSS variable** — set `--page-header-padding-block` on the section or in `config.yaml` `class`.

Default padding uses `--nav-min-height` (static, no JS) so the first paint already clears the header.

---

### Config Defaults (`config.yaml`)

```yaml
components:
  paloPageHeader:
    headingLevel: "h1"
    descClass: "text-lg"
    alignV: "center"
    alignH: "left"
    divider: "bottom"
    useContainer: true
    fullscreen: false
    topNavigationTheme: ""
    class: ""
```

List pages (Blog, Portfolio) spread `{...pageHeader}` built from these defaults. Static pages like Contact pass `''` for each prop to inherit config without hardcoding.

列表页从 config 构建 `{...pageHeader}` 并 spread。Contact 等静态页传 `''` 继承 config，无需硬编码。

---

### MDX / Markdown Frontmatter

Pages using `MarkdownLayout` can define a `pageHeader` block:

```yaml
---
title: My Page
description: Page description
pageHeader:
  title: Custom Header Title
  subtitle: "Optional <strong>HTML</strong> subtitle"
  fullscreen: false
  alignV: center
  alignH: left
  divider: bottom
  contentColor: ""
  topNavigationTheme: dark
  useContainer: true
  bg:
    image: /branding/hero-bg.png
    video: ""
    color: ""
    fixed: false
    overlayOpacity: 0.4
---
```

When `pageHeader` is present, `DefaultLayout` receives `hasHero={true}` and the layout title comes from `pageHeader.title` (falls back to `title`).

---

### Production Examples

#### Blog List Page (current Palo pattern)

```astro
<PaloPageHeader
  title={pageConfig.title}
  subtitle={pageConfig.subtitle}
  alignV="center"
  alignH="left"
  divider="bottom"
  bg={{ image: '', video: '', color: '', fixed: false, overlayOpacity: 0 }}
/>
```

#### Contact Page (inherit all config defaults)

```astro
<PaloPageHeader
  title="Contact"
  subtitle="Have a question? Get in touch with us!"
  fullscreen=""
  contentColor=""
  topNavigationTheme=""
  alignV=""
  alignH=""
  useContainer=""
  divider=""
  bg={{ image: "", color: "", fixed: false, overlayOpacity: 0 }}
/>
```

Empty strings trigger `resolveStringProp` → config.yaml defaults.

空字符串触发 `resolveStringProp` → 回退到 config.yaml 默认值。

#### Image Hero with Overlay

```astro
<PaloPageHeader
  title="The Future of Web Design"
  subtitle="Trends and innovations for 2026 and beyond"
  fullscreen={true}
  alignV="bottom"
  alignH="center"
  contentColor="#ffffff"
  topNavigationTheme="dark"
  divider="bottom"
  bg={{
    image: '/branding/hero-bg.png',
    overlayOpacity: 0.5,
  }}
/>
```

---

### Tips

1. **Use `bg` object** — don't use legacy flat props like `backgroundImage` (removed)
2. **Set `topNavigationTheme`** when using dark/light backgrounds so the site header logo stays readable
3. **Always add `overlayOpacity`** on photo/video backgrounds for WCAG contrast
4. **Use `alignH="center"`** for dramatic landing headers; `left` for list/index pages
5. **Override padding via `class="py-*"`** — not a dedicated padding prop
6. **No slot** — put CTA buttons in the section *below* `PaloPageHeader`, not inside it

1. **使用 `bg` 对象** — 不要用已废弃的平铺 prop（如 `backgroundImage`）
2. **深色/浅色背景时设置 `topNavigationTheme`** — 保证顶栏 Logo 可读
3. **图片/视频背景务必加 `overlayOpacity`** — 保证文字对比度
4. **着陆页用 `alignH="center"`**；列表页用 `left`
5. **通过 `class="py-*"` 覆盖 padding** — 没有专用 padding prop
6. **无 slot** — CTA 按钮放在 `PaloPageHeader` **下方**的 section 中

---

### Accessibility

| Feature | Implementation |
|---------|---------------|
| **Semantic structure** | `<section>` + configurable `Heading` level |
| **Sanitized subtitle** | `sanitize-html` strips unsafe tags/attributes |
| **Decorative media** | Background image/video wrapper is `aria-hidden` |
| **Video** | `muted`, `loop`, `playsinline` — no audio autoplay |
| **Nav theme** | `data-top-navigation-theme` coordinates header contrast |

Place the primary page `<h1>` here on list/static pages. Detail pages (blog posts, projects) use `PostHeader` instead with `headingLevel: h2` from config.

列表页/静态页的主 `<h1>` 应放在此处。详情页（文章、项目）使用 `PostHeader`，config 中默认 `headingLevel: h2`。

---

### Conclusion

`PaloPageHeader` is the standard page opener across Palo: one component, config-driven defaults, nested `bg` for media, and `topNavigationTheme` for header coordination. Use it on list and static pages; use `PostHeader` for content detail pages with cover images.

`PaloPageHeader` 是 Palo 的标准页面头部：单一组件、config 驱动默认值、嵌套 `bg` 管理媒体、`topNavigationTheme` 协调顶栏。列表页和静态页用它；带封面的内容详情页用 `PostHeader`。
