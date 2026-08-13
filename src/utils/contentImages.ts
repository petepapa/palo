import type { ImageMetadata } from 'astro'
import fs from 'node:fs'
import path from 'node:path'

import type { CollectionEntry, RenderResult } from 'astro:content'
import { render } from 'astro:content'
import defaultPostImage from '@assets/images/posts/default.png'

export type ResolvedImage = ImageMetadata | string
export type ContentCollection = 'posts' | 'projects'

// ═══════════════════════════════════════════════════════════════
// 🔬 Eager Glob 引擎：构建时一次性导入全站内容图片
//    将 Vite 编译期 import 产物缓存为 ImageMetadata 映射表，
//    使 resolveContentImage 能返还完整对象而非退化字符串。
// ═══════════════════════════════════════════════════════════════
// 不使用 import: 'default' —— Vite 对 src/content/ 下图片的 default export 可能仅返回 URL 字符串，
// 缺少 width/height/format 元数据。改为获取完整模块对象，再手动提取 .default，
// 强制触发 Astro 图片管道的完整 ImageMetadata 转换。
const postImagesRaw = import.meta.glob(
  '/src/content/posts/**/*.{jpg,jpeg,png,gif,webp,avif}',
  { eager: true }
)
const projectImagesRaw = import.meta.glob(
  '/src/content/projects/**/*.{jpg,jpeg,png,gif,webp,avif}',
  { eager: true }
)
const assetsImagesRaw = import.meta.glob(
  '/src/assets/**/*.{jpg,jpeg,png,gif,webp,avif}',
  { eager: true }
)

const allGlobImages: Record<string, ImageMetadata> = {}
for (const [filePath, mod] of Object.entries({
  ...postImagesRaw,
  ...projectImagesRaw,
  ...assetsImagesRaw,
})) {
  const metadata = (mod as { default: unknown }).default
  if (isImageMetadata(metadata)) {
    allGlobImages[filePath] = metadata
  }
}

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

/**
 * 判断图片是否为 PNG 格式
 * 支持 ImageMetadata 对象和字符串路径两种输入
 */
export function isPngImage(src: unknown): boolean {
  if (!src) return false

  // 1. ImageMetadata 对象（有 format 属性）
  if (isImageMetadata(src)) {
    return src.format.toLowerCase() === 'png'
  }

  // 2. 普通对象带 format 属性
  if (typeof src === 'object' && src !== null && 'format' in src) {
    const fmt = (src as { format: unknown }).format
    if (typeof fmt === 'string') {
      return fmt.toLowerCase() === 'png'
    }
  }

  // 3. 字符串路径
  if (typeof src === 'string') {
    const cleanSrc = src.split('?')[0].split('#')[0]
    return cleanSrc.toLowerCase().endsWith('.png')
  }

  return false
}

export { defaultPostImage }

export function getPostDefaultImage(): ImageMetadata {
  return defaultPostImage
}

export function isPublicImagePath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('/src/')
}

export function isRelativeContentImage(path: string): boolean {
  return path.startsWith('./') || path.startsWith('../')
}

/**
 * Dev-only: mirror src/content image to public/ when missing or stale.
 * Returns source file mtimeMs for cache-busting query params.
 */
