import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { defaultProjectType, projectTypeIds } from './projectTypes'

/**
 * 公共图像字段校验器 - 终极容错版本
 * 
 * 设计原则：
 * 1. 宽容接纳：接受 Astro ImageMetadata、字符串路径、null、undefined
 * 2. 永不崩溃：通过 .catch(undefined) 确保任何解析失败都不阻断整个 collection
 * 3. 向后兼容：支持旧式 /public 路径和新式 co-located 相对路径
 * 
 * 容错链：
 *   z.image() → 解析失败 → 尝试 z.string() → 也失败 → catch 兜底到 undefined
 * 
 * 这确保了：
 *   - Dev 模式下图片还未被 Vite 解析时，不会导致整个 collection 初始化失败
 *   - 新添加的内容目录在热更新时，即使图片还未同步，页面也能正常渲染
 *   - 图片路径拼写错误时，不会导致整站崩溃
 */
const imageField = z
  .image()
  .optional()
  .or(z.string().optional())
  .catch(undefined)

/**
 * 安全的日期字段：解析失败时使用默认日期（避免 Dev 热更新时日期格式问题）
 */
const safeDateField = z
  .date()
  .optional()
  .catch(() => new Date('2024-01-01'))

/**
 * glob loader 配置说明：
 * - pattern: '**/[^_]*.{md,mdx}' 
 *   - `**/` 递归匹配所有子目录
 *   - `[^_]*` 排除以 _ 开头的文件（草稿文件）
 *   - `.{md,mdx}` 匹配 md 和 mdx 文件
 *   
 * - base: './src/content/posts' / './src/content/projects'
 *   - 指定 collection 的根目录
 *   
 * 此配置完美兼容：
 *   1. 单文件模式：src/content/posts/my-post.md
 *   2. 文件夹模式：src/content/posts/my-post/index.mdx
 */

const posts = defineCollection({
  loader: glob({ 
    pattern: '**/[^_]*.{md,mdx}', 
    base: './src/content/posts',
    // Ensure hot-reload correctly tracks new files / 确保热更新时正确追踪新增文件
    watch: true,
  }),
  schema: () =>
    z.object({
      title: z.string().catch('Untitled'),
      description: z.string().catch(''),
      publishDate: safeDateField,
      author: z
        .union([
          z.string(),
          z.object({
            name: z.string().catch('Anonymous'),
            image: z.string().optional().catch(undefined),
            bio: z.string().optional().catch(''),
          }),
        ])
        .default('Anonymous')
        .catch('Anonymous'),
      tags: z.array(z.string()).default([]).catch([]),
      coverImage: imageField,
      breadcrumbs: z.boolean().default(true).catch(true),
      source: z.string().optional().catch(undefined),
      liveDemo: z.string().optional().catch(undefined),
      customBreadcrumbLabels: z.any().optional().catch(undefined),
      joinLastBreadcrumb: z.boolean().default(false).catch(false),
      divider: z.enum(['top', 'both', 'bottom', 'none']).default('none').catch('none'),
      coverImagePosition: z.enum(['top', 'head', 'bottom']).default('head').catch('head'),
      toc: z.boolean().default(true).catch(true),
      narrow: z.boolean().default(true).catch(true),
      updatedDate: safeDateField,
      featuredOrder: z.number().optional().catch(undefined),
      draft: z.boolean().default(false).catch(false),
      share: z.boolean().default(true).catch(true),
      canonicalURL: z.string().optional().catch(undefined),
      language: z.string().optional().catch(undefined),
    }),
})

const projects = defineCollection({
  loader: glob({ 
    pattern: '**/[^_]*.{md,mdx}', 
    base: './src/content/projects',
    watch: true,
  }),
  schema: () =>
    z.object({
      title: z.string().catch('Untitled'),
      author: z
        .union([
          z.string(),
          z.object({
            name: z.string().catch('Anonymous'),
            image: z.string().optional().catch(undefined),
            bio: z.string().optional().catch(''),
          }),
        ])
        .default('Anonymous')
        .catch('Anonymous'),
      description: z.string().catch(''),
      type: z.enum(projectTypeIds).default(defaultProjectType).catch(defaultProjectType),
      tags: z.array(z.string()).default([]).catch([]),
      coverImage: imageField,
      breadcrumbs: z.boolean().default(true).catch(true),
      source: z.string().optional().catch(undefined),
      liveDemo: z.string().optional().catch(undefined),
      customBreadcrumbLabels: z.any().optional().catch(undefined),
      joinLastBreadcrumb: z.boolean().default(false).catch(false),
      divider: z.enum(['top', 'both', 'bottom', 'none']).default('none').catch('none'),
      coverImagePosition: z.enum(['top', 'head', 'bottom']).default('head').catch('head'),
      toc: z.boolean().default(true).catch(true),
      narrow: z.boolean().default(true).catch(true),
      publishDate: safeDateField,
      featuredImage: imageField,
      featuredOrder: z.number().optional().catch(undefined),
      externalLink: z.string().optional().catch(undefined),
      video: z.string().optional().catch(undefined),
      draft: z.boolean().default(false).catch(false),
      share: z.boolean().default(true).catch(true),
    }),
})

export const collections = { posts, projects }
