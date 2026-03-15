import type { CostCenter } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { i18n } from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

interface ApiCostCenter {
  id: string
  name: string
  slug: string
  description: string | null
  budget: string | null
  spent: string
  is_active: boolean
  created_at: string
  updated_at: string
}

function toFrontend(row: ApiCostCenter): CostCenter {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? null,
    budget: row.budget ? Number.parseFloat(row.budget) : null,
    spent: Number.parseFloat(row.spent ?? '0'),
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function useCostCenterMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: { name: string; slug: string; description?: string | null }) => {
      const res = await apiClient.post<ApiCostCenter>('/cost-centers', {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
      })
      return toFrontend(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-centers'] })
      showSuccessToast({ title: i18n.t('admin:toast.costCenterCreated') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:toast.costCenterCreateError') })
    },
  })

  const update = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; slug?: string; description?: string | null; is_active?: boolean }) => {
      const res = await apiClient.patch<ApiCostCenter>(`/cost-centers/${id}`, data)
      return toFrontend(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-centers'] })
      showSuccessToast({ title: i18n.t('admin:toast.costCenterUpdated') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:toast.costCenterUpdateError') })
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/cost-centers/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-centers'] })
      showSuccessToast({ title: i18n.t('admin:toast.costCenterDeleted') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:toast.costCenterDeleteError') })
    },
  })

  return { create, update, remove }
}
