import type { MetricsDateRange, PlatformMetrics } from '../types'

import { useQuery } from '@tanstack/react-query'

function generateMrrHistory(days: number) {
  const data: { date: string; mrr: number }[] = []
  let mrr = 14000
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    mrr += Math.round((Math.random() - 0.3) * 200)
    data.push({ date: date.toISOString().split('T')[0], mrr })
  }
  return data
}

function generateUserGrowth(days: number) {
  const data: { date: string; total: number; new: number }[] = []
  let total = 1100
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const newUsers = Math.round(Math.random() * 8 + 1)
    total += newUsers
    data.push({ date: date.toISOString().split('T')[0], total, new: newUsers })
  }
  return data
}

function generateRevenueComposition(days: number) {
  const data: { date: string; newMrr: number; expansion: number; churn: number }[] = []
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      newMrr: Math.round(Math.random() * 3000 + 500),
      expansion: Math.round(Math.random() * 1200 + 200),
      churn: -Math.round(Math.random() * 1500 + 300),
    })
  }
  return data
}

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
  mrrHistory: generateMrrHistory(30),
  userGrowth: generateUserGrowth(30),
  revenueComposition: generateRevenueComposition(30),
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
