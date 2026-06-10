import type { ImageMetadata } from 'astro'
import type { CollectionEntry, RenderResult } from 'astro:content'
import { render } from 'astro:content'

export type ResolvedImage = ImageMetadata | string
export type ContentCollection = 'posts' | 'projects'

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

export function resolveRelativeImagePath(
  relativePath: string,
  currentFilePath?: string
): string {
  if (!isRelativeContentImage(relativePath)) {
    return relativePath
  }

  if (!currentFilePath) {
    return relativePath
  }

  const normalizedPath = relativePath.replace(/^\.\//, '')
  
  const parts = currentFilePath.split('/')
  parts.pop()
  
  if (relativePath.startsWith('../')) {
    const depth = relativePath.match(/^\.\.\//g)?.length || 0
    for (let i = 0; i < depth; i++) {
      parts.pop()
    }
    const remainingPath = relativePath.replace(/^\.\.\//g, '')
    parts.push(remainingPath)
  } else {
    parts.push(normalizedPath)
  }

  const fullPath = parts.join('/')
  
  if (fullPath.startsWith('src/content/posts/')) {
    return '/posts/' + fullPath.replace('src/content/posts/', '')
  } else if (fullPath.startsWith('src/content/projects/')) {
    return '/projects/' + fullPath.replace('src/content/projects/', '')
  }
  
  return relativePath
}

export const defaultPostImages = [
  '/posts/post-image-1.jpg',
  '/posts/post-image-2.jpg',
  '/posts/post-image-3.jpg',
  '/posts/post-image-4.jpg',
  '/posts/post-image-5.jpg',
  '/posts/post-image-6.jpg',
] as const

export function resolveContentImage(
  imagePath: string | ImageMetadata | undefined | null,
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

  if (isImageMetadata(imagePath)) {
    return imagePath
  }

  if (typeof imagePath === 'string') {
    if (isPublicImagePath(imagePath)) {
      return imagePath
    }

    if (isRelativeContentImage(imagePath) && contentId && collection) {
      // 处理 Astro co-located 图片
      // 将相对路径（如 ./cover.jpg）转换为内容集合路径
      const normalizedImagePath = imagePath.replace(/^\.\//, '')
      const basePath = collection === 'posts' ? '/posts' : '/projects'
      
      // 如果 contentId 已经包含文件夹路径（如 project-01/index.md），需要提取目录部分
      const contentDir = contentId.includes('/') 
        ? contentId.substring(0, contentId.lastIndexOf('/'))
        : ''
      
      const resolvedPath = contentDir
        ? `${basePath}/${contentDir}/${normalizedImagePath}`
        : `${basePath}/${contentId.replace(/\.(md|mdx)$/, '')}/${normalizedImagePath}`
      
      return resolvedPath
    }

    return imagePath.startsWith('/') ? imagePath : fallback ?? imagePath
  }

  return fallback
}

export function resolveCollectionCoverImage(
  coverImage: string | ImageMetadata | undefined | null,
  contentId: string,
  collection: ContentCollection,
  fallback: ResolvedImage,
): ResolvedImage {
  return resolveContentImage(coverImage, { contentId, collection, fallback }) ?? fallback
}

export function getPublicImageUrl(image: ResolvedImage | undefined): string | undefined {
  if (!image) {
    return undefined
  }

  return typeof image === 'string' ? image : image.src
}

// ==================== 高级容错与自愈机制 ====================

export interface SmartRenderOptions {
  maxRetries?: number
  retryDelay?: number
  onRetry?: (attempt: number, error: Error) => void
  onSuccess?: () => void
  onError?: (error: Error) => void
  renderProps?: Record<string, unknown>
}

export async function smartRender(
  entry: CollectionEntry<any>,
  options: SmartRenderOptions = {},
): Promise<RenderResult & { renderProps?: Record<string, unknown> }> {
  const {
    maxRetries = 3,
    retryDelay = 100,
    onRetry,
    onSuccess,
    onError,
    renderProps,
  } = options

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await render(entry)
      onSuccess?.()
      return { ...result, renderProps }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt < maxRetries) {
        onRetry?.(attempt, lastError)
        
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1)))
        
        try {
          await cleanupContentCache(entry.collection, entry.id)
        } catch (cleanupError) {
          console.warn('[smartRender] 缓存清理失败:', cleanupError)
        }
      }
    }
  }

  onError?.(lastError!)
  throw lastError!
}

async function cleanupContentCache(collection: string, entryId: string): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      const links = document.querySelectorAll('link[rel="stylesheet"], script[src]')
      links.forEach(link => {
        if (link instanceof HTMLLinkElement || link instanceof HTMLScriptElement) {
          const href = link.getAttribute('href') || link.getAttribute('src')
          if (href && !href.includes('cache_bust')) {
            const newHref = href + (href.includes('?') ? '&' : '?') + `cache_bust=${Date.now()}`
            link.setAttribute(link instanceof HTMLLinkElement ? 'href' : 'src', newHref)
          }
        }
      })
    }
  } catch (error) {
    console.warn('[cleanupContentCache] 清理失败:', error)
  }
}

export function isImageLoadingError(error: Error): boolean {
  const message = error.message.toLowerCase()
  return (
    message.includes('image') ||
    message.includes('cover') ||
    message.includes('sharp') ||
    message.includes('asset') ||
    message.includes('file')
  )
}

export function isSchemaValidationError(error: Error): boolean {
  const message = error.message.toLowerCase()
  return (
    message.includes('schema') ||
    message.includes('validation') ||
    message.includes('zod') ||
    message.includes('parse')
  )
}

export function getFallbackContentHtml(contentId: string, error: Error, isDev: boolean): string {
  const errorDetails = isDev ? `
    <div class="fallback-error-details">${escapeHtml(error.message)}</div>
    <button class="fallback-retry-btn" onclick="window.location.reload()">
      🔄 重新加载
    </button>
  ` : ''

  return `
    <div class="fallback-content">
      <style>
        .fallback-content {
          padding: 2rem;
          border: 1px dashed #f66;
          background: #fff5f5;
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #333;
        }
        .fallback-content h3 {
          margin-top: 0;
          color: #c33;
        }
        .fallback-error-details {
          font-family: monospace;
          font-size: 0.875rem;
          background: #fff;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          max-height: 200px;
          overflow-y: auto;
          margin: 1rem 0;
        }
        .fallback-retry-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .fallback-retry-btn:hover {
          background: #0056b3;
        }
        .fallback-hint {
          font-size: 0.875rem;
          color: #666;
          margin-top: 1rem;
        }
      </style>
      <h3>内容加载中...</h3>
      <p>正在尝试重新加载内容，请稍候...</p>
      ${errorDetails}
      <div class="fallback-hint">
        <strong>提示：</strong>这通常是开发模式下的临时问题，刷新页面即可恢复。
      </div>
    </div>
  `
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}