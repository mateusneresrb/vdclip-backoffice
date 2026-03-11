import type { CashFlowEntry, Currency } from '../types'
import type { MetricsDateRange } from '@/features/admin/types'
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  DollarSign,
  Flame,
  HeartPulse,
  Percent,
  Plus,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart } from '@/components/charts/bar-chart'
import { ChartCard } from '@/components/charts/chart-card'
import { InfoTooltip } from '@/components/info-tooltip'
import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { DateRangeFilter } from '@/features/dashboard/components/date-range-filter'
import { usePagination } from '@/hooks/use-pagination'

import { cn } from '@/lib/utils'
import { useAdminCashFlow } from '../hooks/use-cash-flow'

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

function AddCashFlowForm({
  onClose,
  t,
}: {
  onClose: () => void
  t: (key: string) => string
}) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [type, setType] = useState<'inflow' | 'outflow'>('inflow')
  const [category, setCategory] = useState('revenue')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  function handleSave() {
    const newErrors: Record<string, boolean> = {}
    if (!description.trim()) 
newErrors.description = true
    if (!amount || Number(amount) <= 0) 
newErrors.amount = true
    if (!date) 
newErrors.date = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // TODO: call mutation
    onClose()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cf-description">{t('cashFlow.form.description')}</Label>
        <Input
          id="cf-description"
          placeholder={t('cashFlow.form.descriptionPlaceholder')}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            if (errors.description) 
setErrors((prev) => ({ ...prev, description: false }))
          }}
          className={cn(errors.description && 'border-destructive')}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{t('cashFlow.form.requiredField')}</p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cf-amount">{t('cashFlow.form.amount')}</Label>
          <Input
            id="cf-amount"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              if (errors.amount) 
setErrors((prev) => ({ ...prev, amount: false }))
            }}
            className={cn(errors.amount && 'border-destructive')}
          />
          {errors.amount && (
            <p className="text-xs text-destructive">{t('cashFlow.form.invalidAmount')}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t('cashFlow.form.currency')}</Label>
          <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="BRL">BRL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('cashFlow.form.type')}</Label>
          <Select value={type} onValueChange={(v) => setType(v as 'inflow' | 'outflow')}>
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
          <div className="flex items-center gap-1.5">
            <Label>{t('cashFlow.form.category')}</Label>
            {category === 'revenue' && (
              <InfoTooltip content={t('finance.kpiTooltips.revenueCategory')} />
            )}
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">{t('cashFlow.categories.revenue')}</SelectItem>
              <SelectItem value="expense">{t('cashFlow.categories.expense')}</SelectItem>
              <SelectItem value="investment">{t('cashFlow.categories.investment')}</SelectItem>
              <SelectItem value="refund">{t('cashFlow.categories.refund')}</SelectItem>
              <SelectItem value="tax">{t('cashFlow.categories.tax')}</SelectItem>
              <SelectItem value="other">{t('cashFlow.categories.other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cf-date">{t('cashFlow.form.date')}</Label>
        <Input
          id="cf-date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            if (errors.date) 
setErrors((prev) => ({ ...prev, date: false }))
          }}
          className={cn(errors.date && 'border-destructive')}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>
          {t('cashFlow.form.cancel')}
        </Button>
        <Button onClick={handleSave}>
          {t('cashFlow.form.save')}
        </Button>
      </div>
    </div>
  )
}

type CategoryFilter = CashFlowEntry['category'] | 'all'

function HealthIndicator({ ratio, t }: { ratio: number; t: (key: string) => string }) {
  let color: string
  let bgColor: string
  let label: string
  let icon: React.ReactNode

  if (ratio >= 20) {
    color = 'text-emerald-700 dark:text-emerald-400'
    bgColor = 'bg-emerald-500/10'
    label = t('finance.health.excellent')
    icon = <ShieldCheck className="h-4 w-4" />
  } else if (ratio >= 5) {
    color = 'text-emerald-600 dark:text-emerald-400'
    bgColor = 'bg-emerald-500/10'
    label = t('finance.health.good')
    icon = <HeartPulse className="h-4 w-4" />
  } else if (ratio >= 0) {
    color = 'text-amber-700 dark:text-amber-400'
    bgColor = 'bg-amber-500/10'
    label = t('finance.health.attention')
    icon = <TrendingDown className="h-4 w-4" />
  } else {
    color = 'text-red-700 dark:text-red-400'
    bgColor = 'bg-red-500/10'
    label = t('finance.health.critical')
    icon = <ShieldAlert className="h-4 w-4" />
  }

  return (
    <Badge variant="outline" className={cn('gap-1 border-transparent px-2.5 py-1', bgColor, color)}>
      {icon}
      {label}
    </Badge>
  )
}

