import type { TeamMember } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const teamMembersKeys = {
  all: ['team-members'] as const,
  byTeam: (teamId: string) => [...teamMembersKeys.all, teamId] as const,
}

function mapMember(data: Record<string, unknown>): TeamMember {
  return {
    id: String(data.id),
    name: String(data.name ?? ''),
    email: String(data.email ?? ''),
    role: (data.role as TeamMember['role']) ?? 'member',
    avatar: data.avatar as string | undefined,
  }
}

export function useTeamMembers(teamId: string) {
  return useQuery({
    queryKey: teamMembersKeys.byTeam(teamId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[] | { items: Record<string, unknown>[] }>(
        `/platform/teams/${teamId}/members`,
      )
      const items = Array.isArray(data) ? data : (data.items ?? [])
      return items.map(mapMember)
    },
  })
}
