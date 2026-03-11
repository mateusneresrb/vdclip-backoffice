import type { CashFlowEntry, Currency } from '../types'
import {
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Plus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAdminCashFlow } from '../hooks/use-admin-cash-flow'

const categoryColors: Record<CashFlowEntry['category'], string> = {
  revenue: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  expense: 'bg-red-500/15 text-red-700 dark:text-red-400',
  refund: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
  tax: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  investment: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  other: 'bg-muted text-muted-foreground',
}

function formatCurrency(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function CashFlowManager() {
  const { t } = useTranslation('admin')
  const [currencyTab, setCurrencyTab] = useState<Currency>('USD')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { data: cashFlowData, isLoading } = useAdminCashFlow(currencyTab)

  const summary = cashFlowData

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {t('cashFlow.title')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('cashFlow.description')}
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              {t('cashFlow.addEntry')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('cashFlow.addEntryTitle')}</DialogTitle>
            </DialogHeader>
            <AddCashFlowForm
              currency={currencyTab}
              onClose={() => setShowAddDialog(false)}
              t={t}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={currencyTab} onValueChange={(v) => setCurrencyTab(v as Currency)}>
        <TabsList>
          <TabsTrigger value="USD">USD</TabsTrigger>
          <TabsTrigger value="BRL">BRL</TabsTrigger>
        </TabsList>

        <TabsContent value={currencyTab} className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-28" />
                ))}
              </div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            </div>
          ) : !summary ? (
            <p className="text-muted-foreground">{t('cashFlow.noData')}</p>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('cashFlow.totalInflow')}
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold sm:text-2xl text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(summary.totalInflow, currencyTab)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('cashFlow.totalOutflow')}
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold sm:text-2xl text-red-600 dark:text-red-400">
                      {formatCurrency(summary.totalOutflow, currencyTab)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('cashFlow.netFlow')}
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <p className={`text-lg font-bold sm:text-2xl ${summary.netFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(summary.netFlow, currencyTab)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('cashFlow.entries')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!summary.entries.length ? (
                    <p className="text-sm text-muted-foreground">{t('cashFlow.noEntries')}</p>
                  ) : (
                    <div className="space-y-2">
                      {summary.entries.map((entry) => {
                        const isInflow = entry.type === 'inflow'
                        return (
                          <div
                            key={entry.id}
                            className="flex items-center justify-between rounded-md border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${isInflow ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                {isInflow
                                  ? <ArrowDownLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                  : <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                                }
                              </div>
                              <div>
                                <p className="text-sm font-medium">{entry.description}</p>
                                <div className="flex items-center gap-1.5">
                                  <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${categoryColors[entry.category]}`}>
                                    {t(`cashFlow.categories.${entry.category}`)}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {new Date(entry.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className={`text-sm font-bold ${isInflow ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                              {isInflow ? '+' : '-'}{formatCurrency(entry.amount, currencyTab)}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AddCashFlowForm({
  currency,
  onClose,
  t,
}: {
  currency: Currency
  onClose: () => void
  t: (key: string) => string
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('cashFlow.form.description')}</Label>
        <Input placeholder={t('cashFlow.form.descriptionPlaceholder')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('cashFlow.form.amount')}</Label>
          <Input type="number" placeholder="0.00" min="0" step="0.01" />
        </div>
        <div className="space-y-2">
          <Label>{t('cashFlow.form.currency')}</Label>
          <Input value={currency} disabled />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('cashFlow.form.type')}</Label>
          <Select defaultValue="inflow">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inflow">{t('cashFlow.form.inflow')}</SelectItem>
              <SelectItem value="outflow">{t('cashFlow.form.outflow')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t('cashFlow.form.category')}</Label>
          <Select defaultValue="revenue">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">{t('cashFlow.categories.revenue')}</SelectItem>
              <SelectItem value="expense">{t('cashFlow.categories.expense')}</SelectItem>
              <SelectItem value="refund">{t('cashFlow.categories.refund')}</SelectItem>
              <SelectItem value="tax">{t('cashFlow.categories.tax')}</SelectItem>
              <SelectItem value="other">{t('cashFlow.categories.other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('cashFlow.form.date')}</Label>
        <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          {t('cashFlow.form.cancel')}
        </Button>
        <Button onClick={onClose}>
          {t('cashFlow.form.save')}
        </Button>
      </div>
    </div>
  )
}
