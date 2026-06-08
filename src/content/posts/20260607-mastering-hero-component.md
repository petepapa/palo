---
title: "Mastering the Hero Component"
description: "Learn how to use Palo's Hero component to create stunning, accessible page headers with customizable backgrounds, layouts, and interactive elements"
publishDate: 2026-06-07
author:
  name: "Pete"
  image: "/branding/avater.png"
  bio: "PetePa.com"
tags: ['Components', 'Palo Theme', 'Web Design', 'Hero Section']
coverImage: /posts/docs/hero.png
coverImagePosition: head
showBreadcrumbs: true
customBreadcrumbLabels:
  "blog": "博客"
  "current": ""
joinLastBreadcrumb: false
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
showDivider: true
showTableOfContents: true
views: 2300

---

### Introduction

The Hero component is your page's first impression. It provides a flexible, accessible container for your most important content, with support for videos, images, fixed backgrounds, and various layout options.

Hero 组件是你页面的第一印象。它提供了一个灵活、可访问的容器来展示你最重要的内容，支持视频、图片、固定背景和多种布局选项。

---

### What is the Hero Component?

The Hero component is a versatile section component that sits at the top of your page. It handles background media (images/videos), content alignment, divider lines, and accessibility features out of the box.

Hero 组件是一个多功能的区块组件，位于页面顶部。它开箱即用地处理背景媒体（图片/视频）、内容对齐、分隔线和无障碍功能。

---

### Core Features

#### Basic Display Options

Control whether your hero takes up the full viewport or a standard section height.

控制你的 hero 是占据整个视口还是标准区块高度。

```astro
<Hero
  fullscreen={true}
>
  <h1>Welcome to My Site</h1>
</Hero>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `fullscreen` | boolean | `true` | Full viewport height vs standard section height | 是否全屏高度，`true` 为全屏，`false` 为标准高度 |

---

#### Content Color

Control text color within the hero.

控制 hero 内的文字颜色。

```astro
<Hero
  contentColor="#ffffff"
  backgroundImage="/dark-bg.jpg"
>
  <h1>White Text on Dark Background</h1>
</Hero>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `contentColor` | string | `''` | Text content color (CSS color value) | 文字内容颜色（CSS 颜色值） |

---

#### Background Media

Add stunning visual backgrounds with images or videos.

使用图片或视频添加令人惊叹的视觉背景。

```astro
<!-- Image Background / 图片背景 -->
<Hero
  backgroundImage="/hero-bg.jpg"
  backgroundFixed={true}
>
  <h1>Parallax Effect</h1>
</Hero>

<!-- Video Background / 视频背景 -->
<Hero
  backgroundVideo="/hero-video.mp4"
>
  <h1>Animated Background</h1>
</Hero>

<!-- Solid Color Background / 纯色背景 -->
<Hero
  backgroundColor="#2563eb"
>
  <h1>Clean Look</h1>
</Hero>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `backgroundImage` | string | `''` | Background image path | 背景图片路径 |
| `backgroundVideo` | string | `''` | Background video path (MP4 format) | 背景视频路径（MP4 格式） |
| `backgroundColor` | string | `''` | Solid background color | 纯色背景色 |
| `backgroundFixed` | boolean | `false` | Fixed background (parallax effect) | 背景是否固定（视差效果） |

**Note:** When both `backgroundImage` and `backgroundVideo` are provided, the video takes precedence.

**注意：** 当同时提供 `backgroundImage` 和 `backgroundVideo` 时，视频优先显示。

---

#### Background Overlay

Add a semi-transparent overlay to improve text readability on busy backgrounds.

添加半透明遮罩，以在复杂背景上提高文字可读性。

```astro
<Hero
  backgroundImage="/busy-photo.jpg"
  backgroundOverlayOpacity={0.6}
>
  <h1>Text Stands Out</h1>
</Hero>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `backgroundOverlayOpacity` | number | `0` | Overlay opacity from 0 (transparent) to 1 (solid) | 遮罩透明度，0 为完全透明，1 为完全不透明 |

---

#### Navigation Theme Integration

