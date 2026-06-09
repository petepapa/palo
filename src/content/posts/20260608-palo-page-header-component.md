---
title: PaloPageHeader Component
description: Master the PaloPageHeader component for creating elegant page headers - customize titles, subtitles, background colors, and content layouts. Supports the useContainer parameter to control content container behavior
publishDate: 2026-06-08
author:
  name: "Pete"
  image: "/branding/avater.png"
  bio: "PetePa.com"
tags: ['Components', 'Palo Theme', 'Page Headers', 'Web Design']
coverImage: /posts/docs/cover03.jpg
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
views: 1900
---

### Introduction

The PaloPageHeader component is a specialized header for content pages, providing a clean way to display titles and subtitles with beautiful backgrounds and layouts. It includes built-in support for background media, customizable padding, and full accessibility.

PaloPageHeader 组件是内容页面的专用标题组件，提供了一种简洁的方式来展示标题和副标题，并具有精美的背景和布局。它内置支持背景媒体、可自定义的内边距和完整的无障碍功能。

---

### What is PaloPageHeader?

PaloPageHeader is a section component designed for page titles, especially for blogs, documentation, and content-rich pages. It extends the same background capabilities as Hero and CreativeSection but with an opinionated layout for title/subtitle pairs.

PaloPageHeader 是专门为页面标题设计的区块组件，特别适用于博客、文档和内容丰富的页面。它扩展了与 Hero 和 CreativeSection 相同的背景功能，但为标题/副标题对提供了更有见解的布局。

---

### Core Features

#### Basic Title and Subtitle

The most simple usage is just a title and optional subtitle.

最简单的用法就是标题和可选副标题。

```astro
<PaloPageHeader
  title="About Us"
  subtitle="Learn about our mission and team"
/>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `title` | string | required | Main page title | 主页面标题 |
| `subtitle` | string | `''` | Subtitle or description text | 副标题或描述文本 |

The subtitle supports basic HTML tags like `strong`, `em`, `a`, and `span`.

副标题支持基本 HTML 标签，如 `strong`、`em`、`a` 和 `span`。

```astro
<PaloPageHeader
  title="Our Services"
  subtitle="Check out our <strong>amazing features</strong> and <a href=\"#\">contact us</a> to learn more"
/>
```

---

#### Display Mode

Control whether the header takes up the full viewport or a standard section height.

控制标题是占据整个视口还是标准区块高度。

```astro
<PaloPageHeader
  title="Welcome"
  subtitle="We're glad you're here"
  fullscreen={true}
/>

<PaloPageHeader
  title="Blog"
  subtitle="Latest news and updates"
  fullscreen={false}
/>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `fullscreen` | boolean | `false` | Full viewport height vs standard section height | 是否全屏高度，`true` 为全屏，`false` 为标准高度 |

---

#### Background Media

Add images, videos, or solid colors as backgrounds.

添加图片、视频或纯色作为背景。

```astro
<!-- Image Background -->
<PaloPageHeader
  title="Nature"
  subtitle="Exploring the great outdoors"
  backgroundImage="/nature.jpg"
  backgroundOverlayOpacity={0.4}
  contentColor="#ffffff"
/>

<!-- Video Background -->
<PaloPageHeader
  title="Innovation"
  subtitle="Forward-thinking solutions"
  backgroundVideo="/innovation.mp4"
  backgroundOverlayOpacity={0.5}
  contentColor="#ffffff"
/>

<!-- Solid Color Background -->
<PaloPageHeader
  title="Design"
  subtitle="Creating beautiful experiences"
  backgroundColor="#3b82f6"
  contentColor="#ffffff"
/>

<!-- Fixed Parallax Background -->
<PaloPageHeader
  title="City Life"
  subtitle="Urban adventures await"
  backgroundImage="/city.jpg"
  backgroundFixed={true}
  backgroundOverlayOpacity={0.6}
  contentColor="#ffffff"
/>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `backgroundImage` | string | `''` | Background image path | 背景图片路径 |
| `backgroundVideo` | string | `''` | Background video path (MP4) | 背景视频路径（MP4 格式） |
| `backgroundColor` | string | `''` | Solid background color | 纯色背景色 |
| `backgroundFixed` | boolean | `false` | Fixed background (parallax) | 背景是否固定（视差效果） |
| `backgroundOverlayOpacity` | number | `0` | Overlay opacity (0-1) | 遮罩透明度（0-1） |
| `contentColor` | string | `''` | Text content color | 文字内容颜色 |

---

#### Navigation Theme Integration

Automatically adapt navigation based on your background.

根据背景自动适配导航。

```astro
<PaloPageHeader
  title="Dark Theme"
  subtitle="Dark background with light navigation"
  backgroundImage="/dark-bg.jpg"
  topNavigationTheme="dark"
