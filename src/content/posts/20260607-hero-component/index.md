---
title: Hero Component
description: Homepage hero with background media, navigation theme, alignment, dividers, and a content slot — used on index.astro with hasHero layout integration.
publishDate: 2026-06-07
author:
  name: "Pete"
  image: "/branding/avatar.png"
  bio: "PetePa.com"
tags: ['Components', 'Palo Theme', 'Web Design', 'Hero Section']
coverImage: ./cover.png
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
views: 2300
---

### Introduction

`Hero` is Palo's **homepage-first** immersive section: full-viewport background media, a free content slot, and `topNavigationTheme` to coordinate the site header. It lives at `src/components/Hero.astro` and is used on the homepage (`src/pages/index.astro`).

`Hero` 是 Palo 的**首页专用**沉浸式区块：全视口背景媒体、自由内容 slot，以及协调顶栏的 `topNavigationTheme`。位于 `src/components/Hero.astro`，用于首页。

Unlike `PaloPageHeader` (fixed title/subtitle for inner pages) or `CreativeSection` (mid-page bands without nav theme), Hero is built for landing-page impact with CTA buttons and custom markup inside the slot.

与 `PaloPageHeader`（内页固定 title/subtitle）和 `CreativeSection`（无 nav theme 的中段区块）不同，Hero 面向着陆页冲击力，slot 内可放 CTA 和自定义 markup。

---

### Quick Start

```astro
---
import Hero from '@components/Hero.astro'
import DefaultLayout from '@layouts/DefaultLayout.astro'
---

<DefaultLayout hasHero={true}>
  <Hero
    fullscreen={true}
    alignV="center"
    alignH="center"
    topNavigationTheme="dark"
    bg={{
      image: '/branding/hero-bg.png',
      fixed: true,
      overlayOpacity: 0.4,
    }}
    contentColor="#ffffff"
  >
    <h1>Welcome</h1>
    <p>Your message here</p>
  </Hero>
</DefaultLayout>
```

Always pair with `hasHero={true}` on `DefaultLayout` so the hero sits flush under the header (no extra `<main>` top padding).

务必在 `DefaultLayout` 上设 `hasHero={true}`，让 hero 紧贴顶栏下方（无额外 `<main>` 顶部内边距）。

---

### vs Related Components

| | `Hero` | `PaloPageHeader` | `CreativeSection` |
|--|--------|------------------|-------------------|
| **Content** | Slot (any markup) | `title` + `subtitle` | Slot |
| **`fullscreen` default** | `true` | `false` | `false` |
| **`topNavigationTheme`** | ✅ | ✅ | — |
| **Config defaults** | None (inline props) | `config.yaml` | None |
| **Typical page** | Homepage | Blog, portfolio lists | Homepage video band, footer |

See [PaloPageHeader](/blog/20260608-palo-page-header-component) and [CreativeSection](/blog/20260608-creativesection-component).

---

### Parameters

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fullscreen` | `boolean` | `true` | Viewport-height hero (`section-fullscreen`) |
| `contentColor` | `string` | `''` | Foreground text color |
| `topNavigationTheme` | `'' \| 'dark' \| 'light'` | `''` | Header logo + in-hero button theme |
| `divider` | `'top' \| 'bottom' \| 'both' \| 'none' \| ''` | `'bottom'` | Section border dividers |
| `alignV` | `'top' \| 'center' \| 'bottom' \| ''` | `''` → `center` | Vertical alignment |
| `alignH` | `'left' \| 'center' \| 'right' \| ''` | `''` → `center` | Text + horizontal alignment |
| `useContainer` | `boolean` | `true` | Wrap slot in `.container` |
| `class` | `string` | `''` | Classes on root `<section>` |
| `bg` | object | see below | Background media |

#### `bg` object

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `image` | `string` | `''` | Background image path |
| `video` | `string` | `''` | Background video (MP4 in `/public/`) |
| `color` | `string` | `''` | Solid background color |
| `fixed` | `boolean` | `false` | Fixed viewport background |
| `overlayOpacity` | `number` | `0` | Black overlay `0`–`1` |

```astro
<Hero
  bg={{
    image: '/branding/hero-bg.png',
    video: '/bg-video.mp4',
    color: '',
    fixed: true,
    overlayOpacity: 0.3,
  }}
>
  ...
