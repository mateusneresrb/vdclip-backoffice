import { useMemo, useState } from 'react'

const DEFAULT_PAGE_SIZE = 10

export function usePagination<T>(items: T[], pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safeCurrentPage = Math.min(page, totalPages)

  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, safeCurrentPage, pageSize])

  return {
    page: safeCurrentPage,
    totalPages,
    totalItems: items.length,
    paginatedItems,
    setPage,
    canPreviousPage: safeCurrentPage > 1,
    canNextPage: safeCurrentPage < totalPages,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    previousPage: () => setPage((p) => Math.max(p - 1, 1)),
  }
}
