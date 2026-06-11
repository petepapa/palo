---
title: Projects List and FeaturedProjects Component
description: Discover project portfolio pages in Palo - master tag filtering, type filtering, and learn how to use the FeaturedProjects component to display your work with beautiful card layouts and hover effects
publishDate: 2026-06-07
author:
  name: "Pete"
  image: "/branding/avatar.png"
  bio: "PetePa.com"
tags: ['Components', 'Documentation', 'Portfolio', 'Projects']
coverImage: /posts/docs/projectslist.png
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
views: 1850
---

### Introduction

The portfolio section of your website showcases your projects in an organized, filterable manner. Whether you want to display all projects, filter by specific tags, or browse by project type, this system provides flexible options for presenting your work.

Portfolio 部分以有组织、可过滤的方式展示你的项目。无论你想显示所有项目、按特定标签过滤，还是按项目类型浏览，这个系统都提供了灵活的选项来呈现你的作品。

This guide covers four key components:
- Portfolio list page (`/portfolio`)
- Tag filtering system (`/portfolio/tag/[tag]`)
- Type filtering system (`/portfolio/type/[type]`)
- FeaturedProjects component

本指南涵盖四个关键组件：
- Portfolio 列表页面 (`/portfolio`)
- 标签过滤系统 (`/portfolio/tag/[tag]`)
- 类型过滤系统 (`/portfolio/type/[type]`)
- FeaturedProjects 组件

---

### Portfolio List Page

The main portfolio list page at `/portfolio` displays all projects in a paginated, masonry-style grid layout.

位于 `/portfolio` 的主要 Portfolio 列表页面以分页的瀑布流网格布局显示所有项目。

**Key Features**:
- Masonry grid layout for visual variety
- Pagination for managing large project collections
- Tag cloud for quick navigation
- Consistent styling with other site pages

**主要特性**：
- 瀑布流网格布局，视觉效果丰富
- 分页功能，管理大量项目集合
- 标签云，快速导航
- 与网站其他页面一致的样式

**Configuration**:
```typescript
// Located in: src/pages/portfolio/[...page].astro

// Editing guide / 编辑引导
// 1. Edit pageTitle/pageDescription/pageHeading/pageSubtitle for page copy and SEO.
//    修改 pageTitle/pageDescription/pageHeading/pageSubtitle 来调整页面文案和 SEO。
// 2. Edit pageHeaderAppearance to control PaloPageHeader visual behavior.
//    修改 pageHeaderAppearance 来控制 PaloPageHeader 的视觉表现。
// 3. Edit projectListWidth, projectListGapClass, and ProjectCard props near the card list to adjust list width, gap, card layout, or heading level.
//    修改 projectListWidth、projectListGapClass 和卡片列表附近的 ProjectCard 参数，以调整列表宽度、间隙、卡片布局或标题层级。
// 4. Edit pageSize in getStaticPaths to change the number of projects per page (currently 10).
//    修改 getStaticPaths 中的 pageSize 来调整每页显示的项目数量（当前为 10）。
```

**Customization Options**:

1. **Page Metadata**:
```yaml
pageTitle: 'Portfolio'
pageDescription: 'A complete visual index of portfolio projects...'
pageHeading: 'All Projects'
pageSubtitle: 'A visual summary of every project...'
```

2. **List Layout**:
```typescript
projectListWidth: 'full'  // Options: 'container' | 'full'
projectListGapClass: 'gap-5'  // Controls spacing between cards
```

3. **Pagination**:
- Default: 10 projects per page
- Configurable in `getStaticPaths` function
- Centered at bottom of page

---

### Tag Filtering System

Tags provide a flexible way to categorize and filter projects. Each project can have multiple tags, and users can browse projects by clicking on tag links.

标签提供了一种灵活的方式来分类和过滤项目。每个项目可以有多个标签，用户可以通过点击标签链接来浏览项目。

**Tag Page URL**: `/portfolio/tag/[tag-slug]`

