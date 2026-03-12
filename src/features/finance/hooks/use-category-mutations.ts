import type { CreateFinancialCategoryInput, FinancialCategory } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import i18n from '@/i18n'

import { showSuccessToast } from '@/lib/toast'

export function useCategoryMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: CreateFinancialCategoryInput) => {
      await new Promise((r) => setTimeout(r, 500))
      return {
        ...data,
        id: crypto.randomUUID(),
        costGroup: data.costGroup ?? null,
        level: data.level,
        displayOrder: data.displayOrder,
        description: data.description ?? null,
        isActive: true,
      } as FinancialCategory
    },
    onSuccess: (newCategory) => {
      queryClient.setQueryData<FinancialCategory[]>(
        ['financial-categories', 'list'],
        (old) => [...(old ?? []), newCategory],
      )
      showSuccessToast({ title: i18n.t('admin:toast.categoryCreated') })
    },
  })

  const update = useMutation({
    mutationFn: async (data: FinancialCategory) => {
      await new Promise((r) => setTimeout(r, 500))
      return data
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<FinancialCategory[]>(
        ['financial-categories', 'list'],
        (old) =>
          (old ?? []).map((item) => (item.id === updated.id ? updated : item)),
      )
      showSuccessToast({ title: i18n.t('admin:toast.categoryUpdated') })
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 500))
      return id
    },
    onSuccess: (id) => {
      queryClient.setQueryData<FinancialCategory[]>(
        ['financial-categories', 'list'],
        (old) => (old ?? []).filter((item) => item.id !== id),
      )
      showSuccessToast({ title: i18n.t('admin:toast.categoryDeleted') })
    },
  })

  return { create, update, remove }
}
