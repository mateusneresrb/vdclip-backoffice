import type { UserActivityEvent } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

const mockActivity: UserActivityEvent[] = [
  { id: '1', type: 'login', description: 'Login via email', createdAt: '2026-03-06T10:30:00Z' },
  { id: '2', type: 'media_created', description: 'Novo projeto criado: "Video Marketing Q1"', createdAt: '2026-03-05T14:20:00Z' },
  { id: '3', type: 'credits_added', description: '100 creditos adicionados (ciclo do plano)', metadata: { amount: 100, type: 'plan_cycle' }, createdAt: '2026-03-01T00:00:00Z' },
  { id: '4', type: 'plan_changed', description: 'Plano alterado de Lite para Premium', metadata: { from: 'lite', to: 'premium' }, createdAt: '2026-02-28T16:45:00Z' },
  { id: '5', type: 'subscription_created', description: 'Assinatura criada — Plano Lite (mensal)', createdAt: '2026-01-15T09:00:00Z' },
  { id: '6', type: 'password_changed', description: 'Senha alterada', createdAt: '2026-01-10T11:30:00Z' },
  { id: '7', type: 'login', description: 'Login via Google OAuth', createdAt: '2026-01-05T08:15:00Z' },
]

const userActivityKeys = {
  all: ['user-activity'] as const,
  byUser: (userId: string) => [...userActivityKeys.all, userId] as const,
}

export function useUserActivity(userId: string) {
  return useQuery({
    queryKey: userActivityKeys.byUser(userId),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400))
      return mockActivity
    },
  })
}
