import type { BackofficeAdmin } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockAdmins: BackofficeAdmin[] = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@vdclip.com',
    role: 'super_admin',
    avatar: undefined,
    mfaEnabled: true,
    isActive: true,
    lastLoginAt: '2026-03-06T10:00:00Z',
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: '2',
    name: 'Financeiro',
    email: 'financeiro@vdclip.com',
    role: 'finance_admin',
    avatar: undefined,
    mfaEnabled: true,
    isActive: true,
    lastLoginAt: '2026-03-05T16:30:00Z',
    createdAt: '2025-03-10T09:00:00Z',
  },
  {
    id: '3',
    name: 'Suporte',
    email: 'suporte@vdclip.com',
    role: 'support',
    avatar: undefined,
    mfaEnabled: false,
    isActive: true,
    lastLoginAt: '2026-03-06T08:45:00Z',
    createdAt: '2025-06-20T14:00:00Z',
  },
  {
    id: '4',
    name: 'Visualizador',
    email: 'viewer@vdclip.com',
    role: 'viewer',
    avatar: undefined,
    mfaEnabled: false,
    isActive: false,
    lastLoginAt: '2026-02-20T11:00:00Z',
    createdAt: '2025-09-01T10:00:00Z',
  },
]

const adminAccountsKeys = {
  all: ['admin-accounts'] as const,
}

export function useAdminAccounts() {
  return useQuery({
    queryKey: adminAccountsKeys.all,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return mockAdmins
    },
  })
}
