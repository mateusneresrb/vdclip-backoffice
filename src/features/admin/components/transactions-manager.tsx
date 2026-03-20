import type { Currency, TransactionStatus, TransactionType } from '../types'
import { ArrowDownLeft, ArrowUpRight, Receipt, Search } from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { PaginationControls } from '@/components/pagination-controls'
import { Badge } from '@/components/ui/badge'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { usePagination } from '@/hooks/use-pagination'
import { formatCurrency } from '@/lib/format'
import { useAdminTransactions } from '../hooks/use-admin-transactions'

const statusColors: Record<TransactionStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  processing: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  failed: 'bg-red-500/15 text-red-700 dark:text-red-400',
  refunded: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
}

const typeIcons: Record<TransactionType, React.ComponentType<{ className?: string }>> = {
  subscription_payment: ArrowDownLeft,
  credit_purchase: ArrowDownLeft,
  refund: ArrowUpRight,
}

export function TransactionsManager() {
  const { t } = useTranslation('admin')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [currencyTab, setCurrencyTab] = useState<Currency>('USD')
  const { data: transactions, isLoading } = useAdminTransactions(search, typeFilter)

  const filtered = transactions?.filter(
    (tx) => tx.currency === currencyTab,
  ) ?? []

  const pagination = usePagination(filtered, 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {t('transactions.title')}
        </h1>
      </div>

      <Tabs value={currencyTab} onValueChange={(v) => setCurrencyTab(v as Currency)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="USD">USD</TabsTrigger>
            <TabsTrigger value="BRL">BRL</TabsTrigger>
          </TabsList>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('transactions.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 sm:w-64"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder={t('transactions.filterType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('transactions.allTypes')}</SelectItem>
                <SelectItem value="subscription_payment">{t('transactions.typeSubscription')}</SelectItem>
                <SelectItem value="credit_purchase">{t('transactions.typeCredit')}</SelectItem>
                <SelectItem value="refund">{t('transactions.typeRefund')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={currencyTab} className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : !filtered.length ? (
            <p className="text-muted-foreground">{t('transactions.noResults')}</p>
          ) : (
            <div className="space-y-2">
              {pagination.paginatedItems.map((tx) => {
                const TypeIcon = typeIcons[tx.transactionType] ?? Receipt
                const isRefund = tx.transactionType === 'refund'

                return (
                  <Card key={tx.id}>
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${isRefund ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                          <TypeIcon className={`h-4 w-4 ${isRefund ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {tx.userName ?? tx.teamName ?? '-'}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${statusColors[tx.status]}`}>
                              {t(`transactions.status.${tx.status}`)}
                            </span>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {tx.provider}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {t(`transactions.type.${tx.transactionType}`)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isRefund ? 'text-red-600 dark:text-red-400' : ''}`}>
                          {isRefund ? '-' : '+'}{formatCurrency(tx.amount, tx.currency)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              <PaginationControls {...pagination} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
