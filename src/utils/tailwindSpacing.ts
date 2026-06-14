const spacingScale: Record<string, string> = {
  px: '1px',
  '0': '0',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '44': '11rem',
  '48': '12rem',
  '52': '13rem',
  '56': '14rem',
  '60': '15rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '96': '24rem',
}

export function resolveTailwindGapClass(gapClass: string, fallback = 'var(--space-m, 1.5rem)') {
  const arbitraryMatch = gapClass.match(/^gap-\[(.+)\]$/)

  if (arbitraryMatch?.[1]) {
    return arbitraryMatch[1].replaceAll('_', ' ')
  }

  const scaleKey = gapClass.match(/^gap-(.+)$/)?.[1]

  if (!scaleKey) {
    return fallback
  }

  // 1) 已知 Tailwind spacing scale
  if (spacingScale[scaleKey] !== undefined) {
    return spacingScale[scaleKey]
  }

  // 2) 纯数字 → 按 Tailwind 规则计算：1 = 0.25rem
  const numeric = Number(scaleKey)
  if (!Number.isNaN(numeric) && numeric >= 0) {
    return `${numeric * 0.25}rem`
  }

  // 3) 未知 token → fallback
  return fallback
}
