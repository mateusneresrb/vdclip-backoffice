import { useQuery } from '@tanstack/react-query'

import type { MetricsDateRange, PlatformMetrics } from '../types'

const mockMetrics: PlatformMetrics = {
  revenue: {
    mrr: 18750,
    newMrr: 2340,
    expansionMrr: 890,
    contractionMrr: 320,
    churnedMrr: 1150,
    reactivationMrr: 480,
    creditRevenue: 3200,
    totalRevenue: 224800,
  },
  subscriptions: {
    activeSubscriptions: 727,
    newSubscriptions: 63,
    churnedSubscriptions: 18,
    churnRate: 2.5,
    byPlan: {
      free: 520,
      lite: 380,
      premium: 280,
      ultimate: 67,
    },
    byProvider: {
      paddle: 480,
      pix: 180,
      internal: 67,
    },
    byBillingPeriod: {
      monthly: 520,
      yearly: 207,
    },
  },
  users: {
    totalUsers: 1247,
    newUsersInPeriod: 63,
    verifiedEmails: 1089,
    socialAccounts: 412,
  },
  content: {
    totalProjects: 15840,
    completedProjects: 14200,
    failedProjects: 340,
    totalScheduledPosts: 12350,
    publishedPosts: 11800,
    failedPosts: 150,
    byAiType: {
      clips: 8400,
      highlights: 4200,
      shorts: 3240,
    },
    byProvider: {
      youtube: 6200,
      tiktok: 3800,
      instagram: 2400,
      facebook: 1500,
      vdclip: 1940,
    },
  },
  credits: {
    totalCreditsIssued: 245000,
    totalCreditsUsed: 198000,
    expiredCredits: 12400,
    byType: {
      plan_cycle: 180000,
      purchased: 42000,
      promotional: 15000,
      bonus: 6000,
      adjustment: 2000,
    },
    transactionVolume: 324500,
    refunds: 4200,
  },
}

const adminMetricsKeys = {
  all: ['admin-metrics'] as const,
  byRange: (range: MetricsDateRange) =>
    [...adminMetricsKeys.all, range] as const,
}

export function useAdminMetrics(dateRange: MetricsDateRange = '30d') {
  return useQuery({
    queryKey: adminMetricsKeys.byRange(dateRange),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockMetrics
    },
  })
}
