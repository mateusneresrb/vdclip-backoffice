import type { CostEntry, CostEntryStatus, Currency } from '../types'
import { MessageSquare, MoreVertical, Package, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { usePagination } from '@/hooks/use-pagination'

import { cn } from '@/lib/utils'
import { useCostEntries } from '../hooks/use-cost-entries'
import { useFinancialCategories } from '../hooks/use-financial-categories'
import { CostEntryFormDialog } from './cost-entry-form-dialog'
import { FinancialNotes } from './financial-notes'

function formatCurrency(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

const statusColors: Record<CostEntryStatus, string> = {
  draft: 'bg-slate-500/15 text-slate-700 dark:text-slate-400',
  approved: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  paid: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  cancelled: 'bg-red-500/15 text-red-700 dark:text-red-400',
}

const frequencyLabels: Record<string, string> = {
  monthly: 'finance.frequency.monthly',
  quarterly: 'finance.frequency.quarterly',
  annual: 'finance.frequency.annual',
}

export function FinanceCostEntriesTab() {
  const { t } = useTranslation('admin')
  const { data: entries, isLoading } = useCostEntries()
  const { data: categories } = useFinancialCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<CostEntry | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [notesEntry, setNotesEntry] = useState<CostEntry | null>(null)

  const filtered = useMemo(() => {
    if (!entries) 
return []
    const q = search.trim().toLowerCase()
    if (!q) 
return entries
    return entries.filter(
      (e) =>
        e.description?.toLowerCase().includes(q) ||
        e.categoryName?.toLowerCase().includes(q) ||
        e.costCenterName?.toLowerCase().includes(q),
    )
  }, [entries, search])

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{t('finance.tabDescriptions.costs')}</p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-9 w-full sm:w-56 pl-8 text-sm"
              placeholder={t('finance.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={() => { setEditEntry(undefined); setFormOpen(true) }}>
            <Plus className="mr-1 h-4 w-4" />
            {t('finance.addCost')}
          </Button>
        </div>
      </div>

      {!entries?.length ? (
        <EmptyState
          icon={Package}
          title={t('finance.noCosts')}
          action={{ label: t('finance.addCost'), onClick: () => setFormOpen(true) }}
        />
      ) : !filtered.length ? (
        <EmptyState icon={Package} title={t('finance.noResults')} />
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('finance.costEntries')}</CardTitle>
            <CardDescription>{pagination.totalItems} {t('finance.costEntries').toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pagination.paginatedItems.map((entry) => (
                <div key={entry.id} className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="truncate text-sm font-medium">{entry.description}</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground">{entry.categoryName}</span>
                      <span className={cn('inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium', statusColors[entry.status])}>
                        {t(`finance.costStatus.${entry.status}`)}
                      </span>
                      {entry.isRecurring && entry.recurrenceInterval && (
                        <span className="text-[10px] text-muted-foreground">{t(frequencyLabels[entry.recurrenceInterval])}</span>
                      )}
                      {entry.costCenterName && (
                        <Badge variant="outline" className="text-[10px]">{entry.costCenterName}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <p className="whitespace-nowrap text-sm font-bold">{formatCurrency(entry.amount, entry.currency)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground"
                      onClick={() => setNotesEntry(entry)}
                      title={t('finance.notes.title')}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setEditEntry(entry); setFormOpen(true) }}>
                          <Pencil className="mr-2 h-4 w-4" />{t('common.edit', { ns: 'common' })}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(entry.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />{t('common.delete', { ns: 'common' })}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      <CostEntryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        entry={editEntry}
        categories={categories ?? []}
      />

      <Sheet open={!!notesEntry} onOpenChange={(open) => { if (!open) 
setNotesEntry(null) }}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('finance.notes.title')} — {notesEntry?.description}</SheetTitle>
            <SheetDescription>{t('finance.tabDescriptions.costs')}</SheetDescription>
          </SheetHeader>
          {notesEntry && (
            <FinancialNotes
              entityType="cost_entry"
              entityId={notesEntry.id}
              className="px-4 pb-4"
            />
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('finance.deleteCostTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('finance.deleteCostDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('finance.form.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => setDeleteId(null)}>{t('finance.confirmDelete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
