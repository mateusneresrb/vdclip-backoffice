import type { MetricsDateRange, PlatformMetrics } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const adminMetricsKeys = {
  all: ['admin-metrics'] as const,
  byRange: (range: MetricsDateRange) =>
    [...adminMetricsKeys.all, range] as const,
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

function mapMetrics(d: Record<string, unknown>): PlatformMetrics {
  const revenue = (d.revenue ?? {}) as Record<string, unknown>
  const subs = (d.subscriptions ?? {}) as Record<string, unknown>
  const users = (d.users ?? {}) as Record<string, unknown>
  const content = (d.content ?? {}) as Record<string, unknown>
  const credits = (d.credits ?? {}) as Record<string, unknown>

  const byPlan = (subs.by_plan ?? subs.byPlan ?? {}) as Record<string, number>
  const byProvider = (subs.by_provider ?? subs.byProvider ?? {}) as Record<string, number>
  const byBilling = (subs.by_billing_period ?? subs.byBillingPeriod ?? {}) as Record<string, number>
  const byAiType = (content.by_ai_type ?? content.byAiType ?? {}) as Record<string, number>
  const byContentProvider = (content.by_provider ?? content.byProvider ?? {}) as Record<string, number>
  const byCredType = (credits.by_type ?? credits.byType ?? {}) as Record<string, number>

  return {
    revenue: {
      mrr: Number(revenue.mrr ?? 0),
      newMrr: Number(revenue.new_mrr ?? revenue.newMrr ?? 0),
      expansionMrr: Number(revenue.expansion_mrr ?? revenue.expansionMrr ?? 0),
      contractionMrr: Number(revenue.contraction_mrr ?? revenue.contractionMrr ?? 0),
      churnedMrr: Number(revenue.churned_mrr ?? revenue.churnedMrr ?? 0),
      reactivationMrr: Number(revenue.reactivation_mrr ?? revenue.reactivationMrr ?? 0),
      creditRevenue: Number(revenue.credit_revenue ?? revenue.creditRevenue ?? 0),
      totalRevenue: Number(revenue.total_revenue ?? revenue.totalRevenue ?? 0),
    },
    subscriptions: {
      activeSubscriptions: Number(subs.active_subscriptions ?? subs.activeSubscriptions ?? 0),
      newSubscriptions: Number(subs.new_subscriptions ?? subs.newSubscriptions ?? 0),
      churnedSubscriptions: Number(subs.churned_subscriptions ?? subs.churnedSubscriptions ?? 0),
      churnRate: Number(subs.churn_rate ?? subs.churnRate ?? 0),
      byPlan: {
        free: Number(byPlan.free ?? 0),
        lite: Number(byPlan.lite ?? 0),
        premium: Number(byPlan.premium ?? 0),
        ultimate: Number(byPlan.ultimate ?? 0),
      },
      byProvider: {
        paddle: Number(byProvider.paddle ?? 0),
        pix: Number(byProvider.pix ?? 0),
        internal: Number(byProvider.internal ?? 0),
      },
      byBillingPeriod: {
        monthly: Number(byBilling.monthly ?? 0),
        yearly: Number(byBilling.yearly ?? 0),
      },
    },
    users: {
      totalUsers: Number(users.total_users ?? users.totalUsers ?? 0),
      newUsersInPeriod: Number(users.new_users_in_period ?? users.newUsersInPeriod ?? 0),
      verifiedEmails: Number(users.verified_emails ?? users.verifiedEmails ?? 0),
      socialAccounts: Number(users.social_accounts ?? users.socialAccounts ?? 0),
    },
    content: {
      totalProjects: Number(content.total_projects ?? content.totalProjects ?? 0),
      completedProjects: Number(content.completed_projects ?? content.completedProjects ?? 0),
      failedProjects: Number(content.failed_projects ?? content.failedProjects ?? 0),
      totalScheduledPosts: Number(content.total_scheduled_posts ?? content.totalScheduledPosts ?? 0),
      publishedPosts: Number(content.published_posts ?? content.publishedPosts ?? 0),
      failedPosts: Number(content.failed_posts ?? content.failedPosts ?? 0),
      byAiType: {
        clips: Number(byAiType.clips ?? 0),
        highlights: Number(byAiType.highlights ?? 0),
        shorts: Number(byAiType.shorts ?? 0),
      },
      byProvider: byContentProvider,
    },
    credits: {
      totalCreditsIssued: Number(credits.total_credits_issued ?? credits.totalCreditsIssued ?? 0),
      totalCreditsUsed: Number(credits.total_credits_used ?? credits.totalCreditsUsed ?? 0),
      expiredCredits: Number(credits.expired_credits ?? credits.expiredCredits ?? 0),
      byType: {
        plan_cycle: Number(byCredType.plan_cycle ?? 0),
        purchased: Number(byCredType.purchased ?? 0),
        promotional: Number(byCredType.promotional ?? 0),
        bonus: Number(byCredType.bonus ?? 0),
        adjustment: Number(byCredType.adjustment ?? 0),
      },
      transactionVolume: Number(credits.transaction_volume ?? credits.transactionVolume ?? 0),
      refunds: Number(credits.refunds ?? 0),
    },
    mrrHistory: Array.isArray(d.mrr_history ?? d.mrrHistory)
      ? ((d.mrr_history ?? d.mrrHistory) as Record<string, unknown>[]).map(h => ({
          date: String(h.date ?? ''),
          mrr: Number(h.mrr ?? 0),
        }))
      : [],
    userGrowth: Array.isArray(d.user_growth ?? d.userGrowth)
      ? ((d.user_growth ?? d.userGrowth) as Record<string, unknown>[]).map(g => ({
          date: String(g.date ?? ''),
          total: Number(g.total ?? 0),
          new: Number(g.new ?? 0),
        }))
      : [],
    revenueComposition: Array.isArray(d.revenue_composition ?? d.revenueComposition)
      ? ((d.revenue_composition ?? d.revenueComposition) as Record<string, unknown>[]).map(r => ({
          date: String(r.date ?? ''),
          newMrr: Number(r.new_mrr ?? r.newMrr ?? 0),
          expansion: Number(r.expansion ?? 0),
          churn: Number(r.churn ?? 0),
        }))
      : [],
  }
}

export function useAdminMetrics(dateRange: MetricsDateRange = '30d') {
  return useQuery({
    queryKey: adminMetricsKeys.byRange(dateRange),
    queryFn: async () => {
      const params = getDateParams(dateRange)
      const data = await apiClient.get<Record<string, unknown>>('/platform/metrics', params)
      return mapMetrics(data)
    },
  })
}
