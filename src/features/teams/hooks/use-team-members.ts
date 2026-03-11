import type { TeamMember } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

const mockMembers: Record<string, TeamMember[]> = {
  '1': [
    { id: 'm1', name: 'Mateus Neres', email: 'mateus@vdclip.com', role: 'owner' },
    { id: 'm2', name: 'Ana Silva', email: 'ana@vdclip.com', role: 'admin' },
    { id: 'm3', name: 'Carlos Souza', email: 'carlos@vdclip.com', role: 'member' },
    { id: 'm4', name: 'Julia Santos', email: 'julia@vdclip.com', role: 'member' },
    { id: 'm5', name: 'Rafael Lima', email: 'rafael@vdclip.com', role: 'member' },
  ],
  '2': [
    { id: 'm6', name: 'Pedro Costa', email: 'pedro@gaming.gg', role: 'owner' },
    { id: 'm7', name: 'Lucas Alves', email: 'lucas@gaming.gg', role: 'admin' },
    { id: 'm8', name: 'Mariana Reis', email: 'mariana@gaming.gg', role: 'member' },
  ],
}

const teamMembersKeys = {
  all: ['team-members'] as const,
  byTeam: (teamId: string) => [...teamMembersKeys.all, teamId] as const,
}

export function useTeamMembers(teamId: string) {
  return useQuery({
    queryKey: teamMembersKeys.byTeam(teamId),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300))
      return mockMembers[teamId] ?? []
    },
  })
}
