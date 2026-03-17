import type { CostAllocation, CostEntry, CostEntryStatus, CreateCostEntryInput, RecurrenceInterval } from '../types'

import type { Currency } from '@/features/admin/types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { i18n } from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showSuccessToast } from '@/lib/toast'

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

function toCostEntry(row: ReturnType<typeof Object> & Record<string, unknown>): CostEntry {
  return {
    ...row,
    categoryName: (row.categoryName as string) ?? '',
    categoryExternalId: row.categoryId as string,
    costCenterExternalId: (row.costCenterId as string) ?? null,
    amount: Number.parseFloat(String(row.amount)),
    currency: row.currency as Currency,
    recurrenceInterval: (row.recurrenceInterval as RecurrenceInterval) ?? null,
    status: row.status as CostEntryStatus,
    billingDate: (row.billingDate as string) ?? '',
    competenceMonth: (row.competenceMonth as string) ?? '',
    costAllocation: row.costAllocation as CostAllocation,
    unitQuantity: row.unitQuantity ? Number.parseFloat(String(row.unitQuantity)) : null,
    unitCost: row.unitCost ? Number.parseFloat(String(row.unitCost)) : null,
  } as CostEntry
}

function normalizeCompetenceMonth(value: string): string {
  // HTML month input returns "YYYY-MM", backend expects "YYYY-MM-DD"
  if (value && !value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return `${value}-01`
  }
  return value
}

export function useCostEntryMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: CreateCostEntryInput) => {
      const res = await apiClient.post<ApiCostEntry>('/cost-entries', {
        categoryId: data.categoryId,
        costCenterId: data.costCenterId ?? null,
        vendor: data.vendor,
        description: data.description,
        amount: String(data.amount),
        currency: data.currency,
        isRecurring: data.isRecurring,
        recurrenceInterval: data.recurrenceInterval ?? null,
        recurringSince: data.recurringSince ?? null,
        recurringUntil: data.recurringUntil ?? null,
        billingDate: data.billingDate,
        dueDate: data.dueDate ?? null,
        competenceMonth: normalizeCompetenceMonth(data.competenceMonth),
        costAllocation: data.costAllocation,
        isVariable: data.isVariable ?? false,
        unitMetric: data.unitMetric ?? null,
        unitQuantity: data.unitQuantity != null ? String(data.unitQuantity) : null,
        unitCost: data.unitCost != null ? String(data.unitCost) : null,
        receiptUrl: data.receiptUrl ?? null,
        notes: data.notes ?? null,
      })
      return toCostEntry(res as unknown as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-entries'] })
      showSuccessToast({ title: i18n.t('admin:toast.costEntryCreated') })
    },
  })

  const update = useMutation({
    mutationFn: async (data: CostEntry) => {
      const res = await apiClient.patch<ApiCostEntry>(`/cost-entries/${data.id}`, {
        vendor: data.vendor,
        description: data.description,
        amount: String(data.amount),
        dueDate: data.dueDate ?? null,
        receiptUrl: data.receiptUrl ?? null,
        notes: data.notes ?? null,
      })
      return toCostEntry(res as unknown as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-entries'] })
      showSuccessToast({ title: i18n.t('admin:toast.costEntryUpdated') })
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/cost-entries/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-entries'] })
      showSuccessToast({ title: i18n.t('admin:toast.costEntryDeleted') })
    },
  })

  const approve = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/cost-entries/${id}/approve`, {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-entries'] })
      showSuccessToast({ title: i18n.t('admin:toast.costEntryApproved') })
    },
  })

  const pay = useMutation({
    mutationFn: async (data: { id: string; paymentMethod: string; bankAccountId: string; transactionDate: string; notes?: string | null }) => {
      await apiClient.post(`/cost-entries/${data.id}/pay`, {
        paymentMethod: data.paymentMethod,
        bankAccountId: data.bankAccountId,
        transactionDate: data.transactionDate,
        notes: data.notes ?? null,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-entries'] })
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] })
      queryClient.invalidateQueries({ queryKey: ['admin-cash-flow'] })
      showSuccessToast({ title: i18n.t('admin:toast.costEntryPaid') })
    },
  })

  return { create, update, remove, approve, pay }
}
