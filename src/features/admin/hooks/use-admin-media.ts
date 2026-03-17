import type { AdminMedia, MediaResult } from '../types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
    externalId: (m.externalId ?? null) as string | null,
    title: String(m.title ?? ''),
    url: (m.url ?? null) as string | null,
    thumbnailUrl: (m.thumbnailUrl ?? null) as string | null,
    status: (m.status as AdminMedia['status']) ?? 'pending',
    aiType: (m.aiType ?? null) as AdminMedia['aiType'],
    aspectRatio: String(m.aspectRatio ?? 'auto'),
    category: (m.category ?? null) as string | null,
    language: String(m.language ?? 'en'),
    provider: (m.provider ?? null) as string | null,
    processStep: Number(m.processStep ?? 0),
    clipLengths: (m.clipLengths ?? null) as string[] | null,
    errorCode: (m.errorCode ?? null) as string | null,
    deletedAt: (m.deletedAt ?? null) as string | null,
    resultsCount: Number(m.resultsCount ?? 0),
    newVersion: Boolean(m.newVersion ?? false),
    ownerId: String(m.ownerId ?? ''),
    ownerType: (m.ownerType ?? 'USER') as 'USER' | 'TEAM',
  }
}

function parseHighlightTags(raw: unknown): string[] | null {
  if (!raw) 
return null
  const arr = Array.isArray(raw) ? raw : [raw]
  // Tags may come as ["#Tag1 #Tag2 #Tag3"] (single string with all tags)
  return arr
    .flatMap((item: unknown) => String(item).split(/\s+/))
    .map((t: string) => t.replace(/^#+/, '').trim())
    .filter(Boolean)
}

function mapRenderingStatus(raw: unknown): MediaResult['renderingStatus'] {
  const status = String(raw ?? 'pending')
  if (status === 'error') 
return 'failed'
  return status as MediaResult['renderingStatus']
}

function mapResult(r: Record<string, unknown>): MediaResult {
  return {
    id: String(r.id ?? ''),
    title: String(r.title ?? ''),
    description: (r.description ?? null) as string | null,
    highlightTags: parseHighlightTags(r.highlightTags),
    thumbnailUrl: (r.thumbnailUrl ?? null) as string | null,
    viralityScore: r.viralityScore != null ? Number(r.viralityScore) : null,
    projectVersion: Number(r.projectVersion ?? 0),
    renderingStatus: mapRenderingStatus(r.renderingStatus),
    processId: r.processId as string | undefined,
    newVersion: Boolean(r.newVersion ?? false),
    ownerId: r.ownerId as string | undefined,
    ownerType: r.ownerType as 'USER' | 'TEAM' | undefined,
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

export function useAdminMediaResults(mediaId: string, enabled: boolean, userId?: string) {
  return useQuery({
    queryKey: adminMediaKeys.results(mediaId),
    queryFn: async () => {
      if (!userId) 
return []
      const data = await apiClient.get<Record<string, unknown>[]>(`/platform/users/${userId}/media/${mediaId}/results`)
      return data.map(mapResult)
    },
    enabled: enabled && !!userId,
  })
}

export function useMediaMutations() {
  const queryClient = useQueryClient()

  const softDelete = useMutation({
    mutationFn: (mediaId: string) => apiClient.delete(`/platform/media/${mediaId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMediaKeys.all }),
  })

  const restore = useMutation({
    mutationFn: (mediaId: string) => apiClient.post(`/platform/media/${mediaId}/restore`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMediaKeys.all }),
  })

  const reprocess = useMutation({
    mutationFn: (mediaId: string) => apiClient.post(`/platform/media/${mediaId}/reprocess`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMediaKeys.all }),
  })

  const renderResult = useMutation({
    mutationFn: (resultId: string) => apiClient.post(`/platform/results/${resultId}/render`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMediaKeys.all }),
  })

  return { softDelete, restore, reprocess, renderResult }
}
