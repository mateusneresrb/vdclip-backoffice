import { useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  DollarSign,
  Film,
  Layers,
  ReceiptText,
  RefreshCcw,
  Send,
  TrendingDown,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

import { useAdminMetrics } from '../hooks/use-admin-metrics'
import type { MetricsDateRange, PlanProvider, UserPlan } from '../types'

const dateRangePresets: MetricsDateRange[] = ['1d', '7d', '30d', '90d', 'ytd', 'all']

const planColors: Record<UserPlan, string> = {
  free: 'bg-muted',
  lite: 'bg-blue-500/15',
  premium: 'bg-violet-500/15',
  ultimate: 'bg-amber-500/15',
}

const providerColors: Record<PlanProvider, string> = {
  paddle: 'bg-blue-500/15',
  pix: 'bg-emerald-500/15',
  internal: 'bg-muted',
}

export function MetricsOverview() {
  const { t } = useTranslation('admin')
  const [dateRange, setDateRange] = useState<MetricsDateRange>('30d')
  const [showCustom, setShowCustom] = useState(false)
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const { data: metrics, isLoading } = useAdminMetrics(dateRange)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-16" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="space-y-8">
      {/* Date Range Filter */}
      <div className="space-y-3">
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

        {showCustom && (
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">{t('metrics.dateRange.from')}</Label>
              <Input
                type="date"
                className="h-9 w-40"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('metrics.dateRange.to')}</Label>
              <Input
                type="date"
                className="h-9 w-40"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              disabled={!customFrom || !customTo}
              onClick={() => {
                setDateRange('custom' as MetricsDateRange)
              }}
            >
              {t('metrics.dateRange.apply')}
            </Button>
          </div>
        )}
      </div>

      {/* Revenue */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t('metrics.revenue.title')}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t('metrics.revenue.mrr')}
            value={`$${metrics.revenue.mrr.toLocaleString()}`}
            icon={DollarSign}
          />
          <MetricCard
            title={t('metrics.revenue.newMrr')}
            value={`$${metrics.revenue.newMrr.toLocaleString()}`}
            icon={ArrowUpRight}
          />
          <MetricCard
            title={t('metrics.revenue.expansionMrr')}
            value={`$${metrics.revenue.expansionMrr.toLocaleString()}`}
            icon={ArrowUpRight}
          />
          <MetricCard
            title={t('metrics.revenue.contractionMrr')}
            value={`$${metrics.revenue.contractionMrr.toLocaleString()}`}
            icon={ArrowDownRight}
          />
          <MetricCard
            title={t('metrics.revenue.churnedMrr')}
            value={`$${metrics.revenue.churnedMrr.toLocaleString()}`}
            icon={TrendingDown}
          />
          <MetricCard
            title={t('metrics.revenue.reactivationMrr')}
            value={`$${metrics.revenue.reactivationMrr.toLocaleString()}`}
            icon={RefreshCcw}
          />
          <MetricCard
            title={t('metrics.revenue.creditRevenue')}
            value={`$${metrics.revenue.creditRevenue.toLocaleString()}`}
            icon={CreditCard}
          />
          <MetricCard
            title={t('metrics.revenue.totalRevenue')}
            value={`$${metrics.revenue.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
          />
        </div>
      </section>

      {/* Subscriptions */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">
          {t('metrics.subscriptions.title')}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t('metrics.subscriptions.active')}
            value={metrics.subscriptions.activeSubscriptions.toLocaleString()}
            icon={Users}
          />
          <MetricCard
            title={t('metrics.subscriptions.new')}
            value={metrics.subscriptions.newSubscriptions.toLocaleString()}
            icon={UserPlus}
          />
          <MetricCard
            title={t('metrics.subscriptions.churned')}
            value={metrics.subscriptions.churnedSubscriptions.toLocaleString()}
            icon={TrendingDown}
          />
          <MetricCard
            title={t('metrics.subscriptions.churnRate')}
            value={`${metrics.subscriptions.churnRate}%`}
            icon={TrendingDown}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* By Plan */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {t('metrics.subscriptions.byPlan')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(
                  Object.entries(metrics.subscriptions.byPlan) as [
                    UserPlan,
                    number,
                  ][]
                ).map(([plan, count]) => (
                  <div
                    key={plan}
                    className={`flex items-center justify-between rounded-md p-2 ${planColors[plan]}`}
                  >
                    <span className="text-sm">{t(`plan.${plan}`)}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* By Provider */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {t('metrics.subscriptions.byProvider')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(
                  Object.entries(metrics.subscriptions.byProvider) as [
                    PlanProvider,
                    number,
                  ][]
                ).map(([provider, count]) => (
                  <div
                    key={provider}
                    className={`flex items-center justify-between rounded-md p-2 ${providerColors[provider]}`}
                  >
                    <span className="text-sm capitalize">{provider}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* By Billing Period */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {t('metrics.subscriptions.byBilling')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md bg-muted p-2">
                  <span className="text-sm">
                    {t('metrics.subscriptions.monthly')}
                  </span>
                  <span className="font-semibold">
                    {metrics.subscriptions.byBillingPeriod.monthly}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-muted p-2">
                  <span className="text-sm">
                    {t('metrics.subscriptions.yearly')}
                  </span>
                  <span className="font-semibold">
                    {metrics.subscriptions.byBillingPeriod.yearly}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Users */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t('metrics.users.title')}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t('metrics.users.total')}
            value={metrics.users.totalUsers.toLocaleString()}
            icon={Users}
            subtitle={t('metrics.users.totalHint')}
          />
          <MetricCard
            title={t('metrics.users.newInPeriod')}
            value={metrics.users.newUsersInPeriod.toLocaleString()}
            icon={UserPlus}
          />
          <MetricCard
            title={t('metrics.users.verifiedEmails')}
            value={metrics.users.verifiedEmails.toLocaleString()}
            icon={Users}
          />
          <MetricCard
            title={t('metrics.users.socialAccounts')}
            value={metrics.users.socialAccounts.toLocaleString()}
            icon={Users}
          />
        </div>
      </section>

      {/* Content */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t('metrics.content.title')}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title={t('metrics.content.totalProjects')}
            value={metrics.content.totalProjects.toLocaleString()}
            icon={Film}
          />
          <MetricCard
            title={t('metrics.content.completed')}
            value={metrics.content.completedProjects.toLocaleString()}
            icon={Film}
          />
          <MetricCard
            title={t('metrics.content.failed')}
            value={metrics.content.failedProjects.toLocaleString()}
            icon={XCircle}
          />
          <MetricCard
            title={t('metrics.content.scheduledPosts')}
            value={metrics.content.totalScheduledPosts.toLocaleString()}
            icon={Send}
          />
          <MetricCard
            title={t('metrics.content.published')}
            value={metrics.content.publishedPosts.toLocaleString()}
            icon={Send}
          />
          <MetricCard
            title={t('metrics.content.failedPosts')}
            value={metrics.content.failedPosts.toLocaleString()}
            icon={XCircle}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* By AI Type */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {t('metrics.content.byAiType')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(
                  Object.entries(metrics.content.byAiType) as [string, number][]
                ).map(([type, count]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between rounded-md bg-muted p-2"
                  >
                    <span className="text-sm">
                      {t(`metrics.content.${type}`)}
                    </span>
                    <span className="font-semibold">
                      {count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* By Provider */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {t('metrics.content.byProvider')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(metrics.content.byProvider).map(
                  ([provider, count]) => (
                    <div
                      key={provider}
                      className="flex items-center justify-between rounded-md bg-muted p-2"
                    >
                      <span className="text-sm capitalize">{provider}</span>
                      <span className="font-semibold">
                        {count.toLocaleString()}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Credits & Transactions */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t('metrics.credits.title')}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title={t('metrics.credits.totalIssued')}
            value={metrics.credits.totalCreditsIssued.toLocaleString()}
            icon={Layers}
          />
          <MetricCard
            title={t('metrics.credits.totalUsed')}
            value={metrics.credits.totalCreditsUsed.toLocaleString()}
            icon={Layers}
          />
          <MetricCard
            title={t('metrics.credits.expired')}
            value={metrics.credits.expiredCredits.toLocaleString()}
            icon={XCircle}
          />
          <MetricCard
            title={t('metrics.credits.transactionVolume')}
            value={`$${metrics.credits.transactionVolume.toLocaleString()}`}
            icon={ReceiptText}
          />
          <MetricCard
            title={t('metrics.credits.refunds')}
            value={`$${metrics.credits.refunds.toLocaleString()}`}
            icon={RefreshCcw}
          />
        </div>

        {/* By Credit Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('metrics.credits.byType')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {Object.entries(metrics.credits.byType).map(([type, count]) => (
                <div
                  key={type}
                  className="flex items-center justify-between rounded-md bg-muted p-2"
                >
                  <span className="text-sm">{t(`creditTypes.${type}`)}</span>
                  <span className="font-semibold">
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  subtitle?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
