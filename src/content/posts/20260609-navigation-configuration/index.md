---
title: Navigation Configuration
description: Learn how to customize your website's main navigation menu in Palo — edit menu items and social links in src/navigation.ts, tune header appearance in config.yaml, and wire up QR codes, icons, and the launcher.
publishDate: 2026-06-09
author:
  name: "Pete"
  image: "/branding/avatar.png"
  bio: "PetePa.com"
tags: ['Documentation', 'Configuration', 'Navigation']
coverImage: ./cover.jpg
coverImagePosition: head
breadcrumbs: true
customBreadcrumbLabels:
  "blog": ""
  "current": ""
joinLastBreadcrumb: false
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
divider: true
toc: true
views: 800
---

### Introduction

The navigation menu is one of the most important elements of any website. Palo splits navigation into two layers:

导航菜单是任何网站最重要的元素之一。Palo 将导航配置分为两层：

| Layer | File | Controls |
|-------|------|----------|
| **Structure** | `src/navigation.ts` | Menu items, dropdowns, social links |
| **Appearance** | `src/config.yaml` → `navigation:` | Fixed header, font sizes, active styles, alignment |

| 层级 | 文件 | 控制内容 |
|------|------|---------|
| **结构** | `src/navigation.ts` | 菜单项、下拉菜单、社交链接 |
| **外观** | `src/config.yaml` → `navigation:` | 固定顶栏、字号、高亮样式、对齐方式 |

This guide covers `navigation.ts` in detail. For header styling (opacity, blur, active underline style), see [Config: Everything You Like](/blog/20260603-config-everything-you-like).

本指南详细讲解 `navigation.ts`。顶栏样式（透明度、模糊、高亮样式）请参阅 [Config: Everything You Like](/blog/20260603-config-everything-you-like)。

---

### File Overview

`src/navigation.ts` exports three symbols:

```typescript
export const navigationItems: NavigationItem[]   // Main header menu
export const socialConfig = { title, items }    // Social / contact links
export const socialItems = socialConfig.items   // Shorthand alias
```

**Where each export appears / 出现位置：**

| Export | Header menu | Launcher (⌘K) | Footer | Contact page |
|--------|:-----------:|:---------------:|:------:|:--------------:|
| `navigationItems` | ✅ | ✅ (flattened) | — | — |
| `socialConfig` | — | ✅ | ✅ | ✅ |

---

### Navigation Items (`navigationItems`)

The header menu splits into two visual groups automatically:

顶栏菜单自动分为两组：

- **Primary items** — no `icon` property → text links (Home, Blog, Portfolio, …)
- **Utility items** — has `icon` → icon-only buttons on the right (GitHub, dark mode, launcher)

#### Basic Link

```typescript
{
  label: 'Contact',
  href: '/contact',
}
```

#### Dropdown Menu

```typescript
{
  label: 'Features',
  type: 'dropdown',
  items: [
    { label: 'Accessibility statement', href: '/accessibility-statement' },
    { label: 'Accessible components', href: '/accessible-components' },
  ],
}
```

Dropdown child items support `external?: boolean` for links that open in a new tab.

下拉子项支持 `external?: boolean`，用于在新标签页打开的链接。

#### Utility Link with Icon

Icon items render as icon-only buttons with an screen-reader label (`sr-only`):

带 `icon` 的项渲染为纯图标按钮，标签文字仅对读屏软件可见：

```typescript
{
  label: 'Go to our GitHub page, opens in new tab',
  href: 'https://github.com/petepapa/palo',
  icon: 'ph:github-logo',
  external: true,
  excludeFromLauncher: true,
}
```

#### Navigation Item Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `label` | `string` | Display text (required for accessibility on icon items) |
| `href` | `string` | URL — internal path or external link |
| `type` | `'dropdown'` | Creates a dropdown menu |
| `items` | `array` | Child links for dropdowns |
| `icon` | `string` | Phosphor or fa6-brands icon name — moves item to utility bar |
| `external` | `boolean` | Opens link in a new tab with `rel="noopener noreferrer"` |
| `excludeFromLauncher` | `boolean` | Hide this item from the ⌘K launcher "Navigate to" section |
| `highlight` | `boolean` | Optional visual emphasis (link items only) |

---

### Default Menu Structure (Current Palo)

Palo ships with this structure out of the box:

