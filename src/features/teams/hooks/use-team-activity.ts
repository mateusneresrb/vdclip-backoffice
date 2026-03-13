import type { UserActivityEvent } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const teamActivityKeys = {
  all: ['team-activity'] as const,
  byTeam: (teamId: string) => [...teamActivityKeys.all, teamId] as const,
}

function mapActivityEvent(data: Record<string, unknown>): UserActivityEvent {
  return {
    id: String(data.id),
    type: (data.type as UserActivityEvent['type']) ?? 'login',
    description: String(data.description ?? ''),
    metadata: data.metadata as Record<string, unknown> | undefined,
    createdAt: String(data.created_at ?? data.createdAt ?? ''),
  }
}

export function useTeamActivity(teamId: string) {
  return useQuery({
    queryKey: teamActivityKeys.byTeam(teamId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[] | { items: Record<string, unknown>[] }>(
        `/platform/teams/${teamId}/activity`,
        { limit: 50 },
      )
      const items = Array.isArray(data) ? data : (data.items ?? [])
      return items.map(mapActivityEvent)
    },
  })
}
