import type { TaxConfig } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

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

const taxConfigKeys = {
  all: ['tax-config'] as const,
  list: () => [...taxConfigKeys.all, 'list'] as const,
}

export function useTaxConfig() {
  return useQuery({
    queryKey: taxConfigKeys.list(),
    queryFn: async () => {
      const res = await apiClient.get<{ items: ApiTaxConfig[] }>('/tax-configurations')
      return res.items.map(toFrontend)
    },
  })
}
