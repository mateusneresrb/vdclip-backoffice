import type { ApiCostEntry, CostAllocation, CostEntry, CostEntryStatus, RecurrenceInterval } from '../types'

import type { Currency } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

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
