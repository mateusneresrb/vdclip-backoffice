import type { PlatformMetrics } from '../types'
import { UserPlus, Users } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import { AreaChart } from '@/components/charts/area-chart'

import { ChartCard } from '@/components/charts/chart-card'
import { MetricCard } from './metric-card'

export function DashboardUsersTab({ metrics }: { metrics: PlatformMetrics }) {
  const { t } = useTranslation('admin')

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <MetricCard
          title={t('metrics.users.total')}
          value={metrics.users.totalUsers.toLocaleString()}
          icon={Users}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          subtitle={t('metrics.users.totalHint')}
          tooltip={t('dashboard.usersHints.totalTooltip')}
        />
        <MetricCard
          title={t('metrics.users.newInPeriod')}
          value={metrics.users.newUsersInPeriod.toLocaleString()}
          icon={UserPlus}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          tooltip={t('dashboard.usersHints.newTooltip')}
          subtitle={t('dashboard.usersHints.newDesc')}
        />
        <MetricCard
          title={t('metrics.users.verifiedEmails')}
          value={metrics.users.verifiedEmails.toLocaleString()}
          icon={Users}
          iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          tooltip={t('tooltips.verifiedEmails')}
          subtitle={t('dashboard.usersHints.verifiedDesc')}
        />
        <MetricCard
          title={t('metrics.users.socialAccounts')}
          value={metrics.users.socialAccounts.toLocaleString()}
          icon={Users}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          tooltip={t('dashboard.usersHints.socialTooltip')}
          subtitle={t('dashboard.usersHints.socialDesc')}
        />
      </div>

      <ChartCard
        title={t('charts.userGrowth')}
        description={t('dashboard.chartDescriptions.userGrowth')}
        tooltip={t('dashboard.usersHints.growthChartTooltip')}
      >
        <AreaChart
          data={metrics.userGrowth}
          xKey="date"
          yKey="total"
          yLabel={t('charts.totalUsers')}
          colorIndex={1}
        />
      </ChartCard>
    </div>
  )
}
