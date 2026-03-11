import type { MetricsDateRange, RevenueDailySnapshot } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockSnapshots: RevenueDailySnapshot[] = [
  { snapshotDate: '2026-03-05', currency: 'USD', mrr: 18750, newMrr: 2340, expansionMrr: 890, contractionMrr: 320, churnedMrr: 1150, reactivationMrr: 480, activeSubscriptionsCount: 480, newSubscriptionsCount: 12, churnedSubscriptionsCount: 3, creditRevenue: 1200 },
  { snapshotDate: '2026-03-05', currency: 'BRL', mrr: 42500, newMrr: 5800, expansionMrr: 1200, contractionMrr: 800, churnedMrr: 2300, reactivationMrr: 950, activeSubscriptionsCount: 247, newSubscriptionsCount: 8, churnedSubscriptionsCount: 2, creditRevenue: 2800 },
  { snapshotDate: '2026-03-04', currency: 'USD', mrr: 18200, newMrr: 1800, expansionMrr: 500, contractionMrr: 200, churnedMrr: 900, reactivationMrr: 300, activeSubscriptionsCount: 475, newSubscriptionsCount: 8, churnedSubscriptionsCount: 2, creditRevenue: 900 },
  { snapshotDate: '2026-03-04', currency: 'BRL', mrr: 41800, newMrr: 4200, expansionMrr: 900, contractionMrr: 600, churnedMrr: 1800, reactivationMrr: 700, activeSubscriptionsCount: 243, newSubscriptionsCount: 5, churnedSubscriptionsCount: 1, creditRevenue: 2100 },
  { snapshotDate: '2026-03-03', currency: 'USD', mrr: 17900, newMrr: 1500, expansionMrr: 400, contractionMrr: 150, churnedMrr: 700, reactivationMrr: 200, activeSubscriptionsCount: 470, newSubscriptionsCount: 6, churnedSubscriptionsCount: 1, creditRevenue: 750 },
  { snapshotDate: '2026-03-03', currency: 'BRL', mrr: 41200, newMrr: 3800, expansionMrr: 700, contractionMrr: 400, churnedMrr: 1500, reactivationMrr: 500, activeSubscriptionsCount: 240, newSubscriptionsCount: 4, churnedSubscriptionsCount: 1, creditRevenue: 1800 },
]

const adminRevenueKeys = {
  all: ['admin-revenue'] as const,
  byRange: (range: MetricsDateRange) =>
    [...adminRevenueKeys.all, range] as const,
}

export function useAdminRevenue(dateRange: MetricsDateRange = '30d') {
  return useQuery({
    queryKey: adminRevenueKeys.byRange(dateRange),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockSnapshots
    },
  })
}
