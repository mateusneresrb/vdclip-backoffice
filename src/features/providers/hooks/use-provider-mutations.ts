import { useMutation, useQueryClient } from '@tanstack/react-query'
import { i18n } from '@/i18n'

import { adminProviderKeys } from '@/features/admin/hooks/use-admin-providers'
import { apiClient } from '@/lib/api-client'
import { showMutationError, showSuccessToast } from '@/lib/toast'

export function useToggleProvider() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ slug, enabled }: { slug: string; enabled: boolean }) => {
      return apiClient.patch<{ message: string }>(
        `/platform/providers/${slug}`,
        { enabled },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProviderKeys.all })
      showSuccessToast({ title: i18n.t('admin:toast.providerToggled') })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:toast.providerToggleError'))
    },
  })
}
