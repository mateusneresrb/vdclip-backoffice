import type { AdminRoleInfo } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const adminRolesKeys = {
  all: ['admin-roles'] as const,
}

function mapRole(data: Record<string, unknown>): AdminRoleInfo {
  return {
    id: String(data.id),
    name: (data.name as AdminRoleInfo['name']) ?? 'viewer',
    displayName: String(data.display_name ?? data.displayName ?? data.name ?? ''),
    description: String(data.description ?? ''),
    permissionCount: Number(data.permission_count ?? data.permissionCount ?? 0),
    adminCount: Number(data.admin_count ?? data.adminCount ?? 0),
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
