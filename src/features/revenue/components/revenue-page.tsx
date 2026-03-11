import type { Currency, MetricsDateRange } from '@/features/admin/types'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  BarChart3,
  CreditCard,
} from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DateRangeFilter } from '@/features/dashboard/components/date-range-filter'
import { FinanceSaasMetricsTab } from '@/features/finance/components/finance-saas-metrics-tab'

import { RevenueSummaryTab } from './revenue-summary-tab'
import { RevenueTransactionsTab } from './revenue-transactions-tab'

const VALID_TABS = ['saas-metrics', 'revenue', 'transactions'] as const
type RevenueTab = typeof VALID_TABS[number]

export function RevenuePage() {
  const { t } = useTranslation('admin')
  const { tab } = useSearch({ from: '/_app/revenue' })
  const navigate = useNavigate()
  const activeTab: RevenueTab = VALID_TABS.includes(tab as RevenueTab) ? (tab as RevenueTab) : 'saas-metrics'

  const [currency, setCurrency] = useState<Currency>('USD')
  const [dateRange, setDateRange] = useState<MetricsDateRange>('30d')

  function handleTabChange(value: string) {
    navigate({ to: '/revenue', search: { tab: value }, replace: true })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={t('revenue.title')}
        description={t('revenue.pageDescription')}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="-mb-px w-full overflow-x-auto overflow-y-hidden sm:w-auto">
            <TabsList className="w-max sm:w-auto">
              <TabsTrigger value="saas-metrics" className="gap-1.5">
                <BarChart3 className="h-4 w-4" />
                {t('dashboard.tabs.saasMetrics')}
              </TabsTrigger>
              <TabsTrigger value="revenue" className="gap-1.5">
                <CreditCard className="h-4 w-4" />
                {t('revenue.tabSummary')}
              </TabsTrigger>
              <TabsTrigger value="transactions" className="gap-1.5">
                <CreditCard className="h-4 w-4" />
                {t('revenue.tabTransactions')}
              </TabsTrigger>
            </TabsList>
          </div>

          {activeTab === 'saas-metrics' && (
            <div className="flex shrink-0 items-center rounded-md border bg-muted p-0.5">
              <Button
                variant={currency === 'USD' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setCurrency('USD')}
              >
                USD
              </Button>
              <Button
                variant={currency === 'BRL' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setCurrency('BRL')}
              >
                BRL
              </Button>
            </div>
          )}

          {activeTab === 'revenue' && (
            <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
          )}
        </div>

        <TabsContent value="saas-metrics" className="mt-6">
          <FinanceSaasMetricsTab currency={currency} />
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <RevenueSummaryTab dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <RevenueTransactionsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