/>

<PaloPageHeader
  title="Light Theme"
  subtitle="Light background with dark navigation"
  backgroundImage="/light-bg.jpg"
  topNavigationTheme="light"
/>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `topNavigationTheme` | string | `''` | Navigation theme: `'light'` or `'dark'` | 导航主题：`'light'`（浅色）或 `'dark'`（深色） |

---

#### Content Alignment

Control how content is aligned vertically and horizontally.

控制内容的垂直和水平对齐方式。

```astro
<!-- Vertical Alignment -->
<PaloPageHeader
  title="Top Aligned"
  subtitle="Content at the top"
  fullscreen={true}
  contentVerticalAlign="top"
/>

<PaloPageHeader
  title="Center Aligned"
  subtitle="Content in the middle"
  fullscreen={true}
  contentVerticalAlign="center"
/>

<PaloPageHeader
  title="Bottom Aligned"
  subtitle="Content at the bottom"
  fullscreen={true}
  contentVerticalAlign="bottom"
/>

<!-- Horizontal Alignment & Text Alignment -->
<PaloPageHeader
  title="Left Aligned"
  subtitle="Default alignment"
  contentHorizontalAlign="left"
/>

<PaloPageHeader
  title="Center Aligned"
  subtitle="Perfectly centered"
  contentHorizontalAlign="center"
  textAlign="center"
/>

<PaloPageHeader
  title="Right Aligned"
  subtitle="On the right side"
  contentHorizontalAlign="right"
  textAlign="right"
/>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `contentVerticalAlign` | string | `'center'` | Vertical alignment: `'top'`, `'center'`, `'bottom'` | 垂直对齐：`'top'`、`'center'`、`'bottom'` |
| `contentHorizontalAlign` | string | `'left'` | Horizontal alignment: `'left'`, `'center'`, `'right'` | 水平对齐：`'left'`、`'center'`、`'right'` |
| `textAlign` | string | `''` | Text alignment: `'left'`, `'center'`, `'right'` | 文本对齐：`'left'`、`'center'`、`'right'` |

---

#### Divider Lines

Add elegant divider lines above or below the header.

在标题上方或下方添加优雅的分隔线。

```astro
<PaloPageHeader
  title="Blog Post"
  subtitle="With bottom divider"
  showDivider="bottom"
/>

<PaloPageHeader
  title="Product Page"
  subtitle="With both dividers"
  showDivider="both"
/>

<PaloPageHeader
  title="Landing Page"
  subtitle="With top divider"
  showDivider="top"
/>

<PaloPageHeader
  title="Simple Page"
  subtitle="No dividers"
  showDivider={false}
/>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `showDivider` | multiple | `true` | Divider placement | 分隔线位置 |

---

#### Padding Control

Adjust vertical padding using space tokens or custom CSS values.

使用 space token 或自定义 CSS 值调整垂直内边距。

```astro
<!-- Using Space Tokens -->
<PaloPageHeader
  title="Small Padding"
  subtitle="Compact header"
  paddingBlock="md"
/>

<PaloPageHeader
  title="Extra Large Padding"
  subtitle="Spacious header"
  paddingBlock="2xl"
/>

<!-- Using Custom CSS Values -->
<PaloPageHeader
  title="Custom Spacing"
  subtitle="Precise control"
  paddingBlock="6rem"
/>

<!-- Using Clamp for Responsive Padding -->
<PaloPageHeader
  title="Responsive Padding"
  subtitle="Adapts to screen size"
  paddingBlock="clamp(2rem, 5vw, 6rem)"
/>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `paddingBlock` | string | `''` | Vertical padding (space token or CSS value) | 垂直内边距（space token 或 CSS 值） |

Available space tokens: `5xs`, `4xs`, `3xs`, `2xs`, `xs`, `s`, `sm`, `m`, `md`, `l`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`.

可用的 space token：`5xs`、`4xs`、`3xs`、`2xs`、`xs`、`s`、`sm`、`m`、`md`、`l`、`lg`、`xl`、`2xl`、`3xl`、`4xl`、`5xl`。

---

#### Content Container

Control whether content is wrapped in a container or spans the full width.

控制内容是否包裹在 container 中，还是占满全宽度。

```astro
<!-- Default: with container -->
<PaloPageHeader
  title="Standard Width"
  subtitle="Content in container"
  useContainer={true}
/>

<!-- Without container: full width -->
<PaloPageHeader
  title="Full Width"
  subtitle="Content stretches to edges"
  useContainer={false}
/>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `useContainer` | boolean | `true` | Wrap content in container | 是否将内容包裹在 container 中 |

---

#### Custom Classes

Add your own CSS classes.

添加你自己的 CSS 类。

```astro
<PaloPageHeader
  title="Custom Styles"
  subtitle="With additional classes"
  class="my-custom-header additional-styling"
