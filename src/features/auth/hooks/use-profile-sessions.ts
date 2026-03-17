import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { authApi } from '@/features/auth/lib/auth-api'

export interface ProfileSession {
  id: string
  device: string
  ip: string
  city?: string
  country?: string
  lastActiveAt: string
  isCurrent: boolean
}

const profileSessionKeys = {
  all: ['profile-sessions'] as const,
}

export function useProfileSessions() {
  return useQuery({
    queryKey: profileSessionKeys.all,
    queryFn: async () => {
      const { sessions } = await authApi.getSessions()
      return sessions.map((s, index): ProfileSession => ({
        id: s.id,
        device: s.userAgent,
        ip: s.ipAddress,
        city: s.city ?? undefined,
        country: s.country ?? undefined,
        lastActiveAt: s.lastActivityAt,
        isCurrent: index === 0,
      }))
    },
  })
}

export function useRevokeSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileSessionKeys.all }),
  })
}
