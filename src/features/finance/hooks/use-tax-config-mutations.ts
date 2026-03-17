import type { TaxConfig } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { i18n } from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

interface ApiTaxConfig {
  id: string
  tax_type: string
  rate: string
  municipality_code: string | null
  tax_regime: string
  effective_from: string
  effective_to: string | null
  created_at: string
  updated_at: string
}

function toTaxConfig(row: Record<string, unknown>): TaxConfig {
  return {
    id: row.id as string,
    taxType: row.taxType as string,
    rate: Number.parseFloat(String(row.rate)),
    municipalityCode: (row.municipalityCode as string) ?? null,
    taxRegime: row.taxRegime as string,
    effectiveFrom: row.effectiveFrom as string,
    effectiveTo: (row.effectiveTo as string) ?? null,
  }
}

export function useTaxConfigMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: Omit<TaxConfig, 'id'>) => {
      const res = await apiClient.post<ApiTaxConfig>('/tax-configurations', {
        taxType: data.taxType,
        rate: String(data.rate),
        municipalityCode: data.municipalityCode ?? null,
        taxRegime: data.taxRegime,
        effectiveFrom: data.effectiveFrom,
        effectiveTo: data.effectiveTo ?? null,
      })
      return toTaxConfig(res as unknown as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-config'] })
      showSuccessToast({ title: i18n.t('admin:toast.taxConfigCreated') })
    },
    onError: () => {
      showErrorToast({ title: i18n.t('admin:toast.taxConfigCreateError') })
    },
  })

  const update = useMutation({
    mutationFn: async (data: TaxConfig) => {
      const res = await apiClient.patch<ApiTaxConfig>(`/tax-configurations/${data.id}`, {
        rate: String(data.rate),
        effectiveTo: data.effectiveTo ?? null,
      })
      return toTaxConfig(res as unknown as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-config'] })
      showSuccessToast({ title: i18n.t('admin:toast.taxConfigUpdated') })
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/tax-configurations/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-config'] })
      showSuccessToast({ title: i18n.t('admin:toast.taxConfigDeleted') })
    },
  })

  return { create, update, remove }
}
