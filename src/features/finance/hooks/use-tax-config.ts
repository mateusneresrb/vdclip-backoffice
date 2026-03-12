import type { TaxConfig } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockTaxConfigs: TaxConfig[] = [
  {
    id: 'tax-1',
    taxType: 'ISS',
    rate: 5,
    municipalityCode: '3550308',
    taxRegime: 'simples_nacional',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
  },
  {
    id: 'tax-2',
    taxType: 'PIS',
    rate: 0.65,
    municipalityCode: null,
    taxRegime: 'simples_nacional',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
  },
  {
    id: 'tax-3',
    taxType: 'COFINS',
    rate: 3,
    municipalityCode: null,
    taxRegime: 'simples_nacional',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
  },
  {
    id: 'tax-4',
    taxType: 'IRPJ',
    rate: 15,
    municipalityCode: null,
    taxRegime: 'lucro_presumido',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
  },
  {
    id: 'tax-5',
    taxType: 'CSLL',
    rate: 9,
    municipalityCode: null,
    taxRegime: 'lucro_presumido',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
  },
  {
    id: 'tax-6',
    taxType: 'INSS Patronal',
    rate: 20,
    municipalityCode: null,
    taxRegime: 'clt',
    effectiveFrom: '2025-01-01',
    effectiveTo: null,
  },
]

const taxConfigKeys = {
  all: ['tax-config'] as const,
  list: () => [...taxConfigKeys.all, 'list'] as const,
}

export function useTaxConfig() {
  return useQuery({
    queryKey: taxConfigKeys.list(),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return mockTaxConfigs
    },
  })
}
