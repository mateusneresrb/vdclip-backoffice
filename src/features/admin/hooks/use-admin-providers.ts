import { useQuery } from '@tanstack/react-query'

import type { SupportedProvider } from '../types'

const mockProviders: SupportedProvider[] = [
  { id: '1', name: 'YouTube', enabled: true, type: 'processing' },
  { id: '2', name: 'Google Drive', enabled: true, type: 'processing' },
  { id: '3', name: 'TikTok', enabled: true, type: 'processing' },
  { id: '4', name: 'Twitch', enabled: true, type: 'processing' },
  { id: '5', name: 'Vimeo', enabled: true, type: 'processing' },
  { id: '6', name: 'Kwai', enabled: false, type: 'processing' },
  { id: '7', name: 'Dailymotion', enabled: false, type: 'processing' },
  { id: '8', name: 'VDClip', enabled: true, type: 'processing' },
  { id: '9', name: 'Facebook', enabled: true, type: 'processing' },
  { id: '10', name: 'Instagram', enabled: true, type: 'processing' },
  { id: '11', name: 'Rumble', enabled: false, type: 'processing' },
  { id: '12', name: 'Kick', enabled: false, type: 'processing' },
]

const adminProviderKeys = {
  all: ['admin-providers'] as const,
}

export function useAdminProviders() {
  return useQuery({
    queryKey: adminProviderKeys.all,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return mockProviders
    },
  })
}
