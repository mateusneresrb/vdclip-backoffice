import type { AdminUser, AffiliateInfo, TeamSettings } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockUsers: AdminUser[] = [
  {
    id: '1',
    external_id: 'ext_usr_a1b2c3d4e5',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    status: 'active',
    plan: 'premium',
    planProvider: 'paddle',
    planExpiresAt: '2026-12-31',
    subscriptionId: 'sub_abc123',
    credits: 150,
    creditPackages: [
      { id: 'cp1', type: 'plan_cycle', amount: 100, used: 62, startDate: '2026-03-01', expiresAt: '2026-03-31' },
      { id: 'cp2', type: 'purchased', amount: 50, used: 0, startDate: '2026-02-20', expiresAt: '2026-05-20' },
      { id: 'cp3', type: 'promotional', amount: 20, used: 8, startDate: '2026-01-15', expiresAt: '2026-04-15' },
    ],
    mediaCreated: 87,
    mediaPosted: 64,
    socialLogins: ['google', 'github'],
    emailVerified: true,
    isSocialAccount: true,
    createdAt: '2025-03-15',
    lastLoginAt: '2026-03-02',
    teams: [
      { id: 't1', name: 'Alice Studio', role: 'owner', members: 4 },
      { id: 't2', name: 'Marketing Team', role: 'member', members: 12 },
    ],
  },
  {
    id: '2',
    external_id: 'ext_usr_f6g7h8i9j0',
    name: 'Bruno Silva',
    email: 'bruno@example.com',
    status: 'active',
    plan: 'ultimate',
    planProvider: 'pix',
    planExpiresAt: '2027-06-30',
    subscriptionId: 'hot_xyz789',
    credits: 500,
    creditPackages: [
      { id: 'cp4', type: 'plan_cycle', amount: 300, used: 120, startDate: '2026-03-01', expiresAt: '2026-03-31' },
      { id: 'cp5', type: 'bonus', amount: 200, used: 80, startDate: '2026-02-01', expiresAt: '2026-06-01' },
    ],
    mediaCreated: 234,
    mediaPosted: 198,
    socialLogins: ['google'],
    emailVerified: true,
    isSocialAccount: false,
    createdAt: '2024-11-01',
    lastLoginAt: '2026-03-03',
    teams: [
      { id: 't3', name: 'Bruno Agency', role: 'owner', members: 8 },
    ],
  },
  {
    id: '3',
    external_id: 'ext_usr_k1l2m3n4o5',
    name: 'Carmen Rodriguez',
    email: 'carmen@example.com',
    avatar: 'https://i.pravatar.cc/150?u=carmen',
    status: 'suspended',
    plan: 'lite',
    planProvider: 'paddle',
    planExpiresAt: '2026-04-15',
    subscriptionId: 'sub_def456',
    credits: 0,
    creditPackages: [
      { id: 'cp6', type: 'plan_cycle', amount: 30, used: 30, startDate: '2026-01-01', expiresAt: '2026-01-31' },
    ],
    mediaCreated: 12,
    mediaPosted: 5,
    socialLogins: [],
    emailVerified: false,
    isSocialAccount: false,
    createdAt: '2025-09-20',
    lastLoginAt: '2026-01-10',
    teams: [],
  },
  {
    id: '4',
    external_id: 'ext_usr_p6q7r8s9t0',
    name: 'David Chen',
    email: 'david@example.com',
    avatar: 'https://i.pravatar.cc/150?u=david',
    status: 'active',
    plan: 'free',
    planProvider: 'internal',
    planExpiresAt: null,
    subscriptionId: null,
    credits: 5,
    creditPackages: [
      { id: 'cp7', type: 'bonus', amount: 5, used: 0, startDate: '2026-02-01', expiresAt: '2026-04-01' },
    ],
    mediaCreated: 3,
    mediaPosted: 1,
    socialLogins: ['discord'],
    emailVerified: true,
    isSocialAccount: true,
    createdAt: '2026-02-01',
    lastLoginAt: '2026-03-01',
    teams: [
      { id: 't2', name: 'Marketing Team', role: 'member', members: 12 },
    ],
  },
  {
    id: '5',
    external_id: 'ext_usr_u1v2w3x4y5',
    name: 'Elena Petrova',
    email: 'elena@example.com',
    status: 'inactive',
    plan: 'premium',
    planProvider: 'paddle',
    planExpiresAt: '2025-12-31',
    subscriptionId: 'sub_ghi789',
    credits: 45,
    creditPackages: [
      { id: 'cp8', type: 'plan_cycle', amount: 50, used: 5, startDate: '2025-12-01', expiresAt: '2025-12-31' },
    ],
    mediaCreated: 56,
    mediaPosted: 42,
    socialLogins: ['google', 'discord'],
    emailVerified: true,
    isSocialAccount: false,
    createdAt: '2025-01-10',
    lastLoginAt: '2025-11-20',
    teams: [],
  },
  {
    id: '6',
    external_id: 'ext_usr_z6a7b8c9d0',
    name: 'Felipe Gomez',
    email: 'felipe@example.com',
    avatar: 'https://i.pravatar.cc/150?u=felipe',
    status: 'active',
    plan: 'lite',
    planProvider: 'pix',
    planExpiresAt: '2026-09-30',
    subscriptionId: 'hot_mno321',
    credits: 25,
    creditPackages: [
      { id: 'cp9', type: 'purchased', amount: 25, used: 0, startDate: '2026-02-15', expiresAt: '2026-05-15' },
    ],
    mediaCreated: 18,
    mediaPosted: 14,
    socialLogins: ['github'],
    emailVerified: true,
    isSocialAccount: false,
    createdAt: '2025-06-15',
    lastLoginAt: '2026-02-28',
    teams: [
      { id: 't4', name: 'Felipe Clips', role: 'owner', members: 2 },
    ],
  },
  {
    id: '7',
    external_id: 'ext_usr_e1f2g3h4i5',
    name: 'Grace Kim',
    email: 'grace@example.com',
    avatar: 'https://i.pravatar.cc/150?u=grace',
    status: 'active',
    plan: 'ultimate',
    planProvider: 'paddle',
    planExpiresAt: '2027-03-31',
    subscriptionId: 'sub_pqr654',
    credits: 1000,
    creditPackages: [
      { id: 'cp10', type: 'plan_cycle', amount: 500, used: 200, startDate: '2026-03-01', expiresAt: '2026-03-31' },
      { id: 'cp11', type: 'purchased', amount: 300, used: 0, startDate: '2026-02-10', expiresAt: '2026-08-10' },
      { id: 'cp12', type: 'promotional', amount: 200, used: 0, startDate: '2026-01-01', expiresAt: '2026-07-01' },
    ],
    mediaCreated: 412,
    mediaPosted: 380,
    socialLogins: ['google', 'github', 'discord'],
    emailVerified: true,
    isSocialAccount: true,
    createdAt: '2024-08-20',
    lastLoginAt: '2026-03-03',
    teams: [
      { id: 't5', name: 'Kim Productions', role: 'owner', members: 15 },
      { id: 't6', name: 'Freelancer Hub', role: 'admin', members: 30 },
    ],
  },
  {
    id: '8',
    external_id: 'ext_usr_j6k7l8m9n0',
    name: 'Hugo Martinez',
    email: 'hugo@example.com',
    status: 'active',
    plan: 'free',
    planProvider: 'internal',
    planExpiresAt: null,
    subscriptionId: null,
    credits: 2,
    creditPackages: [
      { id: 'cp13', type: 'bonus', amount: 2, used: 0, startDate: '2026-02-20', expiresAt: '2026-03-20' },
    ],
    mediaCreated: 1,
    mediaPosted: 0,
    socialLogins: [],
    emailVerified: false,
    isSocialAccount: false,
    createdAt: '2026-02-20',
    lastLoginAt: '2026-02-20',
    teams: [],
  },
  {
    id: '9',
    external_id: 'ext_usr_o1p2q3r4s5',
    name: 'Isabela Santos',
    email: 'isabela@example.com',
    avatar: 'https://i.pravatar.cc/150?u=isabela',
    status: 'active',
    plan: 'premium',
    planProvider: 'paddle',
    planExpiresAt: '2026-11-30',
    subscriptionId: 'sub_stu987',
    credits: 200,
    creditPackages: [
      { id: 'cp14', type: 'plan_cycle', amount: 150, used: 50, startDate: '2026-03-01', expiresAt: '2026-03-31' },
      { id: 'cp15', type: 'adjustment', amount: 50, used: 0, startDate: '2026-02-25', expiresAt: '2026-05-25' },
    ],
    mediaCreated: 145,
    mediaPosted: 120,
    socialLogins: ['google'],
    emailVerified: true,
    isSocialAccount: true,
    createdAt: '2025-04-05',
    lastLoginAt: '2026-03-02',
    teams: [
      { id: 't7', name: 'Isa Content', role: 'owner', members: 3 },
    ],
  },
  {
    id: '10',
    external_id: 'ext_usr_t6u7v8w9x0',
    name: 'James Wilson',
    email: 'james@example.com',
    status: 'suspended',
    plan: 'lite',
    planProvider: 'internal',
    planExpiresAt: '2026-06-30',
    subscriptionId: null,
    credits: 0,
    creditPackages: [],
    mediaCreated: 8,
    mediaPosted: 3,
    socialLogins: ['discord'],
    emailVerified: true,
    isSocialAccount: false,
    createdAt: '2025-07-12',
    lastLoginAt: '2026-01-05',
    teams: [],
  },
  {
    id: '11',
    external_id: 'ext_usr_y1z2a3b4c5',
    name: 'Karen Oliveira',
    email: 'karen@example.com',
    avatar: 'https://i.pravatar.cc/150?u=karen',
    status: 'active',
    plan: 'premium',
    planProvider: 'paddle',
    planExpiresAt: '2026-10-31',
    subscriptionId: 'sub_kar123',
    credits: 80,
    creditPackages: [
      { id: 'cp16', type: 'plan_cycle', amount: 80, used: 20, startDate: '2026-03-01', expiresAt: '2026-03-31' },
    ],
    mediaCreated: 67,
    mediaPosted: 53,
    socialLogins: ['google'],
    emailVerified: true,
    isSocialAccount: true,
    createdAt: '2025-05-10',
    lastLoginAt: '2026-03-01',
    teams: [],
  },
  {
    id: '12',
    external_id: 'ext_usr_d6e7f8g9h0',
    name: 'Luca Ferrari',
    email: 'luca@example.com',
    status: 'active',
    plan: 'ultimate',
    planProvider: 'paddle',
    planExpiresAt: '2027-01-31',
    subscriptionId: 'sub_luc456',
    credits: 750,
    creditPackages: [
      { id: 'cp17', type: 'plan_cycle', amount: 500, used: 150, startDate: '2026-03-01', expiresAt: '2026-03-31' },
      { id: 'cp18', type: 'purchased', amount: 250, used: 0, startDate: '2026-02-01', expiresAt: '2026-08-01' },
    ],
    mediaCreated: 312,
    mediaPosted: 290,
    socialLogins: ['github'],
    emailVerified: true,
    isSocialAccount: false,
    createdAt: '2024-10-15',
    lastLoginAt: '2026-03-02',
    teams: [],
  },
  {
    id: '13',
    external_id: 'ext_usr_i1j2k3l4m5',
    name: 'Mariana Costa',
    email: 'mariana@example.com',
    avatar: 'https://i.pravatar.cc/150?u=mariana',
    status: 'inactive',
    plan: 'free',
    planProvider: 'internal',
    planExpiresAt: null,
    subscriptionId: null,
    credits: 0,
    creditPackages: [],
    mediaCreated: 2,
    mediaPosted: 1,
    socialLogins: [],
    emailVerified: false,
    isSocialAccount: false,
    createdAt: '2026-01-20',
    lastLoginAt: '2026-01-22',
    teams: [],
  },
  {
    id: '14',
    external_id: 'ext_usr_n6o7p8q9r0',
    name: 'Nathan Brooks',
    email: 'nathan@example.com',
    avatar: 'https://i.pravatar.cc/150?u=nathan',
    status: 'active',
    plan: 'lite',
    planProvider: 'pix',
    planExpiresAt: '2026-08-31',
    subscriptionId: 'hot_nat789',
    credits: 30,
    creditPackages: [
      { id: 'cp19', type: 'plan_cycle', amount: 30, used: 10, startDate: '2026-03-01', expiresAt: '2026-03-31' },
    ],
    mediaCreated: 22,
    mediaPosted: 18,
    socialLogins: ['google', 'discord'],
    emailVerified: true,
    isSocialAccount: false,
    createdAt: '2025-08-05',
    lastLoginAt: '2026-02-25',
    teams: [],
  },
  {
    id: '15',
    external_id: 'ext_usr_s1t2u3v4w5',
    name: 'Olivia Zhang',
    email: 'olivia@example.com',
    avatar: 'https://i.pravatar.cc/150?u=olivia',
    status: 'active',
    plan: 'premium',
    planProvider: 'paddle',
    planExpiresAt: '2027-02-28',
    subscriptionId: 'sub_olv321',
    credits: 120,
    creditPackages: [
      { id: 'cp20', type: 'plan_cycle', amount: 100, used: 40, startDate: '2026-03-01', expiresAt: '2026-03-31' },
      { id: 'cp21', type: 'promotional', amount: 20, used: 0, startDate: '2026-02-01', expiresAt: '2026-05-01' },
    ],
    mediaCreated: 98,
    mediaPosted: 82,
    socialLogins: ['google', 'github'],
    emailVerified: true,
    isSocialAccount: true,
    createdAt: '2025-02-14',
    lastLoginAt: '2026-03-03',
    teams: [],
  },
]

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

