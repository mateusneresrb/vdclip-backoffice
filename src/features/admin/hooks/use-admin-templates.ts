import type { AdminTemplate } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const adminTemplateKeys = {
  all: ['admin-templates'] as const,
  user: (userId: string) => [...adminTemplateKeys.all, 'user', userId] as const,
  team: (teamId: string) => [...adminTemplateKeys.all, 'team', teamId] as const,
}

function mapTemplate(t: Record<string, unknown>): AdminTemplate {
  return {
    id: String(t.id ?? ''),
    name: String(t.name ?? ''),
    isDefault: Boolean(t.is_default ?? t.isDefault ?? false),
    aspectRatio: (t.aspect_ratio ?? t.aspectRatio ?? 'auto') as AdminTemplate['aspectRatio'],
    settings: (t.settings ?? {}) as AdminTemplate['settings'],
    createdAt: String(t.created_at ?? t.createdAt ?? ''),
    updatedAt: String(t.updated_at ?? t.updatedAt ?? ''),
  }
}

export function useAdminUserTemplates(userId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminTemplateKeys.user(userId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[]>(`/platform/users/${userId}/templates`)
      return data.map(mapTemplate)
    },
    enabled,
  })
}

export function useAdminTeamTemplates(teamId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminTemplateKeys.team(teamId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[]>(`/platform/teams/${teamId}/templates`)
      return data.map(mapTemplate)
    },
    enabled,
  })
}
