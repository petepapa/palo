---
title: PostHeader Component
description: Learn all about the PostHeader component - covering parameters for titles, subtitles, author information, publish dates, reading time, and customizable breadcrumb labels. Perfect for creating consistent post page headers
publishDate: 2026-06-03
author:
  name: "Pete"
  image: "/branding/avater.png"
  bio: "PetePa.com"
tags: ['Components', 'Documentation', 'PostHeader']
coverImage: /posts/docs/cover01.jpg
coverImagePosition: top
showBreadcrumbs: true
customBreadcrumbLabels:
  "blog": "博客"
  "current": ""
joinLastBreadcrumb: false
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
showDivider: true
showTableOfContents: true
views: 1600

---

### Introduction

The PostHeader component is a versatile and powerful header for blog posts and project pages. It provides a consistent way to display titles, authors, cover images, and navigation breadcrumbs in an accessible and visually appealing manner.

This component is designed with accessibility in mind, following WCAG 2.2 guidelines while providing rich customization options.

PostHeader 组件是博客文章和项目页面的多功能强大头部组件。它提供了一种一致的方式来显示标题、作者信息、封面图和导航面包屑，既美观又符合无障碍要求。

该组件遵循 WCAG 2.2 无障碍指南设计，同时提供丰富的自定义选项。

---

### What is PostHeader Component?

The PostHeader component is more than just a simple header - combined with the article page layout, it's a complete reading experience solution that handles:
- Displaying cover images in various positions
- Breadcrumb navigation with customization
- Author information with avatars
- Source and live demo links
- Content dividers
- Responsive design
- Auto-generated table of contents navigation

PostHeader 组件不仅仅是一个简单的头部 - 结合文章页面布局，它是一个完整的阅读体验解决方案，可以处理：
- 在不同位置显示封面图
- 可自定义的面包屑导航
- 带头像的作者信息
- 源代码和在线演示链接
- 内容分隔线
- 响应式设计
- 自动生成的目录导航

---
### Core Parameters

#### Content Navigation Parameters

##### `showTableOfContents`
- **Type**: `boolean`
- **Required**: `false`
- **Default**: `true`
- **Function**: Whether to display the table of contents sidebar

This feature automatically extracts all H2, H3, and H4 headings from your content and creates a sticky navigation sidebar on the right (desktop) or at the top (mobile). Users can click on the links to jump directly to the corresponding sections, and the current section will be highlighted as they scroll.

是否显示侧边的目录导航。

此功能会自动从内容中提取所有 H2、H3 和 H4 标题，并在右侧（桌面端）或顶部（移动端）创建一个粘性导航侧边栏。用户可以点击链接直接跳转到对应的章节，滚动时当前章节会高亮显示。

**Example**:
```yaml
showTableOfContents: true
```

---

#### Basic Parameters

##### `title`
- **Type**: `string`
- **Required**: `true`
- **Default**: `none`
- **Function**: The main title of the post or project, displayed as a heading level 2

This is the primary identifier for your content. It should be clear, concise, and descriptive.

这是内容的主要标识。标题应该清晰、简洁、具有描述性。

**Example**:
```yaml
title: Mastering PostHeader Component
```

##### `subtitle`
- **Type**: `string`
- **Required**: `false`
- **Default**: `''`
- **Function**: Subtitle or description that supports limited HTML tags

Supported HTML tags: `<b>`, `<i>`, `<em>`, `<strong>`, `<a>`, `<span>`, `<br>`

支持的 HTML 标签：`<b>`, `<i>`, `<em>`, `<strong>`, `<a>`, `<span>`, `<br>`

**Example**:
```yaml
subtitle: A comprehensive guide to <b>all parameters</b> and customization options
```

##### `class`
- **Type**: `string`
- **Required**: `false`
- **Default**: `''`
- **Function**: Additional custom CSS classes

额外的自定义 CSS 类名

---

#### Cover Image Parameters

##### `coverImage`
- **Type**: `string`
- **Required**: `false`
- **Default**: `undefined`
- **Function**: Path to the cover image file

Images should be placed in the `public/` directory.

图片应该放在 `public/` 目录中。

**Example**:
```yaml
coverImage: /posts/docs/cover01.jpg
```

##### `coverImagePosition`
- **Type**: `boolean | 'top' | 'head' | 'bottom'`
- **Required**: `false`
- **Default**: `'head'`
- **Function**: Position of the cover image

Options:
- `'top'` - Display at the very top of the page
- `'head'` - Display after breadcrumbs and before content (default)
- `'bottom'` - Display at the bottom of the header
- `false` - Hide the cover image

选项：
- `'top'` - 显示在页面最顶部
- `'head'` - 显示在面包屑之后、内容之前（默认）
- `'bottom'` - 显示在头部的底部
- `false` - 隐藏封面图片

---

#### Author Parameters

##### `author`
- **Type**: `object`
- **Required**: `false`
- **Default**: `undefined`
- **Function**: Author information object

The author object supports three properties:
- `name`: The author's name (required)
- `image`: Path to the author's avatar image
- `bio`: A short bio or tagline

