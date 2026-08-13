---
title: PostHeader Component
description: Detail-page header for blog posts and portfolio projects — cover image, breadcrumbs, author block, config.yaml defaults, and progressive image loading.
publishDate: 2026-06-03
author:
  name: "Pete"
  image: "/branding/avatar.png"
  bio: "PetePa.com"
tags: ['Components', 'Documentation', 'PostHeader']
coverImage: ./cover.jpg
coverImagePosition: top
breadcrumbs: true
customBreadcrumbLabels:
  "blog": "Blog"
  "current": ""
joinLastBreadcrumb: false
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
divider: both
toc: true
---

### Introduction

`PostHeader` is Palo’s header for **content detail pages** — individual blog posts (`/blog/{slug}`) and portfolio projects (`/portfolio/{slug}`). It renders a full-width cover image, optional breadcrumbs, title + description, author metadata, and optional Source / Live Demo buttons.

`PostHeader` 是 Palo 的**内容详情页**页头——用于博客文章（`/blog/{slug}`）和作品集项目（`/portfolio/{slug}`）。它渲染全宽封面、可选面包屑、标题与摘要、作者信息，以及可选的 Source / Live Demo 按钮。

Component path: `src/components/PostHeader.astro`

Used by: `src/pages/blog/[post].astro`, `src/pages/portfolio/[project].astro`

---

### PostHeader vs PaloPageHeader

| | **PostHeader** | **PaloPageHeader** |
|---|----------------|-------------------|
| **Use on** | Blog post & project detail pages | List pages, static pages, MDX layouts |
| **Cover** | Full-viewport hero (`60vh`) via `coverImage` | Optional `bg.image` / video / color |
| **Default heading** | `h2` (config) | `h1` (config) |
| **Config block** | `components.postHeader` | `components.paloPageHeader` |

See [PaloPageHeader Component](/blog/20260608-palo-page-header-component) for list/static page headers.

列表页与静态页头部见 [PaloPageHeader 组件](/blog/20260608-palo-page-header-component)。

---

### Configuration (`config.yaml`)

Global defaults live under **`components.postHeader`**:

```yaml
components:
  postHeader:
    headingLevel: "h2"           # Detail page title tag (h2–h6)
    descClass: "text-lg"         # Tailwind class on description/subtitle
    coverImagePosition: "head"   # top | head | bottom | none
    divider: "both"              # top | bottom | both | none
    showBreadcrumbs: true
    showShare: true              # Social share block (page layout, not PostHeader)
```

| Key | Values | Effect |
|-----|--------|--------|
| `headingLevel` | `h2`–`h6` | HTML tag for the post/project title |
| `descClass` | Tailwind class | Styles the description paragraph (from frontmatter `description`) |
| `coverImagePosition` | `top` \| `head` \| `bottom` \| `none` | Default cover placement when frontmatter omits it |
| `divider` | `top` \| `bottom` \| `both` \| `none` | Section border dividers around the header |
| `showBreadcrumbs` | boolean | Default breadcrumb visibility |
| `showShare` | boolean | Default for the share block below the article *(handled by page template)* |

Restart dev after editing config.

修改 config 后需重启 dev。

See also [Config: Everything You Like](/blog/20260603-config-everything-you-like).

---

### Resolution Order

PostHeader merges three layers:

PostHeader 合并三层配置：

```
frontmatter field  →  config.yaml (components.postHeader)  →  component fallback
```

Special behavior:

- **Empty string** (`''`) in frontmatter → treated as unset → uses config default
- **Zod catch sentinel**: if frontmatter equals the schema default (e.g. `divider: both`) but config differs, **config wins** — avoids accidental overrides when a field was never explicitly set

---

### Frontmatter Fields

These fields in `index.md` / `index.mdx` are passed to `PostHeader` by the page template:

| Field | Type | Schema default | Maps to |
|-------|------|----------------|---------|
| `title` | string | — | PostHeader `title` |
| `description` | string | `''` | PostHeader `subtitle` *(sanitized HTML)* |
| `coverImage` | string | — | Resolved cover via `resolveCollectionCoverImage()` |
| `coverImagePosition` | enum | `head` | Cover placement |
| `breadcrumbs` | boolean | `true` | Breadcrumb nav |
| `customBreadcrumbLabels` | object | — | Per-segment label overrides |
| `joinLastBreadcrumb` | boolean | `false` | Merge last two crumbs |
| `divider` | enum | `both` | `top` \| `bottom` \| `both` \| `none` |
| `source` | string | — | Source code button URL |
| `liveDemo` | string | — | Live Demo button URL |

