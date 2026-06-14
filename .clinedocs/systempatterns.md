# System Patterns

## Button Styling Logic
- **Unified Global Hover**: All buttons share consistent hover, focus, and active states.
- **No Shadows**: Buttons intentionally have no box-shadows.
- **No Movement**: Buttons do not translate or move on interaction.

## Safari Sub-pixel Antialiasing Barrier

When using fluid `aspect-ratio` values (especially non-integer ratios like `9/16` = `0.5625`) combined with hover `transform: scale()` animations, Safari (WebKit) can exhibit a sub-pixel rendering overflow bug: the container's computed height produces a fractional value (e.g. `.66px`, `.33px`), causing the GPU rasterization slice to misalign with the CSS box boundary by < 1px, leaking background/line color from behind the card.

### Defense Layer (Applied in 3 tiers)

| Tier | Element | Properties Applied |
|------|---------|-------------------|
| Outer Wrapper | `.project-card` | `transform: translateZ(0)` + `backface-visibility: hidden` + `perspective: 1000px` + `background-clip: padding-box` |
| Media Container | `.project-card__media` | `clip-path: inset(0)` + `isolation: isolate` |
| Image Layer | `.project-card__image` | `transform: translateZ(0) scale(1)` + `perspective: 1000px` + explicit `-webkit-transform` |
| Column Item | `.project-masonry__item` | `transform: translateZ(0)` + `perspective: 1000px` |

These styles force WebKit to push all card layers into a GPU compositing layer, eliminating the fractional-pixel gap during hover transitions.

## Tailwind Columns Safety List

When using dynamic column numbers in portfolio/blog grids that may exceed Tailwind v4's built-in range (1-4), a **safety list** is declared in `src/styles/tailwind.css` under `@layer utilities`. This explicitly generates CSS for `columns-5` through `columns-12` and all their responsive variants (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`).

### How it works

1. `src/types/config.ts::buildColumnsClass()` converts a `PortfolioColumns` object to standard class syntax: `columns-1 sm:columns-2 lg:columns-5 xl:columns-5`
2. Tailwind v4 natively handles values 1-4 (including their responsive variants)
3. The safety list in `tailwind.css` explicitly declares `columns-5~12` and all `sm:`/`md:`/`lg:`/`xl:`/`2xl:` variants
4. `buildGridColsClass()` remains using arbitrary value syntax `grid-cols-[N]` since `grid-cols-*` has no such gap in Tailwind v4

### When Adding a New Column Count

If a column count > 12 is ever needed, add it to the safety list in `src/styles/tailwind.css` (all breakpoint variants).

## 模块全局基座平级继承架构 (Config Defaults Cascade Pattern)

The config.yaml uses a **defaults + scene-level override** architecture, where each scene page (listPage, tagPage, typePage) inherits from a shared `defaults` block but can selectively override any field.

### Architecture
```
portfolio:
  defaults:        # 🧬 纯视觉基因基座 — 所有场景的兜底
    showTags: true
    showStats: true
    layout: "overlay"
    width: "full"
    gap: "gap-5"
    columns: { initial: 1, sm: 2, lg: 3, xl: 3 }
    tagsHeading: "h5"
    projectHeadingLevel: "h5"
    projectDescClass: "text-base"
  listPage:        # 📄 列表页覆盖 — 与 defaults 平级
    title: "PORTFOLIO"
    subtitle: "Selected works."
  typePage:        # 📐 类型页覆盖
    layout: "standard"
    width: "container"
    gap: "gap-6"
  tagPage: {}      # 🏷️ 标签页 — 空对象 = 100% 继承 defaults

blog:
  defaults:        # 🧬 博客基座
    showTags: true
    showStats: true
    itemGap: "gap-24"
    cardGap: "gap-12 md:gap-24"
    tagsHeading: "h5"
    postHeadingLevel: "h3"
    postDescClass: "text-base"
  listPage: {}     # 📄 博客列表页 — 空对象 = 100% 继承 defaults
```

### 三级降级链路 (Triple Fallback Chain)
Each page template implements the same resolution pattern:
```
[scenePage] → [defaults] → [hardcoded fallback]
```

### Resolution Example (portfolio listPage)
```typescript
const portfolioDefaults = config.portfolio?.defaults ?? {}
const portfolioListPage = config.portfolio?.listPage ?? {}

const pageConfig = {
  showTags: portfolioListPage.showTags ?? portfolioDefaults.showTags ?? true,
  layout: portfolioListPage.layout ?? portfolioDefaults.layout ?? 'overlay',
  width: (portfolioListPage.width ?? portfolioDefaults.width ?? 'full') as ProjectListWidth,
  colsClass: buildColumnsClass(
    Object.keys(portfolioListPage.columns ?? {}).length > 0
      ? portfolioListPage.columns
      : portfolioDefaults.columns
  ),
  // ... etc
}
```

### Columns 继承特殊处理
Since `columns` is an object (`PortfolioColumns`) that cannot be resolved with simple `??`, the pattern checks for non-empty keys:
```typescript
const effectiveColumns = scenePage.columns !== undefined && Object.keys(scenePage.columns).length > 0
  ? scenePage.columns
  : defaults.columns
```

### Width Dynamics
Each page template supports `full` vs `container` width switching:
- **listPage** (masonry): `<div class={isFullWidthList ? "w-full" : "container"}>` around the `ul`
- **typePage** (grid): Same pattern — typePage.width defaults to `"container"` (overriding defaults' `"full"`)
- **featuredComponent / latestComponent**: Uses its own local config with `limit` field

### Type Safety
Each scene config type (`PortfolioListPageConfig`, `PortfolioTagPageConfig`, `BlogListPageConfig`) includes the same optional fields as `defaults`, enabling type-safe selective overrides.

## Patch Management

This project uses `patch-package` to apply fixes directly to `accessible-astro-components` in `node_modules/`. The patch file is at `patches/accessible-astro-components+5.2.0.patch`.

### Current Patches

| Component | File | Fix Description |
|-----------|------|-----------------|
| Avatar | `src/components/avatar/Avatar.astro` | `.initials` span now uses `display: flex; align-items: center; justify-content: center; inline-size: 100%; block-size: 100%;` to ensure initials text is vertically and horizontally centered inside the avatar circle. |
| Badge | `src/components/badge/Badge.astro` | Circular badges (`isCircular`) now use fixed `inline-size`/`block-size` instead of `aspect-ratio` + `min-inline-size`/`min-block-size` to guarantee a perfect circle. Additionally, direct children of `badge.circular` are styled as flexbox with `align-items: center; justify-content: center; inline-size: 100%; block-size: 100%;` to ensure numbers/text are perfectly centered. |

### When Adding a New Patch
1. Edit the source file directly in `node_modules/accessible-astro-components/`
2. Run `npx patch-package accessible-astro-components` to regenerate the patch
3. Update this file with a description of the fix
4. Test the component in both dev (`npm run dev`) and build (`npm run build`)