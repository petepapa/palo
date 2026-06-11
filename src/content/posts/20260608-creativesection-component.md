---
title: CreativeSection Component
description: Learn how to use the CreativeSection component to create dynamic section layouts with background media (images and videos), flexible content containers, and various display modes. Supports useContainer parameter for controlling container behavior
publishDate: 2026-06-08
author:
  name: "Pete"
  image: "/branding/avatar.png"
  bio: "PetePa.com"
tags: ['Components', 'Documentation', 'CreativeSection']
coverImage: /posts/docs/creativesection.png
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
views: 2100

---

### Introduction

The CreativeSection component is a powerful and flexible section component designed for hero areas, feature showcases, or any content that needs stunning background visuals. It supports both images and videos as backgrounds, with customizable overlays and content positioning.

CreativeSection 组件是一个功能强大且灵活的区块组件，专为英雄区域、功能展示或任何需要精美背景视觉的内容而设计。它支持图片和视频作为背景，具有可自定义的遮罩和内容定位。

This component is perfect for:
- Landing page hero sections
- Feature highlights
- Product showcases
- Creative portfolios
- Brand storytelling

该组件非常适合用于：
- 着陆页英雄区域
- 功能亮点
- 产品展示
- 创意作品集
- 品牌故事讲述

---

### What is CreativeSection Component?

CreativeSection is more than just a simple section wrapper - it's a complete background media solution that handles:
- Video and image backgrounds
- Semi-transparent overlays for text readability
- Fullscreen display mode
- Fixed background scrolling
- Custom content colors
- Content vertical alignment
- Dividers for section separation
- Accessibility features like `prefers-reduced-motion` support

CreativeSection 不仅仅是一个简单的区块包装器 - 它是一个完整的背景媒体解决方案，可以处理：
- 视频和图片背景
- 提高文字可读性的半透明遮罩
- 全屏显示模式
- 背景固定滚动
- 自定义内容颜色
- 内容垂直对齐
- 用于区块分隔的分割线
- 无障碍功能，如 `prefers-reduced-motion` 支持

---

### Core Parameters

#### Display Mode Parameters

##### `fullscreen`
- **Type**: `boolean`
- **Required**: `false`
- **Default**: `false`
- **Function**: Whether to display the section as fullscreen (filling the entire viewport height)

When enabled, the section will take up 100% of the viewport height, making it perfect for hero sections or dramatic introductions.

是否将区块显示为全屏（填满整个视口高度）。

启用后，区块将占据 100% 的视口高度，非常适合用于英雄区域或戏剧化的介绍。

**Example**:
```astro
<CreativeSection fullscreen>
  <h1>Welcome to our site</h1>
</CreativeSection>
```

---

#### Background Media Parameters

##### `backgroundImage`
- **Type**: `string`
- **Required**: `false`
- **Default**: `''`
- **Function**: Path to the background image file (placed under `/public`)

The image will be scaled to cover the entire section using `background-size: cover`.

背景图片文件的路径（放在 `/public` 目录下）。

图片将使用 `background-size: cover` 缩放以覆盖整个区块。

**Example**:
```astro
<CreativeSection backgroundImage="/images/hero.jpg">
  <h1>Our Story</h1>
</CreativeSection>
```

##### `backgroundVideo`
- **Type**: `string`
- **Required**: `false`
- **Default**: `''`
- **Function**: Path to the background video file (placed under `/public`, typically MP4 format)

Videos will autoplay, loop, and be muted by default for accessibility. They will be automatically hidden when `prefers-reduced-motion` is enabled.

背景视频文件的路径（放在 `/public` 目录下，通常是 MP4 格式）。

视频将自动播放、循环播放，并且默认静音以确保无障碍。当启用 `prefers-reduced-motion` 时，视频会自动隐藏。

**Example**:
```astro
<CreativeSection backgroundVideo="/videos/hero.mp4">
  <h1>Watch our journey</h1>
</CreativeSection>
```

##### `backgroundColor`
- **Type**: `string`
- **Required**: `false`
- **Default**: `transparent`
- **Function**: Background color for the section (supports Hex, OKLCH, CSS variables)

Can be used alone or as a fallback for background media.

区块的背景颜色（支持 Hex、OKLCH、CSS 变量）。

可以单独使用，也可以作为背景媒体的回退。

**Example**:
```astro
<CreativeSection backgroundColor="var(--brand-primary)">
  <h1>Brand Color Background</h1>
</CreativeSection>
```

##### `backgroundFixed`
- **Type**: `boolean`
- **Required**: `false`
- **Default**: `false`
- **Function**: Whether to keep the background fixed while content scrolls

Creates a parallax-like effect where the background stays in place as the user scrolls past.

是否在内容滚动时保持背景固定。

创建类似视差的效果，当用户滚动时背景保持在原位。

**Example**:
```astro
<CreativeSection
  backgroundImage="/images/hero.jpg"
  backgroundFixed
>
  <h1>Parallax Effect</h1>
</CreativeSection>
```

