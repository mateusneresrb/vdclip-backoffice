import type { CreateFinancialCategoryInput, FinancialCategory, FinancialCategoryType } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { i18n } from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

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

function toFrontend(row: ApiCategory): FinancialCategory {
  return {
    id: row.id,
    parentId: row.parent_id ?? null,
    code: row.code,
    name: row.name,
    type: row.type as FinancialCategoryType,
    costGroup: row.cost_group ?? null,
    level: row.level ?? 0,
    displayOrder: row.display_order ?? 0,
    description: row.description ?? null,
    isActive: row.is_active,
  }
}

function toCreateBody(data: CreateFinancialCategoryInput) {
  return {
    code: data.code,
    name: data.name,
    type: data.type,
    parent_id: data.parentId ?? null,
    level: data.level,
    display_order: data.displayOrder,
    description: data.description ?? null,
    cost_group: data.costGroup ?? null,
  }
}

function toUpdateBody(data: FinancialCategory) {
  return {
    name: data.name,
    description: data.description ?? null,
    is_active: data.isActive,
    display_order: data.displayOrder,
  }
}

export function useCategoryMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: CreateFinancialCategoryInput) => {
      const res = await apiClient.post<ApiCategory>('/financial-categories', toCreateBody(data))
      return toFrontend(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories'] })
      showSuccessToast({ title: i18n.t('admin:toast.categoryCreated') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:toast.categoryCreateError') })
    },
  })

  const update = useMutation({
    mutationFn: async (data: FinancialCategory) => {
      const res = await apiClient.patch<ApiCategory>(`/financial-categories/${data.id}`, toUpdateBody(data))
      return toFrontend(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories'] })
      showSuccessToast({ title: i18n.t('admin:toast.categoryUpdated') })
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
  })

  return { create, update, remove }
}
