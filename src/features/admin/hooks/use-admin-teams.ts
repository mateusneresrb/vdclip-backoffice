import type { AdminTeamOverview } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockTeams: AdminTeamOverview[] = [
  { id: '1', name: 'VDClip Core', memberCount: 5, plan: 'ultimate', category: 'technology', createdAt: '2024-06-01T00:00:00Z' },
  { id: '2', name: 'Gaming Squad', memberCount: 3, plan: 'premium', category: 'gaming', createdAt: '2024-08-15T00:00:00Z' },
  { id: '3', name: 'Content Creators', memberCount: 8, plan: 'premium', category: 'entertainment', createdAt: '2024-09-10T00:00:00Z' },
  { id: '4', name: 'Edu Channel', memberCount: 2, plan: 'lite', category: 'education', createdAt: '2025-01-05T00:00:00Z' },
  { id: '5', name: 'Sports Highlights', memberCount: 4, plan: 'premium', category: 'sports', createdAt: '2025-02-20T00:00:00Z' },
  { id: '6', name: 'Music Clips', memberCount: 6, plan: 'ultimate', category: 'music', createdAt: '2024-11-30T00:00:00Z' },
  { id: '7', name: 'Travel Vloggers', memberCount: 4, plan: 'premium', category: 'travel', createdAt: '2025-03-12T00:00:00Z' },
  { id: '8', name: 'Cooking Channel', memberCount: 2, plan: 'lite', category: 'food', createdAt: '2025-04-20T00:00:00Z' },
  { id: '9', name: 'Tech Reviews', memberCount: 7, plan: 'premium', category: 'technology', createdAt: '2025-05-08T00:00:00Z' },
  { id: '10', name: 'Comedy Squad', memberCount: 5, plan: 'premium', category: 'entertainment', createdAt: '2025-06-15T00:00:00Z' },
  { id: '11', name: 'Fitness Nation', memberCount: 3, plan: 'lite', category: 'sports', createdAt: '2025-07-22T00:00:00Z' },
  { id: '12', name: 'Pixel Studio', memberCount: 9, plan: 'ultimate', category: 'technology', createdAt: '2025-08-01T00:00:00Z' },
]

export type TeamSearchField = 'name' | 'id'
export interface TeamSearchQuery {
  field: TeamSearchField
  value: string
}

const adminTeamsKeys = {
  all: ['admin-teams'] as const,
  search: (q: TeamSearchQuery) => [...adminTeamsKeys.all, q.field, q.value] as const,
}

export function useAdminTeams(query: TeamSearchQuery = { field: 'name', value: '' }) {
  return useQuery({
    queryKey: adminTeamsKeys.search(query),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      if (!query.value.trim()) 
return mockTeams
      const q = query.value.trim().toLowerCase()
      return mockTeams.filter((t) => {
        if (query.field === 'name') 
return t.name.toLowerCase().includes(q)
        if (query.field === 'id') 
return t.id.toLowerCase().includes(q)
        return true
      })
    },
  })
}