Automatically adapt the navigation theme based on your hero background.

根据你的 hero 背景自动适配导航主题。

```astro
<Hero
  backgroundImage="/dark-bg.jpg"
  topNavigationTheme="dark"
>
  <h1>Light Navigation on Dark Background</h1>
</Hero>

<Hero
  backgroundImage="/light-bg.jpg"
  topNavigationTheme="light"
>
  <h1>Dark Navigation on Light Background</h1>
</Hero>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `topNavigationTheme` | string | `''` | Navigation theme: `'light'` or `'dark'` | 导航主题：`'light'`（浅色导航）或 `'dark'`（深色导航） |

This setting also affects button colors within the hero to maintain proper contrast.

这个设置也会影响 hero 内的按钮颜色，以保持适当的对比度。

---

#### Divider Lines

Add elegant divider lines above or below the hero section.

在 hero 区块上方或下方添加优雅的分隔线。

```astro
<!-- Bottom divider (default) / 底部分隔线（默认） -->
<Hero showDivider={true}>
  <h1>Bottom Divider</h1>
</Hero>

<!-- Top divider / 顶部分隔线 -->
<Hero showDivider="top">
  <h1>Top Divider</h1>
</Hero>

<!-- Both top and bottom / 上下都有 -->
<Hero showDivider="both">
  <h1>Both Dividers</h1>
</Hero>

<!-- No dividers / 无分隔线 -->
<Hero showDivider={false}>
  <h1>No Dividers</h1>
</Hero>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `showDivider` | multiple | `true` | Divider placement: `true`/`'bottom'`/`'下方'`, `'top'`/`'上方'`, `'both'`/`'上下'`, `false`/`'false'` | 分隔线位置 |

---

#### Content Vertical Alignment

Control how content aligns vertically within the hero.

控制内容在 hero 内的垂直对齐方式。

```astro
<Hero
  contentVerticalAlign="center"
>
  <h1>Centered Content</h1>
</Hero>

<Hero
  contentVerticalAlign="top"
>
  <h1>Top-Aligned Content</h1>
</Hero>

<Hero
  contentVerticalAlign="bottom"
>
  <h1>Bottom-Aligned Content</h1>
</Hero>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `contentVerticalAlign` | string | `'center'` | Content alignment: `'top'`, `'center'`, or `'bottom'` | 内容对齐方式：`'top'`（顶部）、`'center'`（居中）、`'bottom'`（底部） |

---

#### Content Container

Control whether content is wrapped in a container or spans the full width.

控制内容是否包裹在 container 中，还是占满全宽度。

```astro
<!-- Default: with container (standard width) -->
<Hero>
  <h1>Standard Width Content</h1>
</Hero>

<!-- Without container (full width) -->
<Hero useContainer={false}>
  <h1>Full Width Content</h1>
</Hero>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `useContainer` | boolean | `true` | Wrap content in container for proper width | 是否将内容包裹在 container 中以获得适当的宽度 |

---

#### Custom Classes

Add your own CSS classes for additional styling.

添加你自己的 CSS 类来进行额外的样式调整。

```astro
<Hero
  class="py-24 px-8"
>
  <h1>Custom Spacing</h1>
</Hero>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `class` | string | `''` | Custom CSS classes | 自定义 CSS 类 |

---

### Practical Examples

#### Minimalist Hero / 极简主义 Hero

```astro
<Hero
  fullscreen={false}
  backgroundColor="#f8fafc"
  showDivider="bottom"
>
  <h1>Clean & Simple</h1>
  <p>Welcome to our site</p>
</Hero>
```

---

#### Image Background with Overlay / 带遮罩的图片背景

```astro
<Hero
  fullscreen={true}
  backgroundImage="/mountain.jpg"
  backgroundOverlayOpacity={0.5}
  contentColor="#ffffff"
  topNavigationTheme="dark"
  contentVerticalAlign="bottom"
  showDivider="top"
>
  <h1>Adventure Awaits</h1>
  <p>Explore the world with us</p>
