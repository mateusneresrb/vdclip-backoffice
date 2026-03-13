import type { AdminUser, UserStatus } from '@/features/admin/types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import i18n from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showSuccessToast } from '@/lib/toast'

export function useUserMutations() {
  const queryClient = useQueryClient()

  const updateStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string, status: UserStatus }) => {
      if (status === 'suspended') {
        await apiClient.post(`/platform/users/${userId}/suspend`, {})
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
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      showSuccessToast({ title: i18n.t('admin:toast.userStatusUpdated') })
    },
  })

  return { updateStatus }
}
