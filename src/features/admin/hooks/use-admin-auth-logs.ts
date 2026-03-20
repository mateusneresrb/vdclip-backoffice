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
    userId: l.userId != null ? Number(l.userId) : null,
    userName: (l.userName ?? null) as string | null,
    userEmail: (l.userEmail ?? null) as string | null,
    userSource: (l.userSource ?? 'vdclip') as AuthLogEntry['userSource'],
    eventType: l.eventType as AuthLogEntry['eventType'],
    ipAddress: (l.ipAddress ?? null) as string | null,
    userAgent: (l.userAgent ?? null) as string | null,
    metadata: (l.metadata ?? null) as Record<string, unknown> | null,
    createdAt: String(l.createdAt ?? ''),
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
