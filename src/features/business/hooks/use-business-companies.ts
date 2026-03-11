import type { BusinessCompany } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockBusinessCompanies: BusinessCompany[] = [
  { id: '1', externalId: 'bc_001', name: 'Acme Corp', document: '12.345.678/0001-90', plan: 'enterprise', status: 'active', userCount: 12, createdAt: '2025-04-01T00:00:00Z', contactEmail: 'contato@acmecorp.com' },
  { id: '2', externalId: 'bc_002', name: 'Tech Startup', document: '98.765.432/0001-10', plan: 'business', status: 'active', userCount: 5, createdAt: '2025-07-15T00:00:00Z', contactEmail: 'hello@techstartup.io' },
  { id: '3', externalId: 'bc_003', name: 'Media House', document: '11.222.333/0001-44', plan: 'business', status: 'trial', userCount: 3, createdAt: '2025-11-01T00:00:00Z', contactEmail: 'admin@mediahouse.com.br' },
  { id: '4', externalId: 'bc_004', name: 'Digital Agency', document: null, plan: 'enterprise', status: 'active', userCount: 20, createdAt: '2025-02-10T00:00:00Z', contactEmail: 'ops@digitalagency.com' },
  { id: '5', externalId: 'bc_005', name: 'Studio Pro', document: '55.666.777/0001-88', plan: 'business', status: 'inactive', userCount: 0, createdAt: '2025-09-20T00:00:00Z', contactEmail: null },
]

const businessCompanyKeys = {
  all: ['business-companies'] as const,
  list: (search: string) => [...businessCompanyKeys.all, 'list', search] as const,
}

export function useBusinessCompanies(search: string = '') {
  return useQuery({
    queryKey: businessCompanyKeys.list(search),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      if (!search) 
return mockBusinessCompanies
      const q = search.toLowerCase()
      return mockBusinessCompanies.filter(
        (c) => c.name.toLowerCase().includes(q) || c.contactEmail?.toLowerCase().includes(q) || c.document?.includes(q),
      )
    },
  })
}