> **`coverImagePosition: false`** is accepted and normalized to `none` (legacy shorthand).

#### Not part of PostHeader (same frontmatter, different layer)

| Field | Handled by |
|-------|------------|
| `toc` | Article layout — sticky Table of Contents sidebar |
| `share` | Article layout — `SocialShares` below content |
| `narrow` | Article layout — prose column width |
| `publishDate`, `tags`, `draft`, `featuredOrder` | Lists, SEO, filtering — not rendered in PostHeader |

There are **no** built-in publish date, reading time, or view count in PostHeader.

PostHeader **不包含**发布日期、阅读时长或浏览量显示。

---

### Component Props

When using `PostHeader` directly in Astro:

| Prop | Type | Default source | Description |
|------|------|----------------|-------------|
| `title` | string | *(required)* | Main heading text |
| `subtitle` | string | — | Description; limited HTML via `sanitize-html` |
| `coverImage` | `string \| ImageMetadata` | default asset | Resolved cover image |
| `coverImagePosition` | enum | config / `head` | Cover placement |
| `author` | `{ name, image?, bio? }` | — | Author metadata |
| `authorImageResolved` | `ResolvedImage` | — | Optimized avatar from `resolveAuthorImageResolved()` |
| `breadcrumbs` | boolean | config / `true` | Show breadcrumb trail |
| `customBreadcrumbLabels` | `Record<string, string>` | — | Override segment labels; `"current"` for last item |
| `joinLastBreadcrumb` | boolean | `false` | Join last two segments as `"Prev: Current"` |
| `divider` | enum | config / `both` | Border placement |
| `source` | string | — | GitHub / repo link |
| `liveDemo` | string | — | Demo URL |
| `headingLevel` | string | config / `h2` | Title heading tag |
| `descClass` | string | config / `text-lg` | Subtitle Tailwind classes |
| `class` | string | — | Extra classes on root `<section>` |

```astro
---
import PostHeader from '@components/PostHeader.astro'
---

<PostHeader
  title="My Post"
  subtitle="A short <strong>intro</strong>"
  coverImage={resolvedCover}
  author={{ name: 'Pete', bio: 'PetePa.com' }}
  authorImageResolved={resolvedAvatar}
/>
```

---

### Cover Image

#### Co-location (recommended)

```yaml
coverImage: ./cover.jpg
coverImagePosition: head
```

Place the file next to `index.md` / `index.mdx`. Palo resolves it through `resolveCollectionCoverImage()`. See [Asset Co-Location Guide](/blog/20260611-asset-co-location-guide).

#### Placement

Render order inside `PostHeader`:

```
top     → cover (full viewport width) → breadcrumbs → title block → [bottom cover]
head    → breadcrumbs → cover → title block → [bottom cover]
bottom  → breadcrumbs → title block → cover
none    → breadcrumbs → title block (no cover)
```

| Value | Effect |
|-------|--------|
| `top` | Cover above everything, including breadcrumbs |
| `head` | Cover after breadcrumbs, before title *(config default)* |
| `bottom` | Cover below title/author/actions |
| `none` | Hide cover (falls back to internal default image if `coverImage` unset) |

#### Visual & loading behavior

- **Layout:** `100vw` breakout, `60vh` / `60dvh` height, `object-cover`
- **Progressive load:** `ContentImage` with dominant-color placeholder (zero CLS)
- **PNG covers:** placeholder uses dominant color → fades to **contrast background** after load
- **Non-PNG covers:** placeholder uses dominant color → fades to **transparent** after load
- **Missing cover:** falls back to `src/assets/images/posts/default.png`
- Cover images use `alt=""` (decorative hero); meaning is conveyed by the visible title

---

### Title & Description

- **Title** renders via `accessible-astro-components` `Heading` at `headingLevel` (default **`h2`** on detail pages)
- **Description** (`description` frontmatter) maps to `subtitle` — supports: `<b>`, `<i>`, `<em>`, `<strong>`, `<a>`, `<span>`, `<br>`

```yaml
title: Mastering PostHeader
description: A guide to <strong>all parameters</strong> and config defaults
```

Style the description globally:

```yaml
# config.yaml
components:
  postHeader:
    descClass: "text-base text-neutral-600"
```

---

### Breadcrumbs

Auto-generated from the URL path (`Home` → segment → … → current).

```yaml
breadcrumbs: true
customBreadcrumbLabels:
  "blog": "Blog"
  "portfolio": "Work"
  "current": ""          # Empty string hides the current page label
joinLastBreadcrumb: false
```

