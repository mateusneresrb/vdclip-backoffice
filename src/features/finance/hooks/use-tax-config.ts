import type { TaxConfig } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

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

const taxConfigKeys = {
  all: ['tax-config'] as const,
  list: () => [...taxConfigKeys.all, 'list'] as const,
}

export function useTaxConfig() {
  return useQuery({
    queryKey: taxConfigKeys.list(),
    queryFn: async () => {
      const res = await apiClient.get<ApiTaxConfig[]>('/tax-configurations')
      return res.map((row): TaxConfig => ({
        id: row.id,
        taxType: row.taxType,
        rate: Number.parseFloat(String(row.rate)),
        municipalityCode: row.municipalityCode ?? null,
        taxRegime: row.taxRegime,
        effectiveFrom: row.effectiveFrom,
        effectiveTo: row.effectiveTo ?? null,
      }))
    },
  })
}
