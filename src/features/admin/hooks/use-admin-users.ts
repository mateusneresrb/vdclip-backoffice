import type { AdminUser, TeamSettings } from '../types'

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
    externalId: String(u.externalId ?? ''),
    name: String(u.name ?? ''),
    email: String(u.email ?? ''),
    avatar: u.avatar ? String(u.avatar) : undefined,
    status: (u.status as AdminUser['status']) ?? 'active',
    plan: (u.plan as AdminUser['plan']) ?? 'free',
    planProvider: (u.planProvider as AdminUser['planProvider']) ?? 'internal',
    planExpiresAt: (u.planExpiresAt ?? null) as string | null,
    subscriptionId: (u.subscriptionId ?? null) as string | null,
    credits: Number(u.credits ?? 0),
    creditPackages: Array.isArray(u.creditPackages)
      ? (u.creditPackages as Record<string, unknown>[]).map((cp) => ({
          id: String(cp.id ?? ''),
          type: (cp.type as AdminUser['creditPackages'][number]['type']) ?? 'plan_cycle',
          amount: Number(cp.amount ?? 0),
          used: Number(cp.used ?? 0),
          startDate: String(cp.startDate ?? ''),
          expiresAt: String(cp.expiresAt ?? ''),
        }))
      : [],
    mediaCreated: Number(u.mediaCreated ?? 0),
    mediaPosted: Number(u.mediaPosted ?? 0),
    socialLogins: (Array.isArray(u.socialLogins) ? u.socialLogins : []) as AdminUser['socialLogins'],
    emailVerified: Boolean(u.emailVerified ?? false),
    isSocialAccount: Boolean(u.isSocialAccount ?? false),
    createdAt: String(u.createdAt ?? ''),
    lastLoginAt: String(u.lastLoginAt ?? ''),
    teams: Array.isArray(u.teams)
      ? (u.teams as Record<string, unknown>[]).map(t => ({
          id: String(t.id ?? ''),
          name: String(t.name ?? ''),
          role: (t.role as AdminUser['teams'][number]['role']) ?? 'member',
          members: Number(t.members ?? t.memberCount ?? 0),
        }))
      : [],
    companyId: (u.companyId ?? null) as string | null,
    companyName: (u.companyName ?? null) as string | null,
  }
}

function mapTeamSettings(t: Record<string, unknown>): TeamSettings {
  return {
    id: String(t.id ?? ''),
    name: String(t.name ?? ''),
    plan: (t.plan as TeamSettings['plan']) ?? 'free',
    maxMembers: Number(t.maxMembers ?? 0),
    storageUsed: Number(t.storageUsed ?? 0),
    storageLimit: Number(t.storageLimit ?? 0),
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

export function useAdminUserAffiliate(_userId: string, _enabled: boolean) {
  return useQuery({
    queryKey: adminUserKeys.affiliate(_userId),
    queryFn: async () => null,
    enabled: false,
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
