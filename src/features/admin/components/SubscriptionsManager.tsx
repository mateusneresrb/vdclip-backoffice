import type { Currency, SubscriptionStatus } from '../types'
import { CreditCard, Search } from 'lucide-react'
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
import { useAdminSubscriptions } from '../hooks/use-admin-subscriptions'

const statusColors: Record<SubscriptionStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  past_due: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  cancelled: 'bg-red-500/15 text-red-700 dark:text-red-400',
  expired: 'bg-muted text-muted-foreground',
}

function formatCurrency(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function SubscriptionsManager() {
  const { t } = useTranslation('admin')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currencyTab, setCurrencyTab] = useState<Currency>('USD')
  const { data: subscriptions, isLoading } = useAdminSubscriptions(search, statusFilter)

  const filtered = subscriptions?.filter(
    (s) => s.currency === currencyTab,
  ) ?? []

  const pagination = usePagination(filtered, 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {t('subscriptions.title')}
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
                placeholder={t('subscriptions.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 sm:w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder={t('subscriptions.filterStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('subscriptions.allStatuses')}</SelectItem>
                <SelectItem value="active">{t('subscriptions.statusActive')}</SelectItem>
                <SelectItem value="past_due">{t('subscriptions.statusPastDue')}</SelectItem>
                <SelectItem value="cancelled">{t('subscriptions.statusCancelled')}</SelectItem>
                <SelectItem value="expired">{t('subscriptions.statusExpired')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={currencyTab} className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : !filtered.length ? (
            <p className="text-muted-foreground">{t('subscriptions.noResults')}</p>
          ) : (
            <div className="space-y-3">
              {pagination.paginatedItems.map((sub) => (
                <Card key={sub.id}>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <CreditCard className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">
                          {sub.userName ?? sub.teamName ?? t('subscriptions.unknownUser')}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${statusColors[sub.status]}`}>
                            {t(`subscriptions.status${sub.status.charAt(0).toUpperCase() + sub.status.slice(1).replace('_', '')}`)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {t(`plan.${sub.planTier}`)}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {sub.provider}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {t(`subscriptions.${sub.billingPeriod}`)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {formatCurrency(sub.amount, sub.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        MRR: {formatCurrency(sub.mrr, sub.currency)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <PaginationControls {...pagination} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
