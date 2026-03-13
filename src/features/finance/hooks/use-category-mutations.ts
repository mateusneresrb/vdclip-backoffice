import type { CreateFinancialCategoryInput, FinancialCategory, FinancialCategoryType } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import i18n from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showSuccessToast } from '@/lib/toast'

interface ApiCategory {
  id: string
  external_id: string
  name: string
  slug: string
  parent_id: string | null
  description: string | null
  type: string
  is_active: boolean
  level?: number
  display_order?: number
  cost_group?: string | null
  created_at: string
  updated_at: string
}

function toFrontend(row: ApiCategory): FinancialCategory {
  return {
    id: row.external_id ?? row.id,
    parentId: row.parent_id ?? null,
    code: row.slug,
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
    slug: data.code,
    name: data.name,
    type: data.type,
    parent_id: data.parentId ?? null,
    description: data.description ?? null,
    cost_group: data.costGroup ?? null,
  }
}

function toUpdateBody(data: FinancialCategory) {
  return {
    slug: data.code,
    name: data.name,
    type: data.type,
    parent_id: data.parentId ?? null,
    description: data.description ?? null,
    cost_group: data.costGroup ?? null,
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
