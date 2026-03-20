import type { Currency } from '@/features/admin/types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { i18n } from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showMutationError, showSuccessToast } from '@/lib/toast'

interface CreateCashFlowInput {
  description: string
  amount: number
  currency: Currency
  type: 'inflow' | 'outflow'
  category: string
  date: string
  bankAccountId: string
  categoryId: string
}

export function useCashFlowMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: CreateCashFlowInput) => {
      return apiClient.post('/financial-transactions', {
        description: data.description,
        amount: String(data.amount),
        currency: data.currency,
        direction: data.type,
        type: data.category,
        transactionDate: data.date,
        competenceDate: data.date,
        bankAccountId: data.bankAccountId,
        categoryId: data.categoryId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cash-flow'] })
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] })
      showSuccessToast({ title: i18n.t('admin:toast.cashFlowEntryCreated') })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:toast.cashFlowEntryCreateError'))
    },
  })

  return { create }
}
