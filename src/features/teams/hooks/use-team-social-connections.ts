import type { UserSocialConnection } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

const mockTeamConnections: Record<string, UserSocialConnection[]> = {
  '1': [
    { id: 'tc1-1', platform: 'youtube', displayName: 'VDClip Core', username: '@vdclipcore', connectedAt: '2024-06-15T00:00:00Z', lastUsedAt: '2026-03-05T10:00:00Z', hasError: false, errorMessage: null, postsCount: 280 },
    { id: 'tc1-2', platform: 'instagram', displayName: 'VDClip Core IG', username: '@vdclip.core', connectedAt: '2024-07-01T00:00:00Z', lastUsedAt: '2026-03-04T08:00:00Z', hasError: false, errorMessage: null, postsCount: 128 },
  ],
  '2': [
    { id: 'tc2-1', platform: 'youtube', displayName: 'Gaming Squad', username: '@gamingsquad', connectedAt: '2024-08-20T00:00:00Z', lastUsedAt: '2026-03-05T12:00:00Z', hasError: false, errorMessage: null, postsCount: 95 },
    { id: 'tc2-2', platform: 'tiktok', displayName: 'Gaming Squad TK', username: '@gamingsquad', connectedAt: '2024-09-01T00:00:00Z', lastUsedAt: null, hasError: true, errorMessage: 'Token expirado — reconectar necessario', postsCount: 47 },
  ],
  '3': [
    { id: 'tc3-1', platform: 'youtube', displayName: 'Content Creators', username: '@contentcreators', connectedAt: '2024-09-15T00:00:00Z', lastUsedAt: '2026-03-03T15:00:00Z', hasError: false, errorMessage: null, postsCount: 387 },
  ],
  '6': [
    { id: 'tc6-1', platform: 'youtube', displayName: 'Music Clips', username: '@musicclips', connectedAt: '2024-12-01T00:00:00Z', lastUsedAt: '2026-03-05T11:00:00Z', hasError: false, errorMessage: null, postsCount: 463 },
    { id: 'tc6-2', platform: 'tiktok', displayName: 'Music Clips TK', username: '@musicclips', connectedAt: '2024-12-10T00:00:00Z', lastUsedAt: '2026-03-04T09:00:00Z', hasError: false, errorMessage: null, postsCount: 312 },
    { id: 'tc6-3', platform: 'instagram', displayName: 'Music Clips IG', username: '@musicclips', connectedAt: '2025-01-05T00:00:00Z', lastUsedAt: null, hasError: true, errorMessage: 'Permissao de publicacao revogada', postsCount: 88 },
  ],
  '9': [
    { id: 'tc9-1', platform: 'youtube', displayName: 'Tech Reviews', username: '@techreviews', connectedAt: '2025-05-10T00:00:00Z', lastUsedAt: '2026-03-05T08:00:00Z', hasError: false, errorMessage: null, postsCount: 310 },
    { id: 'tc9-2', platform: 'tiktok', displayName: 'Tech Reviews TK', username: '@techreviews', connectedAt: '2025-06-01T00:00:00Z', lastUsedAt: '2026-03-01T14:00:00Z', hasError: false, errorMessage: null, postsCount: 145 },
  ],
}

const teamConnectionKeys = {
  all: ['team-social-connections'] as const,
  byTeam: (teamId: string) => [...teamConnectionKeys.all, teamId] as const,
}

export function useTeamSocialConnections(teamId: string) {
  return useQuery({
    queryKey: teamConnectionKeys.byTeam(teamId),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400))
      return mockTeamConnections[teamId] ?? []
    },
  })
}
