import type { AdminTeamDetail } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const teamDetailKeys = {
  all: ['team-detail'] as const,
  byId: (id: string) => [...teamDetailKeys.all, id] as const,
}

function mapTeamDetail(data: Record<string, unknown>): AdminTeamDetail {
  const socialUrls = (data.social_urls ?? data.socialUrls ?? {}) as Record<string, string>
  return {
    id: String(data.id),
    name: String(data.name ?? ''),
    picture: (data.picture as string) ?? null,
    email: (data.email as string) ?? null,
    category: (data.category as string) ?? null,
    socialUrls: {
      youtube: socialUrls.youtube,
      instagram: socialUrls.instagram,
      tiktok: socialUrls.tiktok,
    },
    plan: (data.plan as AdminTeamDetail['plan']) ?? 'free',
    memberCount: Number(data.member_count ?? data.memberCount ?? 0),
    maxMembers: Number(data.max_members ?? data.maxMembers ?? 0),
    storageUsed: Number(data.storage_used ?? data.storageUsed ?? 0),
    storageLimit: Number(data.storage_limit ?? data.storageLimit ?? 0),
    credits: Number(data.credits ?? 0),
    mediaCreated: Number(data.media_created ?? data.mediaCreated ?? 0),
    mediaPosted: Number(data.media_posted ?? data.mediaPosted ?? 0),
    createdAt: String(data.created_at ?? data.createdAt ?? ''),
  }
}

export function useTeamDetail(teamId: string) {
  return useQuery({
    queryKey: teamDetailKeys.byId(teamId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>>(
        `/platform/teams/${teamId}`,
      )
      return mapTeamDetail(data)
    },
  })
}
