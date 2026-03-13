import type { MetricsDateRange, RevenueDailySnapshot } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const adminRevenueKeys = {
  all: ['admin-revenue'] as const,
  byRange: (range: MetricsDateRange) =>
    [...adminRevenueKeys.all, range] as const,
}

function getDateParams(range: MetricsDateRange): Record<string, string> {
  const now = new Date()
  const to = now.toISOString().split('T')[0]
  let from: string

  switch (range) {
    case '1d': {
      const d = new Date(now)
      d.setDate(d.getDate() - 1)
      from = d.toISOString().split('T')[0]
      break
    }
    case '3d': {
      const d = new Date(now)
      d.setDate(d.getDate() - 3)
      from = d.toISOString().split('T')[0]
      break
    }
    case '7d': {
      const d = new Date(now)
      d.setDate(d.getDate() - 7)
      from = d.toISOString().split('T')[0]
      break
    }
    case '90d': {
      const d = new Date(now)
      d.setDate(d.getDate() - 90)
      from = d.toISOString().split('T')[0]
      break
    }
    case 'ytd': {
      from = `${now.getFullYear()}-01-01`
      break
    }
    case 'all': {
      from = '2024-01-01'
      break
    }
    case '30d':
    default: {
      const d = new Date(now)
      d.setDate(d.getDate() - 30)
      from = d.toISOString().split('T')[0]
      break
    }
  }

  return { date_from: from, date_to: to }
}

function mapSnapshot(s: Record<string, unknown>): RevenueDailySnapshot {
  return {
    snapshotDate: String(s.snapshot_date ?? s.snapshotDate ?? ''),
    currency: (s.currency as RevenueDailySnapshot['currency']) ?? 'USD',
    mrr: Number(s.mrr ?? 0),
    newMrr: Number(s.new_mrr ?? s.newMrr ?? 0),
    expansionMrr: Number(s.expansion_mrr ?? s.expansionMrr ?? 0),
    contractionMrr: Number(s.contraction_mrr ?? s.contractionMrr ?? 0),
    churnedMrr: Number(s.churned_mrr ?? s.churnedMrr ?? 0),
    reactivationMrr: Number(s.reactivation_mrr ?? s.reactivationMrr ?? 0),
    activeSubscriptionsCount: Number(s.active_subscriptions_count ?? s.activeSubscriptionsCount ?? 0),
    newSubscriptionsCount: Number(s.new_subscriptions_count ?? s.newSubscriptionsCount ?? 0),
    churnedSubscriptionsCount: Number(s.churned_subscriptions_count ?? s.churnedSubscriptionsCount ?? 0),
    creditRevenue: Number(s.credit_revenue ?? s.creditRevenue ?? 0),
  }
}

export function useAdminRevenue(dateRange: MetricsDateRange = '30d') {
  return useQuery({
    queryKey: adminRevenueKeys.byRange(dateRange),
    queryFn: async () => {
      const params = getDateParams(dateRange)
      const data = await apiClient.get<Record<string, unknown>[]>('/platform/revenue', params)
      return data.map(mapSnapshot)
    },
  })
}
