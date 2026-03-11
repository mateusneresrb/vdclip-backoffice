import type { Currency, Receivable, ReceivableStatus } from '../types'
import {
  CalendarCheck,
  CheckCircle2,
  MessageSquare,
  Package,
  Search,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { usePagination } from '@/hooks/use-pagination'
import { showSuccessToast } from '@/lib/toast'

import { cn } from '@/lib/utils'
import { useReceivables } from '../hooks/use-receivables'
import { FinancialNotes } from './financial-notes'

function formatCurrency(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

const statusColors: Record<ReceivableStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  received: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  overdue: 'bg-red-500/15 text-red-700 dark:text-red-400',
  written_off: 'bg-muted text-muted-foreground',
  cancelled: 'bg-muted text-muted-foreground',
}

const statusFilters: Array<ReceivableStatus | 'all'> = [
  'all',
  'pending',
  'received',
  'overdue',
  'written_off',
  'cancelled',
]

export function FinanceReceivablesTab() {
  const { t } = useTranslation('admin')
  const { data: receivables, isLoading } = useReceivables()
  const [statusFilter, setStatusFilter] = useState<ReceivableStatus | 'all'>('all')
  const [confirmEntry, setConfirmEntry] = useState<Receivable | null>(null)
  const [receivedDate, setReceivedDate] = useState('')
  const [search, setSearch] = useState('')
  const [notesEntry, setNotesEntry] = useState<Receivable | null>(null)

  const filtered = useMemo(() => {
    if (!receivables) 
return []
    const byStatus = statusFilter === 'all' ? receivables : receivables.filter((r) => r.status === statusFilter)
    const q = search.trim().toLowerCase()
    if (!q) 
return byStatus
    return byStatus.filter(
      (r) =>
        r.description?.toLowerCase().includes(q) ||
        r.customerName?.toLowerCase().includes(q),
    )
  }, [receivables, statusFilter, search])

  const summaries = useMemo(() => {
    if (!receivables) 
return { pending: 0, received: 0, overdue: 0, cancelled: 0 }
    return {
      pending: receivables
        .filter((r) => r.status === 'pending')
        .reduce((sum, r) => sum + r.amount, 0),
      received: receivables
        .filter((r) => r.status === 'received')
        .reduce((sum, r) => sum + r.amount, 0),
      overdue: receivables
        .filter((r) => r.status === 'overdue')
        .reduce((sum, r) => sum + r.amount, 0),
      cancelled: receivables
        .filter((r) => r.status === 'cancelled')
        .reduce((sum, r) => sum + r.amount, 0),
    }
  }, [receivables])

  const pagination = usePagination(filtered, 10)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    )
  }

  function handleOpenConfirm(entry: Receivable) {
    setConfirmEntry(entry)
    setReceivedDate(new Date().toISOString().split('T')[0])
  }

  function handleConfirmReceived() {
    // TODO: API call to mark as received with receivedDate
    showSuccessToast({ title: t('toast.receivableMarked') })
    setConfirmEntry(null)
    setReceivedDate('')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t('finance.tabDescriptions.receivables')}
        </p>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 w-full pl-8 text-sm"
            placeholder={t('finance.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardDescription className="text-xs">{t('finance.receivables.totalPending')}</CardDescription>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <p className="text-base font-bold sm:text-lg text-amber-600 dark:text-amber-400">
              {formatCurrency(summaries.pending, 'BRL')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardDescription className="text-xs">{t('finance.receivables.totalReceived')}</CardDescription>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <p className="text-base font-bold sm:text-lg text-emerald-600 dark:text-emerald-400">
              {formatCurrency(summaries.received, 'BRL')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardDescription className="text-xs">{t('finance.receivables.totalOverdue')}</CardDescription>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <p className="text-base font-bold sm:text-lg text-red-600 dark:text-red-400">
              {formatCurrency(summaries.overdue, 'BRL')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardDescription className="text-xs">{t('finance.receivables.totalCancelled')}</CardDescription>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <p className="text-base font-bold sm:text-lg text-muted-foreground">
              {formatCurrency(summaries.cancelled, 'BRL')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-1.5">
        {statusFilters.map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setStatusFilter(status)}
          >
            {t(`finance.receivables.filter.${status}`)}
          </Button>
        ))}
      </div>

      {/* List */}
      {!filtered.length ? (
        <EmptyState
          icon={Package}
          title={t('finance.receivables.noResults')}
        />
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('finance.receivables.title')}
            </CardTitle>
            <CardDescription>
              {pagination.totalItems} {t('finance.receivables.entries')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pagination.paginatedItems.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="truncate text-sm font-medium">{entry.description}</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground">
                        {entry.customerName}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {t(`finance.receivables.sourceType.${entry.sourceType}`)}
                      </Badge>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium',
                          statusColors[entry.status],
                        )}
                      >
                        {t(`finance.receivables.status.${entry.status}`)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {t('finance.receivables.expectedDate')}: {entry.expectedDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <p className="whitespace-nowrap text-sm font-bold">
                      {formatCurrency(entry.amount, entry.currency)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground"
                      onClick={() => setNotesEntry(entry)}
                      title={t('finance.notes.title')}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    {(entry.status === 'pending' || entry.status === 'overdue') && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 shrink-0 gap-1 text-xs"
                        onClick={() => handleOpenConfirm(entry)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t('finance.receivables.markReceived')}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <PaginationControls
                page={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                canPreviousPage={pagination.canPreviousPage}
                canNextPage={pagination.canNextPage}
                previousPage={pagination.previousPage}
                nextPage={pagination.nextPage}
                setPage={pagination.setPage}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Sheet open={!!notesEntry} onOpenChange={(open) => { if (!open) 
setNotesEntry(null) }}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('finance.notes.title')} — {notesEntry?.description}</SheetTitle>
            <SheetDescription>{notesEntry?.customerName}</SheetDescription>
          </SheetHeader>
          {notesEntry && (
            <FinancialNotes
              entityType="receivable"
              entityId={notesEntry.id}
              className="px-4 pb-4"
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Confirm Received Dialog */}
      <Dialog open={!!confirmEntry} onOpenChange={() => setConfirmEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('finance.receivables.confirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('finance.receivables.confirmDescription', {
                description: confirmEntry?.description,
                customer: confirmEntry?.customerName,
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>{t('finance.receivables.receivedAt')}</Label>
            <Input
              type="date"
              value={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmEntry(null)}>
              {t('finance.form.cancel')}
            </Button>
            <Button onClick={handleConfirmReceived} disabled={!receivedDate}>
              <CalendarCheck className="mr-1 h-4 w-4" />
              {t('finance.receivables.confirmButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
