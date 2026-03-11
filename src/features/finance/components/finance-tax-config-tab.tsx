import type { TaxConfig } from '../types'
import { MoreVertical, Pencil, Plus, Scale, Trash2 } from 'lucide-react'
import { useState } from 'react'

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { usePagination } from '@/hooks/use-pagination'

import { cn } from '@/lib/utils'
import { useTaxConfig } from '../hooks/use-tax-config'
import { TaxConfigFormDialog } from './tax-config-form-dialog'

const taxTypeColors: Record<TaxConfig['type'], string> = {
  federal: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  state: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  municipal: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
}

const appliesToLabels: Record<string, string> = {
  revenue: 'finance.appliesTo.revenue',
  payroll: 'finance.appliesTo.payroll',
  services: 'finance.appliesTo.services',
  all: 'finance.appliesTo.all',
}

export function FinanceTaxConfigTab() {
  const { t } = useTranslation('admin')
  const { data: taxes, isLoading } = useTaxConfig()
  const [formOpen, setFormOpen] = useState(false)
  const [editTax, setEditTax] = useState<TaxConfig | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const pagination = usePagination(taxes ?? [], 10)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{t('finance.tabDescriptions.taxes')}</p>
        <Button size="sm" onClick={() => { setEditTax(undefined); setFormOpen(true) }}>
          <Plus className="mr-1 h-4 w-4" />
          {t('finance.addTax')}
        </Button>
      </div>

      {!taxes?.length ? (
        <EmptyState
          icon={Scale}
          title={t('finance.noTaxes')}
          action={{ label: t('finance.addTax'), onClick: () => setFormOpen(true) }}
        />
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('finance.taxConfiguration')}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop table */}
            <div className="hidden md:block">
              <div className="space-y-1">
                <div className="grid grid-cols-7 gap-2 border-b px-3 py-2 text-[11px] font-medium text-muted-foreground">
                  <span>{t('finance.taxTable.name')}</span>
                  <span>{t('finance.taxTable.code')}</span>
                  <span className="text-right">{t('finance.taxTable.rate')}</span>
                  <span>{t('finance.taxTable.type')}</span>
                  <span>{t('finance.taxTable.appliesTo')}</span>
                  <span className="text-right">{t('finance.taxTable.active')}</span>
                  <span></span>
                </div>
                {pagination.paginatedItems.map((tax) => (
                  <div key={tax.id} className="grid grid-cols-7 items-center gap-2 rounded-md px-3 py-2.5 hover:bg-muted/50">
                    <span className="text-sm font-medium">{tax.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{tax.code}</span>
                    <span className="text-right text-sm font-bold">{tax.rate}%</span>
                    <span className={cn('inline-flex w-fit items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium', taxTypeColors[tax.type])}>
                      {t(`finance.taxType.${tax.type}`)}
                    </span>
                    <Badge variant="outline" className="w-fit text-[10px]">
                      {t(appliesToLabels[tax.appliesTo])}
                    </Badge>
                    <div className="flex justify-end">
                      <Switch checked={tax.isActive} />
                    </div>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditTax(tax); setFormOpen(true) }}>
                            <Pencil className="mr-2 h-4 w-4" />{t('common.edit', { ns: 'common' })}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(tax.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />{t('common.delete', { ns: 'common' })}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 md:hidden">
              {pagination.paginatedItems.map((tax) => (
                <div key={tax.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{tax.name}</span>
                      <span className="text-sm font-bold text-primary">{tax.rate}%</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={cn('inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium', taxTypeColors[tax.type])}>
                        {t(`finance.taxType.${tax.type}`)}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {t(appliesToLabels[tax.appliesTo])}
                      </Badge>
                      <span className="font-mono text-[10px] text-muted-foreground">{tax.code}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={tax.isActive} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setEditTax(tax); setFormOpen(true) }}>
                          <Pencil className="mr-2 h-4 w-4" />{t('common.edit', { ns: 'common' })}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(tax.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />{t('common.delete', { ns: 'common' })}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
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
          </CardContent>
        </Card>
      )}

      <TaxConfigFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        tax={editTax}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('finance.deleteTaxTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('finance.deleteTaxDescription')}</AlertDialogDescription>
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
