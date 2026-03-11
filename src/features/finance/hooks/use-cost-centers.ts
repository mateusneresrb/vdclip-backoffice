import type { CostCenter } from '../types'
import { useQuery } from '@tanstack/react-query'

import { useMemo } from 'react'

const mockCostCenters: CostCenter[] = [
  {
    id: 'cc-1',
    code: 'ENG-001',
    name: 'Engenharia',
    description: 'Time de desenvolvimento e engenharia de software',
    responsible: 'Carlos Silva',
    budget: 50000,
    spent: 42500,
    currency: 'USD',
    isActive: true,
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'cc-2',
    code: 'MKT-001',
    name: 'Marketing',
    description: 'Campanhas de marketing e aquisicao de clientes',
    responsible: 'Ana Rodrigues',
    budget: 25000,
    spent: 23800,
    currency: 'BRL',
    isActive: true,
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'cc-3',
    code: 'INF-001',
    name: 'Infraestrutura',
    description: 'Custos de servidores, cloud e ferramentas SaaS',
    responsible: 'Rafael Santos',
    budget: 35000,
    spent: 28700,
    currency: 'USD',
    isActive: true,
    createdAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'cc-4',
    code: 'SAL-001',
    name: 'Vendas',
    description: 'Equipe comercial e operacoes de vendas',
    responsible: 'Julia Martins',
    budget: 18000,
    spent: 9200,
    currency: 'BRL',
    isActive: true,
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'cc-5',
    code: 'OPS-001',
    name: 'Operacoes',
    description: 'Processos operacionais e administrativos',
    responsible: 'Fernando Lima',
    budget: 15000,
    spent: 14200,
    currency: 'BRL',
    isActive: false,
    createdAt: '2025-04-01T00:00:00Z',
  },
  {
    id: 'cc-6',
    code: 'SUP-001',
    name: 'Suporte ao Cliente',
    description: 'Atendimento e suporte tecnico ao cliente',
    responsible: 'Mariana Costa',
    budget: 12000,
    spent: 8400,
    currency: 'USD',
    isActive: true,
    createdAt: '2025-05-01T00:00:00Z',
  },
]

const costCenterKeys = {
  all: ['cost-centers'] as const,
  list: (search: string, activeOnly: boolean) =>
    [...costCenterKeys.all, 'list', search, activeOnly] as const,
}

export function useCostCenters(search: string, activeOnly: boolean) {
  const query = useQuery({
    queryKey: costCenterKeys.list(search, activeOnly),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockCostCenters
    },
  })

  const filtered = useMemo(() => {
    if (!query.data) 
return []
    let result = query.data
    if (activeOnly) {
      result = result.filter((cc) => cc.isActive)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (cc) =>
          cc.name.toLowerCase().includes(q) ||
          cc.code.toLowerCase().includes(q) ||
          cc.responsible.toLowerCase().includes(q),
      )
    }
    return result
  }, [query.data, search, activeOnly])

  return { ...query, data: filtered }
}
