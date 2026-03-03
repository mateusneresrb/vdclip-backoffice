export type UserStatus = 'active' | 'inactive' | 'suspended'
export type UserPlan = 'free' | 'lite' | 'premium' | 'ultimate'
export type PlanProvider = 'paddle' | 'pix' | 'internal'
export type SocialProvider = 'google' | 'github' | 'discord'
export type CreditType = 'plan_cycle' | 'purchased' | 'promotional' | 'bonus' | 'adjustment'

export type MetricsDateRange = '1d' | '7d' | '30d' | '90d' | 'ytd' | 'all' | 'custom'

export interface DateRange {
  from: string
  to: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  avatar?: string
  status: UserStatus
  plan: UserPlan
  planProvider: PlanProvider
  planExpiresAt: string | null
  subscriptionId: string | null
  credits: number
  mediaCreated: number
  mediaPosted: number
  socialLogins: SocialProvider[]
  emailVerified: boolean
  isSocialAccount: boolean
  createdAt: string
  lastLoginAt: string
  teams: UserTeam[]
}

export interface UserTeam {
  id: string
  name: string
  role: 'owner' | 'admin' | 'member'
  members: number
}

export interface AffiliateInfo {
  referralCode: string
  commissionPercent: number
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  pendingPayout: number
  tier: 'bronze' | 'silver' | 'gold'
}

export interface TeamSettings {
  id: string
  name: string
  plan: UserPlan
  members: TeamMember[]
  maxMembers: number
  storageUsed: number
  storageLimit: number
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  avatar?: string
}

export interface RevenueMetrics {
  mrr: number
  newMrr: number
  expansionMrr: number
  contractionMrr: number
  churnedMrr: number
  reactivationMrr: number
  creditRevenue: number
  totalRevenue: number
}

export interface SubscriptionMetrics {
  activeSubscriptions: number
  newSubscriptions: number
  churnedSubscriptions: number
  churnRate: number
  byPlan: Record<UserPlan, number>
  byProvider: Record<PlanProvider, number>
  byBillingPeriod: { monthly: number; yearly: number }
}

export interface UserMetrics {
  totalUsers: number
  newUsersInPeriod: number
  verifiedEmails: number
  socialAccounts: number
}

export interface ContentMetrics {
  totalProjects: number
  completedProjects: number
  failedProjects: number
  totalScheduledPosts: number
  publishedPosts: number
  failedPosts: number
  byAiType: { clips: number; highlights: number; shorts: number }
  byProvider: Record<string, number>
}

export interface CreditMetrics {
  totalCreditsIssued: number
  totalCreditsUsed: number
  expiredCredits: number
  byType: Record<CreditType, number>
  transactionVolume: number
  refunds: number
}

export interface PlatformMetrics {
  revenue: RevenueMetrics
  subscriptions: SubscriptionMetrics
  users: UserMetrics
  content: ContentMetrics
  credits: CreditMetrics
}

// Template types (mirrors vdclip-dashboard schema)

export type AspectRatio = 'auto' | '9:16' | '16:9' | '1:1'
export type LayoutOption = 'fit' | 'fill' | 'split' | 'three' | 'four' | 'react'
export type CaptionAnimation = 'none' | 'bounce' | 'underline' | 'karaoke' | 'pulse' | 'scale' | 'box' | 'word-box' | 'one-word'
export type CaptionPosition = 'auto' | 'top' | 'middle' | 'bottom'
export type CaptionsPerPage = 'auto' | 'one-word'
export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface TemplateLayoutSettings {
  aspectRatio: AspectRatio
  faceTracking: boolean
  layouts: LayoutOption[]
}

export interface TemplateCaptionSettings {
  enabled: boolean
  presetModel?: string
  animation: CaptionAnimation
  position: CaptionPosition
  captionsPerPage: CaptionsPerPage
  fontFamily: string
  fontSize: number
  bold: boolean
  italic: boolean
  underline: boolean
  fontColor: string
  highlightColor: string
  outlineEnabled: boolean
  outlineColor: string
  outlineWidth: number
  shadowEnabled: boolean
  shadowColor: string
  shadowBlur: number
  removePunctuation: boolean
  removeProfanity: boolean
  uppercaseAll: boolean
}

export interface TemplateHookSettings {
  enabled: boolean
}

export interface TemplateLogoSettings {
  enabled: boolean
  imageUrl?: string | null
  scale: number
  opacity: number
  alternatePosition: boolean
  positions: LogoPosition[]
}

export interface TemplateSettings {
  layout: TemplateLayoutSettings
  caption: TemplateCaptionSettings
  hook: TemplateHookSettings
  logo: TemplateLogoSettings
}

export interface AdminTemplate {
  id: string
  name: string
  isDefault: boolean
  aspectRatio: AspectRatio
  settings: TemplateSettings
  createdAt: string
  updatedAt: string
}

export interface SupportedProvider {
  id: string
  name: string
  enabled: boolean
  type: 'social' | 'publishing' | 'ai' | 'processing'
}
