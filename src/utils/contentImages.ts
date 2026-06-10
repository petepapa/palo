import type { ImageMetadata } from 'astro'

export type ResolvedImage = ImageMetadata | string

export type ContentCollection = 'posts' | 'projects'

const contentPostImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/posts/**/*.{jpeg,jpg,png,gif,webp,avif,svg}',
  { eager: true },
)

const contentProjectImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/projects/**/*.{jpeg,jpg,png,gif,webp,avif,svg}',
  { eager: true },
)

const assetImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpeg,jpg,png,gif,webp,avif,svg}',
  { eager: true },
)

export const defaultPostImages = [
  '/posts/post-image-1.jpg',
  '/posts/post-image-2.jpg',
  '/posts/post-image-3.jpg',
  '/posts/post-image-4.jpg',
  '/posts/post-image-5.jpg',
  '/posts/post-image-6.jpg',
] as const

export function isImageMetadata(value: unknown): value is ImageMetadata {
  return (
    typeof value === 'object' &&
    value !== null &&
    'src' in value &&
    'width' in value &&
    'height' in value &&
    'format' in value
  )
}

export function isPublicImagePath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('/src/')
}

export function isRelativeContentImage(path: string): boolean {
  return path.startsWith('./') || path.startsWith('../')
}

function getContentGlob(collection: ContentCollection): Record<string, { default: ImageMetadata }> {
  return collection === 'posts' ? contentPostImages : contentProjectImages
}

function normalizeAssetPath(path: string): string {
  if (path.startsWith('@assets/')) {
    return `/src/assets/${path.slice('@assets/'.length)}`
  }

  if (path.startsWith('/src/assets/')) {
    return path
  }

  if (path.startsWith('src/assets/')) {
    return `/${path}`
  }

  if (path.startsWith('assets/')) {
    return `/src/${path}`
  }

  return path
}

function resolveRelativeContentPath(
  relativePath: string,
  contentId: string,
  collection: ContentCollection,
): ImageMetadata | undefined {
  const normalized = relativePath.replace(/^\.\//, '')
  const exactPath = `/src/content/${collection}/${contentId}/${normalized}`
  const glob = getContentGlob(collection)

  if (glob[exactPath]) {
    return glob[exactPath].default
  }

  const suffix = `/${contentId}/${normalized}`
  const matched = Object.entries(glob).find(([key]) => key.endsWith(suffix))
  return matched?.[1].default
}

function resolveAssetPath(path: string): ImageMetadata | undefined {
  const normalized = normalizeAssetPath(path)
  return assetImages[normalized]?.default
}

/**
 * Resolve a cover/featured image path from public, co-located content, or src/assets.
 *
 * - `/posts/...` or `/projects/...` → public URL string
 * - `./cover.jpg` (with contentId + collection) → ImageMetadata from co-located asset
 * - `@assets/images/foo.jpg` → ImageMetadata from src/assets
 */
export function resolveContentImage(
  imagePath: string | undefined,
  options: {
    contentId?: string
    collection?: ContentCollection
    fallback?: ResolvedImage
  } = {},
): ResolvedImage | undefined {
  const { contentId, collection, fallback } = options

  if (!imagePath) {
    return fallback
  }

  if (isPublicImagePath(imagePath)) {
    return imagePath
  }

  if (isRelativeContentImage(imagePath)) {
    if (contentId && collection) {
      const resolved = resolveRelativeContentPath(imagePath, contentId, collection)
      if (resolved) {
        return resolved
      }
    }

    return fallback ?? imagePath
  }

  const assetResolved = resolveAssetPath(imagePath)
  if (assetResolved) {
    return assetResolved
  }

  return imagePath.startsWith('/') ? imagePath : fallback ?? imagePath
}

export function resolveCollectionCoverImage(
  coverImage: string | undefined,
  contentId: string,
  collection: ContentCollection,
  fallback: ResolvedImage,
): ResolvedImage {
  return resolveContentImage(coverImage, { contentId, collection, fallback }) ?? fallback
}

/** Get a string URL suitable for meta tags and layout SEO props. */
export function getPublicImageUrl(image: ResolvedImage | undefined): string | undefined {
  if (!image) {
    return undefined
  }

  return typeof image === 'string' ? image : image.src
}
