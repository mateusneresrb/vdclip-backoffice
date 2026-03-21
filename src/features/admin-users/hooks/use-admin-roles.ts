import type { AdminRoleInfo } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const adminRolesKeys = {
  all: ['admin-roles'] as const,
}

function mapRole(data: Record<string, unknown>): AdminRoleInfo {
  return {
    id: String(data.id),
    name: (data.slug as AdminRoleInfo['name']) ?? 'viewer',
    displayName: String(data.name ?? data.slug ?? ''),
    description: String(data.description ?? ''),
    permissionCount: Number(data.permissionCount ?? 0),
    adminCount: Number(data.adminCount ?? 0),
    isSystem: Boolean(data.isSystem ?? false),
  }
}

export function useAdminRoles() {
  return useQuery({
    queryKey: adminRolesKeys.all,
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[] | { items: Record<string, unknown>[] }>(
        '/admin-roles',
      )
      const items = Array.isArray(data) ? data : (data.items ?? [])
      return items.map(mapRole)
    },
  })
}