export function syncCoLocatedPublicMirror(
  globFilePath: string,
  publicPath: string,
): number {
  const srcAbs = path.resolve(process.cwd(), globFilePath.replace(/^\//, ''))
  if (!fs.existsSync(srcAbs)) return Date.now()

  const pubAbs = path.resolve(process.cwd(), 'public', publicPath.slice(1))
  const srcStat = fs.statSync(srcAbs)

  if (!fs.existsSync(pubAbs) || fs.statSync(pubAbs).mtimeMs < srcStat.mtimeMs) {
    fs.mkdirSync(path.dirname(pubAbs), { recursive: true })
    fs.copyFileSync(srcAbs, pubAbs)
  }

  return srcStat.mtimeMs
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

/**
 * 从 eager glob 缓存中查找图片对应的 ImageMetadata 对象。
 *
 * 支持两种路径模式：
 *   1. @assets/... 别名 → 映射到 /src/assets/... 文件系统路径
 *   2. ./cover.jpg 相对路径 → 映射到 /src/content/{collection}/{contentDir}/cover.jpg
 *
 * 返回 null 表示 glob 未命中（如纯 public/ 图片），调用方应回退到字符串路径。
 */
function buildContentImageMetadata(metadata: ImageMetadata, filePath: string): ImageMetadata {
  const publicPath = filePath.includes('/src/content/posts/')
    ? `/posts/${filePath.replace('/src/content/posts/', '')}`
    : filePath.includes('/src/content/projects/')
      ? `/projects/${filePath.replace('/src/content/projects/', '')}`
      : metadata.src

  return {
    ...metadata,
    src: publicPath,
  }
}

/** Resolve co-located image paths from contentId + relative imagePath. */
function getCoLocatedPaths(
  imagePath: string,
  contentId: string,
  collection: ContentCollection,
): { fsContentPath: string; publicPath: string } | null {
  if (!isRelativeContentImage(imagePath)) return null

  const normalizedImagePath = imagePath.replace(/^\.\//, '')
  const baseContentPath = collection === 'posts' ? 'posts' : 'projects'
  const basePublicPath = collection === 'posts' ? '/posts' : '/projects'

  const contentDir = contentId.includes('/')
    ? contentId.substring(0, contentId.lastIndexOf('/'))
    : ''

  const slug = contentId.replace(/\.(md|mdx)$/, '')

  const fsContentPath = contentDir
    ? `src/content/${baseContentPath}/${contentDir}/${normalizedImagePath}`
    : `src/content/${baseContentPath}/${slug}/${normalizedImagePath}`

  const publicPath = contentDir
    ? `${basePublicPath}/${contentDir}/${normalizedImagePath}`
    : `${basePublicPath}/${slug}/${normalizedImagePath}`

  return { fsContentPath, publicPath }
}

/**
 * Dev-only: mirror src/content image to public/ when missing or stale,
 * then return a cache-busted public URL so browser picks up replacements immediately.
 */
function resolveDevCoLocatedUrl(
  imagePath: string,
  contentId: string,
  collection: ContentCollection,
): string | null {
  const paths = getCoLocatedPaths(imagePath, contentId, collection)
  if (!paths) return null

  const srcAbs = path.resolve(process.cwd(), paths.fsContentPath)
  if (!fs.existsSync(srcAbs)) return null

  const pubAbs = path.resolve(process.cwd(), 'public', paths.publicPath.slice(1))
  const srcStat = fs.statSync(srcAbs)

  if (!fs.existsSync(pubAbs) || fs.statSync(pubAbs).mtimeMs < srcStat.mtimeMs) {
    fs.mkdirSync(path.dirname(pubAbs), { recursive: true })
    fs.copyFileSync(srcAbs, pubAbs)
  }

  return `${paths.publicPath}?v=${Math.round(srcStat.mtimeMs)}`
}

function resolveImageFromGlob(
  imagePath: string,
  contentId?: string,
  collection?: ContentCollection
): ImageMetadata | null {
  // 分支 A: @assets 别名 → 文件系统路径
  if (imagePath.startsWith('@assets/')) {
    const fsPath = '/src/assets/' + imagePath.slice('@assets/'.length)
    return allGlobImages[fsPath] ?? null
  }

  // 分支 B: 相对路径（./ 或 ../）→ co-located 图片
  if (isRelativeContentImage(imagePath) && contentId && collection) {
    const normalizedImagePath = imagePath.replace(/^\.\//, '')
    const basePath = collection === 'posts' ? 'posts' : 'projects'

    // ── 精确路径匹配 ──
    const hasSubdirectory = contentId.includes('/')
    const contentDir = hasSubdirectory
      ? contentId.substring(0, contentId.lastIndexOf('/'))
      : null

    const contentSlug = contentId.replace(/\.(md|mdx)$/, '')
    const fsPath = contentDir
      ? `/src/content/${basePath}/${contentDir}/${normalizedImagePath}`
      : `/src/content/${basePath}/${contentSlug}/${normalizedImagePath}`

    const exactMatch = allGlobImages[fsPath]
    if (exactMatch) {
      return import.meta.env.DEV ? buildContentImageMetadata(exactMatch, fsPath) : exactMatch
    }

    // ── 文件名回退匹配 ──
    // 当精确路径推算偏差（如 contentDir 与实际目录结构不一致）时，
    // 提取文件名在 glob 中做 basename 查找，与 BreakoutImage 行为一致。
    const filename = normalizedImagePath.split('/').pop()!
    for (const [globKey, metadata] of Object.entries(allGlobImages)) {
      if (globKey.endsWith('/' + filename) || globKey.split('/').pop() === filename) {
        // 优先匹配与 collection 相关的路径
        if (globKey.includes(`/content/${basePath}/`)) {
          return import.meta.env.DEV ? buildContentImageMetadata(metadata, globKey) : metadata
        }
      }
    }
    // 放宽约束：跨 collection 也接受（作为最终回退）
    for (const [globKey, metadata] of Object.entries(allGlobImages)) {
      if (globKey.split('/').pop() === filename) {
        return import.meta.env.DEV ? buildContentImageMetadata(metadata, globKey) : metadata
      }
    }
  }

  return null
}

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
    // ── Dev Phase 0: co-located ./ paths → sync public mirror + cache-busted URL ──
    // Runs before glob so new/replaced covers work without restarting dev.
    if (import.meta.env.DEV && isRelativeContentImage(imagePath) && contentId && collection) {
      const devUrl = resolveDevCoLocatedUrl(imagePath, contentId, collection)
      if (devUrl) return devUrl
    }

    // ── Phase 1: Glob 优先解析 → ImageMetadata（触发 C++ Sharp 管道）──
    const globMetadata = resolveImageFromGlob(imagePath, contentId, collection)
    if (globMetadata) {
      return globMetadata
    }

    // ── Phase 2: public/ 路径 → 字符串（静态托管，不经 Sharp）──
    if (isPublicImagePath(imagePath)) {
      return imagePath
    }

    // ── Phase 3: 相对路径兜底 → 构造可访问路径（当 glob 未命中时）──
    if (isRelativeContentImage(imagePath) && contentId && collection) {
      const paths = getCoLocatedPaths(imagePath, contentId, collection)
      if (paths && fs.existsSync(path.resolve(process.cwd(), paths.fsContentPath))) {
        return paths.publicPath
      }
      if (import.meta.env.DEV && paths) {
        console.warn(
          `[contentImages] Dev 模式 co-located 图片不存在：${paths.fsContentPath}，回退到 public 路径`
        )
      }
      if (paths) return paths.publicPath
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

export function resolveAuthorImage(
  authorImage: string | undefined | null,
  contentId: string,
  collection: ContentCollection,
): string | undefined {
  if (!authorImage) return undefined
  return getPublicImageUrl(resolveContentImage(authorImage, { contentId, collection }))
}

export function resolveAuthorImageResolved(
  authorImage: string | undefined | null,
  contentId: string,
  collection: ContentCollection,
): ResolvedImage | undefined {
  if (!authorImage) return undefined
  return resolveContentImage(authorImage, { contentId, collection })
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
  entry: CollectionEntry<ContentCollection>,
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

async function cleanupContentCache(_collection: string, _entryId: string): Promise<void> {
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

function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, (match) => {
    const escapeMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escapeMap[match] || match;
  });
}