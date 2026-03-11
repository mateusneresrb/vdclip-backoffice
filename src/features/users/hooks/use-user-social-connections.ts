import type { UserSocialConnection } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

const mockConnections: UserSocialConnection[] = [
  { id: '1', platform: 'youtube', displayName: 'Canal Principal', username: '@canalvdclip', connectedAt: '2025-06-01T00:00:00Z', lastUsedAt: '2026-03-05T14:00:00Z', hasError: false, errorMessage: null, postsCount: 48 },
  { id: '2', platform: 'tiktok', displayName: 'VDClip TikTok', username: '@vdclip', connectedAt: '2025-08-15T00:00:00Z', lastUsedAt: '2026-03-04T10:00:00Z', hasError: false, errorMessage: null, postsCount: 132 },
  { id: '3', platform: 'instagram', displayName: 'VDClip Insta', username: '@vdclip.app', connectedAt: '2025-09-10T00:00:00Z', lastUsedAt: null, hasError: true, errorMessage: 'Token expirado — reconectar necessario', postsCount: 27 },
]

const userSocialKeys = {
  all: ['user-social-connections'] as const,
  byUser: (userId: string) => [...userSocialKeys.all, userId] as const,
}

export function useUserSocialConnections(userId: string) {
  return useQuery({
    queryKey: userSocialKeys.byUser(userId),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400))
      return mockConnections
    },
  })
}
