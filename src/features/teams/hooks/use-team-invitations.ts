import type { TeamInvitation } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

const mockInvitations: Record<string, TeamInvitation[]> = {
  '1': [
    { id: 'inv1', email: 'newdev@vdclip.com', role: 'member', status: 'pending', invitedBy: 'Mateus Neres', createdAt: '2026-03-01T10:00:00Z', expiresAt: '2026-03-08T10:00:00Z' },
    { id: 'inv2', email: 'designer@vdclip.com', role: 'admin', status: 'accepted', invitedBy: 'Mateus Neres', createdAt: '2026-02-15T09:00:00Z', expiresAt: '2026-02-22T09:00:00Z' },
    { id: 'inv3', email: 'freelancer@email.com', role: 'member', status: 'expired', invitedBy: 'Ana Silva', createdAt: '2026-01-10T14:00:00Z', expiresAt: '2026-01-17T14:00:00Z' },
  ],
  '2': [
    { id: 'inv4', email: 'streamer@gaming.gg', role: 'member', status: 'pending', invitedBy: 'Pedro Costa', createdAt: '2026-03-04T16:00:00Z', expiresAt: '2026-03-11T16:00:00Z' },
  ],
}

const teamInvitationsKeys = {
  all: ['team-invitations'] as const,
  byTeam: (teamId: string) => [...teamInvitationsKeys.all, teamId] as const,
}

export function useTeamInvitations(teamId: string) {
  return useQuery({
    queryKey: teamInvitationsKeys.byTeam(teamId),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300))
      return mockInvitations[teamId] ?? []
    },
  })
}
