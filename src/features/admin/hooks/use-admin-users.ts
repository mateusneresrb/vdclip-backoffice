import type { AdminUser, AffiliateInfo, TeamSettings } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

export type UserSearchField = 'name' | 'email' | 'externalId'
export interface UserSearchQuery {
  field: UserSearchField
  value: string
}

const adminUserKeys = {
  all: ['admin-users'] as const,
  list: (q: UserSearchQuery) => [...adminUserKeys.all, 'list', q.field, q.value] as const,
  detail: (id: string) => [...adminUserKeys.all, 'detail', id] as const,
  affiliate: (id: string) => [...adminUserKeys.all, 'affiliate', id] as const,
  team: (teamId: string) => [...adminUserKeys.all, 'team', teamId] as const,
}

function mapUser(u: Record<string, unknown>): AdminUser {
  return {
    id: String(u.id ?? ''),
    external_id: String(u.external_id ?? ''),
    name: String(u.name ?? ''),
    email: String(u.email ?? ''),
    avatar: u.avatar ? String(u.avatar) : undefined,
    status: (u.status as AdminUser['status']) ?? 'active',
    plan: (u.plan as AdminUser['plan']) ?? 'free',
    planProvider: ((u.plan_provider ?? u.planProvider) as AdminUser['planProvider']) ?? 'internal',
    planExpiresAt: (u.plan_expires_at ?? u.planExpiresAt ?? null) as string | null,
    subscriptionId: (u.subscription_id ?? u.subscriptionId ?? null) as string | null,
    credits: Number(u.credits ?? 0),
    creditPackages: Array.isArray(u.credit_packages ?? u.creditPackages)
      ? ((u.credit_packages ?? u.creditPackages) as Record<string, unknown>[]).map((cp) => ({
          id: String(cp.id ?? ''),
          type: (cp.type as AdminUser['creditPackages'][number]['type']) ?? 'plan_cycle',
          amount: Number(cp.amount ?? 0),
          used: Number(cp.used ?? 0),
          startDate: String(cp.start_date ?? cp.startDate ?? ''),
          expiresAt: String(cp.expires_at ?? cp.expiresAt ?? ''),
        }))
      : [],
    mediaCreated: Number(u.media_created ?? u.mediaCreated ?? 0),
    mediaPosted: Number(u.media_posted ?? u.mediaPosted ?? 0),
    socialLogins: (Array.isArray(u.social_logins ?? u.socialLogins) ? (u.social_logins ?? u.socialLogins) : []) as AdminUser['socialLogins'],
    emailVerified: Boolean(u.email_verified ?? u.emailVerified ?? false),
    isSocialAccount: Boolean(u.is_social_account ?? u.isSocialAccount ?? false),
    createdAt: String(u.created_at ?? u.createdAt ?? ''),
    lastLoginAt: String(u.last_login_at ?? u.lastLoginAt ?? ''),
    teams: Array.isArray(u.teams)
      ? (u.teams as Record<string, unknown>[]).map(t => ({
          id: String(t.id ?? ''),
          name: String(t.name ?? ''),
          role: (t.role as AdminUser['teams'][number]['role']) ?? 'member',
          members: Number(t.members ?? t.member_count ?? 0),
        }))
      : [],
    companyId: (u.company_id ?? u.companyId ?? null) as string | null,
    companyName: (u.company_name ?? u.companyName ?? null) as string | null,
  }
}

function mapTeamSettings(t: Record<string, unknown>): TeamSettings {
  return {
    id: String(t.id ?? ''),
    name: String(t.name ?? ''),
    plan: (t.plan as TeamSettings['plan']) ?? 'free',
    maxMembers: Number(t.max_members ?? t.maxMembers ?? 0),
    storageUsed: Number(t.storage_used ?? t.storageUsed ?? 0),
    storageLimit: Number(t.storage_limit ?? t.storageLimit ?? 0),
    members: Array.isArray(t.members)
      ? (t.members as Record<string, unknown>[]).map(m => ({
          id: String(m.id ?? ''),
          name: String(m.name ?? ''),
          email: String(m.email ?? ''),
          role: (m.role as TeamSettings['members'][number]['role']) ?? 'member',
          avatar: m.avatar ? String(m.avatar) : undefined,
        }))
      : [],
  }
}

const mockAffiliateByUser: Record<string, AffiliateInfo> = {
  '1': {
    referralCode: 'ALICE2025',
    commissionPercent: 20,
    totalReferrals: 24,
    activeReferrals: 18,
    totalEarnings: 1250.0,
    pendingPayout: 320.5,
    tier: 'gold',
  },
  '2': {
    referralCode: 'BRUNO2024',
    commissionPercent: 25,
    totalReferrals: 45,
    activeReferrals: 32,
    totalEarnings: 3800.0,
    pendingPayout: 890.0,
    tier: 'gold',
  },
  '6': {
    referralCode: 'FELIPE25',
    commissionPercent: 15,
    totalReferrals: 8,
    activeReferrals: 5,
    totalEarnings: 240.0,
    pendingPayout: 60.0,
    tier: 'bronze',
  },
  '7': {
    referralCode: 'GRACE2024',
    commissionPercent: 20,
    totalReferrals: 15,
    activeReferrals: 12,
    totalEarnings: 890.0,
    pendingPayout: 150.0,
    tier: 'silver',
  },
  '9': {
    referralCode: 'ISA2025',
    commissionPercent: 15,
    totalReferrals: 10,
    activeReferrals: 7,
    totalEarnings: 420.0,
    pendingPayout: 85.0,
    tier: 'silver',
  },
}

export function useAdminUsers(query: UserSearchQuery = { field: 'name', value: '' }) {
  return useQuery({
    queryKey: adminUserKeys.list(query),
    queryFn: async () => {
      const params: Record<string, string | number | boolean | undefined> = {
        page: 1,
        per_page: 50,
      }
      if (query.value.trim()) {
        params.search = query.value.trim()
      }

      const data = await apiClient.get<{ items: Record<string, unknown>[] }>('/platform/users', params)
      return data.items.map(mapUser)
    },
  })
}

export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: adminUserKeys.detail(userId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>>(`/platform/users/${userId}`)
      return mapUser(data)
    },
  })
}

export function useAdminUserAffiliate(userId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminUserKeys.affiliate(userId),
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 400))
      return mockAffiliateByUser[userId] ?? null
    },
    enabled,
  })
}

export function useAdminTeamSettings(teamId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminUserKeys.team(teamId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>>(`/platform/teams/${teamId}`)
      return mapTeamSettings(data)
    },
    enabled,
  })
}
