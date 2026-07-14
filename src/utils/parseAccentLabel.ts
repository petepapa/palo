export interface LabelSegment {
  text: string
  /** heading 字重（**text**） */
  bold?: boolean
  /** accent 字重（*text*） */
  accent?: boolean
}

/**
 * 解析 label 中的 Markdown 风格字重语法，支持 3 种字重：
 *   **text** → heading 字重
 *   *text*   → accent 字重
 *   无标记   → body 字重（默认）
 *
 * 解析顺序：先处理 **（heading），再处理 *（accent）
 *
 * 示例：**Pa***l*o → "Pa" heading + "l" accent + "o" body
 *
 * @param label 原始 label 字符串
 * @returns 分段数组
 */
export function parseAccentLabel(label: string): LabelSegment[] {
  if (!label.includes('*')) {
    return [{ text: label }]
  }

  const segments: LabelSegment[] = []
  const boldRegex = /\*\*([^*]+)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = boldRegex.exec(label)) !== null) {
    if (match.index > lastIndex) {
      segments.push(...parseAccentParts(label.slice(lastIndex, match.index)))
    }
    segments.push({ text: match[1], bold: true })
    lastIndex = boldRegex.lastIndex
  }

  if (lastIndex < label.length) {
    segments.push(...parseAccentParts(label.slice(lastIndex)))
  }

  return segments
}

/**
 * 解析 *accent* 语法，返回分段数组（纯函数）
 */
function parseAccentParts(text: string): LabelSegment[] {
  if (!text.includes('*')) {
    return text ? [{ text }] : []
  }

  const parts: LabelSegment[] = []
  const accentRegex = /\*([^*]+)\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = accentRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index) })
    }
    parts.push({ text: match[1], accent: true })
    lastIndex = accentRegex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex) })
  }

  return parts
}

/**
 * 将解析后的 segments 渲染为单个 HTML 字符串，
 * 避免 Astro 模板中元素间空白节点产生多余空格。
 * 加粗段末尾的普通空格替换为 &nbsp;，使其在 inline-block
 * 中不被折叠，同时 hover 时不显示下划线。
 */
export function renderAccentLabel(label: string): string {
  if (!label.includes('*')) return label

  const wrapWithClass = (text: string, className: string) => {
    const safeText = text.replace(/ $/, '&nbsp;')
    return `<span class="${className}">${safeText}</span>`
  }

  return parseAccentLabel(label)
    .map((seg) => {
      if (seg.bold) return wrapWithClass(seg.text, 'font-medium')
      if (seg.accent) return wrapWithClass(seg.text, 'font-accent')
      return seg.text
    })
    .join('')
}
