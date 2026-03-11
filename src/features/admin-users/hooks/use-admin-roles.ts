import type { AdminRoleInfo } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockRoles: AdminRoleInfo[] = [
  {
    id: '1',
    name: 'super_admin',
    displayName: 'Super Administrador',
    description: 'Acesso total a todas as funcionalidades do backoffice',
    permissionCount: 17,
    adminCount: 1,
  },
  {
    id: '2',
    name: 'finance_admin',
    displayName: 'Administrador Financeiro',
    description: 'Gerenciamento financeiro, assinaturas e métricas',
    permissionCount: 6,
    adminCount: 1,
  },
  {
    id: '3',
    name: 'finance_viewer',
    displayName: 'Visualizador Financeiro',
    description: 'Visualização de dados financeiros e métricas (somente leitura)',
    permissionCount: 3,
    adminCount: 0,
  },
  {
    id: '4',
    name: 'support',
    displayName: 'Suporte',
    description: 'Gerenciamento de usuários, times e assinaturas',
    permissionCount: 4,
    adminCount: 1,
  },
  {
    id: '5',
    name: 'viewer',
    displayName: 'Visualizador',
    description: 'Acesso somente leitura a usuários, times e métricas',
    permissionCount: 3,
    adminCount: 1,
  },
]

const adminRolesKeys = {
  all: ['admin-roles'] as const,
}

export function useAdminRoles() {
  return useQuery({
    queryKey: adminRolesKeys.all,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return mockRoles
    },
  })
}
