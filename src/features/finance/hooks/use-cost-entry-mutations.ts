import type { CostEntry } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import i18n from '@/i18n'

import { showSuccessToast } from '@/lib/toast'

export function useCostEntryMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: Omit<CostEntry, 'id'>) => {
      await new Promise((r) => setTimeout(r, 500))
      return {
        ...data,
        id: crypto.randomUUID(),
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
