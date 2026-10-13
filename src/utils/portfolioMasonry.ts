/**
 * Estimate block-size for `.project-masonry--short-list` so column-fill: auto
 * places one same-ratio card per column when item count ≤ column count.
 */
export function getShortListMasonryHeight(options: {
  columnCount: number
  gapRem: string
  aspectRatio: string
  layout: 'overlay' | 'standard'
}): string {
  const [widthUnit, heightUnit] = options.aspectRatio.split('/').map((part) => parseFloat(part.trim()))
  const heightRatio = heightUnit / widthUnit
  const cols = Math.max(1, options.columnCount)
  const gap = options.gapRem
  const textBlock = options.layout === 'standard' ? ' + 9rem' : ''
  // Include bottom padding on `.project-masonry__item` so block-size fits one card per column.
  const itemGap = ` + ${gap}`

  return `calc(((min(100cqw, var(--grid-max-width)) - (${cols - 1} * ${gap})) / ${cols}) * ${heightRatio}${textBlock}${itemGap})`
}

export function shouldUseShortListMasonry(itemCount: number, columnCount: number): boolean {
  return itemCount > 0 && itemCount <= columnCount
}
