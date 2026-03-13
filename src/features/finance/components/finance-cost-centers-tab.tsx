import type { CostCenter } from '../types'
import { Plus, Search, Target } from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'
import { useCostCenters } from '../hooks/use-cost-centers'
import { CostCenterFormDialog } from './cost-center-form-dialog'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

function getBudgetUsageColor(percentage: number) {
  if (percentage > 90) 
return 'bg-red-500'
  if (percentage > 75) 
return 'bg-amber-500'
  return 'bg-emerald-500'
}

function getBudgetUsageTextColor(percentage: number) {
  if (percentage > 90) 
return 'text-red-600 dark:text-red-400'
  if (percentage > 75) 
return 'text-amber-600 dark:text-amber-400'
  return 'text-emerald-600 dark:text-emerald-400'
}

export function FinanceCostCentersTab() {
  const { t } = useTranslation('admin')
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCostCenter, setEditingCostCenter] = useState<CostCenter | undefined>()

  const { data: costCenters, isLoading } = useCostCenters(search, filterActive === 'active')

  const handleEdit = (costCenter: CostCenter) => {
    setEditingCostCenter(costCenter)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingCostCenter(undefined)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <p className="text-sm text-muted-foreground">{t('finance.tabDescriptions.costCenters')}</p>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('finance.costCenters.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={filterActive}
            onValueChange={(v) => setFilterActive(v as 'all' | 'active')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('finance.costCenters.allCostCenters')}
              </SelectItem>
              <SelectItem value="active">
                {t('finance.costCenters.activeCostCenters')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button size="sm" onClick={handleAdd}>
            <Plus className="mr-1 h-4 w-4" />
            {t('finance.costCenters.addCostCenter')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : !costCenters?.length ? (
        <EmptyState icon={Target} title={t('finance.costCenters.noResults')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {costCenters.map((cc) => {
            const hasBudget = cc.budget != null && cc.budget > 0
            const percentage = hasBudget ? (cc.spent / cc.budget!) * 100 : 0
            const clampedPercentage = Math.min(percentage, 100)

            return (
              <Card
                key={cc.id}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-muted/50',
                  !cc.isActive && 'opacity-60',
                )}
                onClick={() => handleEdit(cc)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{cc.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{cc.slug}</p>
                    </div>
                    {!cc.isActive && (
                      <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {t('status.inactive')}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cc.description && (
                    <p className="text-sm text-muted-foreground">{cc.description}</p>
                  )}

                  <div className="space-y-1.5">
                    {hasBudget ? (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {t('finance.costCenters.budgetUsage')}
                          </span>
                          <span className={cn('font-medium', getBudgetUsageTextColor(percentage))}>
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              getBudgetUsageColor(percentage),
                            )}
                            style={{ width: `${clampedPercentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {t('finance.costCenters.spent')}: {formatCurrency(cc.spent)}
                          </span>
                          <span>
                            {t('finance.costCenters.budget')}: {formatCurrency(cc.budget!)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        {t('finance.costCenters.spent')}: {formatCurrency(cc.spent)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <CostCenterFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        costCenter={editingCostCenter}
      />
    </div>
  )
}
