import type { SupportedProvider } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockProviders: SupportedProvider[] = [
  {
    id: '1',
    name: 'YouTube',
    slug: 'youtube',
    enabled: true,
    type: 'social',
    category: 'video_source',
    description: 'Importação de vídeos do YouTube como fonte de conteúdo.',
  },
  {
    id: '2',
    name: 'TikTok',
    slug: 'tiktok',
    enabled: true,
    type: 'social',
    category: 'video_source',
    description: 'Importação de vídeos do TikTok como fonte.',
  },
  {
    id: '3',
    name: 'Instagram',
    slug: 'instagram',
    enabled: true,
    type: 'social',
    category: 'video_source',
    description: 'Importação de vídeos do Instagram.',
  },
  {
    id: '4',
    name: 'Twitch',
    slug: 'twitch',
    enabled: true,
    type: 'social',
    category: 'video_source',
    description: 'Importação de VODs e clips da Twitch.',
  },
  {
    id: '5',
    name: 'Vimeo',
    slug: 'vimeo',
    enabled: true,
    type: 'social',
    category: 'video_source',
    description: 'Importação de vídeos do Vimeo.',
  },
  {
    id: '6',
    name: 'Facebook',
    slug: 'facebook',
    enabled: true,
    type: 'social',
    category: 'video_source',
    description: 'Importação de vídeos do Facebook.',
  },
  {
    id: '7',
    name: 'Kick',
    slug: 'kick',
    enabled: true,
    type: 'social',
    category: 'video_source',
    description: 'Importação de clips do Kick.',
  },
  {
    id: '8',
    name: 'Kwai',
    slug: 'kwai',
    enabled: true,
    type: 'social',
    category: 'video_source',
    description: 'Importação de vídeos do Kwai.',
  },
  {
    id: '9',
    name: 'Dailymotion',
    slug: 'dailymotion',
    enabled: true,
    type: 'social',
    category: 'video_source',
    description: 'Importação de vídeos do Dailymotion.',
  },
  {
    id: '10',
    name: 'Rumble',
    slug: 'rumble',
    enabled: true,
    type: 'social',
    category: 'video_source',
    description: 'Importação de vídeos do Rumble.',
  },
  {
    id: '11',
    name: 'Google Drive',
    slug: 'google-drive',
    enabled: true,
    type: 'processing',
    category: 'video_source',
    description: 'Importação de arquivos de vídeo do Google Drive.',
  },
  {
    id: '12',
    name: 'VDClip Upload',
    slug: 'vdclip-upload',
    enabled: true,
    type: 'processing',
    category: 'video_source',
    description: 'Upload direto de vídeos pelo app VDClip.',
  },
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
