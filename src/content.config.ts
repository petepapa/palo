// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { defaultProjectType, projectTypeIds } from './projectTypes'

// 2. Import loader(s)
import { glob } from 'astro/loaders'

// 3. Define your collection(s)
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    type: z.enum(projectTypeIds).default(defaultProjectType),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
  }),
})

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.union([
      z.string(),
      z.object({
        name: z.string(),
        image: z.string().optional(),
        bio: z.string().optional(),
      }),
    ]).default('Anonymous'),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    showBreadcrumbs: z.boolean().default(true),
    source: z.string().optional(),
    liveDemo: z.string().optional(),
    customBreadcrumbLabels: z.any().optional(),
    joinLastBreadcrumb: z.boolean().default(false),
    showDivider: z.union([z.boolean(), z.enum(['top', 'both', 'bottom'])]).default(true),
    coverImagePosition: z.union([z.boolean(), z.enum(['top', 'head', 'bottom'])]).default('head'),
  }),
})

// 4. Export a single `collections` object to register you collection(s)
export const collections = { projects, posts }
