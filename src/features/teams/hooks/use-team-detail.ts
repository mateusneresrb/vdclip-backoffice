import type { AdminTeamDetail } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

const mockTeamDetails: Record<string, AdminTeamDetail> = {
  '1': { id: '1', name: 'VDClip Core', picture: null, email: 'core@vdclip.com', category: 'technology', socialUrls: { youtube: 'https://youtube.com/@vdclip', instagram: 'https://instagram.com/vdclip' }, plan: 'ultimate', memberCount: 5, maxMembers: 10, storageUsed: 12.5, storageLimit: 50, credits: 5000, mediaCreated: 340, mediaPosted: 280, createdAt: '2024-06-01T00:00:00Z' },
  '2': { id: '2', name: 'Gaming Squad', picture: null, email: 'gaming@squad.gg', category: 'gaming', socialUrls: { youtube: 'https://youtube.com/@gamingsquad', tiktok: 'https://tiktok.com/@gamingsquad' }, plan: 'premium', memberCount: 3, maxMembers: 5, storageUsed: 8.2, storageLimit: 25, credits: 1500, mediaCreated: 120, mediaPosted: 95, createdAt: '2024-08-15T00:00:00Z' },
  '3': { id: '3', name: 'Content Creators', picture: null, email: null, category: 'entertainment', socialUrls: {}, plan: 'premium', memberCount: 8, maxMembers: 10, storageUsed: 18.7, storageLimit: 25, credits: 3200, mediaCreated: 450, mediaPosted: 387, createdAt: '2024-09-10T00:00:00Z' },
  '4': { id: '4', name: 'Edu Channel', picture: null, email: 'edu@channel.com', category: 'education', socialUrls: { youtube: 'https://youtube.com/@educhannel' }, plan: 'lite', memberCount: 2, maxMembers: 3, storageUsed: 2.1, storageLimit: 10, credits: 500, mediaCreated: 45, mediaPosted: 32, createdAt: '2025-01-05T00:00:00Z' },
  '5': { id: '5', name: 'Sports Highlights', picture: null, email: null, category: 'sports', socialUrls: { instagram: 'https://instagram.com/sportshighlights' }, plan: 'premium', memberCount: 4, maxMembers: 5, storageUsed: 14.3, storageLimit: 25, credits: 2100, mediaCreated: 280, mediaPosted: 241, createdAt: '2025-02-20T00:00:00Z' },
  '6': { id: '6', name: 'Music Clips', picture: null, email: 'hello@musicclips.com', category: 'music', socialUrls: { youtube: 'https://youtube.com/@musicclips', tiktok: 'https://tiktok.com/@musicclips', instagram: 'https://instagram.com/musicclips' }, plan: 'ultimate', memberCount: 6, maxMembers: 10, storageUsed: 22.8, storageLimit: 50, credits: 4500, mediaCreated: 510, mediaPosted: 463, createdAt: '2024-11-30T00:00:00Z' },
  '7': { id: '7', name: 'Travel Vloggers', picture: null, email: null, category: 'travel', socialUrls: { youtube: 'https://youtube.com/@travelvloggers', instagram: 'https://instagram.com/travelvloggers' }, plan: 'premium', memberCount: 4, maxMembers: 5, storageUsed: 11.4, storageLimit: 25, credits: 1800, mediaCreated: 198, mediaPosted: 167, createdAt: '2025-03-12T00:00:00Z' },
  '8': { id: '8', name: 'Cooking Channel', picture: null, email: 'hello@cookingchannel.com', category: 'food', socialUrls: { youtube: 'https://youtube.com/@cookingchannel' }, plan: 'lite', memberCount: 2, maxMembers: 3, storageUsed: 3.7, storageLimit: 10, credits: 320, mediaCreated: 67, mediaPosted: 54, createdAt: '2025-04-20T00:00:00Z' },
  '9': { id: '9', name: 'Tech Reviews', picture: null, email: 'team@techreviews.io', category: 'technology', socialUrls: { youtube: 'https://youtube.com/@techreviews', tiktok: 'https://tiktok.com/@techreviews' }, plan: 'premium', memberCount: 7, maxMembers: 10, storageUsed: 19.2, storageLimit: 25, credits: 2700, mediaCreated: 375, mediaPosted: 310, createdAt: '2025-05-08T00:00:00Z' },
  '10': { id: '10', name: 'Comedy Squad', picture: null, email: null, category: 'entertainment', socialUrls: { tiktok: 'https://tiktok.com/@comedysquad', instagram: 'https://instagram.com/comedysquad' }, plan: 'premium', memberCount: 5, maxMembers: 10, storageUsed: 15.6, storageLimit: 25, credits: 2200, mediaCreated: 290, mediaPosted: 251, createdAt: '2025-06-15T00:00:00Z' },
  '11': { id: '11', name: 'Fitness Nation', picture: null, email: 'hi@fitnessnation.com', category: 'sports', socialUrls: { instagram: 'https://instagram.com/fitnessnation', youtube: 'https://youtube.com/@fitnessnation' }, plan: 'lite', memberCount: 3, maxMembers: 3, storageUsed: 7.1, storageLimit: 10, credits: 410, mediaCreated: 88, mediaPosted: 72, createdAt: '2025-07-22T00:00:00Z' },
  '12': { id: '12', name: 'Pixel Studio', picture: null, email: 'studio@pixel.design', category: 'technology', socialUrls: { youtube: 'https://youtube.com/@pixelstudio', instagram: 'https://instagram.com/pixelstudio', tiktok: 'https://tiktok.com/@pixelstudio' }, plan: 'ultimate', memberCount: 9, maxMembers: 10, storageUsed: 35.4, storageLimit: 50, credits: 6100, mediaCreated: 720, mediaPosted: 688, createdAt: '2025-08-01T00:00:00Z' },
}

const teamDetailKeys = {
  all: ['team-detail'] as const,
  byId: (id: string) => [...teamDetailKeys.all, id] as const,
}

export function useTeamDetail(teamId: string) {
  return useQuery({
    queryKey: teamDetailKeys.byId(teamId),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400))
      return mockTeamDetails[teamId] ?? null
    },
  })
}
