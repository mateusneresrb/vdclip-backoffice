import type { PlatformMetrics } from '../types'
import {
  CreditCard,
  DollarSign,
  Film,
  Layers,
  Users,
} from 'lucide-react'
import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import { AreaChart } from '@/components/charts/area-chart'
import { BarChart } from '@/components/charts/bar-chart'
import { ChartCard } from '@/components/charts/chart-card'
import { DonutChart } from '@/components/charts/donut-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { cn } from '@/lib/utils'
import { MetricCard } from './metric-card'

export function DashboardSummaryTab({ metrics }: { metrics: PlatformMetrics }) {
  const { t } = useTranslation('admin')

  const planChartData = useMemo(
    () =>
      Object.entries(metrics.subscriptions.byPlan).map(([plan, value]) => ({
        name: t(`plan.${plan}`),
        value,
      })),
    [metrics.subscriptions.byPlan, t],
  )

  const billingChartData = useMemo(
    () => [
      { name: t('dashboard.summaryHints.monthly'), value: metrics.subscriptions.byBillingPeriod.monthly },
      { name: t('dashboard.summaryHints.yearly'), value: metrics.subscriptions.byBillingPeriod.yearly },
    ],
    [metrics.subscriptions.byBillingPeriod, t],
  )

  const revenueSeries = useMemo(
    () => [
      { key: 'newMrr', label: t('charts.newMrr'), color: 'var(--chart-4)', stackId: 'positive' },
      { key: 'expansion', label: t('charts.expansion'), color: 'var(--chart-2)', stackId: 'positive' },
      { key: 'churn', label: t('charts.churn'), color: 'var(--chart-5)', stackId: 'negative' },
    ],
    [t],
  )

  const mrrMovements = useMemo(() => {
    const { revenue } = metrics
    return [
      { label: t('dashboard.summaryHints.mrrMovements.new'), value: revenue.newMrr, color: 'emerald' },
      { label: t('dashboard.summaryHints.mrrMovements.expansion'), value: revenue.expansionMrr, color: 'blue' },
      { label: t('dashboard.summaryHints.mrrMovements.reactivation'), value: revenue.reactivationMrr, color: 'violet' },
      { label: t('dashboard.summaryHints.mrrMovements.contraction'), value: -revenue.contractionMrr, color: 'amber' },
      { label: t('dashboard.summaryHints.mrrMovements.churn'), value: -revenue.churnedMrr, color: 'red' },
    ]
  }, [metrics, t])

  const netMrrChange = metrics.revenue.newMrr + metrics.revenue.expansionMrr + metrics.revenue.reactivationMrr
    - metrics.revenue.contractionMrr - metrics.revenue.churnedMrr

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <MetricCard
          title={t('metrics.revenue.mrr')}
          value={`$${metrics.revenue.mrr.toLocaleString()}`}
          icon={DollarSign}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          tooltip={t('tooltips.mrr')}
          subtitle={t('dashboard.summaryHints.mrr')}
        />
        <MetricCard
          title={t('metrics.revenue.totalRevenue')}
          value={`$${metrics.revenue.totalRevenue.toLocaleString()}`}
          icon={CreditCard}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          tooltip={t('tooltips.revenue')}
          subtitle={t('dashboard.summaryHints.totalRevenue')}
        />
        <MetricCard
          title={t('metrics.subscriptions.active')}
          value={metrics.subscriptions.activeSubscriptions.toLocaleString()}
          icon={Users}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          subtitle={t('dashboard.summaryHints.activeSubs')}
        />
        <MetricCard
          title={t('metrics.users.total')}
          value={metrics.users.totalUsers.toLocaleString()}
          icon={Users}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          tooltip={t('dashboard.summaryHints.totalUsersTooltip')}
          subtitle={t('metrics.users.totalHint')}
        />
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <MetricCard
          title={t('metrics.content.totalProjects')}
          value={metrics.content.totalProjects.toLocaleString()}
          icon={Film}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          tooltip={t('dashboard.summaryHints.contentTooltip')}
          subtitle={t('dashboard.summaryHints.contentDesc')}
        />
        <MetricCard
          title={t('metrics.content.completed')}
          value={metrics.content.completedProjects.toLocaleString()}
          icon={Film}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          subtitle={t('dashboard.summaryHints.completedDesc')}
        />
        <MetricCard
          title={t('metrics.credits.totalIssued')}
          value={metrics.credits.totalCreditsIssued.toLocaleString()}
          icon={Layers}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          tooltip={t('dashboard.summaryHints.creditsTooltip')}
          subtitle={t('dashboard.summaryHints.creditsDesc')}
        />
        <MetricCard
          title={t('metrics.credits.totalUsed')}
          value={metrics.credits.totalCreditsUsed.toLocaleString()}
          icon={Layers}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          subtitle={t('dashboard.summaryHints.usedDesc')}
        />
      </div>

      {/* MRR Movements Waterfall */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            <span>{t('dashboard.summaryHints.mrrMovementsTitle')}</span>
            <span className={cn(
              'text-base font-bold',
              netMrrChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
            )}>
              {netMrrChange >= 0 ? '+' : ''}${netMrrChange.toLocaleString()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {mrrMovements.map((item) => {
              const isPositive = item.value >= 0
              const colorMap: Record<string, string> = {
                emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
                blue: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
                violet: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20',
                amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
                red: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
              }
              return (
                <div
                  key={item.label}
                  className={cn('flex flex-1 min-w-[140px] flex-col gap-1 rounded-lg border p-3', colorMap[item.color])}
                >
                  <span className="text-xs font-medium opacity-80">{item.label}</span>
                  <span className="text-lg font-bold">
                    {isPositive ? '+' : ''}${Math.abs(item.value).toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title={t('charts.mrrTrend')}
          description={t('dashboard.chartDescriptions.mrrTrend')}
          tooltip={t('dashboard.chartTooltips.mrrTrend')}
        >
          <AreaChart
            data={metrics.mrrHistory}
            xKey="date"
            yKey="mrr"
            yLabel="MRR"
            colorIndex={0}
            formatValue={(v) => `$${v.toLocaleString()}`}
          />
        </ChartCard>

        <ChartCard
          title={t('charts.revenueComposition')}
          description={t('dashboard.chartDescriptions.revenueComposition')}
          tooltip={t('dashboard.chartTooltips.revenueComposition')}
        >
          <BarChart
            data={metrics.revenueComposition}
            xKey="date"
            series={revenueSeries}
            formatValue={(v) => `$${v.toLocaleString()}`}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title={t('charts.subscriptionsByPlan')}
          description={t('dashboard.chartDescriptions.subscriptionsByPlan')}
          tooltip={t('dashboard.chartTooltips.subscriptionsByPlan')}
        >
          <DonutChart data={planChartData} />
        </ChartCard>

        <ChartCard
          title={t('dashboard.summaryHints.billingPeriodTitle')}
          description={t('dashboard.summaryHints.billingPeriodDesc')}
        >
          <DonutChart data={billingChartData} />
        </ChartCard>
      </div>
    </div>
  )
}
