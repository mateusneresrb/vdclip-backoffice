import type { SessionResponse } from '@/features/auth/types'
import type { AdminSession } from '../types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { authApi } from '@/features/auth/lib/auth-api'
import { useAuthStore } from '@/features/auth/stores/auth-store'
import i18n from '@/i18n'
import { showSuccessToast } from '@/lib/toast'

const adminSessionsKeys = {
  all: ['admin-sessions'] as const,
}

function mapSession(
  s: SessionResponse,
  admin: { id: string, name: string },
  isCurrent: boolean,
): AdminSession {
  return {
    id: s.id,
    adminId: admin.id,
    adminName: admin.name,
    ipAddress: s.ip_address,
    userAgent: s.user_agent,
    city: s.city ?? undefined,
    region: s.region ?? undefined,
    country: s.country ?? undefined,
    lastActivityAt: s.last_activity_at,
    createdAt: s.created_at,
    isCurrent,
  }
}

export function useAdminSessions() {
  const admin = useAuthStore((s) => s.admin)

  return useQuery({
    queryKey: adminSessionsKeys.all,
    queryFn: async () => {
      const { sessions } = await authApi.getSessions()
      const adminInfo = { id: admin?.id ?? '', name: admin?.name ?? '' }
      // Backend returns sessions ordered by last_activity_at DESC — first is the current session
      return sessions.map((s, index) => mapSession(s, adminInfo, index === 0))
    },
  })
}

export function useRevokeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSessionsKeys.all })
      showSuccessToast({ title: i18n.t('admin:toast.sessionRevoked') })
    },
  })
}

export function useRevokeOtherSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sessionIds: string[]) => {
      await Promise.all(sessionIds.map((id) => authApi.revokeSession(id)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSessionsKeys.all })
      showSuccessToast({ title: i18n.t('admin:toast.allSessionsRevoked') })
    },
  })
}
