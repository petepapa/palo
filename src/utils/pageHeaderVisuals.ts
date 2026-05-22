export type TopNavigationTheme = '' | 'dark' | 'light'

interface PageHeaderVisualOptions {
  backgroundColor?: string
  backgroundImage?: string
  contentColor?: string
  topNavigationTheme?: string
}

const cssUrl = (value: string): string => `url("${value.replace(/"/g, '\\"')}")`

export const resolveTopNavigationTheme = (value = ''): TopNavigationTheme => {
  const normalizedValue = String(value).trim()
  return normalizedValue === 'dark' || normalizedValue === 'light' ? normalizedValue : ''
}

export const createPageHeaderVisuals = ({
  backgroundColor = '',
  backgroundImage = '',
  contentColor = '',
  topNavigationTheme = '',
}: PageHeaderVisualOptions): { resolvedTopNavigationTheme: TopNavigationTheme; style: string } => {
  const resolvedTopNavigationTheme = resolveTopNavigationTheme(topNavigationTheme)
  const effectiveBackgroundColor =
    backgroundColor ||
    (resolvedTopNavigationTheme === 'dark'
      ? 'var(--color-neutral-900)'
      : resolvedTopNavigationTheme === 'light'
        ? 'var(--color-neutral-100)'
        : '')
  const effectiveContentColor =
    contentColor ||
    (resolvedTopNavigationTheme === 'dark'
      ? 'var(--color-neutral-100)'
      : resolvedTopNavigationTheme === 'light'
        ? 'var(--color-neutral-900)'
        : '')

  const style = [
    effectiveBackgroundColor ? `--page-header-background-color: ${effectiveBackgroundColor}` : '',
    backgroundImage ? `--page-header-background-image: ${cssUrl(backgroundImage)}` : '',
    effectiveContentColor ? `--page-header-content-color: ${effectiveContentColor}` : '',
    resolvedTopNavigationTheme === 'light' ? `--page-header-button-bg: var(--color-neutral-100)` : '',
    resolvedTopNavigationTheme === 'light' ? `--page-header-button-text: var(--color-neutral-900)` : '',
    resolvedTopNavigationTheme === 'light' ? `--page-header-button-border: var(--color-neutral-900)` : '',
    resolvedTopNavigationTheme === 'dark' ? `--page-header-button-bg: var(--color-neutral-900)` : '',
    resolvedTopNavigationTheme === 'dark' ? `--page-header-button-text: var(--color-neutral-100)` : '',
    resolvedTopNavigationTheme === 'dark' ? `--page-header-button-border: var(--color-neutral-100)` : '',
  ]
    .filter(Boolean)
    .join('; ')

  return { resolvedTopNavigationTheme, style }
}
