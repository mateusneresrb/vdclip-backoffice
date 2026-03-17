import type { SupportedProvider } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const adminProviderKeys = {
  all: ['admin-providers'] as const,
}

function mapProvider(p: Record<string, unknown>): SupportedProvider {
  return {
    id: String(p.id ?? ''),
    name: String(p.name ?? ''),
    slug: String(p.slug ?? ''),
    enabled: Boolean(p.enabled ?? true),
    type: (p.type as SupportedProvider['type']) ?? 'social',
    category: (p.category as SupportedProvider['category']) ?? 'video_source',
    description: p.description ? String(p.description) : undefined,
    connectionCount: p.connectionCount != null ? Number(p.connectionCount) : undefined,
  }
}

export function useAdminProviders() {
  return useQuery({
    queryKey: adminProviderKeys.all,
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[]>('/platform/providers')
      return data.map(mapProvider)
    },
  })
}
