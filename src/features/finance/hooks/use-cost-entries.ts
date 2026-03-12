import type { CostAllocation, CostEntry, CostEntryStatus, RecurrenceInterval } from '../types'

import { useQuery } from '@tanstack/react-query'

import type { Currency } from '@/features/admin/types'

import { apiClient } from '@/lib/api-client'

interface ApiCostEntry {
  id: string
  external_id: string
  category_id: string
  category_name: string | null
  category_external_id: string | null
  cost_center_id: string | null
  cost_center_name: string | null
  cost_center_external_id: string | null
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
  billing_date: string | null
  due_date: string | null
  competence_month: string | null
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

function toFrontend(row: ApiCostEntry): CostEntry {
  return {
    id: row.external_id ?? row.id,
    categoryId: row.category_external_id ?? row.category_id,
    categoryName: row.category_name ?? '',
    categoryExternalId: row.category_external_id ?? '',
    costCenterId: row.cost_center_external_id ?? row.cost_center_id ?? null,
    costCenterName: row.cost_center_name ?? null,
    costCenterExternalId: row.cost_center_external_id ?? null,
    recurringParentId: row.recurring_parent_id ?? null,
    vendor: row.vendor,
    description: row.description,
    amount: Number.parseFloat(row.amount),
    currency: row.currency as Currency,
    isRecurring: row.is_recurring,
    recurrenceInterval: (row.recurrence_interval as RecurrenceInterval) ?? null,
    recurringSince: row.recurring_since ?? null,
    recurringUntil: row.recurring_until ?? null,
    status: row.status as CostEntryStatus,
    billingDate: row.billing_date ?? '',
    dueDate: row.due_date ?? null,
    competenceMonth: row.competence_month ?? '',
    costAllocation: row.cost_allocation as CostAllocation,
    isVariable: row.is_variable,
    unitMetric: row.unit_metric ?? null,
    unitQuantity: row.unit_quantity ? Number.parseFloat(row.unit_quantity) : null,
    unitCost: row.unit_cost ? Number.parseFloat(row.unit_cost) : null,
    paidAt: row.paid_at ?? null,
    paymentMethod: row.payment_method ?? null,
    financialTransactionId: row.financial_transaction_id ?? null,
    receiptUrl: row.receipt_url ?? null,
    notes: row.notes ?? null,
    createdBy: row.created_by ?? null,
    createdByEmail: row.created_by_email ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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
        return items.filter((e) => e.costCenterExternalId === costCenter)
      }
      return items
    },
  })
}
