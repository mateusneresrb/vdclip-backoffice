import type { UserActivityEvent } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const userActivityKeys = {
  all: ['user-activity'] as const,
  byUser: (userId: string) => [...userActivityKeys.all, userId] as const,
}

function mapActivityEvent(data: Record<string, unknown>): UserActivityEvent {
  return {
    id: String(data.id),
    type: (data.type as UserActivityEvent['type']) ?? 'login',
    description: String(data.description ?? ''),
    metadata: data.metadata as Record<string, unknown> | undefined,
    createdAt: String(data.createdAt ?? ''),
  }
}

export function useUserActivity(userId: string) {
  return useQuery({
    queryKey: userActivityKeys.byUser(userId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[] | { items: Record<string, unknown>[] }>(
        `/platform/users/${userId}/activity`,
        { limit: 50 },
      )
      const items = Array.isArray(data) ? data : (data.items ?? [])
      return items.map(mapActivityEvent)
    },
  })
}
