import type { AdminTeamOverview } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

export type TeamSearchField = 'name' | 'id'
export interface TeamSearchQuery {
  field: TeamSearchField
  value: string
}

const adminTeamsKeys = {
  all: ['admin-teams'] as const,
  search: (q: TeamSearchQuery) => [...adminTeamsKeys.all, q.field, q.value] as const,
}

function mapTeam(t: Record<string, unknown>): AdminTeamOverview {
  return {
    id: String(t.id ?? ''),
    name: String(t.name ?? ''),
    memberCount: Number(t.member_count ?? t.memberCount ?? 0),
    plan: (t.plan as AdminTeamOverview['plan']) ?? 'free',
    category: (t.category ?? null) as string | null,
    createdAt: String(t.created_at ?? t.createdAt ?? ''),
  }
}

export function useAdminTeams(query: TeamSearchQuery = { field: 'name', value: '' }) {
  return useQuery({
    queryKey: adminTeamsKeys.search(query),
    queryFn: async () => {
      const params: Record<string, string | number | boolean | undefined> = {
        page: 1,
        per_page: 50,
      }
      if (query.value.trim()) {
        params.search = query.value.trim()
      }

      const data = await apiClient.get<{ items: Record<string, unknown>[] }>('/platform/teams', params)
      return data.items.map(mapTeam)
    },
  })
}
