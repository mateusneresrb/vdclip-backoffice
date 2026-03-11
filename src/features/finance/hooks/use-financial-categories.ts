import type { FinancialCategory } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockCategories: FinancialCategory[] = [
  // 1. Ativo (Asset)
  { id: '1', parentId: null, code: '1', name: 'Ativo', type: 'asset' },
  { id: '1.1', parentId: '1', code: '1.1', name: 'Circulante', type: 'asset' },
  { id: '1.1.1', parentId: '1.1', code: '1.1.1', name: 'Caixa', type: 'asset' },
  { id: '1.1.2', parentId: '1.1', code: '1.1.2', name: 'Bancos', type: 'asset' },
  { id: '1.1.3', parentId: '1.1', code: '1.1.3', name: 'Contas a Receber', type: 'asset' },
  { id: '1.2', parentId: '1', code: '1.2', name: 'Nao Circulante', type: 'asset' },

  // 2. Passivo (Liability)
  { id: '2', parentId: null, code: '2', name: 'Passivo', type: 'liability' },
  { id: '2.1', parentId: '2', code: '2.1', name: 'Circulante', type: 'liability' },
  { id: '2.1.1', parentId: '2.1', code: '2.1.1', name: 'Fornecedores', type: 'liability' },
  { id: '2.1.2', parentId: '2.1', code: '2.1.2', name: 'Impostos', type: 'liability' },

  // 3. Receitas (Revenue)
  { id: '3', parentId: null, code: '3', name: 'Receitas', type: 'revenue' },
  { id: '3.1', parentId: '3', code: '3.1', name: 'Assinaturas', type: 'revenue' },
  { id: '3.2', parentId: '3', code: '3.2', name: 'Creditos', type: 'revenue' },
  { id: '3.3', parentId: '3', code: '3.3', name: 'Servicos', type: 'revenue' },

  // 4. Despesas (Expense)
  { id: '4', parentId: null, code: '4', name: 'Despesas', type: 'expense' },
  { id: '4.1', parentId: '4', code: '4.1', name: 'Infraestrutura', type: 'expense' },
  { id: '4.2', parentId: '4', code: '4.2', name: 'Pessoal', type: 'expense' },
  { id: '4.3', parentId: '4', code: '4.3', name: 'Marketing', type: 'expense' },
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
