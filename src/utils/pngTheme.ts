/**
 * PNG 主题反差色计算工具
 *
 * 当 PNG 图片的主色调与背景色相同时，透明区域会与背景融为一体。
 * 本工具通过计算主色调的相对亮度（Relative Luminance），
 * 从系统预设的 neutral 色阶中反向选出最具反差感的背景色。
 *
 * 设计原则：
 * - 深色主色调 → 浅色背景（neutral-200）
 * - 浅色主色调 → 深色背景（neutral-700）
 * - 严格遵循系统色彩规范，使用 neutral-200 到 neutral-800 范围
 */

/**
 * 将 HEX 颜色转换为 RGB 对象
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1]!, 16),
    g: parseInt(result[2]!, 16),
    b: parseInt(result[3]!, 16),
  }
}

/**
 * 计算颜色的相对亮度（WCAG Luminance Formula）
 * 返回值范围：0（纯黑）到 1（纯白）
 *
 * 参考：https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0.5

  const [R, G, B] = [rgb.r, rgb.g, rgb.b].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

/**
 * 亮度分界阈值
 * 当主色调亮度 < 0.5 时认为是深色，反之是浅色
 */
const LUMINANCE_THRESHOLD = 0.5

export interface ContrastBgResult {
  /** CSS 变量名（用于内联样式） */
  cssVar: string
  /** 对应的色阶标识 */
  level: '200' | '300' | '700' | '800'
  /** 是浅色背景还是深色背景 */
  mode: 'light' | 'dark'
}

/**
 * 根据主色调计算 PNG 卡片的反差背景色
 *
 * @param dominantColor - 图片主色调（HEX 格式）
 * @returns 反差背景色信息（CSS 变量名 + 色阶）
 *
 * @example
 * ```ts
 * const bg = getContrastBgColor('#1a1a1a')
 * // 返回 { cssVar: 'var(--color-neutral-200)', level: '200', mode: 'light' }
 *
 * const bg2 = getContrastBgColor('#f0f0f0')
 * // 返回 { cssVar: 'var(--color-neutral-700)', level: '700', mode: 'dark' }
 * ```
 */
export function getContrastBgColor(dominantColor: string): ContrastBgResult {
  const luminance = getLuminance(dominantColor)

  if (luminance < LUMINANCE_THRESHOLD) {
    return {
      cssVar: 'var(--color-neutral-200)',
      level: '200',
      mode: 'light',
    }
  } else {
    return {
      cssVar: 'var(--color-neutral-700)',
      level: '700',
      mode: 'dark',
    }
  }
}

/**
 * 获取更强反差的背景色（用于需要更高对比度的场景）
 * 使用 neutral-300 / neutral-800
 */
export function getStrongContrastBgColor(dominantColor: string): ContrastBgResult {
  const luminance = getLuminance(dominantColor)

  if (luminance < LUMINANCE_THRESHOLD) {
    return {
      cssVar: 'var(--color-neutral-300)',
      level: '300',
      mode: 'light',
    }
  } else {
    return {
      cssVar: 'var(--color-neutral-800)',
      level: '800',
      mode: 'dark',
    }
  }
}

/**
 * 计算两种颜色的对比度（WCAG Contrast Ratio）
 * 返回值：1（无对比）到 21（最大对比）
 *
 * 参考：https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}
