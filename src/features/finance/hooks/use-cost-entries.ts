import type { CostEntry } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiCostEntry {
  id: string
  description: string
  category_id: string
  category_name: string | null
  cost_center_id: string | null
  cost_center_name: string | null
  vendor: string
  amount: string
  currency: string
  is_recurring: boolean
  recurrence_interval: string | null
  status: string
  billing_date: string
  competence_month: string
  cost_allocation: string
  is_variable: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

function toFrontend(row: ApiCostEntry): CostEntry {
  return {
    id: row.id,
    description: row.description,
    categoryId: row.category_id,
    categoryName: row.category_name ?? '',
    costCenter: row.cost_center_name ?? row.cost_center_id ?? '',
    type: row.is_recurring ? 'recurring' : 'one_time',
    frequency: (row.recurrence_interval as CostEntry['frequency']) ?? null,
    currency: row.currency as CostEntry['currency'],
    amount: Number.parseFloat(row.amount),
    startDate: row.billing_date,
    endDate: null,
    isActive: row.status !== 'cancelled',
  }
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
      const items = res.items.map(toFrontend)
      if (costCenter) {
        return items.filter((e) => e.costCenter === costCenter)
      }
      return items
    },
  })
}