##### `backgroundOverlayOpacity`
- **Type**: `number`
- **Required**: `false`
- **Default**: `0`
- **Function**: Opacity of the dark overlay (from 0 to 1)

Adds a semi-transparent black overlay to improve text readability on busy backgrounds.

深色遮罩的透明度（从 0 到 1）。

添加半透明黑色遮罩，以提高在复杂背景上的文字可读性。

**Example**:
```astro
<CreativeSection
  backgroundImage="/images/busy.jpg"
  backgroundOverlayOpacity={0.5}
>
  <h1>Readable Text on Busy Background</h1>
</CreativeSection>
```

---

#### Content Parameters

##### `contentColor`
- **Type**: `string`
- **Required**: `false`
- **Default**: `''` (follows theme text color)
- **Function**: Foreground text color (supports Hex, OKLCH, CSS variables)

Set a custom color for all content inside the section.

前景文字颜色（支持 Hex、OKLCH、CSS 变量）。

为区块内的所有内容设置自定义颜色。

**Example**:
```astro
<CreativeSection
  backgroundColor="var(--brand-primary)"
  contentColor="var(--color-neutral-100)"
>
  <h1>White Text on Primary Background</h1>
</CreativeSection>
```

##### `contentVerticalAlign`
- **Type**: `'' | 'top' | 'center' | 'bottom'`
- **Required**: `false`
- **Default**: `'center'`
- **Function**: Vertical alignment of the content inside the section

Controls where the content slot is positioned vertically.

区块内内容的垂直对齐方式。

控制内容槽在垂直方向上的位置。

**Example**:
```astro
<CreativeSection fullscreen contentVerticalAlign="bottom">
  <h1>Content at the Bottom</h1>
</CreativeSection>
```

---

#### Content Wrapper Parameters

##### `useContainer`
- **Type**: `boolean`
- **Required**: `false`
- **Default**: `true`
- **Function**: Whether to wrap the content in a container

When `true`, content will be wrapped in Palo's standard `container` class for proper horizontal spacing and max-width. When `false`, content will stretch to the full width of the section.

是否用 container 容器包裹内容。

当为 `true` 时，内容将被包裹在 Palo 的标准 `container` 类中，以获得适当的水平间距和最大宽度。当为 `false` 时，内容将拉伸到区块的全宽度。

**Example**:
```astro
<CreativeSection useContainer={false}>
  <h1>Full-Width Content</h1>
  <p>This content stretches to the edges</p>
</CreativeSection>
```

---

#### Section Separation Parameters

##### `divider`
- **Type**: `boolean | 'top' | 'both' | 'bottom' | '上方' | '上下' | '下方'`
- **Required**: `false`
- **Default**: `true`
- **Function**: Position of the divider

Options:
- `'top'` / `'上方'` - Display divider at the top
- `'bottom'` / `'下方'` - Display divider at the bottom (default)
- `'both'` / `'上下'` - Display dividers at both top and bottom
- `false` - Hide all dividers

选项：
- `'top'` / `'上方'` - 在顶部显示分割线
- `'bottom'` / `'下方'` - 在底部显示分割线（默认）
- `'both'` / `'上下'` - 在顶部和底部都显示分割线
- `false` - 隐藏所有分割线

**Example**:
```astro
<CreativeSection divider="both">
  <h1>Section with Dividers on Both Sides</h1>
</CreativeSection>
```

##### `class`
- **Type**: `string`
- **Required**: `false`
- **Default**: `''`
- **Function**: Additional custom CSS classes

Add extra classes for further customization.

添加额外的 CSS 类以进行进一步自定义。

---

### Practical Examples

#### Example 1: Simple Hero Section
A basic hero section with a background image and centered content.

带有背景图片和居中内容的基本英雄区块。

```astro
<CreativeSection
  backgroundImage="/images/hero.jpg"
  backgroundOverlayOpacity={0.3}
  contentColor="var(--color-neutral-100)"
>
  <h1>Welcome to Palo</h1>
  <p>Build beautiful, accessible websites</p>
</CreativeSection>
```

#### Example 2: Fullscreen Video Hero
A dramatic fullscreen hero with video background.

带有视频背景的戏剧化全屏英雄区块。

```astro
<CreativeSection
  fullscreen
  backgroundVideo="/videos/hero.mp4"
  backgroundOverlayOpacity={0.4}
  contentColor="var(--color-neutral-100)"
>
  <h1>Experience the Future</h1>
  <p>Watch our story unfold</p>
</CreativeSection>
```

#### Example 3: Parallax Section
A section with fixed background and dividers.

带有固定背景和分割线的区块。

```astro
<CreativeSection
  backgroundImage="/images/nature.jpg"
  backgroundFixed
  backgroundOverlayOpacity={0.2}
  divider="both"
>
  <h2>Our Journey</h2>
  <p>From humble beginnings to where we are today</p>
</CreativeSection>
```

#### Example 4: Color Section
A simple section using brand colors without background media.

使用品牌颜色、不带背景媒体的简单区块。

```astro
<CreativeSection
  backgroundColor="var(--brand-info)"
  contentColor="var(--color-neutral-100)"
>
  <h2>Information Section</h2>
  <p>Important information for our users</p>
</CreativeSection>
```