</Hero>
```

Background props are nested under `bg` — not flat `backgroundImage` / `backgroundVideo`.

背景 prop 嵌套在 `bg` 内——不是平铺的 `backgroundImage` / `backgroundVideo`。

---

### Layer Architecture

```
┌──────────────────────────────┐
│  .hero__content  ← <slot />  │
├──────────────────────────────┤
│  .hero__background-overlay   │  ← rgba @ overlayOpacity
├──────────────────────────────┤
│  .hero__background-media     │  ← ContentImage (z:0) + video (z:1)
└──────────────────────────────┘
```

- **Image + video:** both render — image as underlay/poster, video on top
- **Overlay:** only when `bg.image` or `bg.video` is set
- **Decorative layers:** `aria-hidden="true"`

---

### Display Mode (`fullscreen`)

| Value | Classes | Behavior |
|-------|---------|----------|
| `true` *(default)* | `hero section-fullscreen` | Full viewport; alignment via `--hero-content-align` / `--hero-text-align` in global utilities |
| `false` | `hero hero--standard` | Standard section with flex padding |

Fullscreen mode adds nav-aware top padding: `nav-min-height + space-xl`.

全屏模式自动添加顶栏补偿内边距。

---

### Alignment (`alignV` / `alignH`)

| `alignV` | Maps to | Effect |
|----------|---------|--------|
| `top` | `start` | Content at top |
| `center` *(default)* | `center` | Vertically centered |
| `bottom` | `end` | Content at bottom |

| `alignH` | Effect |
|----------|--------|
| `''` *(empty)* | Center *(CSS default)* |
| `left` | Start-aligned |
| `center` | Center-aligned |
| `right` | End-aligned |

There is no `contentVerticalAlign` prop — use `alignV`.

没有 `contentVerticalAlign` prop——用 `alignV`。

---

### Navigation Theme (`topNavigationTheme`)

Sets `data-top-navigation-theme` on the section:

- Switches header **logo** variant (light/dark) via site CSS
- Adjusts **button** colors inside the hero (filled + outlined)

| Value | Auto background | Auto text |
|-------|----------------|-----------|
| `'dark'` | `--color-neutral-900` | `--color-neutral-100` |
| `'light'` | `--color-neutral-100` | `--color-neutral-900` |
| `''` | From `bg.color` or transparent | From `contentColor` or inherit |

Uses the same `createPageHeaderVisuals()` engine as `PaloPageHeader` (CSS vars remapped `--page-header-*` → `--hero-*`).

与 `PaloPageHeader` 共用 `createPageHeaderVisuals()`（CSS 变量映射为 `--hero-*`）。

---

### Background Media

#### Image — progressive loading

Non-PNG images get a dominant-color placeholder via `ContentImage`; PNG skips the placeholder to preserve transparency.

#### Video

Autoplay **muted**, **loop**, `playsinline`. Renders above the image layer when both are set.

#### Fixed background (`bg.fixed`)

Media becomes `position: fixed` covering the viewport. Dividers repaint as pseudo-elements above the fixed layer.

#### Overlay

```astro
<Hero
  bg={{ image: '/branding/hero-bg.png', overlayOpacity: 0.5 }}
  contentColor="#ffffff"
>
  ...
</Hero>
```

Use `0.2`–`0.5` on photo backgrounds for readable text.

---

### Dividers (`divider`)

| Value | Effect |
|-------|--------|
| `'bottom'` *(default)* | Border below |
| `'top'` | Border above |
| `'both'` | Both sides |
| `'none'` or `''` | No dividers |

Use `'none'`, not `false`.

---

### Container & Slot

| `useContainer` | Behavior |
|----------------|----------|
| `true` *(default)* | Slot wrapped in `.container` |
| `false` | Full-width slot |

The slot accepts any markup — headings, paragraphs, `Link` buttons, icons, images:

slot 可放任意 markup——标题、段落、`Link` 按钮、图标、图片：

```astro
<Hero useContainer={false} alignH="center">
  <div class="flex flex-col items-center text-center gap-6">
    <img src="/branding/favicon.svg" alt="" class="w-16 h-16" />
    <h2>Your headline</h2>
    <p class="text-lg">Supporting copy</p>
    <Link href="/contact" isButton type="primary">Get started</Link>
  </div>
