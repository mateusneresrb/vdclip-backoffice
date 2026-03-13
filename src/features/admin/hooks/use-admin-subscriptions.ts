import type { AdminSubscription } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const adminSubscriptionsKeys = {
  all: ['admin-subscriptions'] as const,
  filtered: (search: string, status: string) =>
    [...adminSubscriptionsKeys.all, search, status] as const,
}

function mapSubscription(s: Record<string, unknown>): AdminSubscription {
  return {
    id: String(s.id ?? ''),
    userId: (s.user_id ?? s.userId ?? null) as string | null,
    userName: (s.user_name ?? s.userName ?? null) as string | null,
    userEmail: (s.user_email ?? s.userEmail ?? null) as string | null,
    teamId: (s.team_id ?? s.teamId ?? null) as string | null,
    teamName: (s.team_name ?? s.teamName ?? null) as string | null,
    planTier: (s.plan_tier ?? s.planTier) as AdminSubscription['planTier'],
    billingPeriod: (s.billing_period ?? s.billingPeriod) as AdminSubscription['billingPeriod'],
    status: (s.status as AdminSubscription['status']) ?? 'active',
    provider: (s.provider as AdminSubscription['provider']) ?? 'paddle',
    currency: (s.currency as AdminSubscription['currency']) ?? 'USD',
    amount: Number(s.amount ?? 0),
    mrr: Number(s.mrr ?? 0),
    currentPeriodStart: String(s.current_period_start ?? s.currentPeriodStart ?? ''),
    currentPeriodEnd: String(s.current_period_end ?? s.currentPeriodEnd ?? ''),
    cancelledAt: (s.cancelled_at ?? s.cancelledAt ?? null) as string | null,
    createdAt: String(s.created_at ?? s.createdAt ?? ''),
  }
}

export function useAdminSubscriptions(search: string = '', statusFilter: string = 'all') {
  return useQuery({
    queryKey: adminSubscriptionsKeys.filtered(search, statusFilter),
    queryFn: async () => {
      const params: Record<string, string | number | boolean | undefined> = {
        page: 1,
        per_page: 50,
      }
      if (search)
        params.search = search
      if (statusFilter !== 'all')
        params.status = statusFilter

      const data = await apiClient.get<{ items: Record<string, unknown>[] }>('/platform/subscriptions', params)
      return data.items.map(mapSubscription)
    },
  })
}
