import type { CostEntry, CreateCostEntryInput } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import i18n from '@/i18n'

import { showSuccessToast } from '@/lib/toast'

export function useCostEntryMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: CreateCostEntryInput) => {
      await new Promise((r) => setTimeout(r, 500))
      return {
        id: crypto.randomUUID(),
        categoryId: data.categoryId,
        categoryName: '',
        categoryExternalId: data.categoryId,
        costCenterId: data.costCenterId ?? null,
        costCenterName: null,
        costCenterExternalId: null,
        recurringParentId: null,
        vendor: data.vendor,
        description: data.description,
        amount: data.amount,
        currency: data.currency,
        isRecurring: data.isRecurring,
        recurrenceInterval: data.recurrenceInterval ?? null,
        recurringSince: data.recurringSince ?? null,
        recurringUntil: data.recurringUntil ?? null,
        status: 'draft',
        billingDate: data.billingDate,
        dueDate: data.dueDate ?? null,
        competenceMonth: data.competenceMonth,
        costAllocation: data.costAllocation,
        isVariable: data.isVariable ?? false,
        unitMetric: data.unitMetric ?? null,
        unitQuantity: data.unitQuantity ?? null,
        unitCost: data.unitCost ?? null,
        paidAt: null,
        paymentMethod: null,
        financialTransactionId: null,
        receiptUrl: data.receiptUrl ?? null,
        notes: data.notes ?? null,
        createdBy: null,
        createdByEmail: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CostEntry
    },
    onSuccess: (newEntry) => {
      queryClient.setQueryData<CostEntry[]>(
        ['cost-entries', 'list', 'all'],
        (old) => [...(old ?? []), newEntry],
      )
      showSuccessToast({ title: i18n.t('admin:toast.costEntryCreated') })
    },
  })

  const update = useMutation({
    mutationFn: async (data: CostEntry) => {
      await new Promise((r) => setTimeout(r, 500))
      return data
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<CostEntry[]>(
        ['cost-entries', 'list', 'all'],
        (old) =>
          (old ?? []).map((item) => (item.id === updated.id ? updated : item)),
      )
      showSuccessToast({ title: i18n.t('admin:toast.costEntryUpdated') })
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 500))
      return id
    },
    onSuccess: (id) => {
      queryClient.setQueryData<CostEntry[]>(
        ['cost-entries', 'list', 'all'],
        (old) => (old ?? []).filter((item) => item.id !== id),
      )
      showSuccessToast({ title: i18n.t('admin:toast.costEntryDeleted') })
    },
  })

  return { create, update, remove }
}
