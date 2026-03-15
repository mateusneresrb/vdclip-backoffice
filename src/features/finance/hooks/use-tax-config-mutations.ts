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

function toFrontend(row: ApiTaxConfig): TaxConfig {
  return {
    id: row.id,
    taxType: row.tax_type,
    rate: Number.parseFloat(row.rate),
    municipalityCode: row.municipality_code ?? null,
    taxRegime: row.tax_regime,
    effectiveFrom: row.effective_from,
    effectiveTo: row.effective_to ?? null,
  }
}

function toBody(data: Omit<TaxConfig, 'id'>) {
  return {
    tax_type: data.taxType,
    rate: String(data.rate),
    municipality_code: data.municipalityCode ?? null,
    tax_regime: data.taxRegime,
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
    onError: () => {
      showErrorToast({ title: i18n.t('admin:toast.taxConfigCreateError') })
    },
  })

  const update = useMutation({
    mutationFn: async (data: TaxConfig) => {
      const res = await apiClient.patch<ApiTaxConfig>(`/tax-configurations/${data.id}`, {
        rate: String(data.rate),
        effective_to: data.effectiveTo ?? null,
      })
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
