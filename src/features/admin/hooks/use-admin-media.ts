import type { AdminMedia, MediaResult } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

export const adminMediaKeys = {
  all: ['admin-media'] as const,
  user: (userId: string) => [...adminMediaKeys.all, 'user', userId] as const,
  team: (teamId: string) => [...adminMediaKeys.all, 'team', teamId] as const,
  results: (mediaId: string) =>
    [...adminMediaKeys.all, 'results', mediaId] as const,
}

function mapMedia(m: Record<string, unknown>): AdminMedia {
  return {
    id: String(m.id ?? ''),
    externalId: (m.external_id ?? m.externalId ?? null) as string | null,
    title: String(m.title ?? ''),
    url: (m.url ?? null) as string | null,
    thumbnailUrl: (m.thumbnail_url ?? m.thumbnailUrl ?? null) as string | null,
    status: (m.status as AdminMedia['status']) ?? 'pending',
    aiType: (m.ai_type ?? m.aiType ?? null) as AdminMedia['aiType'],
    aspectRatio: String(m.aspect_ratio ?? m.aspectRatio ?? 'auto'),
    category: (m.category ?? null) as string | null,
    language: String(m.language ?? 'en'),
    provider: (m.provider ?? null) as string | null,
    processStep: Number(m.process_step ?? m.processStep ?? 0),
    clipLengths: (m.clip_lengths ?? m.clipLengths ?? null) as string[] | null,
    errorCode: (m.error_code ?? m.errorCode ?? null) as string | null,
    deletedAt: (m.deleted_at ?? m.deletedAt ?? null) as string | null,
    resultsCount: Number(m.results_count ?? m.resultsCount ?? 0),
  }
}

function mapResult(r: Record<string, unknown>): MediaResult {
  return {
    id: String(r.id ?? ''),
    title: String(r.title ?? ''),
    description: (r.description ?? null) as string | null,
    highlightTags: (r.highlight_tags ?? r.highlightTags ?? null) as string[] | null,
    thumbnailUrl: (r.thumbnail_url ?? r.thumbnailUrl ?? null) as string | null,
    viralityScore: r.virality_score != null ? Number(r.virality_score) : (r.viralityScore != null ? Number(r.viralityScore) : null),
    projectVersion: Number(r.project_version ?? r.projectVersion ?? 0),
    renderingStatus: (r.rendering_status ?? r.renderingStatus ?? 'pending') as MediaResult['renderingStatus'],
  }
}

export function useAdminUserMedia(userId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminMediaKeys.user(userId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[]>(`/platform/users/${userId}/media`)
      return data.map(mapMedia)
    },
    enabled,
  })
}

export function useAdminTeamMedia(teamId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminMediaKeys.team(teamId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[]>(`/platform/teams/${teamId}/media`)
      return data.map(mapMedia)
    },
    enabled,
  })
}

export function useAdminMediaResults(mediaId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminMediaKeys.results(mediaId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[]>(`/platform/media/${mediaId}/results`)
      return data.map(mapResult)
    },
    enabled,
  })
}
