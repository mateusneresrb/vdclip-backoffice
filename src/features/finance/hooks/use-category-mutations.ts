import type { CreateFinancialCategoryInput, FinancialCategory, FinancialCategoryType } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { i18n } from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showMutationError, showSuccessToast } from '@/lib/toast'

interface ApiCategory {
  id: string
  parent_id: string | null
  code: string
  name: string
  type: string
  cost_group: string | null
  level: number
  display_order: number
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

function toCategory(row: Record<string, unknown>): FinancialCategory {
  return {
    id: row.id as string,
    parentId: (row.parentId as string) ?? null,
    code: row.code as string,
    name: row.name as string,
    type: row.type as FinancialCategoryType,
    costGroup: (row.costGroup as string) ?? null,
    level: (row.level as number) ?? 0,
    displayOrder: (row.displayOrder as number) ?? 0,
    description: (row.description as string) ?? null,
    isActive: row.isActive as boolean,
  }
}

export function useCategoryMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: CreateFinancialCategoryInput) => {
      const res = await apiClient.post<ApiCategory>('/financial-categories', {
        code: data.code,
        name: data.name,
        type: data.type,
        parentId: data.parentId ?? null,
        level: data.level,
        displayOrder: data.displayOrder,
        description: data.description ?? null,
        costGroup: data.costGroup ?? null,
      })
      return toCategory(res as unknown as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories'] })
      showSuccessToast({ title: i18n.t('admin:toast.categoryCreated') })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:toast.categoryCreateError'))
    },
  })

  const update = useMutation({
    mutationFn: async (data: FinancialCategory) => {
      const res = await apiClient.patch<ApiCategory>(`/financial-categories/${data.id}`, {
        name: data.name,
        description: data.description ?? null,
        isActive: data.isActive,
        displayOrder: data.displayOrder,
      })
      return toCategory(res as unknown as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories'] })
      showSuccessToast({ title: i18n.t('admin:toast.categoryUpdated') })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:toast.categoryUpdateError'))
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/financial-categories/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories'] })
      showSuccessToast({ title: i18n.t('admin:toast.categoryDeleted') })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:toast.categoryDeleteError'))
    },
  })

  return { create, update, remove }
}
