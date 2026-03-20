import type { FinancialCategory, FinancialCategoryType } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiCategory {
  id: string
  parent_id: string | null
  code: string
  name: string
  type: string
  cost_group: string | null
  level: number
  display_order: number
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

const financialCategoryKeys = {
  all: ['financial-categories'] as const,
  list: () => [...financialCategoryKeys.all, 'list'] as const,
}

export function useFinancialCategories() {
  return useQuery({
    queryKey: financialCategoryKeys.list(),
    queryFn: async () => {
      const res = await apiClient.get<ApiCategory[]>('/financial-categories')
      return res.map((row): FinancialCategory => ({
        id: row.id,
        parentId: row.parentId ?? null,
        code: row.code,
        name: row.name,
        type: row.type as FinancialCategoryType,
        costGroup: row.costGroup ?? null,
        level: row.level ?? 0,
        displayOrder: row.displayOrder ?? 0,
        description: row.description ?? null,
        isActive: row.isActive,
      }))
    },
  })
}