作者对象支持三个属性：
- `name`: 作者姓名（必填）
- `image`: 作者头像图片的路径
- `bio`: 简短的简介或标语

**Example**:
```yaml
author:
  name: "Pete"
  image: "/avater.svg"
  bio: "PetePa.com"
```

---

#### Breadcrumb Parameters

##### `showBreadcrumbs`
- **Type**: `boolean`
- **Required**: `false`
- **Default**: `true`
- **Function**: Whether to display breadcrumb navigation

是否显示面包屑导航

##### `customBreadcrumbLabels`
- **Type**: `object`
- **Required**: `false`
- **Default**: `undefined`
- **Function**: Custom labels for breadcrumb segments

自定义面包屑段的标签

**Example**:
```yaml
customBreadcrumbLabels:
  "blog": "博客"
  "current": ""
```

##### `joinLastBreadcrumb`
- **Type**: `boolean`
- **Required**: `false`
- **Default**: `false`
- **Function**: Whether to join the last two breadcrumb items

是否把最后两个面包屑项合并

---

#### Action Link Parameters

##### `source`
- **Type**: `string`
- **Required**: `false`
- **Default**: `''`
- **Function**: Link to the source code repository

源代码仓库的链接

##### `liveDemo`
- **Type**: `string`
- **Required**: `false`
- **Default**: `''`
- **Function**: Link to a live demo of the project

项目在线演示的链接

**Example**:
```yaml
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
```

---

#### Divider Parameters

##### `showDivider`
- **Type**: `boolean | 'top' | 'bottom' | 'both'`
- **Required**: `false`
- **Default**: `true`
- **Function**: Position of the divider

Options:
- `'top'` - Display at the top
- `'bottom'` - Display at the bottom (default when using `true`)
- `'both'` - Display at both top and bottom
- `false` - Hide all dividers

选项：
- `'top'` - 在顶部显示
- `'bottom'` - 在底部显示（使用 `true` 时的默认值）
- `'both'` - 在顶部和底部都显示
- `false` - 隐藏所有分隔线

---

### Practical Examples

#### Example 1: Minimal Setup
A simple header with just a title and cover image.

只有标题和封面图的简单头部。

```yaml
---
title: My Blog Post
coverImage: /posts/post-image-1.jpg
coverImagePosition: head
showBreadcrumbs: true
showDivider: true
---
```

#### Example 2: Full Feature
A complete header with all features enabled.

启用所有功能的完整头部。

```yaml
---
title: Mastering PostHeader Component
description: A comprehensive guide to all parameters
coverImage: /posts/docs/cover01.jpg
coverImagePosition: head
author:
  name: "Pete"
  image: "/avater.svg"
  bio: "PetePa.com"
showBreadcrumbs: true
customBreadcrumbLabels:
  "blog": "博客"
  "current": ""
joinLastBreadcrumb: false
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
showDivider: true
showTableOfContents: true
---
```

---

### Pro Tips

1. **Cover Image Size**: Use images with a 16:9 aspect ratio for best results
2. **Position Matters**: Use `'head'` position for most blog posts, `'top'` for dramatic layouts
3. **Author Bio**: Keep author bios short and engaging
4. **Breadcrumb Customization**: Use custom labels for internationalization
5. **Divider Usage**: Use `'both'` for long articles to create clear sections

1. **封面图片尺寸**：使用 16:9 宽高比的图片效果最好
2. **位置很重要**：大多数博客文章使用 `'head'` 位置，戏剧化布局使用 `'top'`
3. **作者简介**：保持作者简介简短而吸引人
4. **面包屑自定义**：使用自定义标签进行国际化
5. **分隔线使用**：对于长文章使用 `'both'` 来创建清晰的部分

---

### Accessibility First

The PostHeader component is built with accessibility at its core:

- **Semantic HTML**: Proper heading hierarchy and sectioning
- **Keyboard Navigation**: All links and buttons are keyboard accessible
- **Screen Reader Support**: Proper ARIA attributes and labels
- **Focus Indicators**: Clear visual feedback for keyboard users
- **Color Contrast**: Follows WCAG 2.2 AA standards

PostHeader 组件以无障碍为核心构建：

- **语义化 HTML**：正确的标题层次和分区
- **键盘导航**：所有链接和按钮都可以通过键盘访问
- **屏幕阅读器支持**：正确的 ARIA 属性和标签
- **焦点指示器**：为键盘用户提供清晰的视觉反馈
- **颜色对比度**：遵循 WCAG 2.2 AA 标准

---

### Conclusion

The PostHeader component provides a flexible, accessible, and beautiful header solution for your blog posts and project pages. By understanding and utilizing its parameters effectively, you can create compelling headers that enhance user experience while maintaining accessibility standards.

PostHeader 组件为你的博客文章和项目页面提供了一个灵活、无障碍且美观的头部解决方案。通过有效地理解和使用其参数，你可以创建引人注目的头部，在保持无障碍标准的同时提升用户体验。