With `joinLastBreadcrumb: true`, the last two segments merge:

```yaml
joinLastBreadcrumb: true
# /blog/my-post → "Blog: My Post" as the final crumb
```

Disable globally:

```yaml
components:
  postHeader:
    showBreadcrumbs: false
```

Or per post: `breadcrumbs: false`

---

### Author Block

```yaml
author:
  name: "Pete"
  image: "/branding/avatar.png"   # public path or co-located ./avatar.png
  bio: "PetePa.com"
```

- With a resolved avatar image → custom round avatar + name + bio
- Without image → `Avatar` component from `accessible-astro-components`
- String shorthand also works in schema: `author: "Pete"`

---

### Source & Live Demo

Optional action buttons in the meta row (right on desktop, stacked on mobile):

```yaml
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
```

Both open in a new tab with `rel="noopener noreferrer"`.

---

### Dividers

```yaml
divider: both    # top | bottom | both | none
```

| Value | Effect |
|-------|--------|
| `top` | Top border on the header section |
| `bottom` | Bottom border on the header section |
| `both` | Top and bottom borders *(config default)* |
| `none` | No section borders |

A subtle inner divider line always separates the cover/title area from the article body.

封面/标题区与正文之间始终有一条内部分割线。

---

### Customization Recipes

#### Dramatic top cover (this page)

```yaml
coverImage: ./cover.jpg
coverImagePosition: top
divider: both
```

#### Text-first, no hero image

```yaml
coverImagePosition: none
divider: bottom
```

#### Minimal breadcrumbs + centered description

```yaml
# config.yaml
components:
  postHeader:
    showBreadcrumbs: false
    descClass: "text-xl text-center"
```

#### Portfolio project with demo links

```yaml
title: Palo Theme
description: Accessible Astro starter theme
coverImage: ./cover.jpg
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
```

---

### Tips

1. **Use `./cover.jpg`** co-located paths — filename extension must match exactly
2. **Default `coverImagePosition: head`** — breadcrumbs stay above the hero; use `top` for full-bleed impact
3. **Detail pages use `h2`** — keeps a single logical `h1` elsewhere in the page outline; adjust via config if needed
4. **Edit `config.yaml` for site-wide defaults** — only override in frontmatter when a single post differs
5. **`toc` and `share` are separate** — they live in the article layout below PostHeader, not inside the component
6. **PNG covers** get a contrast-color stage after load — good for logos and transparent artwork

1. **封面用 `./cover.jpg` 同域路径** — 扩展名必须完全一致
2. **默认 `coverImagePosition: head`** — 面包屑在封面之上；`top` 适合全屏冲击感
3. **详情页标题默认 `h2`** — 可通过 config 调整
4. **全站默认值改 config** — 单篇差异再用 frontmatter 覆盖
5. **`toc` 与 `share` 独立于 PostHeader** — 由文章布局渲染
6. **PNG 封面** 加载后会过渡到反差色背景

---

### Accessibility

- Semantic `<section>` with proper heading level via `Heading` component
- Breadcrumbs use `accessible-astro-components` `Breadcrumbs` / `BreadcrumbsItem` with `currentPage`
- Decorative cover images use `alt=""`
- Source / Demo links are real `<a>` elements wrapping accessible `Button` components
- Subtitle HTML is sanitized — no arbitrary tags or scripts
- Responsive meta grid stacks on narrow viewports

---

### Troubleshooting

#### Cover not showing

- Check `coverImagePosition` is not `none`
- Verify `./filename` matches the actual file extension
- Run `npm run copy-images` in dev if using co-located frontmatter covers

#### Config change not applied

Restart `npm run dev`. For fields with Zod defaults, ensure you explicitly set frontmatter **or** rely on config override logic.

#### `divider: true` not valid

Use `divider: both` (or `top` / `bottom` / `none`). Boolean `true` is not in the schema.

---

### Conclusion

`PostHeader` is Palo’s config-driven detail-page hero: **`components.postHeader`** sets heading level, description styling, cover placement, dividers, and breadcrumb defaults; frontmatter fine-tunes per post. Pair it with co-located `./cover.jpg`, breadcrumb labels, and optional Source / Live Demo links for a consistent, accessible reading entry on every blog post and portfolio project.

`PostHeader` 是 Palo 由 config 驱动的详情页页头：**`components.postHeader`** 设定标题层级、摘要样式、封面位置、分割线与面包屑默认值；frontmatter 按篇微调。配合同域 `./cover.jpg`、面包屑标签和 Source / Live Demo 链接，为每篇文章和项目提供一致、无障碍的阅读入口。
