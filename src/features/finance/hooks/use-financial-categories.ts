import type { FinancialCategory } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockCategories: FinancialCategory[] = [
  // 1. Ativo (Asset)
  { id: '1', parentId: null, code: '1', name: 'Ativo', type: 'asset', costGroup: null, level: 0, displayOrder: 1, description: null, isActive: true },
  { id: '1.1', parentId: '1', code: '1.1', name: 'Circulante', type: 'asset', costGroup: null, level: 1, displayOrder: 2, description: null, isActive: true },
  { id: '1.1.1', parentId: '1.1', code: '1.1.1', name: 'Caixa', type: 'asset', costGroup: null, level: 2, displayOrder: 3, description: null, isActive: true },
  { id: '1.1.2', parentId: '1.1', code: '1.1.2', name: 'Bancos', type: 'asset', costGroup: null, level: 2, displayOrder: 4, description: null, isActive: true },
  { id: '1.1.3', parentId: '1.1', code: '1.1.3', name: 'Contas a Receber', type: 'asset', costGroup: null, level: 2, displayOrder: 5, description: null, isActive: true },
  { id: '1.2', parentId: '1', code: '1.2', name: 'Nao Circulante', type: 'asset', costGroup: null, level: 1, displayOrder: 6, description: null, isActive: true },

  // 2. Passivo (Liability)
  { id: '2', parentId: null, code: '2', name: 'Passivo', type: 'liability', costGroup: null, level: 0, displayOrder: 7, description: null, isActive: true },
  { id: '2.1', parentId: '2', code: '2.1', name: 'Circulante', type: 'liability', costGroup: null, level: 1, displayOrder: 8, description: null, isActive: true },
  { id: '2.1.1', parentId: '2.1', code: '2.1.1', name: 'Fornecedores', type: 'liability', costGroup: null, level: 2, displayOrder: 9, description: null, isActive: true },
  { id: '2.1.2', parentId: '2.1', code: '2.1.2', name: 'Impostos', type: 'liability', costGroup: null, level: 2, displayOrder: 10, description: null, isActive: true },

  // 3. Receitas (Revenue)
  { id: '3', parentId: null, code: '3', name: 'Receitas', type: 'revenue', costGroup: null, level: 0, displayOrder: 11, description: null, isActive: true },
  { id: '3.1', parentId: '3', code: '3.1', name: 'Assinaturas', type: 'revenue', costGroup: null, level: 1, displayOrder: 12, description: null, isActive: true },
  { id: '3.2', parentId: '3', code: '3.2', name: 'Creditos', type: 'revenue', costGroup: null, level: 1, displayOrder: 13, description: null, isActive: true },
  { id: '3.3', parentId: '3', code: '3.3', name: 'Servicos', type: 'revenue', costGroup: null, level: 1, displayOrder: 14, description: null, isActive: true },

  // 4. COGS
  { id: '4', parentId: null, code: '4', name: 'Custo dos Servicos', type: 'cogs', costGroup: 'cogs', level: 0, displayOrder: 15, description: null, isActive: true },
  { id: '4.1', parentId: '4', code: '4.1', name: 'Infraestrutura', type: 'cogs', costGroup: 'cogs', level: 1, displayOrder: 16, description: null, isActive: true },

  // 5. OPEX
  { id: '5', parentId: null, code: '5', name: 'Despesas Operacionais', type: 'opex', costGroup: 'opex', level: 0, displayOrder: 17, description: null, isActive: true },
  { id: '5.1', parentId: '5', code: '5.1', name: 'Pessoal', type: 'opex', costGroup: 'r_and_d', level: 1, displayOrder: 18, description: null, isActive: true },
  { id: '5.2', parentId: '5', code: '5.2', name: 'Marketing', type: 'opex', costGroup: 'sales_marketing', level: 1, displayOrder: 19, description: null, isActive: true },
]

const financialCategoryKeys = {
  all: ['financial-categories'] as const,
  list: () => [...financialCategoryKeys.all, 'list'] as const,
}

export function useFinancialCategories() {
  return useQuery({
    queryKey: financialCategoryKeys.list(),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return mockCategories
    },
  })
}