</Hero>
```

Spacing and typography inside the slot are **your responsibility** — Hero does not inject title/subtitle components.

slot 内的间距和排版**由你控制**——Hero 不内置 title/subtitle 组件。

---

### Production Example — Palo Homepage

From `src/pages/index.astro`:

```astro
<DefaultLayout hasHero={true}>
  <Hero
    fullscreen={true}
    class="py-8"
    alignV="center"
    alignH="center"
    divider="bottom"
    useContainer={false}
    bg={{
      image: '/branding/hero-bg.png',
      video: '',
      fixed: true,
      overlayOpacity: 0,
    }}
  >
    <div class="flex flex-col items-center text-center gap-6">
      <img src="/branding/favicon.svg" alt="Hero Artwork" class="w-16 h-16 sm:w-24 sm:h-24" />
      <h2>Your art doesn't fit in a box. Neither should your website.</h2>
      <p class="text-lg">Palo is a minimalist Astro theme crafted for artists…</p>
      <Link href="https://github.com/petepapa/palo" isButton type="primary">
        Get on Github
      </Link>
    </div>
  </Hero>
</DefaultLayout>
```

Homepage uses `bg.fixed: true` for a parallax-style hero background and `useContainer={false}` for centered full-bleed content.

首页使用 `bg.fixed: true` 实现视差式背景，`useContainer={false}` 让居中内容全宽排列。

The lower homepage video band uses `CreativeSection` — not Hero.

首页下方的视频区块使用 `CreativeSection`——不是 Hero。

---

### Layout Integration (`hasHero`)

On `DefaultLayout`:

| Prop | When `true` |
|------|-------------|
| `hasHero` | `<main>` gets `padding-top: 0` — hero overlaps to `top: 0` under the fixed header |
| `topNavigationTheme` | Optional layout-level nav theme override (Hero's `data-top-navigation-theme` takes precedence at scroll top) |

Only use `hasHero={true}` on pages whose **first** `<main>` child is `.hero` or `.palo-page-header`.

仅当 `<main>` 的第一个子元素是 `.hero` 或 `.palo-page-header` 时使用 `hasHero={true}`。

---

### Tips

1. **Use `bg` object** — flat `backgroundImage` props are removed
2. **Set `topNavigationTheme`** on dark/light backgrounds so the header logo stays readable
3. **Add `overlayOpacity`** on busy photos — even `0.2` helps contrast
4. **`useContainer={false}`** for centered icon + headline layouts (homepage pattern)
5. **`class="py-*"`** adds vertical breathing room inside fullscreen heroes
6. **One Hero per page** — inner pages use `PaloPageHeader` instead

1. **使用 `bg` 对象** — 已移除平铺 `backgroundImage`
2. **深色/浅色背景设置 `topNavigationTheme`** — 保证顶栏 Logo 可读
3. **复杂照片加 `overlayOpacity`** — 即使 `0.2` 也有帮助
4. **居中 icon + 标题布局用 `useContainer={false}`** — 首页模式
5. **`class="py-*"`** 为全屏 hero 增加纵向空间
6. **每页一个 Hero** — 内页用 `PaloPageHeader`

---

### Accessibility

| Feature | Behavior |
|---------|----------|
| **Semantic HTML** | Root `<section>` |
| **Decorative media** | Background wrapper `aria-hidden="true"` |
| **Video** | Muted autoplay loop — no audio |
| **Slot content** | You provide heading hierarchy, alt text, and button labels |
| **Buttons in hero** | Theme-adaptive styles when `topNavigationTheme` is set |

Use a proper heading level in the slot (`h1` or `h2` depending on page structure). The homepage example uses `<h2>` because the site name/logo carries brand identity above it.

slot 内使用合适的标题层级。首页示例用 `<h2>`，因为上方 logo 已承担品牌标识。

---

### Conclusion

`Hero` is the homepage centerpiece: nested `bg` for media, `topNavigationTheme` for header coordination, alignment and divider controls, and a fully custom slot. Pair it with `DefaultLayout hasHero={true}` for flush full-viewport presentation; use `PaloPageHeader` and `CreativeSection` elsewhere.

`Hero` 是首页核心：嵌套 `bg` 管理媒体、`topNavigationTheme` 协调顶栏、对齐与分割线控制、完全自定义 slot。配合 `DefaultLayout hasHero={true}` 实现全视口贴顶展示；其他页面用 `PaloPageHeader` 和 `CreativeSection`。
