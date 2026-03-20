import { Link } from '@tanstack/react-router'
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
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

const SAAS_HEALTH_THRESHOLDS = {
  runway: { good: 18, warn: 9 },
  churn: { good: 2, warn: 4 },
  ltvCac: { good: 3, warn: 1.5 },
  nrr: { good: 100, warn: 90 },
  customers: { good: 100, warn: 50 },
} as const

function formatCurrencyCompact(value: number, currency = 'USD') {
  return formatCurrency(value, currency, { maximumFractionDigits: 0 })
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
  linkTo?: string
}

function KpiCard({ label, value, subtitle, tooltip, icon: Icon, status = 'neutral', linkTo }: KpiCardProps) {
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
        {linkTo && (
          <Link
            to={linkTo as '/revenue'}
            search={{ tab: undefined }}
            className="mt-2 flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          >
            {t('dashboard.viewDetail')} <ArrowRight className="size-3" />
          </Link>
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
    latest.runwayMonths >= SAAS_HEALTH_THRESHOLDS.runway.good
      ? 'good'
      : latest.runwayMonths >= SAAS_HEALTH_THRESHOLDS.runway.warn
        ? 'warn'
        : 'bad'

  const churnStatus =
    latest.churnRatePct <= SAAS_HEALTH_THRESHOLDS.churn.good
      ? 'good'
      : latest.churnRatePct <= SAAS_HEALTH_THRESHOLDS.churn.warn
        ? 'warn'
        : 'bad'

  const ltvCacStatus =
    latest.ltvCacRatio >= SAAS_HEALTH_THRESHOLDS.ltvCac.good
      ? 'good'
      : latest.ltvCacRatio >= SAAS_HEALTH_THRESHOLDS.ltvCac.warn
        ? 'warn'
        : 'bad'

  const nrrStatus =
    latest.nrrPct >= SAAS_HEALTH_THRESHOLDS.nrr.good
      ? 'good'
      : latest.nrrPct >= SAAS_HEALTH_THRESHOLDS.nrr.warn
        ? 'warn'
        : 'bad'

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">{t('dashboard.financialKpis')}</p>
        <Badge variant="outline" className="text-xs">
          {new Date(latest.month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </Badge>
        <Link
          to="/revenue"
          search={{ tab: 'saas-metrics' }}
          className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {t('dashboard.viewAll')} <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <KpiCard
          label={t('saasMetrics.runway')}
          value={`${latest.runwayMonths}m`}
          subtitle={formatCurrencyCompact(latest.cashBalance, latest.currency)}
          tooltip={t('dashboard.kpiTooltips.runway')}
          icon={Wallet}
          status={runwayStatus}
          linkTo="/finance"
        />
        <KpiCard
          label={t('saasMetrics.mrr')}
          value={formatCurrencyCompact(latest.grossRevenue, latest.currency)}
          tooltip={t('dashboard.kpiTooltips.mrr')}
          subtitle={
            mrrChange !== null
              ? `${mrrChange >= 0 ? '+' : ''}${mrrChange.toFixed(1)}% ${t('dashboard.vsLastMonth')}`
              : undefined
          }
          icon={mrrChange !== null && mrrChange >= 0 ? TrendingUp : TrendingDown}
          status={mrrChange !== null && mrrChange >= 0 ? 'good' : 'warn'}
          linkTo="/revenue"
        />
        <KpiCard
          label={t('saasMetrics.ltvCac')}
          value={`${latest.ltvCacRatio.toFixed(1)  }x`}
          subtitle={`CAC ${formatCurrencyCompact(latest.cac, latest.currency)} · LTV ${formatCurrencyCompact(latest.ltv, latest.currency)}`}
          tooltip={t('dashboard.kpiTooltips.ltvCac')}
          icon={BarChart2}
          status={ltvCacStatus}
          linkTo="/revenue"
        />
        <KpiCard
          label={t('saasMetrics.churnRate')}
          value={formatPct(latest.churnRatePct)}
          subtitle={`${latest.churnedCustomers} ${t('dashboard.customers')}`}
          tooltip={t('dashboard.kpiTooltips.churn')}
          icon={TrendingDown}
          status={churnStatus}
          linkTo="/revenue"
        />
        <KpiCard
          label={t('saasMetrics.nrr')}
          value={formatPct(latest.nrrPct)}
          subtitle={t('dashboard.nrr')}
          tooltip={t('dashboard.kpiTooltips.nrr')}
          icon={Gauge}
          status={nrrStatus}
          linkTo="/revenue"
        />
        <KpiCard
          label={t('saasMetrics.activeCustomers')}
          value={latest.totalCustomers.toLocaleString('pt-BR')}
          subtitle={`+${latest.newCustomers} ${t('dashboard.new')}`}
          tooltip={t('dashboard.kpiTooltips.activeCustomers')}
          icon={Users}
          status="neutral"
          linkTo="/revenue"
        />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Zap className="size-3" />
        {t('dashboard.kpiClickable')}
      </div>
    </div>
  )
}
