import { useQuery } from '@tanstack/react-query'

export interface ProfileSession {
  id: string
  device: string
  ip: string
  city?: string
  country?: string
  lastActiveAt: string
  isCurrent: boolean
}

const mockSessions: ProfileSession[] = [
  {
    id: '1',
    device: 'Chrome 124 - Linux',
    ip: '189.40.72.15',
    city: 'São Paulo',
    country: 'Brasil',
    lastActiveAt: new Date().toISOString(),
    isCurrent: true,
  },
  {
    id: '2',
    device: 'Firefox 126 - Windows',
    ip: '200.158.10.42',
    city: 'Rio de Janeiro',
    country: 'Brasil',
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isCurrent: false,
  },
  {
    id: '3',
    device: 'Safari 17 - macOS',
    ip: '177.22.88.100',
    country: 'Brasil',
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    isCurrent: false,
  },
]

const profileSessionKeys = {
  all: ['profile-sessions'] as const,
}

export function useProfileSessions() {
  return useQuery({
    queryKey: profileSessionKeys.all,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockSessions
    },
  })
}
