import type { ScheduledPost, ScheduledPostStatus } from '../types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { i18n } from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showMutationError } from '@/lib/toast'

export const adminScheduledPostsKeys = {
  all: ['admin-scheduled-posts'] as const,
  user: (userId: string) => [...adminScheduledPostsKeys.all, 'user', userId] as const,
  team: (teamId: string) => [...adminScheduledPostsKeys.all, 'team', teamId] as const,
}

function mapPost(p: Record<string, unknown>): ScheduledPost {
  return {
    id: String(p.id ?? ''),
    platform: String(p.platform ?? ''),
    title: String(p.title ?? ''),
    description: (p.description ?? null) as string | null,
    thumbnailUrl: (p.thumbnailUrl ?? null) as string | null,
    status: (p.status as ScheduledPostStatus) ?? 'pending',
    scheduledAt: (p.scheduledAt ?? null) as string | null,
    publishedAt: (p.publishedAt ?? null) as string | null,
    lastAttemptedAt: (p.lastAttemptedAt ?? null) as string | null,
    socialPublishId: (p.socialPublishId ?? null) as string | null,
    retryCount: Number(p.retryCount ?? 0),
    errorMessage: (p.errorMessage ?? null) as string | null,
    projectResultId: (p.projectResultId ?? null) as string | null,
    socialConnectionId: String(p.socialConnectionId ?? ''),
    createdAt: String(p.createdAt ?? ''),
    updatedAt: String(p.updatedAt ?? ''),
  }
}

export function useAdminUserScheduledPosts(userId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminScheduledPostsKeys.user(userId),
    queryFn: async () => {
      const data = await apiClient.get<{ items: Record<string, unknown>[] }>(
        `/platform/users/${userId}/scheduled-posts`,
        { page: 1, per_page: 50 },
      )
      return data.items.map(mapPost)
    },
    enabled,
  })
}

export function useAdminTeamScheduledPosts(teamId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminScheduledPostsKeys.team(teamId),
    queryFn: async () => {
      const data = await apiClient.get<{ items: Record<string, unknown>[] }>(
        `/platform/teams/${teamId}/scheduled-posts`,
        { page: 1, per_page: 50 },
      )
      return data.items.map(mapPost)
    },
    enabled,
  })
}

export interface UpdateScheduledPostInput {
  title?: string
  description?: string | null
  scheduledAt?: string | null
  status?: ScheduledPostStatus
}

export function useUpdateScheduledPost(scope: 'user' | 'team', scopeId: string) {
  const queryClient = useQueryClient()
  const key =
    scope === 'user'
      ? adminScheduledPostsKeys.user(scopeId)
      : adminScheduledPostsKeys.team(scopeId)

  return useMutation({
    mutationFn: async ({ postId, data }: { postId: string; data: UpdateScheduledPostInput }) => {
      const body: Record<string, unknown> = {}
      if (data.title !== undefined)
body.title = data.title
      if (data.description !== undefined)
body.description = data.description
      if (data.scheduledAt !== undefined)
body.scheduledAt = data.scheduledAt
      if (data.status !== undefined)
body.status = data.status

      await apiClient.patch(`/platform/scheduled-posts/${postId}`, body)
      return { postId, data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:toast.scheduledPostUpdateError'))
    },
  })
}

export function useCancelScheduledPost(scope: 'user' | 'team', scopeId: string) {
  const queryClient = useQueryClient()
  const key =
    scope === 'user'
      ? adminScheduledPostsKeys.user(scopeId)
      : adminScheduledPostsKeys.team(scopeId)

  return useMutation({
    mutationFn: async (postId: string) => {
      await apiClient.delete(`/platform/scheduled-posts/${postId}`)
      return postId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:toast.scheduledPostCancelError'))
    },
  })
}
