import type { Currency, MetricsDateRange } from '../types'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  Landmark,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import { BarChart } from '@/components/charts/bar-chart'
import { ChartCard } from '@/components/charts/chart-card'
import { LineChart } from '@/components/charts/line-chart'
import { InfoTooltip } from '@/components/info-tooltip'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'
import { useAdminRevenue } from '../hooks/use-revenue'

function formatCurrency(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

function HealthBadge({ value, t }: { value: number; t: (key: string) => string }) {
  if (value > 0) {
    return (
      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
        <TrendingUp className="mr-1 h-3 w-3" />
        {t('revenue.healthPositive')}
      </Badge>
    )
  }
  if (value < 0) {
    return (
      <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400">
        <TrendingDown className="mr-1 h-3 w-3" />
        {t('revenue.healthNegative')}
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">
      {t('revenue.healthNeutral')}
    </Badge>
  )
}

function KpiCard({
  title,
  valueUsd,
  valueBrl,
  icon: Icon,
  iconColor,
  tooltip,
  description,
  positive,
  negative,
}: {
  title: string
  valueUsd: string
  valueBrl: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  tooltip?: string
  description?: string
  positive?: boolean
  negative?: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
          {title}
          {tooltip && <InfoTooltip content={tooltip} />}
        </CardTitle>
        <div className={cn('flex size-7 items-center justify-center rounded-lg sm:size-8', iconColor)}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <p className={cn(
          'text-lg font-bold sm:text-xl',
          positive && 'text-emerald-600 dark:text-emerald-400',
          negative && 'text-red-600 dark:text-red-400',
        )}>
          {valueUsd}
        </p>
        <p className={cn(
          'text-xs font-semibold sm:text-sm',
          positive && 'text-emerald-600/70 dark:text-emerald-400/70',
          negative && 'text-red-600/70 dark:text-red-400/70',
          !positive && !negative && 'text-muted-foreground',
        )}>
          {valueBrl}
        </p>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function RevenueSummaryTab({ dateRange }: { dateRange: MetricsDateRange }) {
  const { t } = useTranslation('admin')
  const { data: snapshots, isLoading } = useAdminRevenue(dateRange)

  const usdSnapshots = snapshots?.filter((s) => s.currency === 'USD') ?? []
  const brlSnapshots = snapshots?.filter((s) => s.currency === 'BRL') ?? []
  const latestUsd = usdSnapshots[0]
  const latestBrl = brlSnapshots[0]

  const totalIncome = useMemo(() => {
    const usd = latestUsd ? latestUsd.newMrr + latestUsd.expansionMrr + latestUsd.reactivationMrr + latestUsd.creditRevenue : 0
    const brl = latestBrl ? latestBrl.newMrr + latestBrl.expansionMrr + latestBrl.reactivationMrr + latestBrl.creditRevenue : 0
    return { usd, brl }
  }, [latestUsd, latestBrl])

  const totalExpense = useMemo(() => {
    const usd = latestUsd ? latestUsd.contractionMrr + latestUsd.churnedMrr : 0
    const brl = latestBrl ? latestBrl.contractionMrr + latestBrl.churnedMrr : 0
    return { usd, brl }
  }, [latestUsd, latestBrl])

  const netResult = useMemo(() => ({
    usd: totalIncome.usd - totalExpense.usd,
    brl: totalIncome.brl - totalExpense.brl,
  }), [totalIncome, totalExpense])

  const combinedMrrSeries = useMemo(
    () => [
      { key: 'mrrUsd', label: 'MRR (USD)', color: 'var(--chart-1)' },
      { key: 'mrrBrl', label: 'MRR (BRL)', color: 'var(--chart-3)' },
    ],
    [],
  )

  const incomeVsExpenseSeries = useMemo(
    () => [
      { key: 'usd', label: 'USD', color: 'var(--chart-1)' },
      { key: 'brl', label: 'BRL', color: 'var(--chart-3)' },
    ],
    [],
  )

  const combinedMrrData = useMemo(() => {
    const map = new Map<string, { date: string; mrrUsd: number; mrrBrl: number }>()
    for (const s of usdSnapshots) {
      map.set(s.snapshotDate, { date: s.snapshotDate, mrrUsd: s.mrr, mrrBrl: 0 })
    }
    for (const s of brlSnapshots) {
      const existing = map.get(s.snapshotDate)
      if (existing) {
        existing.mrrBrl = s.mrr
      } else {
        map.set(s.snapshotDate, { date: s.snapshotDate, mrrUsd: 0, mrrBrl: s.mrr })
      }
    }
    return Array.from(map.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((item) => ({
        ...item,
        date: new Date(`${item.date}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      }))
  }, [usdSnapshots, brlSnapshots])

  const incomeVsExpenseData = useMemo(() => {
    if (!latestUsd && !latestBrl) 
return []
    return [
      {
        name: t('revenue.income'),
        usd: latestUsd ? latestUsd.newMrr + latestUsd.expansionMrr + latestUsd.reactivationMrr + latestUsd.creditRevenue : 0,
        brl: latestBrl ? latestBrl.newMrr + latestBrl.expansionMrr + latestBrl.reactivationMrr + latestBrl.creditRevenue : 0,
      },
      {
        name: t('revenue.expense'),
        usd: latestUsd ? latestUsd.contractionMrr + latestUsd.churnedMrr : 0,
        brl: latestBrl ? latestBrl.contractionMrr + latestBrl.churnedMrr : 0,
      },
      {
        name: t('revenue.netResult'),
        usd: netResult.usd,
        brl: netResult.brl,
      },
    ]
  }, [latestUsd, latestBrl, netResult, t])

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    )
  }

  if (!latestUsd && !latestBrl) {
    return <EmptyState icon={BarChart3} title={t('revenue.noData')} description={t('revenue.noDataHint')} />
  }

  return (
    <div className="space-y-6">
      {/* Health Banner */}
      <Card className={cn(
        'border-l-4',
        netResult.usd + netResult.brl >= 0
          ? 'border-l-emerald-500'
          : 'border-l-red-500',
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="h-5 w-5" />
              {t('revenue.businessHealth')}
              <InfoTooltip content={t('tooltips.businessHealth')} />
            </CardTitle>
            <HealthBadge value={netResult.usd + netResult.brl} t={t} />
          </div>
          <CardDescription>{t('revenue.businessHealthDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t('revenue.totalIncome')}</p>
              <p className="text-base font-bold text-emerald-600 sm:text-lg dark:text-emerald-400">
                {formatCurrency(totalIncome.usd, 'USD')}
              </p>
              <p className="text-sm font-medium text-emerald-600/70 dark:text-emerald-400/70">
                {formatCurrency(totalIncome.brl, 'BRL')}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t('revenue.totalExpense')}</p>
              <p className="text-base font-bold text-red-600 sm:text-lg dark:text-red-400">
                {formatCurrency(totalExpense.usd, 'USD')}
              </p>
              <p className="text-sm font-medium text-red-600/70 dark:text-red-400/70">
                {formatCurrency(totalExpense.brl, 'BRL')}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{t('revenue.netResult')}</p>
              <p className={cn(
                'text-lg font-bold',
                netResult.usd >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
              )}>
                {netResult.usd >= 0 ? '+' : ''}{formatCurrency(netResult.usd, 'USD')}
              </p>
              <p className={cn(
                'text-sm font-medium',
                netResult.brl >= 0 ? 'text-emerald-600/70 dark:text-emerald-400/70' : 'text-red-600/70 dark:text-red-400/70',
              )}>
                {netResult.brl >= 0 ? '+' : ''}{formatCurrency(netResult.brl, 'BRL')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards - Grouped USD + BRL */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('revenue.incomeBreakdown')}</h4>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <KpiCard
            title={t('revenue.creditRevenue')}
            valueUsd={formatCurrency(latestUsd?.creditRevenue ?? 0, 'USD')}
            valueBrl={formatCurrency(latestBrl?.creditRevenue ?? 0, 'BRL')}
            icon={DollarSign}
            iconColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            tooltip={t('tooltips.creditRevenue')}
            description={t('revenue.creditRevenueDesc')}
            positive
          />
          <KpiCard
            title={t('revenue.newRevenue')}
            valueUsd={formatCurrency(latestUsd?.newMrr ?? 0, 'USD')}
            valueBrl={formatCurrency(latestBrl?.newMrr ?? 0, 'BRL')}
            icon={ArrowUpRight}
            iconColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            tooltip={t('tooltips.newMrr')}
            description={t('revenue.newRevenueDesc')}
            positive
          />
          <KpiCard
            title={t('revenue.expansionRevenue')}
            valueUsd={formatCurrency(latestUsd?.expansionMrr ?? 0, 'USD')}
            valueBrl={formatCurrency(latestBrl?.expansionMrr ?? 0, 'BRL')}
            icon={TrendingUp}
            iconColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            tooltip={t('tooltips.expansionMrr')}
            description={t('revenue.expansionRevenueDesc')}
            positive
          />
          <KpiCard
            title={t('revenue.investmentInflow')}
            valueUsd={formatCurrency(latestUsd?.reactivationMrr ?? 0, 'USD')}
            valueBrl={formatCurrency(latestBrl?.reactivationMrr ?? 0, 'BRL')}
            icon={Landmark}
            iconColor="bg-violet-500/10 text-violet-600 dark:text-violet-400"
            tooltip={t('tooltips.investmentInflow')}
            description={t('revenue.investmentInflowDesc')}
            positive
          />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('revenue.expenseBreakdown')}</h4>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
          <KpiCard
            title={t('revenue.contractionLoss')}
            valueUsd={formatCurrency(latestUsd?.contractionMrr ?? 0, 'USD')}
            valueBrl={formatCurrency(latestBrl?.contractionMrr ?? 0, 'BRL')}
            icon={ArrowDownRight}
            iconColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            tooltip={t('tooltips.contractionMrr')}
            description={t('revenue.contractionLossDesc')}
            negative
          />
          <KpiCard
            title={t('revenue.churnLoss')}
            valueUsd={formatCurrency(latestUsd?.churnedMrr ?? 0, 'USD')}
            valueBrl={formatCurrency(latestBrl?.churnedMrr ?? 0, 'BRL')}
            icon={TrendingDown}
            iconColor="bg-red-500/10 text-red-600 dark:text-red-400"
            tooltip={t('tooltips.churnedMrr')}
            description={t('revenue.churnLossDesc')}
            negative
          />
          <KpiCard
            title={t('revenue.activeSubs')}
            valueUsd={(latestUsd?.activeSubscriptionsCount ?? 0).toLocaleString('en-US')}
            valueBrl={(latestBrl?.activeSubscriptionsCount ?? 0).toLocaleString('pt-BR')}
            icon={TrendingUp}
            iconColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            tooltip={t('tooltips.activeSubs')}
            description={t('revenue.activeSubsDesc')}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {combinedMrrData.length > 1 && (
          <ChartCard
            title={t('revenue.mrrTrendCombined')}
            tooltip={t('tooltips.mrrTrendCombined')}
          >
            <LineChart
              data={combinedMrrData}
              xKey="date"
              series={combinedMrrSeries}
            />
          </ChartCard>
        )}

        {incomeVsExpenseData.length > 0 && (
          <ChartCard
            title={t('revenue.incomeVsExpense')}
            tooltip={t('tooltips.incomeVsExpense')}
          >
            <BarChart
              data={incomeVsExpenseData}
              xKey="name"
              series={incomeVsExpenseSeries}
            />
          </ChartCard>
        )}
      </div>
    </div>
  )
}
