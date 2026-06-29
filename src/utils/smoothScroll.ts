/**
 * 丝滑平滑滚动工具函数
 * 模拟 Chrome 原生 scroll-behavior: smooth 的效果，跨浏览器一致
 * 使用 easeOutExpo 缓动，结尾极其丝滑地停止
 */

let activeScrollFrame: number | null = null

const easeOutExpo = (t: number): number => (t === 0 ? 0 : 1 - Math.pow(2, -10 * t))

const getHeaderOffset = (): number => {
  const val = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
  )
  return Number.isFinite(val) ? val : 0
}

const calculateDuration = (distance: number): number => {
  const absDistance = Math.abs(distance)
  const minDuration = 300
  const maxDuration = 900
  const baseDuration = Math.sqrt(absDistance) * 18
  return Math.min(maxDuration, Math.max(minDuration, baseDuration))
}

export const smoothScrollTo = (
  targetY: number,
  options: {
    offset?: number
    duration?: number
    onComplete?: () => void
  } = {},
): void => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    window.scrollTo(0, targetY)
    options.onComplete?.()
    return
  }

  if (activeScrollFrame !== null) {
    cancelAnimationFrame(activeScrollFrame)
    activeScrollFrame = null
  }

  const offset = options.offset ?? 0
  const finalY = Math.max(0, targetY - offset)
  const startY = window.scrollY
  const distance = finalY - startY

  if (Math.abs(distance) < 2) {
    options.onComplete?.()
    return
  }

  const duration = options.duration ?? calculateDuration(distance)
  const startTime = performance.now()
  const rootStyle = document.documentElement.style
  const previousScrollBehavior = rootStyle.scrollBehavior
  rootStyle.scrollBehavior = 'auto'

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOutExpo(progress)
    window.scrollTo(0, startY + distance * eased)

    if (progress < 1) {
      activeScrollFrame = requestAnimationFrame(step)
    } else {
      rootStyle.scrollBehavior = previousScrollBehavior
      activeScrollFrame = null
      options.onComplete?.()
    }
  }

  step(startTime)
}

export const smoothScrollToElement = (
  element: HTMLElement,
  options: {
    offset?: number
    duration?: number
    onComplete?: () => void
  } = {},
): void => {
  const offset = options.offset ?? getHeaderOffset()
  const targetY = window.scrollY + element.getBoundingClientRect().top
  smoothScrollTo(targetY, { ...options, offset })
}

export const cancelSmoothScroll = (): void => {
  if (activeScrollFrame !== null) {
    cancelAnimationFrame(activeScrollFrame)
    activeScrollFrame = null
  }
}
