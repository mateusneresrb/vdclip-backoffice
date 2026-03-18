import type { AdminUser, UserPlan, UserStatus } from '@/features/admin/types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { i18n } from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

export function useUserMutations() {
  const queryClient = useQueryClient()

  const invalidateUser = (userId: string) => {
    queryClient.invalidateQueries({ queryKey: ['admin-users', 'detail', userId] })
    queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  }

  const updateStatus = useMutation({
    mutationFn: async ({ userId, status, reason }: { userId: string; status: UserStatus; reason?: string }) => {
      if (status === 'suspended') {
        await apiClient.post(`/platform/users/${userId}/suspend`, {
          reason: reason ?? 'Suspended by admin',
        })
      } else {
        await apiClient.post(`/platform/users/${userId}/unsuspend`, {})
      }
      return { userId, status }
    },
    onSuccess: ({ userId, status }) => {
      queryClient.setQueryData<AdminUser>(
        ['admin-users', 'detail', userId],
        (old) => (old ? { ...old, status } : old),
      )
      invalidateUser(userId)
      showSuccessToast({ title: i18n.t('admin:toast.userStatusUpdated') })
    },
  })

  const grantCredits = useMutation({
    mutationFn: async ({ userId, amount, expiresDays, reason }: {
      userId: string
      amount: number
      expiresDays: number
      reason: string
    }) => {
      const expiresAt = new Date(Date.now() + expiresDays * 86400000).toISOString()
      await apiClient.post(`/platform/users/${userId}/credits`, {
        amount,
        creditType: 'admin_grant',
        description: reason,
        expiresAt,
      })
      return { userId }
    },
    onSuccess: ({ userId }) => {
      invalidateUser(userId)
      showSuccessToast({ title: i18n.t('admin:userDetail.creditGranted') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:userDetail.creditGrantError') })
    },
  })

  const deductCredits = useMutation({
    mutationFn: async ({ userId, amount, reason }: {
      userId: string
      amount: number
      reason: string
    }) => {
      await apiClient.post(`/platform/users/${userId}/deduct-credits`, {
        amount,
        reason,
      })
      return { userId }
    },
    onSuccess: ({ userId }) => {
      invalidateUser(userId)
      showSuccessToast({ title: i18n.t('admin:userDetail.creditDeducted') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:userDetail.creditDeductError') })
    },
  })

  const changePlan = useMutation({
    mutationFn: async ({ userId, plan, reason }: { userId: string; plan: UserPlan; reason: string }) => {
      await apiClient.patch(`/platform/users/${userId}/plan`, { plan, reason })
      return { userId, plan }
    },
    onSuccess: ({ userId, plan }) => {
      queryClient.setQueryData<AdminUser>(
        ['admin-users', 'detail', userId],
        (old) => (old ? { ...old, plan, planProvider: 'internal' } : old),
      )
      invalidateUser(userId)
      showSuccessToast({ title: i18n.t('admin:userDetail.planChanged') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:userDetail.planChangeError') })
    },
  })

  const cancelPlan = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      await apiClient.post(`/platform/users/${userId}/cancel-plan`, {})
      return { userId }
    },
    onSuccess: ({ userId }) => {
      invalidateUser(userId)
      showSuccessToast({ title: i18n.t('admin:userDetail.planCancelled') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:userDetail.planCancelError') })
    },
  })

  const sendVerificationEmail = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      await apiClient.post(`/platform/users/${userId}/send-verification-email`, {})
      return { userId }
    },
    onSuccess: () => {
      showSuccessToast({ title: i18n.t('admin:userDetail.verificationEmailSent') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:userDetail.verificationEmailError') })
    },
  })

  const createPixSubscription = useMutation({
    mutationFn: async ({ userId, plan, billingPeriod, quantity }: {
      userId: string
      plan: UserPlan
      billingPeriod: 'monthly' | 'yearly'
      quantity: number
    }) => {
      const data = await apiClient.post<{ qr_code_text: string; qr_code_base64: string; amount: number; expires_at: string }>(`/platform/users/${userId}/pix-subscription`, {
        plan,
        billingPeriod,
        quantity,
      })
      return data
    },
    onSuccess: () => {
      showSuccessToast({ title: i18n.t('admin:userDetail.pixCreated') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:userDetail.pixCreateError') })
    },
  })

  return { updateStatus, grantCredits, deductCredits, changePlan, cancelPlan, sendVerificationEmail, createPixSubscription }
}