export function FinanceCashFlowTab() {
  const { t } = useTranslation('admin')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<MetricsDateRange>('30d')

  const { data: usdData, isLoading: loadingUsd } = useAdminCashFlow('USD')
  const { data: brlData, isLoading: loadingBrl } = useAdminCashFlow('BRL')
  const isLoading = loadingUsd || loadingBrl

  const allEntries = useMemo(() => {
    const entries: CashFlowEntry[] = []
    if (usdData?.entries) {
      for (const e of usdData.entries) entries.push(e)
    }
    if (brlData?.entries) {
      for (const e of brlData.entries) entries.push(e)
    }
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return entries
  }, [usdData, brlData])

  const filteredEntries = useMemo(() => {
    if (categoryFilter === 'all') 
return allEntries
    return allEntries.filter((e) => e.category === categoryFilter)
  }, [allEntries, categoryFilter])

  const pagination = usePagination(filteredEntries, 8)

  const operatingMarginUsd = useMemo(() => {
    if (!usdData || usdData.totalInflow === 0) 
return 0
    return (usdData.netFlow / usdData.totalInflow) * 100
  }, [usdData])

  const operatingMarginBrl = useMemo(() => {
    if (!brlData || brlData.totalInflow === 0) 
return 0
    return (brlData.netFlow / brlData.totalInflow) * 100
  }, [brlData])

  const burnRate = useMemo(() => {
    const usdBurn = usdData?.monthlyBreakdown.length
      ? usdData.monthlyBreakdown.reduce((sum, m) => sum + m.outflow, 0) / usdData.monthlyBreakdown.length
      : 0
    const brlBurn = brlData?.monthlyBreakdown.length
      ? brlData.monthlyBreakdown.reduce((sum, m) => sum + m.outflow, 0) / brlData.monthlyBreakdown.length
      : 0
    return { usd: usdBurn, brl: brlBurn }
  }, [usdData, brlData])

  const runway = useMemo(() => {
    const usdRunway = burnRate.usd > 0 && usdData ? Math.floor(usdData.netFlow / burnRate.usd) : null
    const brlRunway = burnRate.brl > 0 && brlData ? Math.floor(brlData.netFlow / burnRate.brl) : null
    return { usd: usdRunway, brl: brlRunway }
  }, [burnRate, usdData, brlData])

  const cashFlowSeriesUsd = useMemo(
    () => [
      { key: 'inflow', label: `${t('cashFlow.totalInflow')  } (USD)`, color: 'var(--chart-2)' },
      { key: 'outflow', label: `${t('cashFlow.totalOutflow')  } (USD)`, color: 'var(--chart-5)' },
    ],
    [t],
  )

  const cashFlowSeriesBrl = useMemo(
    () => [
      { key: 'inflow', label: `${t('cashFlow.totalInflow')  } (BRL)`, color: 'var(--chart-3)' },
      { key: 'outflow', label: `${t('cashFlow.totalOutflow')  } (BRL)`, color: 'var(--chart-5)' },
    ],
    [t],
  )

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with date filter and add button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t('finance.cashFlowDescription')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8.5 shrink-0 text-[13px] sm:h-9 sm:text-sm">
                <Plus className="mr-1 h-4 w-4" />
                {t('cashFlow.addEntry')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('cashFlow.addEntryTitle')}</DialogTitle>
                <DialogDescription>{t('cashFlow.addEntryDescription')}</DialogDescription>
              </DialogHeader>
              <AddCashFlowForm
                onClose={() => setShowAddDialog(false)}
                t={t}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      ) : !usdData && !brlData ? (
        <EmptyState icon={Wallet} title={t('cashFlow.noData')} />
      ) : (
        <div className="space-y-4 md:space-y-6">
          {/* Health Overview */}
          <Card className={cn(
            'border-l-4',
            operatingMarginUsd + operatingMarginBrl >= 20
              ? 'border-l-emerald-500'
              : operatingMarginUsd + operatingMarginBrl >= 5
                ? 'border-l-emerald-400'
                : operatingMarginUsd + operatingMarginBrl >= 0
                  ? 'border-l-amber-500'
                  : 'border-l-red-500',
          )}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <HeartPulse className="h-5 w-5" />
                  {t('finance.financialHealth')}
                  <InfoTooltip content={t('finance.financialHealthTooltip')} />
                </CardTitle>
                <HealthIndicator ratio={operatingMarginUsd + operatingMarginBrl} t={t} />
              </div>
              <CardDescription>{t('finance.financialHealthDesc')}</CardDescription>
            </CardHeader>
          </Card>

          {/* KPI Cards - Grouped */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-1 text-sm font-medium">
                  {t('cashFlow.totalInflow')}
                  <InfoTooltip content={t('finance.kpiTooltips.totalInflow')} />
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-emerald-600 sm:text-xl dark:text-emerald-400">
                  {formatCurrency(usdData?.totalInflow ?? 0, 'USD')}
                </p>
                <p className="text-sm font-medium text-emerald-600/70 dark:text-emerald-400/70">
                  {formatCurrency(brlData?.totalInflow ?? 0, 'BRL')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-1 text-sm font-medium">
                  {t('cashFlow.totalOutflow')}
                  <InfoTooltip content={t('finance.kpiTooltips.totalOutflow')} />
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-red-600 sm:text-xl dark:text-red-400">
                  {formatCurrency(usdData?.totalOutflow ?? 0, 'USD')}
                </p>
                <p className="text-sm font-medium text-red-600/70 dark:text-red-400/70">
                  {formatCurrency(brlData?.totalOutflow ?? 0, 'BRL')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-1 text-sm font-medium">
                  {t('cashFlow.netFlow')}
                  <InfoTooltip content={t('finance.kpiTooltips.netFlow')} />
                </CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className={cn(
                  'text-lg sm:text-xl font-bold',
                  (usdData?.netFlow ?? 0) >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400',
                )}>
                  {formatCurrency(usdData?.netFlow ?? 0, 'USD')}
                </p>
                <p className={cn(
                  'text-sm font-medium',
                  (brlData?.netFlow ?? 0) >= 0
                    ? 'text-emerald-600/70 dark:text-emerald-400/70'
                    : 'text-red-600/70 dark:text-red-400/70',
                )}>
                  {formatCurrency(brlData?.netFlow ?? 0, 'BRL')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-1 text-sm font-medium">
                  {t('finance.kpi.operatingMargin')}
                  <InfoTooltip content={t('finance.kpiTooltips.operatingMargin')} />
                </CardTitle>
                <Percent className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className={cn(
                  'text-lg sm:text-xl font-bold',
                  operatingMarginUsd >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400',
                )}>
                  {operatingMarginUsd.toFixed(1)}% (USD)
                </p>
                <p className={cn(
                  'text-sm font-medium',
                  operatingMarginBrl >= 0
                    ? 'text-emerald-600/70 dark:text-emerald-400/70'
                    : 'text-red-600/70 dark:text-red-400/70',
                )}>
                  {operatingMarginBrl.toFixed(1)}% (BRL)
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">{t('finance.kpiDescriptions.operatingMargin')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-1 text-sm font-medium">
                  {t('finance.kpi.burnRate')}
                  <InfoTooltip content={t('finance.kpiTooltips.burnRate')} />
                </CardTitle>
                <Flame className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-amber-600 sm:text-xl dark:text-amber-400">
                  {formatCurrency(burnRate.usd, 'USD')}
                </p>
                <p className="text-sm font-medium text-amber-600/70 dark:text-amber-400/70">
                  {formatCurrency(burnRate.brl, 'BRL')}
                </p>
                {(runway.usd !== null || runway.brl !== null) && (
                  <div className="mt-1 space-y-0.5">
                    {runway.usd !== null && (
                      <p className="text-[10px] text-muted-foreground">
                        {t('finance.runwayLabel')}: ~{runway.usd} {t('finance.months')} (USD)
                      </p>
                    )}
                    {runway.brl !== null && (
                      <p className="text-[10px] text-muted-foreground">
                        {t('finance.runwayLabel')}: ~{runway.brl} {t('finance.months')} (BRL)
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts Side by Side */}
          <div className="grid gap-4 md:grid-cols-2">
            {usdData && usdData.monthlyBreakdown.length > 0 && (
              <ChartCard
                title={`${t('cashFlow.monthlyBreakdown')  } (USD)`}
                tooltip={t('finance.chartTooltips.monthlyBreakdown')}
              >
                <BarChart
                  data={usdData.monthlyBreakdown}
                  xKey="month"
                  series={cashFlowSeriesUsd}
                  formatValue={(v) => formatCurrency(v, 'USD')}
                />
              </ChartCard>
            )}
            {brlData && brlData.monthlyBreakdown.length > 0 && (
              <ChartCard
                title={`${t('cashFlow.monthlyBreakdown')  } (BRL)`}
                tooltip={t('finance.chartTooltips.monthlyBreakdown')}
              >
                <BarChart
                  data={brlData.monthlyBreakdown}
                  xKey="month"
                  series={cashFlowSeriesBrl}
                  formatValue={(v) => formatCurrency(v, 'BRL')}
                />
              </ChartCard>
            )}
          </div>

          {/* Entries List */}
          <Card>
            <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
                  {t('cashFlow.entries')}
                  <InfoTooltip content={t('finance.entriesTooltip')} />
                </CardTitle>
                <CardDescription className="mt-1">{t('finance.entriesDescription')}</CardDescription>
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('cashFlow.allCategories')}</SelectItem>
                  <SelectItem value="revenue">{t('cashFlow.categories.revenue')}</SelectItem>
                  <SelectItem value="expense">{t('cashFlow.categories.expense')}</SelectItem>
                  <SelectItem value="investment">{t('cashFlow.categories.investment')}</SelectItem>
                  <SelectItem value="refund">{t('cashFlow.categories.refund')}</SelectItem>
                  <SelectItem value="tax">{t('cashFlow.categories.tax')}</SelectItem>
                  <SelectItem value="other">{t('cashFlow.categories.other')}</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {!filteredEntries.length ? (
                <p className="text-sm text-muted-foreground">{t('cashFlow.noEntries')}</p>
              ) : (
                <div className="space-y-2">
                  {pagination.paginatedItems.map((entry) => {
                    const isInflow = entry.type === 'inflow'
                    const entryCurrency = entry.currency
                    const isExpanded = expandedEntryId === entry.id
                    return (
                      <div
                        key={entry.id}
                        className={cn(
                          'rounded-md border transition-colors',
                          isExpanded ? 'bg-muted/30' : 'hover:bg-muted/20',
                        )}
                      >
                        <button
                          type="button"
                          className="flex w-full flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
                          onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                              isInflow ? 'bg-emerald-500/10' : 'bg-red-500/10',
                            )}>
                              {isInflow
                                ? <ArrowDownLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                : <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                              }
                            </div>
                            <div className="min-w-0 text-left">
                              <p className="truncate text-sm font-medium">{entry.description}</p>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className={cn(
                                  'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium',
                                  categoryColors[entry.category],
                                )}>
                                  {t(`cashFlow.categories.${entry.category}`)}
                                </span>
                                <Badge variant="outline" className="text-[10px]">
                                  {entryCurrency}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(entry.date).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <p className={cn(
                              'text-sm font-bold whitespace-nowrap',
                              isInflow
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400',
                            )}>
                              {isInflow ? '+' : '-'}{formatCurrency(entry.amount, entryCurrency)}
                            </p>
                            <ChevronDown className={cn(
                              'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                              isExpanded && 'rotate-180',
                            )} />
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="border-t px-3 py-2.5">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-3">
                              <div>
                                <span className="text-muted-foreground">{t('finance.cashFlowEntry.id')}</span>
                                <p className="font-mono text-muted-foreground/80">{entry.id.slice(0, 8)}...</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{t('finance.cashFlowEntry.createdAt')}</span>
                                <p>{new Date(entry.createdAt).toLocaleString('pt-BR')}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{t('cashFlow.form.category')}</span>
                                <p>{t(`cashFlow.categories.${entry.category}`)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <PaginationControls
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    canPreviousPage={pagination.canPreviousPage}
                    canNextPage={pagination.canNextPage}
                    previousPage={pagination.previousPage}
                    nextPage={pagination.nextPage}
                    setPage={pagination.setPage}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
