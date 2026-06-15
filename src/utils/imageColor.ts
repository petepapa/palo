import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

/**
 * Safe fallback color: 极简硬核暗灰色
 */
const FALLBACK_COLOR = '#18181c'

// ── Cache: build-phase 内调用多次时避免重复 I/O ──
const colorCache = new Map<string, string>()

/**
 * 判断输入是否为 Astro ESM import 的图片模块（对象含 .src）
 */
function isAstroImageModule(value: unknown): value is { src: string; width: number; height: number; format: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'src' in value &&
    typeof (value as Record<string, unknown>).src === 'string'
  )
}

/**
 * 将图片输入解析为本地文件系统可读取的绝对路径。
 * 支持三种输入形态：
 *   1. Astro ImageMetadata 对象（{ src, width, height, format }）
 *   2. 以 `/` 开头的 public 虚拟路径（如 `/posts/cover.jpg` → `./public/posts/cover.jpg`）
 *   3. 普通相对路径（如 `./cover.jpg` 或 `src/assets/images/...`）
 *
 * 返回绝对路径，或 null（表示无法解析）。
 */
function resolveImagePath(imageInput: unknown): string | null {
  try {
    // ── 形态 1: Astro ESM 图片导入对象 ──
    if (isAstroImageModule(imageInput)) {
      // 1. 优先从 internal 的 fsPath 属性读取（Vite/Astro 在开发和构建时都会为 ESM 导入资产附加此属性）
      if ('fsPath' in imageInput && typeof (imageInput as any).fsPath === 'string') {
        const fsPath = (imageInput as any).fsPath
        const absoluteFsPath = path.isAbsolute(fsPath) ? fsPath : path.resolve(process.cwd(), fsPath)
        if (fs.existsSync(absoluteFsPath)) {
          return absoluteFsPath
        }
      }

      const srcPath = imageInput.src

      // 2. 如果 src 是以 /@fs/ 开头的 dev server 虚拟绝对路径，剔除该前缀和 query 参数
      if (srcPath.startsWith('/@fs/')) {
        const cleanPath = srcPath.substring(4).split('?')[0]
        if (fs.existsSync(cleanPath)) {
          return cleanPath
        }
      }

      // 3. 原有逻辑与相对路径解析兜底，并排除虚拟 /_astro/ 路径
      if (path.isAbsolute(srcPath) && !srcPath.startsWith('/_astro/')) {
        return srcPath
      }
      
      if (!srcPath.startsWith('/_astro/')) {
        const absolute = path.resolve(process.cwd(), srcPath)
        if (fs.existsSync(absolute)) {
          return absolute
        }
      }

      return null
    }

    if (typeof imageInput !== 'string') {
      return null
    }

    const inputPath = imageInput.trim()

    // ── 形态 2: public/ 绝对虚拟路径（以 / 开头） ──
    if (inputPath.startsWith('/')) {
      // 去除开头的 /，拼上 ./public/
      const relative = inputPath.slice(1)
      const candidate = path.resolve(process.cwd(), 'public', relative)
      if (fs.existsSync(candidate)) {
        return candidate
      }
      // 再试一次不带 public 前缀（某些场景下路径已经是完整的）
      const fallbackCandidate = path.resolve(process.cwd(), relative)
      if (fs.existsSync(fallbackCandidate)) {
        return fallbackCandidate
      }
      return null
    }

    // ── 形态 3: 相对路径 ──
    // 直接相对于 cwd 解析
    const absolutePath = path.resolve(process.cwd(), inputPath)
    if (fs.existsSync(absolutePath)) {
      return absolutePath
    }

    // 尝试相对于 src/ 目录
    const srcPath = path.resolve(process.cwd(), 'src', inputPath)
    if (fs.existsSync(srcPath)) {
      return srcPath
    }

    return null
  } catch {
    return null
  }
}

/**
 * 提取图片的平均主色调。
 *
 * 利用 Sharp 将图片 resize 到 1×1 像素，读取像素值后格式化为 HEX 字符串。
 * 全程无外部依赖、无副作用，纯粹同步风格（内部 await sharp）。
 *
 * @param imageInput - 图片输入，支持：Astro ImageMetadata 对象、public 绝对路径、相对路径
 * @returns HEX 颜色字符串（如 `#6b4c3a`），任何异常均返回兜底色 `#18181c`
 */
export async function getDominantColor(imageInput: unknown): Promise<string> {
  // ── 缓存命中 ──
  const cacheKey = typeof imageInput === 'string' ? imageInput : isAstroImageModule(imageInput) ? imageInput.src : String(imageInput)
  const cached = colorCache.get(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // ── 解析路径 ──
    const resolvedPath = resolveImagePath(imageInput)
    if (!resolvedPath) {
      colorCache.set(cacheKey, FALLBACK_COLOR)
      return FALLBACK_COLOR
    }

    // ── 文件是否存在 ──
    if (!fs.existsSync(resolvedPath)) {
      colorCache.set(cacheKey, FALLBACK_COLOR)
      return FALLBACK_COLOR
    }

    // ── 用 Sharp resize 到 1×1 提取平均色 ──
    const { data, info } = await sharp(resolvedPath)
      .resize(1, 1, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true })

    if (!data || data.length < 3 || !info) {
      colorCache.set(cacheKey, FALLBACK_COLOR)
      return FALLBACK_COLOR
    }

    // data 是 [R, G, B] 三字节（raw 输出不含 alpha）
    const r = data[0]!
    const g = data[1]!
    const b = data[2]!

    // ── 格式化为 HEX ──
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`

    colorCache.set(cacheKey, hex)
    return hex
  } catch {
    colorCache.set(cacheKey, FALLBACK_COLOR)
    return FALLBACK_COLOR
  }
}

/**
 * 清除颜色缓存（主要用于测试或 HMR 场景）
 */
export function clearColorCache(): void {
  colorCache.clear()
}