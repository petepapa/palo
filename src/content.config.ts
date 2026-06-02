// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { defaultProjectType, projectTypeIds } from './projectTypes'

// 2. Import loader(s)
import { glob } from 'astro/loaders'

// 3. Define your collection(s)
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    type: z.enum(projectTypeIds).default(defaultProjectType),
    tags: z.array(z.string()).default([]),
  }),
})

// 4. Export a single `collections` object to register you collection(s)
export const collections = { projects }
