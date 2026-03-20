import type { BackofficeAdmin } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const adminAccountsKeys = {
  all: ['admin-accounts'] as const,
}

function mapAdmin(data: Record<string, unknown>): BackofficeAdmin {
  const firstName = String(data.firstName ?? '')
  const lastName = String(data.lastName ?? '')
  const name = data.name
    ? String(data.name)
    : [firstName, lastName].filter(Boolean).join(' ')

  return {
    id: String(data.id),
    name,
    email: String(data.email ?? ''),
    role: (data.role as BackofficeAdmin['role']) ?? 'viewer',
    avatar: (data.pictureUrl ?? data.avatar) as string | undefined,
    mfaEnabled: Boolean(data.hasMfaEnabled ?? data.mfaEnabled ?? false),
    isActive: Boolean(data.isActive ?? true),
    lastLoginAt: String(data.lastLoginAt ?? ''),
    createdAt: String(data.createdAt ?? ''),
  }
}

export function useAdminAccounts() {
  return useQuery({
    queryKey: adminAccountsKeys.all,
    queryFn: async () => {
      const data = await apiClient.get<
        Record<string, unknown>[]
        | { items: Record<string, unknown>[] }
        | { adminUsers: Record<string, unknown>[] }
      >('/admin-users', { page: 1, per_page: 100 })
      const items = Array.isArray(data)
        ? data
        : ((data as Record<string, unknown>).items ?? (data as Record<string, unknown>).adminUsers ?? []) as Record<string, unknown>[]
      return items.map(mapAdmin)
    },
  })
}
