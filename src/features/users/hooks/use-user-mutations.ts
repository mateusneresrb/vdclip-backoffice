import type { AdminUser, UserStatus } from '@/features/admin/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useNavigate } from '@tanstack/react-router'
import i18n from '@/i18n'

import { showSuccessToast } from '@/lib/toast'

export function useUserMutations() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const updateStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string, status: UserStatus }) => {
      await new Promise((r) => setTimeout(r, 500))
      return { userId, status }
    },
    onSuccess: ({ userId, status }) => {
      queryClient.setQueryData<AdminUser>(
        ['admin-users', 'detail', userId],
        (old) => (old ? { ...old, status } : old),
      )
      queryClient.setQueryData<AdminUser[]>(
        ['admin-users', 'list', ''],
        (old) =>
          (old ?? []).map((u) => (u.id === userId ? { ...u, status } : u)),
      )
      showSuccessToast({ title: i18n.t('admin:toast.userStatusUpdated') })
    },
  })

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      await new Promise((r) => setTimeout(r, 500))
      return userId
    },
    onSuccess: (userId) => {
      queryClient.setQueryData<AdminUser[]>(
        ['admin-users', 'list', ''],
        (old) => (old ?? []).filter((u) => u.id !== userId),
      )
      queryClient.removeQueries({
        queryKey: ['admin-users', 'detail', userId],
      })
      showSuccessToast({ title: i18n.t('admin:toast.userDeleted') })
      navigate({ to: '/users' })
    },
  })

  return { updateStatus, deleteUser }
}
