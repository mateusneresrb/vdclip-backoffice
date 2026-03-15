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

function toFrontend(row: ApiCostEntry): CostEntry {
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.category_name ?? '',
    categoryExternalId: row.category_id,
    costCenterId: row.cost_center_id ?? null,
    costCenterName: row.cost_center_name ?? null,
    costCenterExternalId: row.cost_center_id ?? null,
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

function normalizeCompetenceMonth(value: string): string {
  // HTML month input returns "YYYY-MM", backend expects "YYYY-MM-DD"
  if (value && !value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return `${value}-01`
  }
  return value
}

function toCreateBody(data: CreateCostEntryInput) {
  return {
    category_id: data.categoryId,
    cost_center_id: data.costCenterId ?? null,
    vendor: data.vendor,
    description: data.description,
    amount: String(data.amount),
    currency: data.currency,
    is_recurring: data.isRecurring,
    recurrence_interval: data.recurrenceInterval ?? null,
    recurring_since: data.recurringSince ?? null,
    recurring_until: data.recurringUntil ?? null,
    billing_date: data.billingDate,
    due_date: data.dueDate ?? null,
    competence_month: normalizeCompetenceMonth(data.competenceMonth),
    cost_allocation: data.costAllocation,
    is_variable: data.isVariable ?? false,
    unit_metric: data.unitMetric ?? null,
    unit_quantity: data.unitQuantity != null ? String(data.unitQuantity) : null,
    unit_cost: data.unitCost != null ? String(data.unitCost) : null,
    receipt_url: data.receiptUrl ?? null,
    notes: data.notes ?? null,
  }
}

function toUpdateBody(data: CostEntry) {
  return {
    vendor: data.vendor,
    description: data.description,
    amount: String(data.amount),
    due_date: data.dueDate ?? null,
    receipt_url: data.receiptUrl ?? null,
    notes: data.notes ?? null,
  }
}

export function useCostEntryMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: CreateCostEntryInput) => {
      const res = await apiClient.post<ApiCostEntry>('/cost-entries', toCreateBody(data))
      return toFrontend(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-entries'] })
      showSuccessToast({ title: i18n.t('admin:toast.costEntryCreated') })
    },
  })

  const update = useMutation({
    mutationFn: async (data: CostEntry) => {
      const res = await apiClient.patch<ApiCostEntry>(`/cost-entries/${data.id}`, toUpdateBody(data))
      return toFrontend(res)
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
        payment_method: data.paymentMethod,
        bank_account_id: data.bankAccountId,
        transaction_date: data.transactionDate,
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
