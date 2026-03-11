import type { Currency, SaasMetricsSnapshot } from '../../admin/types'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  Flame,
  Gauge,
  HeartPulse,
  Percent,
  ShieldAlert,
  ShieldCheck,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import { BarChart } from '@/components/charts/bar-chart'
import { ChartCard } from '@/components/charts/chart-card'
import { LineChart } from '@/components/charts/line-chart'
import { InfoTooltip } from '@/components/info-tooltip'
import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usePagination } from '@/hooks/use-pagination'

import { cn } from '@/lib/utils'
import { useSaasMetrics } from '../../admin/hooks/use-saas-metrics'

function formatCurrency(amount: number, currency: Currency = 'USD') {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatPct(value: number) {
  return `${value.toFixed(1)}%`
}

function formatMonths(value: number) {
  return `${value.toFixed(1)}`
}

function MetricCard({
  label,
  value,
  tooltip,
  icon: Icon,
  iconColor,
  trend,
  trendLabel,
  subtitle,
}: {
  label: string
  value: string
  tooltip: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  subtitle?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-1 text-sm font-medium">
          {label}
          <InfoTooltip content={tooltip} />
        </CardTitle>
        <Icon className={cn('size-4', iconColor)} />
      </CardHeader>
      <CardContent>
        <p className="text-lg font-bold sm:text-2xl">{value}</p>
        {trend && trendLabel && (
          <div className="mt-1 flex items-center gap-1">
            {trend === 'up' && <ArrowUpRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
            {trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-600 dark:text-red-400" />}
            <span className={cn(
              'text-xs',
              trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground',
            )}>
              {trendLabel}
            </span>
          </div>
        )}
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

function HealthBadge({ score, t }: { score: 'excellent' | 'good' | 'attention' | 'critical'; t: (key: string) => string }) {
  const config = {
    excellent: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10', icon: ShieldCheck },
    good: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', icon: HeartPulse },
    attention: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10', icon: TrendingDown },
    critical: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-500/10', icon: ShieldAlert },
  }[score]

  return (
    <Badge variant="outline" className={cn('gap-1 border-transparent px-2.5 py-1', config.bg, config.color)}>
      <config.icon className="h-4 w-4" />
      {t(`finance.health.${score}`)}
    </Badge>
  )
}

function computeHealthScore(snapshot: SaasMetricsSnapshot): 'excellent' | 'good' | 'attention' | 'critical' {
  let score = 0
  if (snapshot.ltvCacRatio >= 3) 
score += 2
  else if (snapshot.ltvCacRatio >= 2) 
score += 1
  if (snapshot.nrrPct >= 110) 
score += 2
  else if (snapshot.nrrPct >= 100) 
score += 1
  if (snapshot.grossMarginPct >= 70) 
score += 2
  else if (snapshot.grossMarginPct >= 50) 
score += 1
  if (snapshot.churnRatePct <= 3) 
score += 2
  else if (snapshot.churnRatePct <= 5) 
score += 1
  if (snapshot.quickRatio >= 4) 
score += 2
  else if (snapshot.quickRatio >= 2) 
score += 1

  if (score >= 8) 
return 'excellent'
  if (score >= 5) 
return 'good'
  if (score >= 3) 
return 'attention'
  return 'critical'
}

function computeTrend(current: number, previous: number | undefined): { trend: 'up' | 'down' | 'neutral'; label: string } {
  if (previous === undefined) 
return { trend: 'neutral', label: '' }
  const diff = current - previous
  const pct = previous !== 0 ? ((diff / Math.abs(previous)) * 100).toFixed(1) : '0.0'
  if (diff > 0) 
return { trend: 'up', label: `+${pct}%` }
  if (diff < 0) 
return { trend: 'down', label: `${pct}%` }
  return { trend: 'neutral', label: '0%' }
}

export function FinanceSaasMetricsTab({ currency = 'USD' }: { currency?: Currency }) {
  const { t } = useTranslation('admin')
  const { data: snapshots, isLoading } = useSaasMetrics()

  const currencySnapshots = useMemo(
    () => (snapshots ?? []).filter((s) => s.currency === currency),
    [snapshots, currency],
  )

  const latest = currencySnapshots[currencySnapshots.length - 1]
  const previous = currencySnapshots.length >= 2 ? currencySnapshots[currencySnapshots.length - 2] : undefined

  const revenueChartData = useMemo(() => currencySnapshots.map((s) => ({
    month: s.month,
    grossRevenue: s.grossRevenue,
    netRevenue: s.netRevenue,
    netIncome: s.netIncome,
  })), [currencySnapshots])

  const customerChartData = useMemo(() => currencySnapshots.map((s) => ({
    month: s.month,
    totalCustomers: s.totalCustomers,
    newCustomers: s.newCustomers,
    churnedCustomers: s.churnedCustomers,
  })), [currencySnapshots])

  const unitEconomicsChartData = useMemo(() => currencySnapshots.map((s) => ({
    month: s.month,
    ltv: s.ltv,
    cac: s.cac,
    arpu: s.arpu,
  })), [currencySnapshots])

  const marginChartData = useMemo(() => currencySnapshots.map((s) => ({
    month: s.month,
    grossMargin: s.grossMarginPct,
    nrr: s.nrrPct,
  })), [currencySnapshots])

  const pagination = usePagination(currencySnapshots, 6)

  const revenueSeries = useMemo(() => [
    { key: 'grossRevenue', label: t('saasMetrics.grossRevenue'), color: 'var(--chart-1)' },
    { key: 'netRevenue', label: t('saasMetrics.netRevenue'), color: 'var(--chart-2)' },
    { key: 'netIncome', label: t('saasMetrics.netIncome'), color: 'var(--chart-3)' },
  ], [t])

  const customerSeries = useMemo(() => [
    { key: 'newCustomers', label: t('saasMetrics.newCustomers'), color: 'var(--chart-2)' },
    { key: 'churnedCustomers', label: t('saasMetrics.churnedCustomers'), color: 'var(--chart-5)' },
  ], [t])

  const unitEconomicsSeries = useMemo(() => [
    { key: 'ltv', label: 'LTV', color: 'var(--chart-1)' },
    { key: 'cac', label: 'CAC', color: 'var(--chart-5)' },
  ], [])

  const marginSeries = useMemo(() => [
    { key: 'grossMargin', label: t('saasMetrics.grossMargin'), color: 'var(--chart-2)' },
    { key: 'nrr', label: 'NRR', color: 'var(--chart-3)' },
  ], [t])

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 md:h-80" />
          <Skeleton className="h-64 md:h-80" />
        </div>
      </div>
    )
  }

  if (!latest) {
    return <EmptyState icon={BarChart3} title={t('saasMetrics.noData')} description={t('saasMetrics.noDataDescription')} />
  }

  const health = computeHealthScore(latest)
  const revTrend = computeTrend(latest.grossRevenue, previous?.grossRevenue)
  const customerTrend = computeTrend(latest.totalCustomers, previous?.totalCustomers)
  const ltvTrend = computeTrend(latest.ltv, previous?.ltv)
  const cacTrend = computeTrend(latest.cac, previous?.cac)
  const churnTrend = computeTrend(latest.churnRatePct, previous?.churnRatePct)
  const nrrTrend = computeTrend(latest.nrrPct, previous?.nrrPct)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Health Overview */}
      <Card className={cn(
        'border-l-4',
        health === 'excellent' ? 'border-l-emerald-500'
          : health === 'good' ? 'border-l-emerald-400'
            : health === 'attention' ? 'border-l-amber-500'
              : 'border-l-red-500',
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <HeartPulse className="h-5 w-5" />
              {t('saasMetrics.businessHealth')}
              <InfoTooltip content={t('saasMetrics.businessHealthTooltip')} />
            </CardTitle>
            <HealthBadge score={health} t={t} />
          </div>
          <CardDescription>{t('saasMetrics.businessHealthDesc')}</CardDescription>
        </CardHeader>
      </Card>

      {/* Primary KPIs - Revenue & Growth */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {t('saasMetrics.section.revenueGrowth')}
        </h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <MetricCard
            label={t('saasMetrics.grossRevenue')}
            value={formatCurrency(latest.grossRevenue, currency)}
            tooltip={t('saasMetrics.tooltips.grossRevenue')}
            icon={DollarSign}
            iconColor="text-emerald-600 dark:text-emerald-400"
            trend={revTrend.trend}
            trendLabel={revTrend.label}
          />
          <MetricCard
            label={t('saasMetrics.netIncome')}
            value={formatCurrency(latest.netIncome, currency)}
            tooltip={t('saasMetrics.tooltips.netIncome')}
            icon={TrendingUp}
            iconColor={latest.netIncome >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}
          />
          <MetricCard
            label={t('saasMetrics.grossMargin')}
            value={formatPct(latest.grossMarginPct)}
            tooltip={t('saasMetrics.tooltips.grossMargin')}
            icon={Percent}
            iconColor="text-primary"
            subtitle={t('saasMetrics.benchmarks.grossMargin')}
          />
          <MetricCard
            label="NRR"
            value={formatPct(latest.nrrPct)}
            tooltip={t('saasMetrics.tooltips.nrr')}
            icon={Activity}
            iconColor="text-primary"
            trend={nrrTrend.trend}
            trendLabel={nrrTrend.label}
            subtitle={t('saasMetrics.benchmarks.nrr')}
          />
        </div>
      </div>

      {/* Unit Economics */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {t('saasMetrics.section.unitEconomics')}
        </h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <MetricCard
            label="LTV"
            value={formatCurrency(latest.ltv, currency)}
            tooltip={t('saasMetrics.tooltips.ltv')}
            icon={Target}
            iconColor="text-primary"
            trend={ltvTrend.trend}
            trendLabel={ltvTrend.label}
          />
          <MetricCard
            label="CAC"
            value={formatCurrency(latest.cac, currency)}
            tooltip={t('saasMetrics.tooltips.cac')}
            icon={Zap}
            iconColor="text-amber-600 dark:text-amber-400"
            trend={cacTrend.trend === 'up' ? 'down' : cacTrend.trend === 'down' ? 'up' : 'neutral'}
            trendLabel={cacTrend.label}
          />
          <MetricCard
            label="LTV/CAC"
            value={`${latest.ltvCacRatio.toFixed(1)}x`}
            tooltip={t('saasMetrics.tooltips.ltvCac')}
            icon={Gauge}
            iconColor={latest.ltvCacRatio >= 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}
            subtitle={t('saasMetrics.benchmarks.ltvCac')}
          />
          <MetricCard
            label={t('saasMetrics.payback')}
            value={`${formatMonths(latest.paybackMonths)} ${t('saasMetrics.monthsUnit')}`}
            tooltip={t('saasMetrics.tooltips.payback')}
            icon={Timer}
            iconColor="text-primary"
            subtitle={t('saasMetrics.benchmarks.payback')}
          />
        </div>
      </div>

      {/* Customer Metrics */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {t('saasMetrics.section.customers')}
        </h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <MetricCard
            label={t('saasMetrics.totalCustomers')}
            value={latest.totalCustomers.toLocaleString()}
            tooltip={t('saasMetrics.tooltips.totalCustomers')}
            icon={Users}
            iconColor="text-primary"
            trend={customerTrend.trend}
            trendLabel={customerTrend.label}
          />
          <MetricCard
            label="ARPU"
            value={formatCurrency(latest.arpu, currency)}
            tooltip={t('saasMetrics.tooltips.arpu')}
            icon={DollarSign}
            iconColor="text-primary"
          />
          <MetricCard
            label={t('saasMetrics.churnRate')}
            value={formatPct(latest.churnRatePct)}
            tooltip={t('saasMetrics.tooltips.churnRate')}
            icon={UserMinus}
            iconColor="text-red-600 dark:text-red-400"
            trend={churnTrend.trend === 'up' ? 'down' : churnTrend.trend === 'down' ? 'up' : 'neutral'}
            trendLabel={churnTrend.label}
            subtitle={t('saasMetrics.benchmarks.churnRate')}
          />
          <MetricCard
            label="Quick Ratio"
            value={latest.quickRatio.toFixed(1)}
            tooltip={t('saasMetrics.tooltips.quickRatio')}
            icon={Zap}
            iconColor={latest.quickRatio >= 4 ? 'text-emerald-600 dark:text-emerald-400' : latest.quickRatio >= 2 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}
            subtitle={t('saasMetrics.benchmarks.quickRatio')}
          />
        </div>
      </div>

      {/* Cash & Runway */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {t('saasMetrics.section.cashRunway')}
        </h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <MetricCard
            label={t('saasMetrics.cashBalance')}
            value={formatCurrency(latest.cashBalance, currency)}
            tooltip={t('saasMetrics.tooltips.cashBalance')}
            icon={Wallet}
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
          <MetricCard
            label="Burn Rate"
            value={formatCurrency(latest.burnRate, currency)}
            tooltip={t('saasMetrics.tooltips.burnRate')}
            icon={Flame}
            iconColor="text-amber-600 dark:text-amber-400"
          />
          <MetricCard
            label="Runway"
            value={`${formatMonths(latest.runwayMonths)} ${t('saasMetrics.monthsUnit')}`}
            tooltip={t('saasMetrics.tooltips.runway')}
            icon={Timer}
            iconColor={latest.runwayMonths >= 18 ? 'text-emerald-600 dark:text-emerald-400' : latest.runwayMonths >= 12 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}
            subtitle={t('saasMetrics.benchmarks.runway')}
          />
          <MetricCard
            label={t('saasMetrics.trialToPaid')}
            value={formatPct(latest.trialToPaidRatePct)}
            tooltip={t('saasMetrics.tooltips.trialToPaid')}
            icon={UserPlus}
            iconColor="text-primary"
            subtitle={t('saasMetrics.benchmarks.trialToPaid')}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title={t('saasMetrics.charts.revenueTrend')} tooltip={t('saasMetrics.charts.revenueTrendTooltip')}>
          <BarChart
            data={revenueChartData}
            xKey="month"
            series={revenueSeries}
            formatValue={(v) => formatCurrency(v, currency)}
          />
        </ChartCard>
        <ChartCard title={t('saasMetrics.charts.customerGrowth')} tooltip={t('saasMetrics.charts.customerGrowthTooltip')}>
          <BarChart
            data={customerChartData}
            xKey="month"
            series={customerSeries}
            formatValue={(v) => v.toLocaleString()}
          />
        </ChartCard>
        <ChartCard title={t('saasMetrics.charts.unitEconomics')} tooltip={t('saasMetrics.charts.unitEconomicsTooltip')}>
          <LineChart
            data={unitEconomicsChartData}
            xKey="month"
            series={unitEconomicsSeries}
            formatValue={(v) => formatCurrency(v, currency)}
          />
        </ChartCard>
        <ChartCard title={t('saasMetrics.charts.marginNrr')} tooltip={t('saasMetrics.charts.marginNrrTooltip')}>
          <LineChart
            data={marginChartData}
            xKey="month"
            series={marginSeries}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
        </ChartCard>
      </div>

      {/* Historical Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t('saasMetrics.historicalTable')}</CardTitle>
          <CardDescription>{t('saasMetrics.historicalTableDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('saasMetrics.table.month')}</TableHead>
                  <TableHead className="text-right">{t('saasMetrics.grossRevenue')}</TableHead>
                  <TableHead className="text-right">{t('saasMetrics.grossMargin')}</TableHead>
                  <TableHead className="text-right">{t('saasMetrics.netIncome')}</TableHead>
                  <TableHead className="text-right">LTV</TableHead>
                  <TableHead className="text-right">CAC</TableHead>
                  <TableHead className="text-right">LTV/CAC</TableHead>
                  <TableHead className="text-right">NRR</TableHead>
                  <TableHead className="text-right">{t('saasMetrics.churnRate')}</TableHead>
                  <TableHead className="text-right">{t('saasMetrics.totalCustomers')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.paginatedItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                      {t('saasMetrics.noData')}
                    </TableCell>
                  </TableRow>
                )}
                {pagination.paginatedItems.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.month}</TableCell>
                    <TableCell className="text-right">{formatCurrency(s.grossRevenue, currency)}</TableCell>
                    <TableCell className="text-right">{formatPct(s.grossMarginPct)}</TableCell>
                    <TableCell className={cn('text-right', s.netIncome >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                      {formatCurrency(s.netIncome, currency)}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(s.ltv, currency)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(s.cac, currency)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={s.ltvCacRatio >= 3 ? 'default' : 'secondary'} className="text-xs">
                        {s.ltvCacRatio.toFixed(1)}x
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatPct(s.nrrPct)}</TableCell>
                    <TableCell className="text-right">{formatPct(s.churnRatePct)}</TableCell>
                    <TableCell className="text-right">{s.totalCustomers.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {pagination.paginatedItems.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">{t('saasMetrics.noData')}</p>
            )}
            {pagination.paginatedItems.map((s) => (
              <div key={s.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{s.month}</span>
                  <Badge variant={s.ltvCacRatio >= 3 ? 'default' : 'secondary'} className="text-xs">
                    LTV/CAC {s.ltvCacRatio.toFixed(1)}x
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('saasMetrics.grossRevenue')}</span>
                    <span className="font-medium font-mono">{formatCurrency(s.grossRevenue, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('saasMetrics.grossMargin')}</span>
                    <span className="font-medium font-mono">{formatPct(s.grossMarginPct)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('saasMetrics.netIncome')}</span>
                    <span className={cn('font-medium font-mono', s.netIncome >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                      {formatCurrency(s.netIncome, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NRR</span>
                    <span className="font-medium font-mono">{formatPct(s.nrrPct)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('saasMetrics.churnRate')}</span>
                    <span className="font-medium font-mono">{formatPct(s.churnRatePct)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('saasMetrics.totalCustomers')}</span>
                    <span className="font-medium font-mono">{s.totalCustomers.toLocaleString()}</span>
                  </div>
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

      {/* P&L Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t('saasMetrics.plBreakdown')}</CardTitle>
          <CardDescription>{t('saasMetrics.plBreakdownDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <PLRow label={t('saasMetrics.grossRevenue')} value={latest.grossRevenue} bold currency={currency} />
            <PLRow label={t('saasMetrics.cogs')} value={-latest.cogs} negative currency={currency} />
            <div className="border-t pt-2">
              <PLRow label={t('saasMetrics.grossProfit')} value={latest.grossProfit} bold currency={currency} />
            </div>
            <PLRow label={`  ${t('saasMetrics.rAndD')}`} value={-latest.rAndDCost} negative currency={currency} />
            <PLRow label={`  ${t('saasMetrics.salesMarketing')}`} value={-latest.salesMarketingCost} negative currency={currency} />
            <PLRow label={`  ${t('saasMetrics.generalAdmin')}`} value={-latest.generalAdminCost} negative currency={currency} />
            <PLRow label={t('saasMetrics.totalOpex')} value={-latest.totalOpex} negative currency={currency} />
            <div className="border-t pt-2">
              <PLRow label={t('saasMetrics.netIncome')} value={latest.netIncome} bold currency={currency} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PLRow({ label, value, bold, negative, currency = 'USD' }: { label: string; value: number; bold?: boolean; negative?: boolean; currency?: Currency }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn('text-sm', bold ? 'font-semibold' : 'text-muted-foreground')}>{label}</span>
      <span className={cn(
        'text-sm font-mono',
        bold && 'font-semibold',
        negative && value < 0 ? 'text-red-600 dark:text-red-400' : value > 0 ? 'text-emerald-600 dark:text-emerald-400' : '',
      )}>
        {negative && value < 0 ? '−' : ''}{formatCurrency(Math.abs(value), currency)}
      </span>
    </div>
  )
}