```typescript
// Primary links
Home → /
Blog → /blog
Portfolio → dropdown
  ├── All projects → /portfolio
  └── {projectTypes} → /portfolio/type/{id}   // auto-generated
Features → dropdown (Accessibility, Components, Launcher, …)
Contact → /contact

// Utility bar (right side)
GitHub icon → external link (excludeFromLauncher: true)
Dark mode toggle → from config.yaml (site.darkModeToggle)
Launcher trigger → from config.yaml (site.launcher)
```

#### Dynamic Portfolio Dropdown

The Portfolio submenu auto-generates type filter links from `src/projectTypes.ts`:

Portfolio 下拉菜单的子项由 `src/projectTypes.ts` 自动生成：

```typescript
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
```

To add or rename a portfolio type filter, edit `projectTypes` — not `navigation.ts`.

添加或重命名作品集类型筛选，请编辑 `projectTypes`，而非 `navigation.ts`。

---

### Social Links (`socialConfig`)

Social links live in a separate object with a section title:

```typescript
export const socialConfig = {
  title: 'Keep in touch :-)',
  items: [
    // ...SocialItem entries
  ],
}
```

Each item is a `SocialItem` with a required `icon` and optional `type`:

| `type` | Behavior | Required fields |
|--------|----------|-----------------|
| `'link'` *(default)* | Opens URL | `href`, optional `external: true` |
| `'email'` | Opens mail client | `href: 'mailto:...'` |
| `'qrCode'` | Opens QR modal | `qrCode` (static image) **or** `qrUrl` (dynamic QR) |

#### Link Example

```typescript
{
  label: '*YouTube: *@petepatv',
  href: 'https://www.youtube.com/@petepatv',
  icon: 'ph:youtube-logo',
  type: 'link',
  external: true,
},
```

#### Email Example

```typescript
{
  label: '*Email: *hello@petepa.com',
  href: 'mailto:hello@petepa.com',
  icon: 'ph:envelope',
  type: 'email',
},
```

#### QR Code Example (WeChat — static image)

```typescript
{
  label: '*WeChat: *@pp71270371',
  icon: 'fa6-brands:weixin',
  type: 'qrCode',
  qrCode: '/branding/wechat.JPG',
},
```

#### QR Code Example (Douyin — dynamic URL)

```typescript
{
  label: '*Douyin: *@petepa',
  icon: 'ph:tiktok-logo',
  type: 'qrCode',
  qrUrl: 'https://v.douyin.com/F7SeXJTTMGA/',
},
```

QR modals are shared across Footer, Launcher, and Contact page — one config, three surfaces.

QR 弹窗在 Footer、Launcher 和 Contact 页面共用同一套配置。

#### Social Item Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `label` | `string` | Display text — supports `*accent*` markup (see below) |
| `icon` | `string` | Icon name (`ph:…` or `fa6-brands:…`) |
| `type` | `'link' \| 'email' \| 'qrCode'` | Link behavior |
| `href` | `string` | URL or `mailto:` address |
| `external` | `boolean` | Open in new tab (`link` type) |
| `qrCode` | `string` | Path to static QR image in `public/` |
| `qrUrl` | `string` | URL encoded into a dynamically generated QR code |

---

### Label Accent Markup

Social labels support lightweight inline styling via asterisks:

社交链接标签支持星号标记的内联样式：

| Syntax | Renders as |
|--------|-----------|
| `*text*` | Accent weight |
| `**text**` | Heading weight |
| plain text | Body weight |

Example: `*WeChat: *@pp71270371` → "WeChat:" in accent weight, "@pp71270371" in body weight.

示例：`*WeChat: *@pp71270371` → "WeChat:" 为 accent 字重，"@pp71270371" 为 body 字重。

---

### Icons

Navigation icons use the same `<Icon>` system as the rest of Palo. Most UI icons come from **Phosphor** (`ph:`); regional brand logos use **Font Awesome 6 Brands** (`fa6-brands:`).

| Platform | Icon name | Set |
|----------|-----------|-----|
| GitHub | `ph:github-logo` | Phosphor |
| YouTube | `ph:youtube-logo` | Phosphor |
| Email | `ph:envelope` | Phosphor |
| Douyin | `ph:tiktok-logo` | Phosphor |
| WeChat | `fa6-brands:weixin` | FA Brands |
| Weibo | `fa6-brands:weibo` | FA Brands |

Full icon reference: [Phosphor Icons Guide](/blog/20260609-phosphor-icons-guide).

---

### Launcher Integration

