import type { Currency, MetricsDateRange, RevenueDailySnapshot } from '../types'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  DollarSign,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePagination } from '@/hooks/use-pagination'

import { cn } from '@/lib/utils'
import { useAdminRevenue } from '../hooks/use-admin-revenue'

const dateRangePresets: MetricsDateRange[] = ['1d', '3d', '7d', '30d', '90d', 'ytd']

function formatCurrency(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function RevenueOverview() {
  const { t } = useTranslation('admin')
  const [dateRange, setDateRange] = useState<MetricsDateRange>('30d')
  const [showCustom, setShowCustom] = useState(false)
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [currencyTab, setCurrencyTab] = useState<Currency>('USD')
  const { data: snapshots, isLoading } = useAdminRevenue(dateRange)

  const currencySnapshots = snapshots?.filter((s) => s.currency === currencyTab) ?? []

  const latestSnapshot = currencySnapshots[0]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {t('revenue.title')}
        </h1>
      </div>

      <Tabs value={currencyTab} onValueChange={(v) => setCurrencyTab(v as Currency)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="USD">USD</TabsTrigger>
            <TabsTrigger value="BRL">BRL</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2">
            {dateRangePresets.map((range) => (
              <Button
                key={range}
                variant={dateRange === range && !showCustom ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setDateRange(range)
                  setShowCustom(false)
                }}
              >
                {t(`metrics.dateRange.${range}`)}
              </Button>
            ))}
            <Button
              variant={showCustom ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowCustom(!showCustom)}
            >
              <CalendarDays className="mr-1 h-3.5 w-3.5" />
              {t('metrics.dateRange.custom')}
            </Button>
          </div>
        </div>

        {showCustom && (
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">{t('metrics.dateRange.from')}</Label>
              <Input
                type="date"
                className="h-9 w-full sm:w-40"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('metrics.dateRange.to')}</Label>
              <Input
                type="date"
                className="h-9 w-full sm:w-40"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              disabled={!customFrom || !customTo}
              onClick={() => setDateRange('custom' as MetricsDateRange)}
            >
              {t('metrics.dateRange.apply')}
            </Button>
          </div>
        )}

        <TabsContent value={currencyTab} className="mt-4">
          {!latestSnapshot ? (
            <EmptyState icon={BarChart3} title={t('revenue.noData')} />
          ) : (
            <DailyRevenueContent
              currencyTab={currencyTab}
              latestSnapshot={latestSnapshot}
              currencySnapshots={currencySnapshots}
              t={t}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DailyRevenueContent({
  currencyTab,
  latestSnapshot,
  currencySnapshots,
  t,
}: {
  currencyTab: Currency
  latestSnapshot: RevenueDailySnapshot
  currencySnapshots: RevenueDailySnapshot[]
  t: (key: string) => string
}) {
  const pagination = usePagination(currencySnapshots.slice(1), 10)

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <RevenueCard
          title="MRR"
          value={formatCurrency(latestSnapshot.mrr, currencyTab)}
          icon={DollarSign}
        />
        <RevenueCard
          title={t('revenue.newMrr')}
          value={formatCurrency(latestSnapshot.newMrr, currencyTab)}
          icon={ArrowUpRight}
          positive
        />
        <RevenueCard
          title={t('revenue.expansionMrr')}
          value={formatCurrency(latestSnapshot.expansionMrr, currencyTab)}
          icon={TrendingUp}
          positive
        />
        <RevenueCard
          title={t('revenue.contractionMrr')}
          value={formatCurrency(latestSnapshot.contractionMrr, currencyTab)}
          icon={ArrowDownRight}
          negative
        />
        <RevenueCard
          title={t('revenue.churnedMrr')}
          value={formatCurrency(latestSnapshot.churnedMrr, currencyTab)}
          icon={TrendingDown}
          negative
        />
        <RevenueCard
          title={t('revenue.reactivationMrr')}
          value={formatCurrency(latestSnapshot.reactivationMrr, currencyTab)}
          icon={RefreshCcw}
          positive
        />
        <RevenueCard
          title={t('revenue.creditRevenue')}
          value={formatCurrency(latestSnapshot.creditRevenue, currencyTab)}
          icon={DollarSign}
        />
        <RevenueCard
          title={t('revenue.activeSubs')}
          value={latestSnapshot.activeSubscriptionsCount.toLocaleString('pt-BR')}
          icon={TrendingUp}
        />
      </div>

      {currencySnapshots.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('revenue.dailyHistory')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {pagination.paginatedItems.map((snap) => (
                <div
                  key={snap.snapshotDate}
                  className="flex flex-col gap-1 rounded-md border p-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm font-medium">
                    {new Date(snap.snapshotDate).toLocaleDateString('pt-BR')}
                  </span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">MRR: {formatCurrency(snap.mrr, currencyTab)}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(snap.newMrr, currencyTab)}
                    </span>
                    <span className="text-red-600 dark:text-red-400">
                      -{formatCurrency(snap.churnedMrr, currencyTab)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <PaginationControls {...pagination} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function RevenueCard({
  title,
  value,
  icon: Icon,
  positive,
  negative,
}: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  positive?: boolean
  negative?: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className={cn(
          'text-lg font-bold sm:text-2xl',
          positive && 'text-emerald-600 dark:text-emerald-400',
          negative && 'text-red-600 dark:text-red-400',
        )}>
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
