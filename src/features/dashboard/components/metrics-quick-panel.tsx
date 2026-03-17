import {
  ArrowRight,
  BarChart2,
  Gauge,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { InfoTooltip } from '@/components/info-tooltip'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSaasMetrics } from '@/features/admin/hooks/use-saas-metrics'
import { cn } from '@/lib/utils'

function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPct(value: number) {
  return `${value.toFixed(1)}%`
}

interface KpiCardProps {
  label: string
  value: string
  subtitle?: string
  tooltip?: string
  icon: React.ComponentType<{ className?: string }>
  status?: 'good' | 'warn' | 'bad' | 'neutral'
  href?: string
}

function KpiCard({ label, value, subtitle, tooltip, icon: Icon, status = 'neutral', href }: KpiCardProps) {
  const { t } = useTranslation('admin')
  const statusClass = {
    good: 'text-emerald-600 dark:text-emerald-400',
    warn: 'text-amber-600 dark:text-amber-400',
    bad: 'text-red-600 dark:text-red-400',
    neutral: 'text-foreground',
  }[status]

  const iconBg = {
    good: 'bg-emerald-500/10',
    warn: 'bg-amber-500/10',
    bad: 'bg-red-500/10',
    neutral: 'bg-muted',
  }[status]

  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          {label}
          {tooltip && <InfoTooltip content={tooltip} />}
        </CardTitle>
        <div className={cn('flex size-8 items-center justify-center rounded-lg', iconBg)}>
          <Icon className={cn('size-4', statusClass)} />
        </div>
      </CardHeader>
      <CardContent>
        <p className={cn('text-lg font-bold sm:text-2xl', statusClass)}>{value}</p>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        {href && (
          <a
            href={href}
            className="mt-2 flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          >
            {t('dashboard.viewDetail')} <ArrowRight className="size-3" />
          </a>
        )}
      </CardContent>
    </Card>
  )
}

export function MetricsQuickPanel() {
  const { t } = useTranslation('admin')
  const { data: snapshots, isLoading } = useSaasMetrics()

  const latest = useMemo(() => {
    if (!snapshots || snapshots.length === 0) 
return null
    return snapshots.reduce((a, b) => (a.month > b.month ? a : b))
  }, [snapshots])

  const previous = useMemo(() => {
    if (!snapshots || snapshots.length < 2) 
return null
    const sorted = [...snapshots].sort((a, b) => b.month.localeCompare(a.month))
    return sorted[1]
  }, [snapshots])

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    )
  }

  if (!latest) 
return null

  const mrrChange = previous
    ? ((latest.grossRevenue - previous.grossRevenue) / previous.grossRevenue) * 100
    : null

  const runwayStatus =
    latest.runwayMonths >= 18
      ? 'good'
      : latest.runwayMonths >= 9
        ? 'warn'
        : 'bad'

  const churnStatus =
    latest.churnRatePct <= 2
      ? 'good'
      : latest.churnRatePct <= 4
        ? 'warn'
        : 'bad'

  const ltvCacStatus =
    latest.ltvCacRatio >= 3
      ? 'good'
      : latest.ltvCacRatio >= 1.5
        ? 'warn'
        : 'bad'

  const nrrStatus =
    latest.nrrPct >= 100
      ? 'good'
      : latest.nrrPct >= 90
        ? 'warn'
        : 'bad'

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">{t('dashboard.financialKpis')}</p>
        <Badge variant="outline" className="text-xs">
          {new Date(latest.month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </Badge>
        <a
          href="/revenue?tab=saas-metrics"
          className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {t('dashboard.viewAll')} <ArrowRight className="size-3" />
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <KpiCard
          label={t('saasMetrics.runway')}
          value={`${latest.runwayMonths}m`}
          subtitle={formatCurrency(latest.cashBalance, latest.currency)}
          tooltip={t('dashboard.kpiTooltips.runway')}
          icon={Wallet}
          status={runwayStatus}
          href="/finance"
        />
        <KpiCard
          label={t('saasMetrics.mrr')}
          value={formatCurrency(latest.grossRevenue, latest.currency)}
          tooltip={t('dashboard.kpiTooltips.mrr')}
          subtitle={
            mrrChange !== null
              ? `${mrrChange >= 0 ? '+' : ''}${mrrChange.toFixed(1)}% ${t('dashboard.vsLastMonth')}`
              : undefined
          }
          icon={mrrChange !== null && mrrChange >= 0 ? TrendingUp : TrendingDown}
          status={mrrChange !== null && mrrChange >= 0 ? 'good' : 'warn'}
          href="/revenue"
        />
        <KpiCard
          label={t('saasMetrics.ltvCac')}
          value={`${latest.ltvCacRatio.toFixed(1)  }x`}
          subtitle={`CAC ${formatCurrency(latest.cac, latest.currency)} · LTV ${formatCurrency(latest.ltv, latest.currency)}`}
          tooltip={t('dashboard.kpiTooltips.ltvCac')}
          icon={BarChart2}
          status={ltvCacStatus}
          href="/revenue"
        />
        <KpiCard
          label={t('saasMetrics.churnRate')}
          value={formatPct(latest.churnRatePct)}
          subtitle={`${latest.churnedCustomers} ${t('dashboard.customers')}`}
          tooltip={t('dashboard.kpiTooltips.churn')}
          icon={TrendingDown}
          status={churnStatus}
          href="/revenue"
        />
        <KpiCard
          label={t('saasMetrics.nrr')}
          value={formatPct(latest.nrrPct)}
          subtitle={t('dashboard.nrr')}
          tooltip={t('dashboard.kpiTooltips.nrr')}
          icon={Gauge}
          status={nrrStatus}
          href="/revenue"
        />
        <KpiCard
          label={t('saasMetrics.activeCustomers')}
          value={latest.totalCustomers.toLocaleString('pt-BR')}
          subtitle={`+${latest.newCustomers} ${t('dashboard.new')}`}
          tooltip={t('dashboard.kpiTooltips.activeCustomers')}
          icon={Users}
          status="neutral"
          href="/revenue"
        />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Zap className="size-3" />
        {t('dashboard.kpiClickable')}
      </div>
    </div>
  )
}