**How Tags Work**:

1. **Project Frontmatter**:
```yaml
---
title: My Project
tags: ['Web Design', 'Accessibility', 'UI/UX']
---
```

2. **Tag Generation**: All tags are automatically extracted from projects and displayed as a tag cloud.

3. **Tag Slugs**: Tags are converted to URL-friendly slugs using the `slugify()` function.

**URL Examples**:
- `/portfolio/tag/accessibility`
- `/portfolio/tag/web-design`
- `/portfolio/tag/ui-ux`

**Tag Page Features**:

- Displays all projects with the selected tag
- Shows total count of projects with that tag
- Allows filtering by other tags from the same cloud
- Maintains consistent pagination and layout

**Configuration**:
```typescript
// Located in: src/pages/portfolio/tag/[tag]/[...page].astro

// Modify pageSize to change items per page for tag pages
const paginatedPages = paginate(filteredProjects, {
  pageSize: 10,
  params: { tag: tag.slug },
  props: {
    currentTag: tag,
    uniqueTags,
  },
})
```

---

### Type Filtering System

Project types provide another dimension for organizing projects. Unlike tags which can be freely assigned, types are predefined categories.

项目类型为组织项目提供了另一个维度。与可以自由分配的标签不同，类型是预定义的类别。

**Type Page URL**: `/portfolio/type/[type-id]`

**Available Types**:

Types are defined in `src/projectTypes.ts`:

```typescript
export const projectTypes = {
  'case-study': {
    label: 'Case Study',
    description: 'Detailed project case studies',
    icon: 'case-study.svg'
  },
  'component': {
    label: 'Component',
    description: 'UI components and libraries',
    icon: 'component.svg'
  },
  'template': {
    label: 'Template',
    description: 'Website templates and themes',
    icon: 'template.svg'
  },
  'tool': {
    label: 'Tool',
    description: 'Developer tools and utilities',
    icon: 'tool.svg'
  }
}

export const projectTypeIds = Object.keys(projectTypes)
```

**Type Page Features**:

- Displays all projects of a specific type
- Shows type-specific description and metadata
- Inherits all pagination and layout features
- Filterable by tags from the same tag cloud

**URL Examples**:
- `/portfolio/type/case-study`
- `/portfolio/type/component`
- `/portfolio/type/template`
- `/portfolio/type/tool`

---

### FeaturedProjects Component

The FeaturedProjects component is designed for placement on homepage or landing pages. It displays a curated selection of projects with customizable layout and sorting options.

FeaturedProjects 组件专为放在首页或着陆页而设计。它以可自定义的布局和排序选项显示精选的项目集合。

**Component Props**:

```astro
<FeaturedProjects
  limit={10}
  layout="overlay"
  projectListWidth="full"
  projectListGapClass="gap-5"
  sortBy="latest"
/>
```

**Parameter Details**:

#### `limit`
- **Type**: `number`
- **Default**: `10`
- **Function**: Number of projects to display

显示的项目数量。

#### `layout`
- **Type**: `'overlay' | 'contained' | 'standard'`
- **Default**: `'overlay'`
- **Function**: Card layout style

卡片布局样式。

- `'overlay'`: Image covers card, text overlays at bottom
- `'contained'`: Image contained within card bounds
- `'standard'`: Standard card with image on top

#### `projectListWidth`
- **Type**: `'container' | 'full'`
- **Default**: `'container'`
- **Function**: Width of the project list

项目列表的宽度。

#### `projectListGapClass`
- **Type**: `string`
- **Default**: `'gap-5'`
- **Function**: Gap between cards (uses Tailwind spacing)

卡片之间的间距（使用 Tailwind 间距）。

#### `sortBy`
- **Type**: `'latest' | 'popular' | 'earliest'`
- **Default**: `'latest'`
- **Function**: Sort order for projects

项目的排序方式。

