import type { BusinessActivityEntry, BusinessCompanyDetail, BusinessCompanyUser, BusinessSubscription } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const businessCompanyDetailKeys = {
  all: ['business-company-detail'] as const,
  detail: (id: string) => [...businessCompanyDetailKeys.all, id] as const,
}

function mapSubscription(sub: Record<string, unknown> | null): BusinessSubscription {
  if (!sub) {
    return {
      planTier: 'free',
      status: 'active',
      currentPeriodStart: '',
      currentPeriodEnd: '',
      monthlyPrice: 0,
      currency: 'BRL',
      cancelAtPeriodEnd: false,
    }
  }
  return {
    planTier: String(sub.plan_tier ?? sub.planTier ?? sub.plan ?? 'free'),
    status: (sub.status as BusinessSubscription['status']) ?? 'active',
    currentPeriodStart: String(sub.current_period_start ?? sub.currentPeriodStart ?? ''),
    currentPeriodEnd: String(sub.current_period_end ?? sub.currentPeriodEnd ?? ''),
    monthlyPrice: Number(sub.amount ?? sub.monthly_price ?? sub.monthlyPrice ?? 0),
    currency: String(sub.currency ?? 'BRL'),
    cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end ?? sub.cancelAtPeriodEnd ?? false),
  }
}

function mapMember(m: Record<string, unknown>): BusinessCompanyUser {
  return {
    id: String(m.id ?? ''),
    name: String(m.name ?? ''),
    email: String(m.email ?? ''),
    role: (m.role as BusinessCompanyUser['role']) ?? 'member',
    status: 'active',
    joinedAt: String(m.created_at ?? m.joinedAt ?? ''),
    lastLogin: null,
  }
}

function mapActivity(a: Record<string, unknown>): BusinessActivityEntry {
  return {
    id: String(a.id ?? ''),
    timestamp: String(a.created_at ?? a.timestamp ?? ''),
    action: String(a.event_type ?? a.action ?? ''),
    actor: String(a.email ?? a.actor ?? ''),
    details: String(a.event_type ?? a.details ?? ''),
  }
}


export function useBusinessCompanyDetail(companyId: string) {
  return useQuery({
    queryKey: businessCompanyDetailKeys.detail(companyId),
    queryFn: async () => {
      const [team, membersData, activityData] = await Promise.all([
        apiClient.get<Record<string, unknown>>(`/platform/teams/${companyId}`),
        apiClient.get<Record<string, unknown>[]>(`/platform/teams/${companyId}/members`),
        apiClient.get<Record<string, unknown>[]>(`/platform/teams/${companyId}/activity`),
      ])

      const members = Array.isArray(membersData) ? membersData : []
      const activity = Array.isArray(activityData) ? activityData : []

      const plan = String(team.plan ?? 'free')

      const detail: BusinessCompanyDetail = {
        id: String(team.id ?? ''),
        externalId: String(team.id ?? ''),
        name: String(team.name ?? ''),
        logoUrl: team.picture ? String(team.picture) : undefined,
        document: null,
        plan,
        status: plan === 'free' ? 'trial' : 'active',
        userCount: Number(team.member_count ?? team.memberCount ?? members.length),
        createdAt: String(team.created_at ?? team.createdAt ?? ''),
        contactEmail: (team.email as string) ?? null,
        phone: null,
        address: null,
        subscription: mapSubscription(team.subscription as Record<string, unknown> | null ?? null),
        users: members.map(mapMember),
        billingHistory: [],
        activityLog: activity.map(mapActivity),
      }

      return detail
    },
  })
}
