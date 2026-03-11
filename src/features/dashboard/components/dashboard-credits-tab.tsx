import type { PlatformMetrics } from '../types'
import { Layers, ReceiptText, RefreshCcw, XCircle } from 'lucide-react'
import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import { ChartCard } from '@/components/charts/chart-card'
import { DonutChart } from '@/components/charts/donut-chart'

import { RadialChart } from '@/components/charts/radial-chart'
import { MetricCard } from './metric-card'

export function DashboardCreditsTab({ metrics }: { metrics: PlatformMetrics }) {
  const { t } = useTranslation('admin')

  const creditsByTypeData = useMemo(
    () =>
      Object.entries(metrics.credits.byType).map(([type, count]) => ({
        name: t(`creditTypes.${type}`, type),
        value: count,
      })),
    [metrics.credits.byType, t],
  )

  const utilizationRate = metrics.credits.totalCreditsIssued > 0
    ? (metrics.credits.totalCreditsUsed / metrics.credits.totalCreditsIssued) * 100
    : 0

  const wasteRate = metrics.credits.totalCreditsIssued > 0
    ? (metrics.credits.expiredCredits / metrics.credits.totalCreditsIssued) * 100
    : 0

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title={t('metrics.credits.totalIssued')}
          value={metrics.credits.totalCreditsIssued.toLocaleString()}
          icon={Layers}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          tooltip={t('tooltips.creditsIssued')}
          subtitle={t('dashboard.creditsHints.issuedDesc')}
        />
        <MetricCard
          title={t('metrics.credits.totalUsed')}
          value={metrics.credits.totalCreditsUsed.toLocaleString()}
          icon={Layers}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          tooltip={t('dashboard.creditsHints.usedTooltip')}
          subtitle={t('dashboard.creditsHints.usedDesc')}
        />
        <MetricCard
          title={t('metrics.credits.expired')}
          value={metrics.credits.expiredCredits.toLocaleString()}
          icon={XCircle}
          iconClassName="bg-red-500/10 text-red-600 dark:text-red-400"
          tooltip={t('dashboard.creditsHints.expiredTooltip')}
          subtitle={t('dashboard.creditsHints.expiredDesc')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          title={t('metrics.credits.transactionVolume')}
          value={`$${metrics.credits.transactionVolume.toLocaleString()}`}
          icon={ReceiptText}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          tooltip={t('dashboard.creditsHints.volumeTooltip')}
          subtitle={t('dashboard.creditsHints.volumeDesc')}
        />
        <MetricCard
          title={t('metrics.credits.refunds')}
          value={`$${metrics.credits.refunds.toLocaleString()}`}
          icon={RefreshCcw}
          iconClassName="bg-orange-500/10 text-orange-600 dark:text-orange-400"
          tooltip={t('dashboard.creditsHints.refundsTooltip')}
          subtitle={t('dashboard.creditsHints.refundsDesc')}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title={t('charts.creditsByType')}
          description={t('dashboard.chartDescriptions.creditsByType')}
          tooltip={t('dashboard.creditsHints.chartTooltip')}
        >
          <DonutChart data={creditsByTypeData} height={280} />
        </ChartCard>

        <ChartCard
          title={t('dashboard.creditsHints.utilizationTitle')}
          tooltip={t('dashboard.creditsHints.utilizationTooltip')}
        >
          <RadialChart
            value={utilizationRate}
            label={t('dashboard.creditsHints.utilizationLabel')}
            color="var(--chart-4)"
            height={280}
          />
        </ChartCard>

        <ChartCard
          title={t('dashboard.creditsHints.wasteTitle')}
          tooltip={t('dashboard.creditsHints.wasteTooltip')}
        >
          <RadialChart
            value={wasteRate}
            label={t('dashboard.creditsHints.wasteLabel')}
            color="var(--chart-5)"
            height={280}
          />
        </ChartCard>
      </div>
    </div>
  )
}
