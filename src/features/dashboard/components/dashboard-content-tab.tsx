import type { PlatformMetrics } from '../types'
import { Film, Send, XCircle } from 'lucide-react'
import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import { ChartCard } from '@/components/charts/chart-card'
import { DonutChart } from '@/components/charts/donut-chart'

import { RadialChart } from '@/components/charts/radial-chart'
import { MetricCard } from './metric-card'

export function DashboardContentTab({ metrics }: { metrics: PlatformMetrics }) {
  const { t } = useTranslation('admin')

  const aiTypeData = useMemo(
    () =>
      Object.entries(metrics.content.byAiType).map(([type, count]) => ({
        name: t(`metrics.content.${type}`, type),
        value: count,
      })),
    [metrics.content.byAiType, t],
  )

  const providerData = useMemo(
    () =>
      Object.entries(metrics.content.byProvider).map(([provider, count]) => ({
        name: provider,
        value: count,
      })),
    [metrics.content.byProvider],
  )

  const successRate = metrics.content.totalProjects > 0
    ? (metrics.content.completedProjects / metrics.content.totalProjects) * 100
    : 0

  const publishRate = metrics.content.totalScheduledPosts > 0
    ? (metrics.content.publishedPosts / metrics.content.totalScheduledPosts) * 100
    : 0

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <MetricCard
          title={t('metrics.content.totalProjects')}
          value={metrics.content.totalProjects.toLocaleString()}
          icon={Film}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          tooltip={t('dashboard.contentHints.totalTooltip')}
          subtitle={t('dashboard.contentHints.totalDesc')}
        />
        <MetricCard
          title={t('metrics.content.completed')}
          value={metrics.content.completedProjects.toLocaleString()}
          icon={Film}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          tooltip={t('dashboard.contentHints.completedTooltip')}
          subtitle={t('dashboard.contentHints.completedDesc')}
        />
        <MetricCard
          title={t('metrics.content.failed')}
          value={metrics.content.failedProjects.toLocaleString()}
          icon={XCircle}
          iconClassName="bg-red-500/10 text-red-600 dark:text-red-400"
          tooltip={t('dashboard.contentHints.failedTooltip')}
          subtitle={t('dashboard.contentHints.failedDesc')}
        />
        <MetricCard
          title={t('metrics.content.scheduledPosts')}
          value={metrics.content.totalScheduledPosts.toLocaleString()}
          icon={Send}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          tooltip={t('dashboard.contentHints.scheduledTooltip')}
          subtitle={t('dashboard.contentHints.scheduledDesc')}
        />
        <MetricCard
          title={t('metrics.content.published')}
          value={metrics.content.publishedPosts.toLocaleString()}
          icon={Send}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          tooltip={t('dashboard.contentHints.publishedTooltip')}
          subtitle={t('dashboard.contentHints.publishedDesc')}
        />
        <MetricCard
          title={t('metrics.content.failedPosts')}
          value={metrics.content.failedPosts.toLocaleString()}
          icon={XCircle}
          iconClassName="bg-red-500/10 text-red-600 dark:text-red-400"
          tooltip={t('dashboard.contentHints.failedPostsTooltip')}
          subtitle={t('dashboard.contentHints.failedPostsDesc')}
        />
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <ChartCard
          title={t('metrics.content.byAiType')}
          description={t('dashboard.contentHints.byAiTypeDesc')}
          tooltip={t('dashboard.contentHints.byAiTypeTooltip')}
        >
          {aiTypeData.length > 0 ? (
            <DonutChart data={aiTypeData} height={260} />
          ) : (
            <p className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              {t('dashboard.contentHints.noBreakdownData')}
            </p>
          )}
        </ChartCard>

        <ChartCard
          title={t('metrics.content.byProvider')}
          description={t('dashboard.contentHints.byProviderDesc')}
          tooltip={t('dashboard.contentHints.byProviderTooltip')}
        >
          {providerData.length > 0 ? (
            <DonutChart data={providerData} height={260} />
          ) : (
            <p className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              {t('dashboard.contentHints.noBreakdownData')}
            </p>
          )}
        </ChartCard>

        <ChartCard
          title={t('dashboard.contentHints.successRateTitle')}
          tooltip={t('dashboard.contentHints.successRateTooltip')}
        >
          <RadialChart
            value={successRate}
            label={t('dashboard.contentHints.successRateLabel')}
            color="var(--chart-4)"
            height={260}
          />
        </ChartCard>

        <ChartCard
          title={t('dashboard.contentHints.publishRateTitle')}
          tooltip={t('dashboard.contentHints.publishRateTooltip')}
        >
          <RadialChart
            value={publishRate}
            label={t('dashboard.contentHints.publishRateLabel')}
            color="var(--chart-2)"
            height={260}
          />
        </ChartCard>
      </div>
    </div>
  )
}
