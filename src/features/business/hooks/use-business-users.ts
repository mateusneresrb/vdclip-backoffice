import type { BusinessUser } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const businessUserKeys = {
  all: ['business-users'] as const,
  list: (search: string) => [...businessUserKeys.all, 'list', search] as const,
}

function mapUser(u: Record<string, unknown>): BusinessUser {
  return {
    id: String(u.id ?? ''),
    externalId: String(u.externalId ?? u.id ?? ''),
    name: String(u.name ?? ''),
    email: String(u.email ?? ''),
    avatarUrl: u.avatar ? String(u.avatar) : undefined,
    companyId: String(u.teamId ?? u.companyId ?? ''),
    companyName: String(u.teamName ?? u.companyName ?? ''),
    role: String(u.role ?? 'member'),
    status: (u.status as BusinessUser['status']) ?? 'active',
    createdAt: String(u.createdAt ?? ''),
    lastLogin: (u.lastLoginAt ?? u.lastLogin ?? null) as string | null,
  }
}

export function useBusinessUsers(search: string = '') {
  return useQuery({
    queryKey: businessUserKeys.list(search),
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page: 1,
        per_page: 50,
      }
      if (search.trim()) {
        params.search = search.trim()
      }
      const data = await apiClient.get<{ items: Record<string, unknown>[] }>('/platform/users', params)
      return data.items
        .filter((u) => u.teams && Array.isArray(u.teams) && (u.teams as unknown[]).length > 0)
        .map(mapUser)
    },
  })
}
