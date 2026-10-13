/**
 * 丝滑平滑滚动工具函数
 * 模拟 Chrome 原生 scroll-behavior: smooth 的效果，跨浏览器一致
 * 使用 easeOutExpo 缓动，结尾极其丝滑地停止
 */

let activeScrollFrame: number | null = null

const easeOutExpo = (t: number): number => (t === 0 ? 0 : 1 - Math.pow(2, -10 * t))

const getHeaderOffset = (): number => {
  const headerHeight = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
  )
  const spaceL = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--space-l'),
  )
  const hh = Number.isFinite(headerHeight) ? headerHeight : 0
  const sl = Number.isFinite(spaceL) ? spaceL : 32
  return hh + sl
}

const getElementScrollOffset = (element: HTMLElement): number => {
  const margin = parseFloat(getComputedStyle(element).scrollMarginBlockStart)
  if (Number.isFinite(margin) && margin > 0) {
    return margin
  }
  return getHeaderOffset()
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
    if (progress >= 1) {
      window.scrollTo(0, finalY)
      rootStyle.scrollBehavior = previousScrollBehavior
      activeScrollFrame = null
      options.onComplete?.()
    } else {
      const eased = easeOutExpo(progress)
      window.scrollTo(0, startY + distance * eased)
      activeScrollFrame = requestAnimationFrame(step)
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
    precise?: boolean
  } = {},
): void => {
  if (options.precise) {
    const startY = window.scrollY
    const rootStyle = document.documentElement.style
    const prevBehavior = rootStyle.scrollBehavior
    rootStyle.scrollBehavior = 'auto'
    element.scrollIntoView({ block: 'start', behavior: 'instant' })
    const targetY = window.scrollY
    window.scrollTo(0, startY)
    rootStyle.scrollBehavior = prevBehavior
    smoothScrollTo(targetY, { ...options, offset: 0 })
    return
  }
  const offset = options.offset ?? getElementScrollOffset(element)
  const targetY = window.scrollY + element.getBoundingClientRect().top
  smoothScrollTo(targetY, { ...options, offset })
}

export const cancelSmoothScroll = (): void => {
  if (activeScrollFrame !== null) {
    cancelAnimationFrame(activeScrollFrame)
    activeScrollFrame = null
  }
}
