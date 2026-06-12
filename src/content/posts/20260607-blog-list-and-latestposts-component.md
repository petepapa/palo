---
title: Blog List and LatestPosts Component
description: Explore blog list pages in Palo - learn about pagination configuration, sorting options, and how to use the LatestPosts component to showcase recent blog posts with customizable layouts and styling options
publishDate: 2026-06-07
author:
  name: "Pete"
  image: "/branding/avatar.png"
  bio: "PetePa.com"
tags: ['Components', 'Documentation', 'Blog', 'Posts']
coverImage: /posts/docs/postslist.png
coverImagePosition: head
breadcrumbs: true
customBreadcrumbLabels:
  "blog": "Blog"
  "current": ""
joinLastBreadcrumb: false
source: "https://github.com/petepapa/palo"
liveDemo: "https://palo.petepa.com/"
divider: true
toc: true
views: 2100
---

### Introduction

The blog section provides a structured way to display and navigate through your articles. With support for pagination, multiple sorting options, and reusable components, you can create an engaging reading experience for your visitors.

Blog 部分提供了一种有组织的方式来展示和浏览你的文章。通过支持分页、多种排序选项和可重用组件，你可以为访问者创造引人入胜的阅读体验。

This guide covers:
- Blog list page structure and functionality
- Pagination system
- Sorting options (latest, popular, earliest)
- LatestPosts component and its parameters

本指南涵盖：
- Blog 列表页面结构和功能
- 分页系统
- 排序选项（最新、热门、最早）
- LatestPosts 组件及其参数

---

### Blog List Page Structure

The blog list page at `/blog` serves as the main hub for your articles. It uses a paginated layout to manage large collections of posts.

位于 `/blog` 的 Blog 列表页面作为文章的主要中心。它使用分页布局来管理大量的文章集合。

**URL Structure**:
- Main page: `/blog`
- Paginated pages: `/blog/2`, `/blog/3`, etc.

**Key Features**:
- Automatic pagination based on content
- Breadcrumb navigation
- Post preview cards with metadata
- Consistent styling with site theme

**主要特性**：
- 基于内容的自动分页
- 面包屑导航
- 带元数据的文章预览卡片
- 与网站主题一致的样式

**File Location**: `src/pages/blog/[...page].astro`

---

### Pagination System

The pagination system automatically splits your posts across multiple pages based on the `pageSize` configuration.

分页系统根据 `pageSize` 配置自动将你的文章分散到多个页面。

**Configuration**:

```typescript
// Located in: src/pages/blog/[...page].astro

// ========== PAGINATION CONFIGURATION / 分页配置 ==========
// Modify pageSize to change items per page
// 修改 pageSize 来改变每页显示的文章数量
// Current: 6 items per page / 当前: 每页6篇文章
return paginate(sortedPosts, { pageSize: 6 })
```

**Default Settings**:
- 6 posts per page
- Centered pagination controls
- Shows current page and total pages

**Customization Options**:

1. **Change Page Size**:
```typescript
return paginate(sortedPosts, { pageSize: 10 })  // 10 posts per page
```

2. **Layout Adjustments**:
```typescript
// Available in the component:
const projectListWidth = 'container'  // or 'full'
const projectListGapClass = 'gap-8'  // Tailwind spacing
```

---

### Sorting System

The blog list supports three sorting options, allowing visitors to browse posts by different criteria.

Blog 列表支持三种排序选项，允许访问者按不同标准浏览文章。

#### `sortBy` Parameter

The sorting option is configured in the frontmatter of the page:

```yaml
# src/pages/blog/[...page].astro

# ========== SORTING CONFIGURATION / 排序配置 ==========
# Options: latest | popular | earliest
# 选项: latest | popular | earliest
sortBy: latest  # Default / 默认值
```

#### Sorting Options Explained

##### Latest First (Default)

Sorts posts by publish date in descending order (newest to oldest).

按发布日期降序排序（最新到最早）。

```typescript
const sortedPosts = [...posts].sort((a, b) => 
  b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
)
```

##### Most Popular (By Views)

Sorts posts by view count in descending order. Requires `views` field in post frontmatter.

按浏览量降序排序。需要文章 frontmatter 中有 `views` 字段。

```typescript
const sortedPosts = [...posts].sort((a, b) => 
  (b.data.views || 0) - (a.data.views || 0)
)
```

**Example Post Frontmatter**:
```yaml
---
title: My Article
publishDate: 2026-06-07
views: 1234
---
```

##### Earliest First

Sorts posts by publish date in ascending order (oldest to newest).

按发布日期升序排序（最早到最新）。

```typescript
const sortedPosts = [...posts].sort((a, b) => 
  a.data.publishDate.valueOf() - b.data.publishDate.valueOf()
)
```

---

### LatestPosts Component

The LatestPosts component is a reusable component designed for displaying recent posts on homepage, sidebar, or other pages. It supports all sorting options and customizable display settings.