/>
```

| Parameter | Type | Default | Description | 说明 |
|-----------|------|---------|-------------|------|
| `class` | string | `''` | Custom CSS classes | 自定义 CSS 类 |

---

### Practical Examples

#### Blog Post Header / 博客文章标题

```astro
<PaloPageHeader
  title="The Future of Web Design"
  subtitle="Exploring trends and innovations for 2025 and beyond"
  backgroundImage="/blog-bg.jpg"
  backgroundOverlayOpacity={0.5}
  contentColor="#ffffff"
  topNavigationTheme="dark"
  paddingBlock="xl"
  showDivider="bottom"
  contentHorizontalAlign="center"
  textAlign="center"
/>
```

#### Documentation Header / 文档标题

```astro
<PaloPageHeader
  title="API Documentation"
  subtitle="Complete reference for developers"
  backgroundColor="#0f172a"
  contentColor="#ffffff"
  topNavigationTheme="dark"
  paddingBlock="lg"
  showDivider="both"
/>
```

#### Portfolio Project Header / 作品集项目标题

```astro
<PaloPageHeader
  title="Project Phoenix"
  subtitle="A revolutionary approach to productivity"
  backgroundImage="/project.jpg"
  backgroundFixed={true}
  backgroundOverlayOpacity={0.6}
  contentColor="#ffffff"
  topNavigationTheme="dark"
  fullscreen={true}
  contentVerticalAlign="bottom"
  showDivider="top"
/>
```

#### Product Page Header / 产品页面标题

```astro
<PaloPageHeader
  title="Palo Theme"
  subtitle="Beautiful, accessible, and performant"
  backgroundColor="#3b82f6"
  contentColor="#ffffff"
  topNavigationTheme="dark"
  useContainer={false}
  paddingBlock="2xl"
>
  <div class="mt-8">
    <a href="#get-started" class="btn btn-primary">Get Started</a>
    <a href="#docs" class="btn btn-secondary ml-4">Documentation</a>
  </div>
</PaloPageHeader>
```

---

### Pro Tips

1. **Keep titles concise** - Short, impactful titles work best
2. **Use subtitles effectively** - They provide additional context without cluttering
3. **Choose appropriate padding** - Match the header height to your content importance
4. **Center-align for impact** - Centered titles often feel more dramatic
5. **Test contrast ratios** - Always ensure text is readable against backgrounds
6. **Reserve fullscreen for key pages** - Use `fullscreen` strategically to emphasize important content

1. **保持标题简洁** - 简短、有冲击力的标题效果最好
2. **有效使用副标题** - 它们提供额外的上下文而不会造成混乱
3. **选择适当的内边距** - 标题高度要与内容的重要性相匹配
4. **居中对齐以增强效果** - 居中的标题往往感觉更具戏剧性
5. **测试对比度** - 始终确保文字在背景上清晰可读
6. **为关键页面保留全屏模式** - 有策略地使用 `fullscreen` 来强调重要内容

---

### Accessibility First

PaloPageHeader is built with accessibility as a core priority:

PaloPageHeader 从设计之初就将可访问性作为核心优先事项：

- **Semantic HTML** - Uses proper heading hierarchy with H1 for title
- **语义化 HTML** - 使用正确的标题层次结构，H1 作为标题
- **Keyboard navigable** - All elements are accessible via keyboard
- **键盘可访问** - 所有元素都可通过键盘访问
- **Contrast ratios** - Works with your color choices to maintain WCAG compliance
- **对比度** - 与你的颜色选择配合，保持 WCAG 合规
- **Video accessibility** - Background videos are muted by default
- **视频可访问性** - 背景视频默认静音
- **Respects motion preferences** - Honors `prefers-reduced-motion` settings
- **尊重动效偏好** - 遵循 `prefers-reduced-motion` 设置
- **Focus management** - Proper focus indicators for keyboard navigation
- **焦点管理** - 为键盘导航提供适当的焦点指示器

---

### Conclusion

The PaloPageHeader component provides a robust solution for creating page headers that are beautiful, accessible, and flexible. Whether you're building a blog, documentation site, portfolio, or e-commerce store, PaloPageHeader gives you the tools to create stunning headers that set the tone for your entire page.

PaloPageHeader 组件提供了一个强大的解决方案，用于创建美观、可访问且灵活的页面标题。无论你是在搭建博客、文档站点、作品集还是电商商店，PaloPageHeader 都能为你提供工具，创建出为整个页面定调的精美标题。

Happy header building!

开始构建你的标题吧！🚀