When `site.launcher` is not `'off'` in `config.yaml`, the ⌘K launcher shows:

1. **Navigate to** — flattened `navigationItems` (dropdowns expanded; items with `excludeFromLauncher` skipped)
2. **Blog posts** — auto-populated from the `posts` collection (up to 30)
3. **Projects** — auto-populated from the `projects` collection
4. **Keep in touch** — `socialConfig.items` with icons

Blog posts and projects are **not** configured in `navigation.ts` — they come from content collections automatically.

博客文章和项目**不在** `navigation.ts` 中配置——它们从 content collections 自动读取。

Launcher appearance (`default` / `compact` / `gradientBorder` / `off`) and icon are set in `config.yaml` under `site.launcher` and `site.launcherIcon`.

---

### Navigation Appearance (`config.yaml`)

Visual tuning lives in `config.yaml` under the `navigation:` key:

```yaml
navigation:
  fixedHeader: true
  minHeight: '6rem'
  headerBackgroundOpacity: 0.45
  headerBackgroundBlur: 10px
  desktopMenuAlignment: 'center'    # left | center | right
  activeStyle: 'boldwavy'           # wavy | underline | bold | boldwavy | boldunderline
  desktopFontSize: 'lg'
  mobileFontSize: 'xl'
  navList:
    activeStyle: 'both'             # bold | underline | both | none
    horizontalGap: 'gap-4'
    verticalScale: 0.6
```

See [Config: Everything You Like](/blog/20260603-config-everything-you-like) for the full parameter reference.

完整参数说明见 [Config: Everything You Like](/blog/20260603-config-everything-you-like)。

---

### Practical Examples

#### Add a Simple Menu Item

```typescript
// In navigationItems array, before the utility GitHub item:
{
  label: 'About',
  href: '/about',
},
```

#### Add a Dropdown

```typescript
{
  label: 'Resources',
  type: 'dropdown',
  items: [
    { label: 'Documentation', href: '/blog' },
    { label: 'Changelog', href: '/changelog' },
  ],
},
```

#### Add a Social Link

```typescript
// In socialConfig.items:
{
  label: '*GitHub: *@yourname',
  href: 'https://github.com/yourname',
  icon: 'ph:github-logo',
  type: 'link',
  external: true,
},
```

#### Hide Header Item from Launcher

```typescript
{
  label: 'Internal docs',
  href: '/docs',
  excludeFromLauncher: true,
},
```

---

### Tips and Best Practices

1. **Keep primary navigation short** — group related pages into dropdowns
2. **Write descriptive labels** — especially for icon-only utility items (screen readers use the full `label`)
3. **Use `external: true`** for all off-site links
4. **Use `excludeFromLauncher: true`** for redundant utility icons already visible in the header
5. **Use `fa6-brands:` for brand logos** Phosphor does not include (WeChat, Weibo, QQ, Bilibili)
6. **Edit `projectTypes.ts` for portfolio filters** — not `navigation.ts`
7. **Edit `config.yaml` for visual styling** — not `navigation.ts`

1. **保持主导航简洁** — 相关页面归入下拉菜单
2. **标签描述清晰** — 纯图标项的 `label` 会被读屏软件朗读
3. **站外链接使用 `external: true`**
4. **已在顶栏显示的图标项可设 `excludeFromLauncher: true`**
5. **Phosphor 没有的品牌 Logo 用 `fa6-brands:`**（微信、微博、QQ、Bilibili）
6. **作品集类型筛选改 `projectTypes.ts`** — 不是 `navigation.ts`
7. **视觉样式改 `config.yaml`** — 不是 `navigation.ts`

---

### AI-Assisted Setup

You can describe changes in plain language and let AI edit `src/navigation.ts` for you:

> "Add an About link to /about before Contact"

> "Add a Weibo social link using fa6-brands:weibo pointing to https://weibo.com/u/123456"

> "Create a Resources dropdown with links to /blog and /portfolio"

---

### Conclusion

Palo navigation is intentionally split: **`navigation.ts` for what links exist**, **`config.yaml` for how they look**. Social links use a typed system (`link`, `email`, `qrCode`) shared across Footer, Launcher, and Contact — configure once, appear everywhere.

Palo 的导航刻意分为两层：**`navigation.ts` 决定有哪些链接**，**`config.yaml` 决定它们长什么样**。社交链接使用 `link` / `email` / `qrCode` 类型系统，Footer、Launcher、Contact 三处共用——配置一次，处处生效。
