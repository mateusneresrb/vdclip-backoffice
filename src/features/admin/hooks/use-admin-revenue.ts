import type { MetricsDateRange, RevenueDailySnapshot } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'
import { getDateParams } from '@/lib/date-utils'

const adminRevenueKeys = {
  all: ['admin-revenue'] as const,
  byRange: (range: MetricsDateRange) =>
    [...adminRevenueKeys.all, range] as const,
}

function mapSnapshot(s: Record<string, unknown>): RevenueDailySnapshot {
  return {
    snapshotDate: String(s.snapshotDate ?? ''),
    currency: (s.currency as RevenueDailySnapshot['currency']) ?? 'USD',
    mrr: Number(s.mrr ?? 0),
    newMrr: Number(s.newMrr ?? 0),
    expansionMrr: Number(s.expansionMrr ?? 0),
    contractionMrr: Number(s.contractionMrr ?? 0),
    churnedMrr: Number(s.churnedMrr ?? 0),
    reactivationMrr: Number(s.reactivationMrr ?? 0),
    activeSubscriptionsCount: Number(s.activeSubscriptionsCount ?? 0),
    newSubscriptionsCount: Number(s.newSubscriptionsCount ?? 0),
    churnedSubscriptionsCount: Number(s.churnedSubscriptionsCount ?? 0),
    creditRevenue: Number(s.creditRevenue ?? 0),
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
