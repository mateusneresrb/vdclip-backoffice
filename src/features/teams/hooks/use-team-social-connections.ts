import type { UserSocialConnection } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const teamConnectionKeys = {
  all: ['team-social-connections'] as const,
  byTeam: (teamId: string) => [...teamConnectionKeys.all, teamId] as const,
}

function mapConnection(data: Record<string, unknown>): UserSocialConnection {
  return {
    id: String(data.id),
    platform: String(data.platform ?? ''),
    displayName: String(data.display_name ?? data.displayName ?? ''),
    username: String(data.username ?? ''),
    connectedAt: String(data.connected_at ?? data.connectedAt ?? ''),
    lastUsedAt: (data.last_used_at ?? data.lastUsedAt ?? null) as string | null,
    hasError: Boolean(data.has_error ?? data.hasError ?? false),
    errorMessage: (data.error_message ?? data.errorMessage ?? null) as string | null,
    postsCount: Number(data.posts_count ?? data.postsCount ?? 0),
  }
}

export function useTeamSocialConnections(teamId: string) {
  return useQuery({
    queryKey: teamConnectionKeys.byTeam(teamId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[] | { items: Record<string, unknown>[] }>(
        `/platform/teams/${teamId}/social-connections`,
      )
      const items = Array.isArray(data) ? data : (data.items ?? [])
      return items.map(mapConnection)
    },
  })
}
