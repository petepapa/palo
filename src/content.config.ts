import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { defaultProjectType, projectTypeIds } from './projectTypes'

const imageField = z.string().optional().catch(undefined)

const safeDateField = z
  .date()
  .optional()
  .catch(() => new Date('2024-01-01'))

const posts = defineCollection({
  loader: glob({ 
    pattern: '**/[^_]*.{md,mdx}', 
    base: './src/content/posts',
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
      showDivider: z.union([z.boolean(), z.enum(['top', 'both', 'bottom'])]).default(true).catch(true),
      coverImagePosition: z.union([z.boolean(), z.enum(['top', 'head', 'bottom'])]).default('head').catch('head'),
      toc: z.boolean().default(true).catch(true),
      narrow: z.boolean().default(true).catch(true),
      updatedDate: safeDateField,
      featuredOrder: z.number().optional().catch(undefined),
      draft: z.boolean().default(false).catch(false),
      share: z.boolean().default(true).catch(true),
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
      showDivider: z.union([z.boolean(), z.enum(['top', 'both', 'bottom'])]).default(true).catch(true),
      coverImagePosition: z.union([z.boolean(), z.enum(['top', 'head', 'bottom'])]).default('head').catch('head'),
      toc: z.boolean().default(true).catch(true),
      narrow: z.boolean().default(true).catch(true),
      publishDate: safeDateField,
      featuredOrder: z.number().optional().catch(undefined),
      externalLink: z.string().optional().catch(undefined),
      video: z.string().optional().catch(undefined),
      draft: z.boolean().default(false).catch(false),
      share: z.boolean().default(true).catch(true),
    }),
})

export const collections = { posts, projects }