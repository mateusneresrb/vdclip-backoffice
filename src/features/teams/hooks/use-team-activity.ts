import type { UserActivityEvent } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

const mockTeamActivity: Record<string, UserActivityEvent[]> = {
  '1': [
    { id: 'ta1-1', type: 'subscription_created', description: 'Plano Ultimate ativado via Paddle', createdAt: '2024-06-01T10:00:00Z' },
    { id: 'ta1-2', type: 'credits_added', description: '5000 creditos adicionados (plano)', metadata: { amount: 5000, type: 'plan_cycle' }, createdAt: '2024-06-01T10:05:00Z' },
    { id: 'ta1-3', type: 'media_created', description: 'Nova midia processada: "VDClip Tutorial #12"', createdAt: '2026-02-20T14:00:00Z' },
    { id: 'ta1-4', type: 'plan_changed', description: 'Plano alterado de Premium para Ultimate', metadata: { from: 'premium', to: 'ultimate' }, createdAt: '2024-12-15T09:00:00Z' },
    { id: 'ta1-5', type: 'media_created', description: 'Nova midia processada: "Como usar o VDClip"', createdAt: '2026-03-01T11:00:00Z' },
    { id: 'ta1-6', type: 'credits_added', description: '2000 creditos adicionados (bonus)', metadata: { amount: 2000, type: 'bonus' }, createdAt: '2026-01-10T08:00:00Z' },
  ],
  '2': [
    { id: 'ta2-1', type: 'subscription_created', description: 'Plano Premium ativado', createdAt: '2024-08-15T12:00:00Z' },
    { id: 'ta2-2', type: 'credits_added', description: '1500 creditos adicionados (plano)', metadata: { amount: 1500, type: 'plan_cycle' }, createdAt: '2024-08-15T12:05:00Z' },
    { id: 'ta2-3', type: 'media_created', description: 'Nova midia: "Best Gaming Moments 2025"', createdAt: '2026-02-10T16:00:00Z' },
  ],
  '6': [
    { id: 'ta6-1', type: 'subscription_created', description: 'Plano Ultimate ativado', createdAt: '2024-11-30T10:00:00Z' },
    { id: 'ta6-2', type: 'credits_added', description: '4500 creditos adicionados (plano)', metadata: { amount: 4500, type: 'plan_cycle' }, createdAt: '2024-11-30T10:05:00Z' },
    { id: 'ta6-3', type: 'media_created', description: 'Nova midia: "Best Music Compilation 2025"', createdAt: '2026-03-04T13:00:00Z' },
    { id: 'ta6-4', type: 'media_created', description: 'Nova midia: "Top Hits January"', createdAt: '2026-01-15T09:00:00Z' },
    { id: 'ta6-5', type: 'credits_added', description: '500 creditos adicionados (promocional)', metadata: { amount: 500, type: 'promotional' }, createdAt: '2025-12-25T00:00:00Z' },
  ],
}

const teamActivityKeys = {
  all: ['team-activity'] as const,
  byTeam: (teamId: string) => [...teamActivityKeys.all, teamId] as const,
}

export function useTeamActivity(teamId: string) {
  return useQuery({
    queryKey: teamActivityKeys.byTeam(teamId),
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400))
      return mockTeamActivity[teamId] ?? []
    },
  })
}
