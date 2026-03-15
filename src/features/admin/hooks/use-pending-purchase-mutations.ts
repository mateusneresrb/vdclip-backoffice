import { useMutation, useQueryClient } from '@tanstack/react-query'
import { i18n } from '@/i18n'

import { apiClient } from '@/lib/api-client'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

import { pendingPurchasesKeys } from './use-admin-pending-purchases'

export function useDismissPendingPurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.post<{ message: string }>(
        `/platform/pending-purchases/${id}/dismiss`,
        {},
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pendingPurchasesKeys.all })
      showSuccessToast({ title: i18n.t('admin:pendingPurchases.toast.dismissed') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:pendingPurchases.toast.dismissError') })
    },
  })
}

export function useCancelPendingPurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.post<{ message: string }>(
        `/platform/pending-purchases/${id}/cancel`,
        {},
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pendingPurchasesKeys.all })
      showSuccessToast({ title: i18n.t('admin:pendingPurchases.toast.cancelled') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:pendingPurchases.toast.cancelError') })
    },
  })
}
