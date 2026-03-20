import type { UserSocialConnection } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const userSocialKeys = {
  all: ['user-social-connections'] as const,
  byUser: (userId: string) => [...userSocialKeys.all, userId] as const,
}

function mapConnection(data: Record<string, unknown>): UserSocialConnection {
  return {
    id: String(data.id),
    platform: String(data.platform ?? ''),
    displayName: String(data.displayName ?? ''),
    username: String(data.username ?? ''),
    connectedAt: String(data.connectedAt ?? ''),
    lastUsedAt: (data.lastUsedAt ?? null) as string | null,
    hasError: Boolean(data.hasError ?? false),
    errorMessage: (data.errorMessage ?? null) as string | null,
    postsCount: Number(data.postsCount ?? 0),
  }
}

export function useUserSocialConnections(userId: string) {
  return useQuery({
    queryKey: userSocialKeys.byUser(userId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[] | { items: Record<string, unknown>[] }>(
        `/platform/users/${userId}/social-connections`,
      )
      const items = Array.isArray(data) ? data : (data.items ?? [])
      return items.map(mapConnection)
    },
  })
}