LatestPosts 组件是一个可重用组件，专为在首页、侧边栏或其他页面上显示最新文章而设计。它支持所有排序选项和可自定义的显示设置。

**Component Location**: `src/components/LatestPosts.astro`

**Basic Usage**:

```astro
<LatestPosts limit={3} />
```

**All Parameters**:

#### `limit`
- **Type**: `number`
- **Default**: `3`
- **Function**: Number of posts to display

显示的文章数量。

```astro
<LatestPosts limit={6} />
```

#### `sortBy`
- **Type**: `'latest' | 'popular' | 'earliest'`
- **Default**: `'latest'`
- **Function**: Sort order for posts

文章的排序方式。

```astro
<!-- Most viewed posts -->
<LatestPosts limit={5} sortBy="popular" />

<!-- Oldest posts first -->
<LatestPosts limit={4} sortBy="earliest" />
```

#### `showFeaturedImage`
- **Type**: `boolean`
- **Default**: `true`
- **Function**: Whether to display post featured images

是否显示文章封面图。

```astro
<!-- Hide images -->
<LatestPosts limit={5} showFeaturedImage={false} />

<!-- Show images (default) -->
<LatestPosts limit={5} showFeaturedImage={true} />
```

#### `showDescription`
- **Type**: `boolean`
- **Default**: `true`
- **Function**: Whether to display post descriptions

是否显示文章描述。

```astro
<!-- Hide descriptions -->
<LatestPosts limit={5} showDescription={false} />

<!-- Show descriptions (default) -->
<LatestPosts limit={5} showDescription={true} />
```

#### `layout`
- **Type**: `'vertical' | 'horizontal'`
- **Default**: `'vertical'`
- **Function**: Card layout orientation

卡片布局方向。

```astro
<!-- Vertical stack (default) -->
<LatestPosts limit={3} layout="vertical" />

<!-- Horizontal row -->
<LatestPosts limit={3} layout="horizontal" />
```

#### `headingLevel`
- **Type**: `'h2' | 'h3' | 'h4' | 'h5' | 'h6'`
- **Default**: `'h3'`
- **Function**: Heading level for post titles

文章标题的级别。

```astro
<LatestPosts limit={5} headingLevel="h4" />
```

