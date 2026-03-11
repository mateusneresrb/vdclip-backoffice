import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationControlsProps {
  page: number
  totalPages: number
  totalItems: number
  canPreviousPage: boolean
  canNextPage: boolean
  previousPage: () => void
  nextPage: () => void
  setPage?: (page: number) => void
  itemsLabel?: string
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) 
return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) 
return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) 
return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}

export function PaginationControls({
  page,
  totalPages,
  totalItems,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  setPage,
  itemsLabel,
}: PaginationControlsProps) {
  const { t } = useTranslation('common')

  if (totalPages <= 1) 
return null

  const pages = getPageNumbers(page, totalPages)

  return (
    <nav aria-label={t('pagination.page')} className="flex flex-col items-center gap-1.5 pt-3 sm:flex-row sm:justify-between">
      <span className="text-xs text-muted-foreground">
        {totalItems} {itemsLabel ?? t('pagination.items')} — {t('pagination.page')} {page}/{totalPages}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={!canPreviousPage}
          onClick={previousPage}
          aria-label={t('pagination.previous')}
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-xs text-muted-foreground">…</span>
          ) : (
            <Button
              key={p}
              variant="outline"
              size="icon"
              className={cn('size-8 text-xs', p === page && 'border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground')}
              onClick={() => setPage ? setPage(p) : (p < page ? previousPage() : nextPage())}
              aria-label={`${t('pagination.page')} ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={!canNextPage}
          onClick={nextPage}
          aria-label={t('pagination.next')}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  )
}
