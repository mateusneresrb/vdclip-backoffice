import type { CostCenter } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { i18n } from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showMutationError, showSuccessToast } from '@/lib/toast'

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

function toCostCenter(row: Record<string, unknown>): CostCenter {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description as string) ?? null,
    budget: row.budget ? Number.parseFloat(String(row.budget)) : null,
    spent: Number.parseFloat(String(row.spent ?? '0')),
    isActive: row.isActive as boolean,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
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
      return toCostCenter(res as unknown as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-centers'] })
      showSuccessToast({ title: i18n.t('admin:toast.costCenterCreated') })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:toast.costCenterCreateError'))
    },
  })

  const update = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; slug?: string; description?: string | null; isActive?: boolean }) => {
      const res = await apiClient.patch<ApiCostCenter>(`/cost-centers/${id}`, data)
      return toCostCenter(res as unknown as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-centers'] })
      showSuccessToast({ title: i18n.t('admin:toast.costCenterUpdated') })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:toast.costCenterUpdateError'))
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
    onError: (err) => {
      showMutationError(err, i18n.t('admin:toast.costCenterDeleteError'))
    },
  })

  return { create, update, remove }
}
