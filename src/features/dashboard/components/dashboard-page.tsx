import type { MetricsDateRange } from '../types'
import {
  AlertCircle,
  Film,
  Layers,
} from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/shared/page-header'
import { Skeleton } from '@/components/ui/skeleton'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDashboardMetrics } from '../hooks/use-dashboard-metrics'
import { DashboardContentTab } from './dashboard-content-tab'
import { DashboardCreditsTab } from './dashboard-credits-tab'
import { DashboardSummaryTab } from './dashboard-summary-tab'
import { DashboardUsersTab } from './dashboard-users-tab'
import { DateRangeFilter } from './date-range-filter'
import { MetricsQuickPanel } from './metrics-quick-panel'

export function DashboardPage() {
  const { t } = useTranslation('admin')
  const [dateRange, setDateRange] = useState<MetricsDateRange>('30d')
  const { data: metrics, isLoading } = useDashboardMetrics(dateRange)

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={t('nav.dashboard')}
        description={t('dashboard.consolidatedDescription')}
      />

      <MetricsQuickPanel />

      <Tabs defaultValue="summary">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList aria-label={t('nav.dashboard')}>
            <TabsTrigger value="summary">
              {t('dashboard.tabs.summary')}
            </TabsTrigger>
            <TabsTrigger value="users">
              {t('dashboard.tabs.users')}
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-1.5">
              <Film className="h-4 w-4" />
              {t('dashboard.tabs.content')}
            </TabsTrigger>
            <TabsTrigger value="credits" className="gap-1.5">
              <Layers className="h-4 w-4" />
              {t('dashboard.tabs.credits')}
            </TabsTrigger>
          </TabsList>

          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>

        {isLoading ? (
          <>
            <TabsContent value="summary" className="mt-4">
              <div className="space-y-4">
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28" />
                  ))}
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-64" />
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="users" className="mt-4">
              <div className="space-y-4">
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28" />
                  ))}
                </div>
                <Skeleton className="h-64" />
              </div>
            </TabsContent>
            {['content', 'credits'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-28" />
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </>
        ) : !metrics ? (
          <>
            {['summary', 'users', 'content', 'credits'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center">
                  <AlertCircle className="size-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t('dashboard.noData')}</p>
                </div>
              </TabsContent>
            ))}
          </>
        ) : (
          <>
            <TabsContent value="summary" className="mt-4">
              <DashboardSummaryTab metrics={metrics} />
            </TabsContent>
            <TabsContent value="users" className="mt-4">
              <DashboardUsersTab metrics={metrics} />
            </TabsContent>
            <TabsContent value="content" className="mt-4">
              <DashboardContentTab metrics={metrics} />
            </TabsContent>
            <TabsContent value="credits" className="mt-4">
              <DashboardCreditsTab metrics={metrics} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
