export interface BusinessUser {
  id: string
  externalId: string
  name: string
  email: string
  avatarUrl?: string
  companyId: string
  companyName: string
  role: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin: string | null
}

export interface BusinessCompany {
  id: string
  externalId: string
  name: string
  logoUrl?: string
  document: string | null
  plan: string
  status: 'active' | 'inactive' | 'trial' | 'suspended'
  userCount: number
  createdAt: string
  contactEmail: string | null
}

export interface BusinessCompanyDetail extends BusinessCompany {
  phone: string | null
  address: string | null
  subscription: BusinessSubscription
  users: BusinessCompanyUser[]
  billingHistory: BusinessBillingEntry[]
  activityLog: BusinessActivityEntry[]
}

export interface BusinessSubscription {
  planTier: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  monthlyPrice: number
  currency: string
  cancelAtPeriodEnd: boolean
}

export interface BusinessCompanyUser {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  joinedAt: string
  lastLogin: string | null
}

export interface BusinessBillingEntry {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed' | 'refunded'
}

export interface BusinessActivityEntry {
  id: string
  timestamp: string
  action: string
  actor: string
  details: string
}
