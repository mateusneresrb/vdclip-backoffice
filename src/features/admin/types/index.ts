export type UserStatus = 'active' | 'inactive' | 'suspended'
export type UserPlan = 'free' | 'lite' | 'premium' | 'ultimate'
export type PlanProvider = 'paddle' | 'pix' | 'internal'
export type SocialProvider = 'google' | 'github' | 'discord'
export type CreditType = 'plan_cycle' | 'purchased' | 'promotional' | 'bonus' | 'adjustment'

export type MetricsDateRange = '1d' | '3d' | '7d' | '30d' | '90d' | 'ytd' | 'all' | 'custom'

export interface DateRange {
  from: string
  to: string
}

export interface CreditPackage {
  id: string
  type: CreditType
  amount: number
  used: number
  startDate: string
  expiresAt: string
}

export interface AdminUser {
  id: string
  externalId: string
  name: string
  email: string
  avatar?: string
  status: UserStatus
  plan: UserPlan
  planProvider: PlanProvider
  planExpiresAt: string | null
  subscriptionId: string | null
  credits: number
  creditPackages: CreditPackage[]
  mediaCreated: number
  mediaPosted: number
  socialLogins: SocialProvider[]
  emailVerified: boolean
  isSocialAccount: boolean
  createdAt: string
  lastLoginAt: string
  teams: UserTeam[]
  companyId: string | null
  companyName: string | null
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
  mrrHistory: { date: string; mrr: number }[]
  userGrowth: { date: string; total: number; new: number }[]
  revenueComposition: { date: string; newMrr: number; expansion: number; churn: number }[]
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
  format?: string
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

export type ProviderCategory = 'video_source' | 'payment' | 'ai_processing' | 'publishing'

export interface SupportedProvider {
  id: string
  name: string
  slug: string
  enabled: boolean
  type: 'social' | 'publishing' | 'ai' | 'processing' | 'payment'
  category: ProviderCategory
  description?: string
  connectionCount?: number
}

// Media types (mirrors projects + project_results tables)

export type MediaStatus = 'completed' | 'processing' | 'failed' | 'pending'
export type AiType = 'clips' | 'highlights' | 'shorts'
export type RenderingStatus = 'created' | 'pending' | 'rendering' | 'completed' | 'failed'

export interface AdminMedia {
  id: string
  externalId?: string | null
  title: string
  url: string | null
  thumbnailUrl: string | null
  status: MediaStatus
  aiType: AiType | null
  aspectRatio: string
  category: string | null
  language: string
  provider: string | null
  processStep: number
  clipLengths: string[] | null
  errorCode: string | null
  deletedAt: string | null
  resultsCount: number
  newVersion: boolean
  ownerId: string
  ownerType: 'USER' | 'TEAM'
}

export interface MediaResult {
  id: string
  title: string
  description: string | null
  highlightTags: string[] | null
  thumbnailUrl: string | null
  viralityScore: number | null
  projectVersion: number
  renderingStatus: RenderingStatus
  processId?: string
  newVersion?: boolean
  ownerId?: string
  ownerType?: 'USER' | 'TEAM'
}

// Financial types

export type Currency = 'USD' | 'BRL'
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'expired'
export type TransactionType = 'subscription_payment' | 'credit_purchase' | 'refund'
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
export type BillingPeriod = 'monthly' | 'yearly'
export type AuthEventType = 'login_success' | 'login_failed' | 'password_changed' | 'oauth_connected' | 'oauth_disconnected' | 'token_refreshed' | 'account_locked'

export interface AdminSubscription {
  id: string
  userId: string | null
  userName: string | null
  userEmail: string | null
  teamId: string | null
  teamName: string | null
  planTier: UserPlan
  billingPeriod: BillingPeriod
  status: SubscriptionStatus
  provider: PlanProvider
  currency: Currency
  amount: number
  mrr: number
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelledAt: string | null
  createdAt: string
}

export interface AdminTransaction {
  id: string
  userId: string | null
  userName: string | null
  teamId: string | null
  teamName: string | null
  provider: PlanProvider
  transactionType: TransactionType
  status: TransactionStatus
  currency: Currency
  amount: number
  completedAt: string | null
  createdAt: string
}

export interface AuthLogEntry {
  id: string
  userId: number | null
  userName: string | null
  userEmail: string | null
  userSource: 'vdclip' | 'business'
  eventType: AuthEventType
  ipAddress: string | null
  userAgent: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface AdminTeamOverview {
  id: string
  name: string
  memberCount: number
  plan: UserPlan
  category: string | null
  createdAt: string
}

export interface RevenueDailySnapshot {
  snapshotDate: string
  currency: Currency
  mrr: number
  newMrr: number
  expansionMrr: number
  contractionMrr: number
  churnedMrr: number
  reactivationMrr: number
  activeSubscriptionsCount: number
  newSubscriptionsCount: number
  churnedSubscriptionsCount: number
  creditRevenue: number
}

export interface CashFlowEntry {
  id: string
  date: string
  description: string
  category: 'revenue' | 'expense' | 'refund' | 'tax' | 'investment' | 'other'
  type: 'inflow' | 'outflow'
  currency: Currency
  amount: number
  createdAt: string
}

export interface CashFlowSummary {
  currency: Currency
  totalInflow: number
  totalOutflow: number
  netFlow: number
  entries: CashFlowEntry[]
  monthlyBreakdown: { month: string; inflow: number; outflow: number }[]
}

export interface UserActivityEvent {
  id: string
  type: 'subscription_created' | 'plan_changed' | 'credits_added' | 'login' | 'password_changed' | 'media_created'
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface UserSocialConnection {
  id: string
  platform: string
  displayName: string
  username: string
  connectedAt: string
  lastUsedAt: string | null
  hasError: boolean
  errorMessage: string | null
  postsCount?: number
}

export interface AdminTeamDetail {
  id: string
  name: string
  picture: string | null
  email: string | null
  category: string | null
  socialUrls: { youtube?: string; instagram?: string; tiktok?: string }
  plan: UserPlan
  memberCount: number
  maxMembers: number
  storageUsed: number
  storageLimit: number
  credits: number
  mediaCreated: number
  mediaPosted: number
  createdAt: string
}

// SaaS Metrics (mirrors business_metrics_snapshots table V016)

export interface SaasMetricsSnapshot {
  id: string
  month: string
  costCenterId: string | null
  currency: Currency
  // P&L
  grossRevenue: number
  netRevenue: number
  cogs: number
  grossProfit: number
  grossMarginPct: number
  totalOpex: number
  rAndDCost: number
  salesMarketingCost: number
  generalAdminCost: number
  netIncome: number
  // Cash & Runway
  burnRate: number
  runwayMonths: number
  cashBalance: number
  // Customers
  totalCustomers: number
  newCustomers: number
  churnedCustomers: number
  churnRatePct: number
  revenueChurnRatePct: number
  // Unit Economics
  arpu: number
  ltv: number
  cac: number
  ltvCacRatio: number
  paybackMonths: number
  // Growth & Health
  nrrPct: number
  quickRatio: number
  trialToPaidRatePct: number
  createdAt: string
}

export interface TeamInvitation {
  id: string
  email: string
  role: 'admin' | 'member'
  status: 'pending' | 'accepted' | 'expired'
  invitedBy: string
  createdAt: string
  expiresAt: string
}

// Scheduled Posts (mirrors scheduled_posts table V025)

export interface PendingPurchase {
  id: string
  email: string
  planTier: string
  billingPeriod: string
  provider: string
  providerSubscriptionId: string | null
  providerTransactionId: string | null
  providerCustomerId: string | null
  currency: string
  amount: string
  creditsAmount: number
  periodStart: string | null
  periodEnd: string | null
  isTrial: boolean
  status: 'pending' | 'claimed' | 'expired'
  claimedByUserId: string | null
  claimedByUserEmail: string | null
  claimedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ScheduledPostStatus = 'pending' | 'scheduled' | 'published' | 'failed' | 'cancelled'

export interface ScheduledPost {
  id: string
  platform: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  status: ScheduledPostStatus
  scheduledAt: string | null
  publishedAt: string | null
  lastAttemptedAt: string | null
  socialPublishId: string | null
  retryCount: number
  errorMessage: string | null
  projectResultId: string | null
  socialConnectionId: string
  createdAt: string
  updatedAt: string
}