const mockTeamSettings: Record<string, TeamSettings> = {
  t1: {
    id: 't1',
    name: 'Alice Studio',
    plan: 'premium',
    maxMembers: 5,
    storageUsed: 12.4,
    storageLimit: 50,
    members: [
      { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'owner', avatar: 'https://i.pravatar.cc/150?u=alice' },
      { id: '101', name: 'Tom Baker', email: 'tom@example.com', role: 'admin' },
      { id: '102', name: 'Sara Lee', email: 'sara@example.com', role: 'member' },
      { id: '103', name: 'Mike Ross', email: 'mike@example.com', role: 'member' },
    ],
  },
  t2: {
    id: 't2',
    name: 'Marketing Team',
    plan: 'ultimate',
    maxMembers: 20,
    storageUsed: 45.8,
    storageLimit: 200,
    members: [
      { id: '200', name: 'Jane Doe', email: 'jane@example.com', role: 'owner' },
      { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'member', avatar: 'https://i.pravatar.cc/150?u=alice' },
      { id: '4', name: 'David Chen', email: 'david@example.com', role: 'member', avatar: 'https://i.pravatar.cc/150?u=david' },
    ],
  },
  t3: {
    id: 't3',
    name: 'Bruno Agency',
    plan: 'ultimate',
    maxMembers: 15,
    storageUsed: 78.2,
    storageLimit: 500,
    members: [
      { id: '2', name: 'Bruno Silva', email: 'bruno@example.com', role: 'owner' },
      { id: '301', name: 'Ana Costa', email: 'ana@example.com', role: 'admin' },
      { id: '302', name: 'Pedro Lima', email: 'pedro@example.com', role: 'member' },
    ],
  },
  t4: {
    id: 't4',
    name: 'Felipe Clips',
    plan: 'lite',
    maxMembers: 3,
    storageUsed: 5.1,
    storageLimit: 20,
    members: [
      { id: '6', name: 'Felipe Gomez', email: 'felipe@example.com', role: 'owner', avatar: 'https://i.pravatar.cc/150?u=felipe' },
      { id: '401', name: 'Lucia Vega', email: 'lucia@example.com', role: 'member' },
    ],
  },
  t5: {
    id: 't5',
    name: 'Kim Productions',
    plan: 'ultimate',
    maxMembers: 20,
    storageUsed: 120.5,
    storageLimit: 500,
    members: [
      { id: '7', name: 'Grace Kim', email: 'grace@example.com', role: 'owner', avatar: 'https://i.pravatar.cc/150?u=grace' },
      { id: '501', name: 'Ryan Park', email: 'ryan@example.com', role: 'admin' },
    ],
  },
  t6: {
    id: 't6',
    name: 'Freelancer Hub',
    plan: 'ultimate',
    maxMembers: 50,
    storageUsed: 210.0,
    storageLimit: 1000,
    members: [
      { id: '600', name: 'Chris Taylor', email: 'chris@example.com', role: 'owner' },
      { id: '7', name: 'Grace Kim', email: 'grace@example.com', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=grace' },
    ],
  },
  t7: {
    id: 't7',
    name: 'Isa Content',
    plan: 'premium',
    maxMembers: 5,
    storageUsed: 8.3,
    storageLimit: 50,
    members: [
      { id: '9', name: 'Isabela Santos', email: 'isabela@example.com', role: 'owner', avatar: 'https://i.pravatar.cc/150?u=isabela' },
      { id: '701', name: 'Carlos Neto', email: 'carlos@example.com', role: 'member' },
      { id: '702', name: 'Marta Souza', email: 'marta@example.com', role: 'member' },
    ],
  },
}

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

export function useAdminUsers(query: UserSearchQuery = { field: 'name', value: '' }) {
  return useQuery({
    queryKey: adminUserKeys.list(query),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      if (!query.value.trim()) 
return mockUsers
      const q = query.value.trim().toLowerCase()
      return mockUsers.filter((u) => {
        if (query.field === 'name') 
return u.name.toLowerCase().includes(q)
        if (query.field === 'email') 
return u.email.toLowerCase().includes(q)
        if (query.field === 'externalId') 
return u.external_id.toLowerCase().includes(q)
        return true
      })
    },
  })
}

export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: adminUserKeys.detail(userId),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const user = mockUsers.find((u) => u.id === userId)
      if (!user) 
throw new Error('User not found')
      return user
    },
  })
}

export function useAdminUserAffiliate(userId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminUserKeys.affiliate(userId),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return mockAffiliateByUser[userId] ?? null
    },
    enabled,
  })
}

export function useAdminTeamSettings(teamId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminUserKeys.team(teamId),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      const team = mockTeamSettings[teamId]
      if (!team) 
throw new Error('Team not found')
      return team
    },
    enabled,
  })
}
