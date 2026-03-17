import type { CostCenter } from '../types'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { apiClient } from '@/lib/api-client'

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

const costCenterKeys = {
  all: ['cost-centers'] as const,
  list: (search: string, activeOnly: boolean) =>
    [...costCenterKeys.all, 'list', search, activeOnly] as const,
}

export function useCostCenters(search: string, activeOnly: boolean) {
  const query = useQuery({
    queryKey: costCenterKeys.list(search, activeOnly),
    queryFn: async () => {
      const res = await apiClient.get<ApiCostCenter[]>('/cost-centers')
      return res.map((row): CostCenter => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description ?? null,
        budget: row.budget ? Number.parseFloat(String(row.budget)) : null,
        spent: Number.parseFloat(String(row.spent)),
        isActive: row.isActive,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }))
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
          cc.slug.toLowerCase().includes(q),
      )
    }
    return result
  }, [query.data, search, activeOnly])

  return { ...query, data: filtered }
}
