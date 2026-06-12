type ListSortOrder = 'latest' | 'earliest';

export const PAGE_SIZE = {
  blog: 10,
  portfolio: 10,
} as const;

export const SORT_BY: { readonly blog: ListSortOrder; readonly portfolio: ListSortOrder } = {
  blog: 'latest',
  portfolio: 'latest',
} as const;