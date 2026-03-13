import type { TaxConfig } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import i18n from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showSuccessToast } from '@/lib/toast'

interface ApiTaxConfig {
  id: string
  external_id: string
  name: string
  tax_type: string
  rate: string
  jurisdiction: string | null
  description: string | null
  is_active: boolean
  effective_from?: string | null
  effective_to?: string | null
  tax_regime?: string | null
  created_at: string
  updated_at: string
}

function toFrontend(row: ApiTaxConfig): TaxConfig {
  return {
    id: row.external_id ?? row.id,
    taxType: row.tax_type ?? row.name,
    rate: Number.parseFloat(row.rate),
    municipalityCode: row.jurisdiction ?? null,
    taxRegime: row.tax_regime ?? null,
    effectiveFrom: row.effective_from ?? row.created_at,
    effectiveTo: row.effective_to ?? null,
  }
}

function toBody(data: Omit<TaxConfig, 'id'>) {
  return {
    name: data.taxType,
    tax_type: data.taxType,
    rate: String(data.rate),
    jurisdiction: data.municipalityCode ?? null,
    tax_regime: data.taxRegime ?? null,
    effective_from: data.effectiveFrom,
    effective_to: data.effectiveTo ?? null,
  }
}

export function useTaxConfigMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: Omit<TaxConfig, 'id'>) => {
      const res = await apiClient.post<ApiTaxConfig>('/tax-configurations', toBody(data))
      return toFrontend(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-config'] })
      showSuccessToast({ title: i18n.t('admin:toast.taxConfigCreated') })
    },
  })

  const update = useMutation({
    mutationFn: async (data: TaxConfig) => {
      const { id, ...rest } = data
      const res = await apiClient.patch<ApiTaxConfig>(`/tax-configurations/${id}`, toBody(rest))
      return toFrontend(res)
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