</Hero>
```

---

#### Video Background / 视频背景

```astro
<Hero
  fullscreen={true}
  backgroundVideo="/hero-video.mp4"
  backgroundOverlayOpacity={0.4}
  contentColor="#ffffff"
  topNavigationTheme="dark"
>
  <h1>Watch Us in Action</h1>
  <p>See what makes us different</p>
</Hero>
```

---

#### Fixed Parallax Background / 固定视差背景

```astro
<Hero
  fullscreen={true}
  backgroundImage="/city.jpg"
  backgroundFixed={true}
  backgroundOverlayOpacity={0.6}
  contentColor="#ffffff"
  topNavigationTheme="dark"
  showDivider="both"
>
  <h1>Urban Living</h1>
  <p>Scroll to see the parallax effect</p>
</Hero>
```

---

#### Corporate Landing Page / 企业落地页

```astro
<Hero
  fullscreen={false}
  backgroundColor="#0f172a"
  contentColor="#ffffff"
  topNavigationTheme="dark"
  showDivider="bottom"
  class="py-32"
>
  <h1>Transform Your Business</h1>
  <p>Innovative solutions for modern enterprises</p>
</Hero>
```

---

#### Full-Width Hero / 全宽度 Hero

```astro
<Hero
  fullscreen={false}
  backgroundColor="#f1f5f9"
  useContainer={false}
>
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-24">
    <h1>Full-Width Banner</h1>
    <p>Content stretches edge to edge</p>
  </div>
</Hero>
```

---

### Pro Tips

1. **Start with content first** - Design your hero around your message, not vice versa
2. **Use video sparingly** - Videos are engaging but can impact load times
3. **Test contrast ratios** - Ensure text is readable on any background
4. **Consider mobile first** - Fullscreen can be overwhelming on small screens
5. **Leverage overlays** - Use subtle overlays to improve text readability
6. **Match navigation theme** - Keep the header visible against your hero background

1. **先考虑内容** - 围绕你的信息设计 hero，而不是反过来
2. **谨慎使用视频** - 视频很有吸引力，但可能影响加载速度
3. **测试对比度** - 确保文字在任何背景上都清晰可读
4. **优先考虑移动端** - 全屏在小屏幕上可能会显得过于冗长
5. **利用遮罩** - 使用微妙的遮罩来提高文字可读性
6. **匹配导航主题** - 确保顶栏在 hero 背景上清晰可见

---

### Accessibility First

The Hero component was built with accessibility as a core priority:

Hero 组件从设计之初就将可访问性作为核心优先事项：

- **Semantic HTML** - Uses proper `<section>` element with ARIA attributes
- **语义化 HTML** - 使用正确的 `<section>` 元素和 ARIA 属性

- **Keyboard navigable** - All interactive elements are accessible via keyboard
- **键盘可访问** - 所有交互元素都可通过键盘访问

- **Contrast ratios** - Works with your color choices to maintain WCAG compliance
- **对比度** - 与你的颜色选择配合，保持 WCAG 合规

- **Video accessibility** - Background videos are muted by default and don't autoplay audio
- **视频可访问性** - 背景视频默认静音，不自动播放音频

- **Respects motion preferences** - Honors `prefers-reduced-motion` settings
- **尊重动效偏好** - 遵循 `prefers-reduced-motion` 设置

- **Focus management** - Proper focus indicators for keyboard navigation
- **焦点管理** - 为键盘导航提供适当的焦点指示器

---

### Conclusion

The Hero component provides everything you need to create stunning, accessible page headers. With its flexible parameters and thoughtful defaults, you can create everything from minimal text sections to immersive multimedia experiences. Whether you're building a landing page, blog header, or portfolio introduction, the Hero component helps you make that crucial first impression count.

Hero 组件提供了你创建令人惊叹、可访问的页面标题所需的一切。凭借其灵活的参数和周到的默认值，你可以创建从简洁的文字区块到沉浸式多媒体体验的各种效果。无论你是在搭建落地页、博客标题还是作品集介绍，Hero 组件都能帮助你让那个至关重要的第一印象深入人心。

Happy hero building!

开始构建你的 hero 吧！🚀
