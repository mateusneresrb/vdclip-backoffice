export { UserSearch } from './components/UserSearch'
export { UserDetail } from './components/UserDetail'
export { MetricsOverview } from './components/MetricsOverview'
export { ProvidersManager } from './components/ProvidersManager'
export { TemplateManager } from './components/TemplateManager'
export { MediaManager } from './components/MediaManager'

export {
  useAdminUsers,
  useAdminUser,
  useAdminUserAffiliate,
  useAdminTeamSettings,
} from './hooks/use-admin-users'
export { useAdminMetrics } from './hooks/use-admin-metrics'
export {
  useAdminUserMedia,
  useAdminMediaResults,
} from './hooks/use-admin-media'
export { useAdminProviders } from './hooks/use-admin-providers'
export {
  useAdminUserTemplates,
  useAdminTeamTemplates,
} from './hooks/use-admin-templates'

export type {
  AdminUser,
  PlatformMetrics,
  RevenueMetrics,
  SubscriptionMetrics,
  UserMetrics,
  ContentMetrics,
  CreditMetrics,
  SupportedProvider,
  UserStatus,
  UserPlan,
  PlanProvider,
  SocialProvider,
  CreditType,
  MetricsDateRange,
  DateRange,
  UserTeam,
  AffiliateInfo,
  TeamSettings,
  TeamMember,
  AdminTemplate,
  TemplateSettings,
  AdminMedia,
  MediaResult,
  MediaStatus,
  AiType,
  RenderingStatus,
} from './types'
