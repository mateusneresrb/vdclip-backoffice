import type { BusinessCompany } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const businessCompanyKeys = {
  all: ['business-companies'] as const,
  list: (search: string) => [...businessCompanyKeys.all, 'list', search] as const,
}

function mapTeamToCompany(t: Record<string, unknown>): BusinessCompany {
  const plan = String(t.plan ?? 'free')
  return {
    id: String(t.id ?? ''),
    externalId: String(t.id ?? ''),
    name: String(t.name ?? ''),
    logoUrl: t.picture ? String(t.picture) : undefined,
    document: null,
    plan,
    status: plan === 'free' ? 'trial' : 'active',
    userCount: Number(t.memberCount ?? 0),
    createdAt: String(t.createdAt ?? ''),
    contactEmail: (t.email as string) ?? null,
  }
}

export function useBusinessCompanies(search: string = '') {
  return useQuery({
    queryKey: businessCompanyKeys.list(search),
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page: 1,
        per_page: 50,
      }
      if (search.trim()) {
        params.search = search.trim()
      }
      const data = await apiClient.get<{ items: Record<string, unknown>[] }>('/platform/teams', params)
      return data.items.map(mapTeamToCompany)
    },
  })
}