#### Example 5: Full-Width Content
A section without container, allowing content to stretch to full width.

不带 container 的区块，让内容拉伸到全宽度。

```astro
<CreativeSection
  backgroundColor="var(--color-neutral-100)"
  useContainer={false}
>
  <div class="bg-primary text-neutral-100 px-8 py-16">
    <h2>Full-Width Banner</h2>
    <p>This content stretches from edge to edge</p>
  </div>
</CreativeSection>
```

---

### Pro Tips

1. **Image Sizing**: Use high-quality images that are at least 1920px wide for best results
2. **Video Optimization**: Keep video files small (under 5MB) for fast loading - use MP4 format with H.264 encoding
3. **Overlay Usage**: Use `backgroundOverlayOpacity` between 0.2-0.5 for most backgrounds - enough to improve readability without obscuring the media
4. **Contrast Check**: Always ensure good contrast between content and background
5. **Fullscreen Usage**: Reserve `fullscreen` mode for important hero sections to avoid overwhelming users
6. **Fixed Background**: Use `backgroundFixed` sparingly as it can cause performance issues on some devices

1. **图片尺寸**：使用至少 1920px 宽的高质量图片以获得最佳效果
2. **视频优化**：保持视频文件较小（5MB 以下）以实现快速加载 - 使用 H.264 编码的 MP4 格式
3. **遮罩使用**：对于大多数背景，使用 0.2-0.5 之间的 `backgroundOverlayOpacity` - 足以提高可读性而不会掩盖媒体
4. **对比度检查**：始终确保内容和背景之间有良好的对比度
5. **全屏使用**：将 `fullscreen` 模式用于重要的英雄区块，以避免让用户感到不知所措
6. **固定背景**：谨慎使用 `backgroundFixed`，因为它可能在某些设备上导致性能问题

---

### Accessibility First

The CreativeSection component is built with accessibility at its core:

CreativeSection 组件以无障碍为核心构建：

- **`prefers-reduced-motion` Support**: Videos are automatically hidden when users have motion reduction enabled
- **Semantic HTML**: Uses proper `<section>` element for content grouping
- **Keyboard Navigation**: All interactive content remains accessible
- **ARIA Hidden Backgrounds**: Background media is marked with `aria-hidden="true"` to prevent screen readers from interacting
- **Color Contrast**: Supports custom content colors to ensure WCAG 2.2 AA compliance
- **Focus Indicators**: No focus outline removal
- **Video Accessibility**: Videos are muted by default and loop without sound

CreativeSection 组件以无障碍为核心构建：

- **`prefers-reduced-motion` 支持**：当用户启用动态效果减弱时，视频会自动隐藏
- **语义化 HTML**：使用适当的 `<section>` 元素进行内容分组
- **键盘导航**：所有交互内容都保持可访问
- **ARIA 隐藏背景**：背景媒体标记为 `aria-hidden="true"` 以防止屏幕阅读器交互
- **颜色对比度**：支持自定义内容颜色以确保 WCAG 2.2 AA 合规
- **焦点指示器**：不删除焦点轮廓
- **视频无障碍**：视频默认静音且无声循环

---

### Using the New Semantic Color Classes

CreativeSection works perfectly with Palo's new semantic color utility classes:

CreativeSection 与 Palo 新的语义颜色工具类完美配合：

```astro
<CreativeSection class="bg-info text-neutral-100">
  <h2>Info Section</h2>
  <p>Using the semantic bg-info class</p>
</CreativeSection>
```

Available color classes include:
- Background: `bg-primary`, `bg-secondary`, `bg-info`, `bg-success`, `bg-warning`, `bg-error`
- Text: `text-primary`, `text-secondary`, `text-info`, `text-success`, `text-warning`, `text-error`
- Border: `border-primary`, `border-secondary`, `border-info`, `border-success`, `border-warning`, `border-error`

可用的颜色类包括：
- 背景：`bg-primary`, `bg-secondary`, `bg-info`, `bg-success`, `bg-warning`, `bg-error`
- 文字：`text-primary`, `text-secondary`, `text-info`, `text-success`, `text-warning`, `text-error`
- 边框：`border-primary`, `border-secondary`, `border-info`, `border-success`, `border-warning`, `border-error`

Each also has tone variants like `-100`, `-200`, `-300`, `-400`, `-500` for more nuanced colors.

每个还有色调变体，如 `-100`、`-200`、`-300`、`-400`、`-500`，用于更细致的颜色。

---

### Conclusion

The CreativeSection component provides a flexible, accessible, and beautiful solution for creating stunning sections with background media. Whether you're building a simple hero or an elaborate showcase, this component gives you the tools to create visually impressive content while maintaining accessibility standards.

CreativeSection 组件提供了一个灵活、无障碍且美观的解决方案，用于创建带有背景媒体的精美区块。无论你是在构建一个简单的英雄区块还是一个精心设计的展示，这个组件都为你提供了工具，让你在保持无障碍标准的同时创建视觉上令人印象深刻的内容。
