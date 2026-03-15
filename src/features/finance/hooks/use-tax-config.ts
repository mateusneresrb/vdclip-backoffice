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

const taxConfigKeys = {
  all: ['tax-config'] as const,
  list: () => [...taxConfigKeys.all, 'list'] as const,
}

export function useTaxConfig() {
  return useQuery({
    queryKey: taxConfigKeys.list(),
    queryFn: async () => {
      const res = await apiClient.get<ApiTaxConfig[]>('/tax-configurations')
      return res.map(toFrontend)
    },
  })
}
