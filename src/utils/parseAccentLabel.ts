export interface LabelSegment {
  text: string
  accent: boolean
}

/**
 * 解析 label 中的 **text** 语法，将文本分割为普通段和 accent 加粗段
 * 支持多段 accent，例如："**YouTube:** @petepatv"
 *
 * @param label 原始 label 字符串
 * @returns 分段数组
 */
export function parseAccentLabel(label: string): LabelSegment[] {
  if (!label.includes('**')) {
    return [{ text: label, accent: false }]
  }

  const segments: LabelSegment[] = []
  const regex = /\*\*([^*]+)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(label)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: label.slice(lastIndex, match.index),
        accent: false,
      })
    }
    segments.push({
      text: match[1],
      accent: true,
    })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < label.length) {
    segments.push({
      text: label.slice(lastIndex),
      accent: false,
    })
  }

  return segments
}

/**
 * 将解析后的 segments 渲染为单个 HTML 字符串，
 * 避免 Astro 模板中元素间空白节点产生多余空格。
 * 加粗段末尾的普通空格替换为 &nbsp;，使其在 inline-block
 * 中不被折叠，同时 hover 时不显示下划线。
 */
export function renderAccentLabel(label: string): string {
  if (!label.includes('**')) return label

  return parseAccentLabel(label)
    .map((seg) => {
      if (!seg.accent) return seg.text
      const text = seg.text.replace(/ $/, '&nbsp;')
      return `<span class="font-medium">${text}</span>`
    })
    .join('')
}
