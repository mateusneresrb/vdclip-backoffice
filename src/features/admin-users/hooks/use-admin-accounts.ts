import type { BackofficeAdmin } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const adminAccountsKeys = {
  all: ['admin-accounts'] as const,
}

function mapAdmin(data: Record<string, unknown>): BackofficeAdmin {
  const firstName = String(data.first_name ?? '')
  const lastName = String(data.last_name ?? '')
  const name = data.name
    ? String(data.name)
    : [firstName, lastName].filter(Boolean).join(' ')

  return {
    id: String(data.id),
    name,
    email: String(data.email ?? ''),
    role: (data.role as BackofficeAdmin['role']) ?? 'viewer',
    avatar: (data.picture_url ?? data.avatar) as string | undefined,
    mfaEnabled: Boolean(data.has_mfa_enabled ?? data.mfaEnabled ?? false),
    isActive: Boolean(data.is_active ?? data.isActive ?? true),
    lastLoginAt: String(data.last_login_at ?? data.lastLoginAt ?? ''),
    createdAt: String(data.created_at ?? data.createdAt ?? ''),
  }
}

export function useAdminAccounts() {
  return useQuery({
    queryKey: adminAccountsKeys.all,
    queryFn: async () => {
      const data = await apiClient.get<
        Record<string, unknown>[]
        | { items: Record<string, unknown>[] }
        | { admin_users: Record<string, unknown>[] }
      >('/admin-users', { page: 1, per_page: 100 })
      const items = Array.isArray(data)
        ? data
        : ((data as Record<string, unknown>).items ?? (data as Record<string, unknown>).admin_users ?? []) as Record<string, unknown>[]
      return items.map(mapAdmin)
    },
  })
}
