import type { BusinessUser } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockBusinessUsers: BusinessUser[] = [
  { id: '1', externalId: 'bu_001', name: 'Carlos Silva', email: 'carlos@acmecorp.com', companyId: '1', companyName: 'Acme Corp', role: 'admin', status: 'active', createdAt: '2025-06-01T00:00:00Z', lastLogin: '2026-03-05T14:30:00Z' },
  { id: '2', externalId: 'bu_002', name: 'Ana Oliveira', email: 'ana@techstartup.io', companyId: '2', companyName: 'Tech Startup', role: 'editor', status: 'active', createdAt: '2025-08-15T00:00:00Z', lastLogin: '2026-03-04T10:00:00Z' },
  { id: '3', externalId: 'bu_003', name: 'Pedro Santos', email: 'pedro@acmecorp.com', companyId: '1', companyName: 'Acme Corp', role: 'viewer', status: 'active', createdAt: '2025-09-10T00:00:00Z', lastLogin: '2026-03-01T09:00:00Z' },
  { id: '4', externalId: 'bu_004', name: 'Maria Costa', email: 'maria@mediahouse.com.br', companyId: '3', companyName: 'Media House', role: 'admin', status: 'inactive', createdAt: '2025-11-20T00:00:00Z', lastLogin: null },
  { id: '5', externalId: 'bu_005', name: 'Lucas Ferreira', email: 'lucas@techstartup.io', companyId: '2', companyName: 'Tech Startup', role: 'admin', status: 'active', createdAt: '2025-12-01T00:00:00Z', lastLogin: '2026-03-06T08:00:00Z' },
]

const businessUserKeys = {
  all: ['business-users'] as const,
  list: (search: string) => [...businessUserKeys.all, 'list', search] as const,
}

export function useBusinessUsers(search: string = '') {
  return useQuery({
    queryKey: businessUserKeys.list(search),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      if (!search) 
return mockBusinessUsers
      const q = search.toLowerCase()
      return mockBusinessUsers.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.companyName.toLowerCase().includes(q),
      )
    },
  })
}
