import config from '@config'

/**
 * Read pagination settings from config.yaml
 */
export const PAGE_SIZE = {
  blog: config.blog?.pagination?.pageSize ?? 10,
  portfolio: config.portfolio?.pagination?.pageSize ?? 10,
} as const

export const SORT_BY = {
  blog: config.blog?.pagination?.sortBy ?? ('latest' as const),
  portfolio: config.portfolio?.pagination?.sortBy ?? ('latest' as const),
} as const
