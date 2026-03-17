import type { CostAllocation, CostEntry, CostEntryStatus, RecurrenceInterval } from '../types'

import type { Currency } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiCostEntry {
  id: string
  category_id: string
  category_name: string | null
  cost_center_id: string | null
  cost_center_name: string | null
  recurring_parent_id: string | null
  vendor: string
  description: string
  amount: string
  currency: string
  is_recurring: boolean
  recurrence_interval: string | null
  recurring_since: string | null
  recurring_until: string | null
  status: string
  billing_date: string
  due_date: string | null
  competence_month: string
  cost_allocation: string
  is_variable: boolean
  unit_metric: string | null
  unit_quantity: string | null
  unit_cost: string | null
  paid_at: string | null
  payment_method: string | null
  financial_transaction_id: string | null
  receipt_url: string | null
  notes: string | null
  created_by: string | null
  created_by_email: string | null
  created_at: string
  updated_at: string
}

const costEntryKeys = {
  all: ['cost-entries'] as const,
  list: (costCenter?: string) =>
    [...costEntryKeys.all, 'list', costCenter ?? 'all'] as const,
}

export function useCostEntries(costCenter?: string) {
  return useQuery({
    queryKey: costEntryKeys.list(costCenter),
    queryFn: async () => {
      const res = await apiClient.get<{ items: ApiCostEntry[] }>('/cost-entries', {
        per_page: 100,
      })
      const items: CostEntry[] = res.items.map(row => ({
        ...row,
        categoryName: row.categoryName ?? '',
        categoryExternalId: row.categoryId,
        costCenterExternalId: row.costCenterId ?? null,
        amount: Number.parseFloat(String(row.amount)),
        currency: row.currency as Currency,
        recurrenceInterval: (row.recurrenceInterval as RecurrenceInterval) ?? null,
        status: row.status as CostEntryStatus,
        billingDate: row.billingDate ?? '',
        competenceMonth: row.competenceMonth ?? '',
        costAllocation: row.costAllocation as CostAllocation,
        unitQuantity: row.unitQuantity ? Number.parseFloat(String(row.unitQuantity)) : null,
        unitCost: row.unitCost ? Number.parseFloat(String(row.unitCost)) : null,
      }))
      if (costCenter) {
        return items.filter((e) => e.costCenterExternalId === costCenter)
      }
      return items
    },
  })
}