#### `postHeadingLevel`
- **Type**: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'`
- **Default**: `'h3'`
- **Function**: Heading level for PostCard titles (controls the HTML tag wrapping each post's title link)

PostCard 标题的 HTML 标签级别（控制每篇文章标题链接的 HTML 标签）。

```astro
<LatestPosts limit={5} postHeadingLevel="h4" />
```

#### `postDescClass`
- **Type**: `string`
- **Default**: `''`
- **Function**: CSS class for PostCard description text (e.g. `'text-sm'`, `'text-base'`, `'text-lg'`)

PostCard 摘要文字的 CSS Class（例如 `'text-sm'`、`'text-base'`、`'text-lg'`）。

```astro
<LatestPosts limit={5} postDescClass="text-sm" />
```

#### `itemGap`
- **Type**: `string`
- **Default**: `'gap-24'`
- **Function**: Vertical gap between PostCard items (uses Tailwind Gap Class)

PostCard 之间的垂直间距（使用 Tailwind Gap Class）。

```astro
<LatestPosts limit={5} itemGap="gap-16" />
```

#### `cardGap`
- **Type**: `string`
- **Default**: `'gap-12 md:gap-24'`
- **Function**: CSS gap class between image and content columns inside each PostCard (透传给 PostCard 的 `cardGap`)

PostCard 内部图片与文字区块之间的间距。

```astro
<LatestPosts limit={5} cardGap="gap-8 md:gap-16" />
```

#### `showAuthor`
- **Type**: `boolean`
- **Default**: `true`
- **Function**: Whether to display author information

是否显示作者信息。

```astro
<!-- Hide author -->
<LatestPosts limit={5} showAuthor={false} />

<!-- Show author (default) -->
<LatestPosts limit={5} showAuthor={true} />
```

#### `showDate`
- **Type**: `boolean`
- **Default**: `true`
- **Function**: Whether to display publish date

是否显示发布日期。

```astro
<!-- Hide date -->
<LatestPosts limit={5} showDate={false} />

<!-- Show date (default) -->
<LatestPosts limit={5} showDate={true} />
```

#### `showTags`
- **Type**: `boolean`
- **Default**: `false`
- **Function**: Whether to display post tags

是否显示文章标签。

```astro
<!-- Show tags -->
<LatestPosts limit={5} showTags={true} />

<!-- Hide tags (default) -->
<LatestPosts limit={5} showTags={false} />
```

#### `showViews`
- **Type**: `boolean`
- **Default**: `false`
- **Function**: Whether to display view count

是否显示浏览量。

```astro
<!-- Show view counts -->
<LatestPosts limit={5} showViews={true} />

<!-- Hide views (default) -->
<LatestPosts limit={5} showViews={false} />
```

---

### Complete Usage Examples

#### Homepage Latest Posts

```astro
<!-- Recent articles with images and descriptions -->
<LatestPosts 
  limit={3}
  sortBy="latest"
  showFeaturedImage={true}
  showDescription={true}
  showAuthor={true}
  showDate={true}
  headingLevel="h3"
/>
```

#### Popular Posts Section

```astro
<!-- Most viewed posts sidebar widget -->
<LatestPosts 
  limit={5}
  sortBy="popular"
  showFeaturedImage={false}
  showDescription={false}
  showViews={true}
  headingLevel="h4"
/>
```

#### Minimal List

```astro
<!-- Compact list with just titles -->
<LatestPosts 
  limit={10}
  sortBy="latest"
  showFeaturedImage={false}
  showDescription={false}
  showAuthor={false}
  showDate={true}
  headingLevel="h5"
/>
```

#### Full Featured List

```astro
<!-- Complete information display -->
<LatestPosts 
  limit={6}
  sortBy="latest"
  showFeaturedImage={true}
  showDescription={true}
  showAuthor={true}
  showDate={true}
  showTags={true}
  showViews={true}
  headingLevel="h3"
/>
```

---

### Adding View Counts to Posts

To enable the popular sorting option and view count display, add the `views` field to your post frontmatter:

要为文章启用热门排序和浏览量显示功能，请在文章 frontmatter 中添加 `views` 字段：

```yaml
---
title: Building Accessible Web Experiences
description: A comprehensive guide to web accessibility
publishDate: 2026-06-07
author:
  name: "Pete"
  image: "/branding/avatar.png"
tags: ['Accessibility', 'Web Development', 'CSS']
coverImage: /posts/docs/cover01.jpg
views: 1850
---

Your content here...
```

**Recommended View Counts**:
- New posts: 100-300 views
- Established posts: 500-1000 views
- Popular posts: 1500-3000 views
- Viral posts: 5000+ views

---

### Post Card Features

Each post displayed in the list or LatestPosts component shows:

列表或 LatestPosts 组件中显示的每篇文章都包含：

- **Featured Image**: Cover image from frontmatter
- **Title**: H3 heading with link to full post
- **Description**: Truncated excerpt from content
- **Author**: Author name and avatar (if available)
- **Publish Date**: Formatted date string
- **Tags**: Category tags (optional)
- **Views**: View count (optional)

---

### Responsive Design

The blog list and LatestPosts component are fully responsive:

Blog 列表和 LatestPosts 组件完全响应式：

**Desktop**:
- Multi-column grid layout
- Full pagination controls
- All metadata visible

**Tablet**:
- 2-column grid
- Condensed pagination
- Essential metadata

**Mobile**:
- Single column
- Simplified pagination
- Core information only

---

### Best Practices

1. **Consistent Sorting**: Choose one default sort order for your blog and stick with it for consistency.

2. **View Count Accuracy**: Update view counts periodically to reflect actual engagement.

3. **Image Optimization**: Use optimized images with appropriate aspect ratios for featured images.

4. **Description Length**: Keep descriptions concise but informative (recommended: 100-150 characters).

5. **Tag Usage**: Use consistent, meaningful tags to help users discover related content.

6. **Component Placement**: Use LatestPosts strategically on homepage and landing pages to highlight important content.

7. **Performance**: Limit the `limit` parameter to reasonable numbers (5-10 posts) to maintain fast page loads.

---

### Troubleshooting

**Common Issues**:

1. **Posts not showing**:
   - Check post frontmatter for required fields
   - Ensure posts are in correct directory (`src/content/posts/`)
   - Verify publish dates are in correct format

2. **Pagination not working**:
   - Clear caches: `rm -rf node_modules/.astro node_modules/.vite dist`
   - Restart dev server: `npm run dev`

3. **Sorting not applied**:
   - Verify `sortBy` parameter is spelled correctly
   - Ensure `views` field exists for popular sorting

4. **Images not displaying**:
   - Check image paths in frontmatter
   - Ensure images exist in `public/` directory
   - Verify path format is correct (e.g., `/posts/image.jpg`)

---

### Conclusion

The blog list system provides a flexible, feature-rich solution for presenting your articles. With pagination, sorting options, and the versatile LatestPosts component, you have complete control over how your content is displayed and discovered.

Blog 列表系统为展示你的文章提供了一个灵活、功能丰富的解决方案。通过分页、排序选项和通用的 LatestPosts 组件，你可以完全控制内容的展示和发现方式。

Whether you're displaying recent posts on your homepage, creating a filtered archive, or building a comprehensive blog index, these tools work together to create an engaging reading experience for your visitors.

无论你是在首页展示最新文章、创建过滤归档，还是构建全面的博客索引，这些工具都能协同工作，为访问者创造引人入胜的阅读体验。
