import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { defaultProjectType, projectTypeIds } from './projectTypes'

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/posts' }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.date(),
      author: z
        .union([
          z.string(),
          z.object({
            name: z.string(),
            image: z.string().optional(),
            bio: z.string().optional(),
          }),
        ])
        .default('Anonymous'),
      tags: z.array(z.string()).default([]),
      coverImage: z.string().optional(),
      showBreadcrumbs: z.boolean().default(true),
      source: z.string().optional(),
      liveDemo: z.string().optional(),
      customBreadcrumbLabels: z.any().optional(),
      joinLastBreadcrumb: z.boolean().default(false),
      showDivider: z.union([z.boolean(), z.enum(['top', 'both', 'bottom'])]).default(true),
      coverImagePosition: z.union([z.boolean(), z.enum(['top', 'head', 'bottom'])]).default('head'),
      showTableOfContents: z.boolean().default(true),
      narrow: z.boolean().default(true),
      views: z.number().default(0),
      updatedDate: z.date().optional(),
      featuredOrder: z.number().optional(),
      draft: z.boolean().optional(),
      canonicalURL: z.string().optional(),
      language: z.string().optional(),
    }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: () =>
    z.object({
      title: z.string(),
      author: z
        .union([
          z.string(),
          z.object({
            name: z.string(),
            image: z.string().optional(),
            bio: z.string().optional(),
          }),
        ])
        .default('Anonymous'),
      description: z.string(),
      type: z.enum(projectTypeIds).default(defaultProjectType),
      tags: z.array(z.string()).default([]),
      coverImage: z.string().optional(),
      showBreadcrumbs: z.boolean().default(true),
      source: z.string().optional(),
      liveDemo: z.string().optional(),
      customBreadcrumbLabels: z.any().optional(),
      joinLastBreadcrumb: z.boolean().default(false),
      showDivider: z.union([z.boolean(), z.enum(['top', 'both', 'bottom'])]).default(true),
      coverImagePosition: z.union([z.boolean(), z.enum(['top', 'head', 'bottom'])]).default('head'),
      showTableOfContents: z.boolean().default(true),
      narrow: z.boolean().default(true),
      views: z.number().default(0),
      publishDate: z.date().optional(),
      featuredImage: z.string().optional(),
      featuredOrder: z.number().optional(),
      externalLink: z.string().optional(),
      video: z.string().optional(),
      draft: z.boolean().optional(),
    }),
})

export const collections = { posts, projects }
