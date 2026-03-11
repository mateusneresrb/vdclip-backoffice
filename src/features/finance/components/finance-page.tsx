import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  Banknote,
  Building2,
  Calculator,
  HandCoins,
  List,
  Receipt,
  Target,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/shared/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { FinanceBankAccountsTab } from './finance-bank-accounts-tab'
import { FinanceCashFlowTab } from './finance-cash-flow-tab'
import { FinanceChartOfAccountsTab } from './finance-chart-of-accounts-tab'
import { FinanceCostCentersTab } from './finance-cost-centers-tab'
import { FinanceCostEntriesTab } from './finance-cost-entries-tab'
import { FinanceReceivablesTab } from './finance-receivables-tab'
import { FinanceTaxConfigTab } from './finance-tax-config-tab'

const VALID_TABS = ['cash-flow', 'costs', 'chart-of-accounts', 'bank-accounts', 'taxes', 'cost-centers', 'receivables'] as const
type FinanceTab = typeof VALID_TABS[number]

export function FinancePage() {
  const { t } = useTranslation('admin')
  const { tab } = useSearch({ from: '/_app/finance' })
  const navigate = useNavigate()
  const activeTab: FinanceTab = VALID_TABS.includes(tab as FinanceTab) ? (tab as FinanceTab) : 'cash-flow'

  function handleTabChange(value: string) {
    navigate({ to: '/finance', search: { tab: value }, replace: true })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={t('finance.title')}
        description={t('finance.pageDescription')}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="-mb-px overflow-x-auto overflow-y-hidden">
        <TabsList className="w-max sm:w-auto">
          <TabsTrigger value="cash-flow" className="gap-1.5">
            <Banknote className="hidden h-4 w-4 sm:block" />
            {t('finance.tabs.cashFlow')}
          </TabsTrigger>
          <TabsTrigger value="costs" className="gap-1.5">
            <Receipt className="hidden h-4 w-4 sm:block" />
            {t('finance.tabs.costs')}
          </TabsTrigger>
          <TabsTrigger value="chart-of-accounts" className="gap-1.5">
            <List className="hidden h-4 w-4 sm:block" />
            {t('finance.tabs.chartOfAccounts')}
          </TabsTrigger>
          <TabsTrigger value="bank-accounts" className="gap-1.5">
            <Building2 className="hidden h-4 w-4 sm:block" />
            {t('finance.tabs.bankAccounts')}
          </TabsTrigger>
          <TabsTrigger value="taxes" className="gap-1.5">
            <Calculator className="hidden h-4 w-4 sm:block" />
            {t('finance.tabs.taxes')}
          </TabsTrigger>
          <TabsTrigger value="cost-centers" className="gap-1.5">
            <Target className="hidden h-4 w-4 sm:block" />
            {t('finance.tabs.costCenters')}
          </TabsTrigger>
          <TabsTrigger value="receivables" className="gap-1.5">
            <HandCoins className="hidden h-4 w-4 sm:block" />
            {t('finance.tabs.receivables')}
          </TabsTrigger>
        </TabsList>
        </div>

        <TabsContent value="cash-flow" className="mt-6">
          <FinanceCashFlowTab />
        </TabsContent>
        <TabsContent value="costs" className="mt-6">
          <FinanceCostEntriesTab />
        </TabsContent>
        <TabsContent value="chart-of-accounts" className="mt-6">
          <FinanceChartOfAccountsTab />
        </TabsContent>
        <TabsContent value="bank-accounts" className="mt-6">
          <FinanceBankAccountsTab />
        </TabsContent>
        <TabsContent value="taxes" className="mt-6">
          <FinanceTaxConfigTab />
        </TabsContent>
        <TabsContent value="cost-centers" className="mt-6">
          <FinanceCostCentersTab />
        </TabsContent>
        <TabsContent value="receivables" className="mt-6">
          <FinanceReceivablesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