- `'latest'`: Sort by publish date, newest first
- `'popular'`: Sort by views, most viewed first
- `'earliest'`: Sort by publish date, oldest first

**Usage Examples**:

```astro
<!-- Latest Projects (Default) -->
<FeaturedProjects limit={6} />

<!-- Most Viewed Projects -->
<FeaturedProjects limit={8} sortBy="popular" layout="standard" />

<!-- Full-width Grid -->
<FeaturedProjects limit={12} projectListWidth="full" projectListGapClass="gap-8" />

<!-- Contained Layout -->
<FeaturedProjects limit={4} layout="contained" projectListWidth="container" />
```

**Project Card Component Props**:

The FeaturedProjects component internally uses ProjectCard with these default props:

```typescript
headingLevel="h5"
descriptionClass="text-base"
```

You can customize these in the component source if needed.

---

### Sorting System

Both the portfolio list page and FeaturedProjects component support three sorting options:

Portfolio 列表页面和 FeaturedProjects 组件都支持三种排序选项：

#### Latest First (Default)
Sorts projects by publish date in descending order (newest to oldest).

按发布日期降序排序（最新到最早）。

```typescript
const sortedProjects = [...projects].sort((a, b) => 
  b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
)
```

#### Most Popular (By Views)
Sorts projects by view count in descending order.

按浏览量降序排序。

```typescript
const sortedProjects = [...projects].sort((a, b) => 
  (b.data.views || 0) - (a.data.views || 0)
)
```

#### Earliest First
Sorts projects by publish date in ascending order (oldest to newest).

按发布日期升序排序（最早到最新）。

```typescript
const sortedProjects = [...projects].sort((a, b) => 
  a.data.publishDate.valueOf() - b.data.publishDate.valueOf()
)
```

**Adding View Counts**:

To enable popular sorting, add `views` to project frontmatter:

```yaml
---
title: My Project
publishDate: 2026-06-07
views: 1234
---
```

---

### Best Practices

1. **Tag Organization**:
   - Use consistent naming conventions
   - Keep tags descriptive but concise
   - Limit to 3-5 tags per project
   - Update tags when content evolves

2. **Type Assignment**:
   - Assign each project to exactly one type
   - Choose the most appropriate type
   - Use types for major categorization

3. **Project Images**:
   - Use high-quality featured images
   - Maintain consistent aspect ratios
   - Optimize images for web performance

4. **Pagination Settings**:
   - Balance page length with user experience
   - Consider typical content density
   - Test on mobile devices

5. **FeaturedProjects Usage**:
   - Select visually striking projects
   - Mix project types for variety
   - Update featured selection periodically

---

### Troubleshooting

**Common Issues**:

1. **Pagination not working**:
   - Clear all caches: `rm -rf node_modules/.astro node_modules/.vite dist`
   - Restart dev server: `npm run dev`

2. **Tags not appearing**:
   - Ensure tags are defined in project frontmatter
   - Check tag spelling consistency

3. **View counts not updating**:
   - Add `views` field to project frontmatter
   - Views are static (set at build time)

4. **Layout breaking on mobile**:
   - Test with responsive design tools
   - Adjust gap classes for smaller screens

---

### Conclusion

The project list system provides a powerful, flexible way to showcase your portfolio. With support for tags, types, pagination, and customizable sorting, you can create an organized, user-friendly experience for visitors to explore your work.

项目列表系统提供了一种强大、灵活的方式来展示你的作品集。通过支持标签、类型、分页和可自定义排序，你可以为访问者创造一个有组织、用户友好的体验来探索你的作品。

The FeaturedProjects component extends this functionality to homepage contexts, allowing you to highlight specific projects with full control over layout and sorting. By understanding these systems and their customization options, you can create a portfolio presentation that best suits your needs.

FeaturedProjects 组件将此功能扩展到首页场景，允许你以完全控制布局和排序的方式突出显示特定项目。通过理解这些系统及其自定义选项，你可以创建一个最适合你需求的作品集展示。
