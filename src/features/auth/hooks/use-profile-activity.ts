import { useQuery } from '@tanstack/react-query'

export interface ProfileActivityEvent {
  id: string
  type: string
  description: string
  createdAt: string
}

const mockActivity: ProfileActivityEvent[] = [
  {
    id: '1',
    type: 'login',
    description: 'Login realizado via email/senha.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'password_changed',
    description: 'Senha do backoffice alterada com sucesso.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '3',
    type: 'mfa_enabled',
    description: 'Autenticacao de dois fatores ativada.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: '4',
    type: 'oauth_connected',
    description: 'Conta Google conectada via OAuth.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: '5',
    type: 'login',
    description: 'Login realizado via email/senha.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
]

const profileActivityKeys = {
  all: ['profile-activity'] as const,
}

export function useProfileActivity() {
  return useQuery({
    queryKey: profileActivityKeys.all,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockActivity
    },
  })
}
