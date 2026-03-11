import type { AdminSubscription } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockSubscriptions: AdminSubscription[] = [
  { id: '1', userId: '101', userName: 'John Doe', userEmail: 'john@example.com', teamId: null, teamName: null, planTier: 'premium', billingPeriod: 'monthly', status: 'active', provider: 'paddle', currency: 'USD', amount: 29.99, mrr: 29.99, currentPeriodStart: '2026-02-05T00:00:00Z', currentPeriodEnd: '2026-03-05T00:00:00Z', cancelledAt: null, createdAt: '2025-06-01T00:00:00Z' },
  { id: '2', userId: '102', userName: 'Maria Silva', userEmail: 'maria@example.com', teamId: null, teamName: null, planTier: 'ultimate', billingPeriod: 'yearly', status: 'active', provider: 'pix', currency: 'BRL', amount: 999.90, mrr: 83.33, currentPeriodStart: '2025-09-01T00:00:00Z', currentPeriodEnd: '2026-09-01T00:00:00Z', cancelledAt: null, createdAt: '2025-09-01T00:00:00Z' },
  { id: '3', userId: null, userName: null, userEmail: null, teamId: '1', teamName: 'VDClip Core', planTier: 'ultimate', billingPeriod: 'monthly', status: 'active', provider: 'paddle', currency: 'USD', amount: 99.99, mrr: 99.99, currentPeriodStart: '2026-02-01T00:00:00Z', currentPeriodEnd: '2026-03-01T00:00:00Z', cancelledAt: null, createdAt: '2024-06-01T00:00:00Z' },
  { id: '4', userId: '104', userName: 'Ana Costa', userEmail: 'ana@example.com', teamId: 't2', teamName: 'Studio AC', planTier: 'lite', billingPeriod: 'monthly', status: 'past_due', provider: 'paddle', currency: 'USD', amount: 9.99, mrr: 9.99, currentPeriodStart: '2026-02-01T00:00:00Z', currentPeriodEnd: '2026-03-01T00:00:00Z', cancelledAt: null, createdAt: '2025-11-01T00:00:00Z' },
  { id: '5', userId: '105', userName: 'Pedro Lima', userEmail: 'pedro@example.com', teamId: null, teamName: null, planTier: 'premium', billingPeriod: 'monthly', status: 'cancelled', provider: 'pix', currency: 'BRL', amount: 149.90, mrr: 149.90, currentPeriodStart: '2026-01-15T00:00:00Z', currentPeriodEnd: '2026-02-15T00:00:00Z', cancelledAt: '2026-02-10T00:00:00Z', createdAt: '2025-07-15T00:00:00Z' },
  { id: '6', userId: '106', userName: 'Lucas Mendes', userEmail: 'lucas@example.com', teamId: 't3', teamName: 'Mendes Media', planTier: 'lite', billingPeriod: 'yearly', status: 'active', provider: 'pix', currency: 'BRL', amount: 479.90, mrr: 40.0, currentPeriodStart: '2025-12-01T00:00:00Z', currentPeriodEnd: '2026-12-01T00:00:00Z', cancelledAt: null, createdAt: '2025-12-01T00:00:00Z' },
]

const adminSubscriptionsKeys = {
  all: ['admin-subscriptions'] as const,
  filtered: (search: string, status: string) =>
    [...adminSubscriptionsKeys.all, search, status] as const,
}

export function useAdminSubscriptions(search: string = '', statusFilter: string = 'all') {
  return useQuery({
    queryKey: adminSubscriptionsKeys.filtered(search, statusFilter),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      let result = mockSubscriptions
      if (statusFilter !== 'all') {
        result = result.filter((s) => s.status === statusFilter)
      }
      if (search) {
        const q = search.toLowerCase()
        result = result.filter(
          (s) =>
            s.userName?.toLowerCase().includes(q) ||
            s.userEmail?.toLowerCase().includes(q) ||
            s.teamName?.toLowerCase().includes(q),
        )
      }
      return result
    },
  })
}
