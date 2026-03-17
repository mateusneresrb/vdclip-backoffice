import type { TeamInvitation } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const teamInvitationsKeys = {
  all: ['team-invitations'] as const,
  byTeam: (teamId: string) => [...teamInvitationsKeys.all, teamId] as const,
}

function mapInvitation(data: Record<string, unknown>): TeamInvitation {
  return {
    id: String(data.id),
    email: String(data.email ?? ''),
    role: (data.role as TeamInvitation['role']) ?? 'member',
    status: (data.status as TeamInvitation['status']) ?? 'pending',
    invitedBy: String(data.invitedBy ?? ''),
    createdAt: String(data.createdAt ?? ''),
    expiresAt: String(data.expiresAt ?? ''),
  }
}

export function useTeamInvitations(teamId: string) {
  return useQuery({
    queryKey: teamInvitationsKeys.byTeam(teamId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[] | { items: Record<string, unknown>[] }>(
        `/platform/teams/${teamId}/invitations`,
      )
      const items = Array.isArray(data) ? data : (data.items ?? [])
      return items.map(mapInvitation)
    },
  })
}
