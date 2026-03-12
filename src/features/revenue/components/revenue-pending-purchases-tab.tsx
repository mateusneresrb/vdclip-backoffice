import type { PendingPurchase } from '@/features/admin/types'
import { Ban, Clock, Search, Trash2 } from 'lucide-react'
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
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { cn } from '@/lib/utils'
import {
  useAdminPendingPurchases,
  useCancelPendingPurchase,
  useDismissPendingPurchase,
} from '../hooks/use-pending-purchases'

const statusColors: Record<PendingPurchase['status'], string> = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  claimed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  expired: 'bg-muted text-muted-foreground',
}

const providerColors: Record<string, string> = {
  paddle: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  woovi: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
}

function formatAmount(amount: string, currency: string) {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(Number.parseFloat(amount))
}

export function RevenuePendingPurchasesTab() {
  const { t } = useTranslation('admin')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [providerFilter, setProviderFilter] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 10

  const [dismissTarget, setDismissTarget] = useState<PendingPurchase | null>(null)
  const [cancelTarget, setCancelTarget] = useState<PendingPurchase | null>(null)

  const { data, isLoading } = useAdminPendingPurchases({
    page,
    perPage,
    status: statusFilter,
    provider: providerFilter,
    email: search || undefined,
  })

  const dismiss = useDismissPendingPurchase()
  const cancel = useCancelPendingPurchase()

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold sm:text-lg">{t('pendingPurchases.title')}</h3>
          {!isLoading && (
            <Badge variant="secondary" className="text-xs">
              {t('pendingPurchases.totalCount', { count: total })}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{t('pendingPurchases.description')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('pendingPurchases.searchPlaceholder')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 sm:w-64"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder={t('pendingPurchases.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('pendingPurchases.allStatuses')}</SelectItem>
            <SelectItem value="pending">{t('pendingPurchases.status.pending')}</SelectItem>
            <SelectItem value="claimed">{t('pendingPurchases.status.claimed')}</SelectItem>
            <SelectItem value="expired">{t('pendingPurchases.status.expired')}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={providerFilter}
          onValueChange={(v) => {
            setProviderFilter(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder={t('pendingPurchases.filterProvider')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('pendingPurchases.allProviders')}</SelectItem>
            <SelectItem value="paddle">Paddle</SelectItem>
            <SelectItem value="woovi">Woovi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : !items.length ? (
        <EmptyState
          icon={Clock}
          title={t('pendingPurchases.noResults')}
          description={t('pendingPurchases.noResultsHint')}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('pendingPurchases.columns.email')}</TableHead>
                  <TableHead>{t('pendingPurchases.columns.plan')}</TableHead>
                  <TableHead>{t('pendingPurchases.columns.provider')}</TableHead>
                  <TableHead>{t('pendingPurchases.columns.amount')}</TableHead>
                  <TableHead>{t('pendingPurchases.columns.status')}</TableHead>
                  <TableHead>{t('pendingPurchases.columns.created')}</TableHead>
                  <TableHead className="text-right">{t('pendingPurchases.columns.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-[200px] truncate font-medium">
                      {item.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="capitalize">{item.planTier}</span>
                        <span className="text-xs text-muted-foreground">
                          ({item.billingPeriod})
                        </span>
                        {item.isTrial && (
                          <Badge variant="outline" className="text-[10px]">
                            {t('pendingPurchases.trial')}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-[10px] capitalize', providerColors[item.provider])}
                      >
                        {item.provider}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium">
                      {formatAmount(item.amount, item.currency)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium',
                          statusColors[item.status],
                        )}
                      >
                        {t(`pendingPurchases.status.${item.status}`)}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <RowActions
                        item={item}
                        onDismiss={() => setDismissTarget(item)}
                        onCancel={() => setCancelTarget(item)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-col gap-3 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.email}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium',
                            statusColors[item.status],
                          )}
                        >
                          {t(`pendingPurchases.status.${item.status}`)}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn('text-[10px] capitalize', providerColors[item.provider])}
                        >
                          {item.provider}
                        </Badge>
                        {item.isTrial && (
                          <Badge variant="outline" className="text-[10px]">
                            {t('pendingPurchases.trial')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="whitespace-nowrap text-sm font-bold">
                        {formatAmount(item.amount, item.currency)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      <span className="capitalize">{item.planTier}</span>
                      {' '}({item.billingPeriod})
                    </span>
                    <RowActions
                      item={item}
                      onDismiss={() => setDismissTarget(item)}
                      onCancel={() => setCancelTarget(item)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {total > 0 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          totalItems={total}
          canPreviousPage={page > 1}
          canNextPage={page < totalPages}
          previousPage={() => setPage((p) => Math.max(p - 1, 1))}
          nextPage={() => setPage((p) => Math.min(p + 1, totalPages))}
          setPage={setPage}
        />
      )}

      {/* Dismiss confirmation */}
      <AlertDialog open={!!dismissTarget} onOpenChange={(v) => !v && setDismissTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('pendingPurchases.dismissDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('pendingPurchases.dismissDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('pendingPurchases.dismissDialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={dismiss.isPending}
              onClick={() => {
                if (dismissTarget) {
                  dismiss.mutate(dismissTarget.id, {
                    onSuccess: () => setDismissTarget(null),
                  })
                }
              }}
            >
              {t('pendingPurchases.dismissDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel on provider confirmation */}
      <AlertDialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('pendingPurchases.cancelDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('pendingPurchases.cancelDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('pendingPurchases.cancelDialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancel.isPending}
              onClick={() => {
                if (cancelTarget) {
                  cancel.mutate(cancelTarget.id, {
                    onSuccess: () => setCancelTarget(null),
                  })
                }
              }}
            >
              {t('pendingPurchases.cancelDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function RowActions({
  item,
  onDismiss,
  onCancel,
}: {
  item: PendingPurchase
  onDismiss: () => void
  onCancel: () => void
}) {
  const { t } = useTranslation('admin')

  if (item.status !== 'pending')
    return null

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        title={t('pendingPurchases.dismiss')}
        onClick={onDismiss}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {item.providerSubscriptionId && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          title={t('pendingPurchases.cancelOnProvider')}
          onClick={onCancel}
        >
          <Ban className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
