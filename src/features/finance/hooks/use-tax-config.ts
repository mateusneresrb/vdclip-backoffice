import type { TaxConfig } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockTaxConfigs: TaxConfig[] = [
  {
    id: 'tax-1',
    name: 'ISS',
    code: 'ISS',
    rate: 5,
    type: 'municipal',
    isActive: true,
    appliesTo: 'services',
  },
  {
    id: 'tax-2',
    name: 'PIS',
    code: 'PIS',
    rate: 0.65,
    type: 'federal',
    isActive: true,
    appliesTo: 'revenue',
  },
  {
    id: 'tax-3',
    name: 'COFINS',
    code: 'COFINS',
    rate: 3,
    type: 'federal',
    isActive: true,
    appliesTo: 'revenue',
  },
  {
    id: 'tax-4',
    name: 'IRPJ',
    code: 'IRPJ',
    rate: 15,
    type: 'federal',
    isActive: true,
    appliesTo: 'revenue',
  },
  {
    id: 'tax-5',
    name: 'CSLL',
    code: 'CSLL',
    rate: 9,
    type: 'federal',
    isActive: true,
    appliesTo: 'revenue',
  },
  {
    id: 'tax-6',
    name: 'INSS Patronal',
    code: 'INSS',
    rate: 20,
    type: 'federal',
    isActive: true,
    appliesTo: 'payroll',
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
