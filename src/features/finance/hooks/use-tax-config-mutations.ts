import type { TaxConfig } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import i18n from '@/i18n'

import { showSuccessToast } from '@/lib/toast'

export function useTaxConfigMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: Omit<TaxConfig, 'id'>) => {
      await new Promise((r) => setTimeout(r, 500))
      return {
        ...data,
        id: crypto.randomUUID(),
      } as TaxConfig
    },
    onSuccess: (newTax) => {
      queryClient.setQueryData<TaxConfig[]>(
        ['tax-config', 'list'],
        (old) => [...(old ?? []), newTax],
      )
      showSuccessToast({ title: i18n.t('admin:toast.taxConfigCreated') })
    },
  })

  const update = useMutation({
    mutationFn: async (data: TaxConfig) => {
      await new Promise((r) => setTimeout(r, 500))
      return data
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<TaxConfig[]>(
        ['tax-config', 'list'],
        (old) =>
          (old ?? []).map((item) => (item.id === updated.id ? updated : item)),
      )
      showSuccessToast({ title: i18n.t('admin:toast.taxConfigUpdated') })
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 500))
      return id
    },
    onSuccess: (id) => {
      queryClient.setQueryData<TaxConfig[]>(
        ['tax-config', 'list'],
        (old) => (old ?? []).filter((item) => item.id !== id),
      )
      showSuccessToast({ title: i18n.t('admin:toast.taxConfigDeleted') })
    },
  })

  return { create, update, remove }
}
