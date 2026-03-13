import type { FinancialCategory, FinancialCategoryType } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiCategory {
  id: string
  external_id: string
  name: string
  slug: string
  parent_id: string | null
  description: string | null
  type: string
  is_active: boolean
  level?: number
  display_order?: number
  cost_group?: string | null
  created_at: string
  updated_at: string
}

function toFrontend(row: ApiCategory): FinancialCategory {
  return {
    id: row.external_id ?? row.id,
    parentId: row.parent_id ?? null,
    code: row.slug,
    name: row.name,
    type: row.type as FinancialCategoryType,
    costGroup: row.cost_group ?? null,
    level: row.level ?? 0,
    displayOrder: row.display_order ?? 0,
    description: row.description ?? null,
    isActive: row.is_active,
  }
}

const financialCategoryKeys = {
  all: ['financial-categories'] as const,
  list: () => [...financialCategoryKeys.all, 'list'] as const,
}

export function useFinancialCategories() {
  return useQuery({
    queryKey: financialCategoryKeys.list(),
    queryFn: async () => {
      const res = await apiClient.get<{ items: ApiCategory[] }>('/financial-categories')
      return res.items.map(toFrontend)
    },
  })
}
