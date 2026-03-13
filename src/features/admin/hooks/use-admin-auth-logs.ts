import type { AuthLogEntry } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const adminAuthLogsKeys = {
  all: ['admin-auth-logs'] as const,
  search: (query: string) => [...adminAuthLogsKeys.all, query] as const,
}

function mapLogEntry(l: Record<string, unknown>): AuthLogEntry {
  return {
    id: String(l.id ?? ''),
    userId: l.user_id != null ? Number(l.user_id) : (l.userId != null ? Number(l.userId) : null),
    userName: (l.user_name ?? l.userName ?? null) as string | null,
    userEmail: (l.user_email ?? l.userEmail ?? null) as string | null,
    userSource: (l.user_source ?? l.userSource ?? 'vdclip') as AuthLogEntry['userSource'],
    eventType: (l.event_type ?? l.eventType) as AuthLogEntry['eventType'],
    ipAddress: (l.ip_address ?? l.ipAddress ?? null) as string | null,
    userAgent: (l.user_agent ?? l.userAgent ?? null) as string | null,
    metadata: (l.metadata ?? null) as Record<string, unknown> | null,
    createdAt: String(l.created_at ?? l.createdAt ?? ''),
  }
}

export function useAdminAuthLogs(search: string = '') {
  return useQuery({
    queryKey: adminAuthLogsKeys.search(search),
    queryFn: async () => {
      const params: Record<string, string | number | boolean | undefined> = {
        page: 1,
        per_page: 50,
      }
      if (search)
        params.search = search

      const data = await apiClient.get<{ items: Record<string, unknown>[] }>('/platform/auth-logs', params)
      return data.items.map(mapLogEntry)
    },
  })
}
