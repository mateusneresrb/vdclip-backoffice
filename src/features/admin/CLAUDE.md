# Feature: Admin (Core Data Layer)

Este módulo é o **hub central de tipos e hooks** do backoffice.
Não tem rota própria — fornece tipos e hooks para todos os outros features.

## Responsabilidades
1. **Tipos centrais** (`types/index.ts`) — shared por quase todos os features
2. **Hooks de dados** — queries para dashboard, métricas, usuários, times, revenue

## Hooks disponíveis
```ts
// Dashboard & Métricas
useAdminMetrics(dateRange: MetricsDateRange)    → PlatformMetrics
useSaasMetrics()                                → SaasMetricsSnapshot[]
useAdminRevenue(dateRange: MetricsDateRange)    → RevenueDailySnapshot[]
useAdminCashFlow(currency, dateRange)           → CashFlowSummary

// Usuários
useAdminUsers(query: UserSearchQuery)           → { users, total, page }
useAdminUser(userId)                            → AdminUser
useAdminUserAffiliate(userId, enabled)          → AffiliateInfo  // MOCK — sem endpoint
useAdminUserMedia(userId, enabled)              → Media[]
useAdminUserTemplates(userId, enabled)          → Template[]
useAdminUserScheduledPosts(userId, enabled)     → ScheduledPost[]

// Times
useAdminTeams(query: TeamSearchQuery)           → AdminTeamDetail[]
useAdminTeamSettings(teamId, enabled)           → TeamSettings
useAdminTeamMedia(teamId, enabled)              → Media[]
useAdminTeamTemplates(teamId, enabled)          → Template[]
useAdminTeamScheduledPosts(teamId, enabled)     → ScheduledPost[]

// Financeiro & Transações
useAdminTransactions(search, typeFilter)        → TransactionPage
useAdminSubscriptions(search, statusFilter)     → Subscription[]
useAdminAuthLogs(search)                        → AuthLog[]
useAdminProviders()                             → Provider[]
useAdminMediaResults(mediaId, enabled)          → MediaResult[]

// Compras Pendentes
useAdminPendingPurchases(filters)               → PendingPurchasePage
useDismissPendingPurchase()                     → mutation
useCancelPendingPurchase()                      → mutation

// Scheduled Posts Mutations
useUpdateScheduledPost(scope, scopeId)          → mutation
useCancelScheduledPost(scope, scopeId)          → mutation
```

## Tipos Centrais (todos os features importam daqui via `@/features/admin/types`)
```ts
// Usuário
AdminUser, UserStatus, UserPlan, PlanProvider, SocialProvider
CreditPackage, CreditType, UserTeam, AffiliateInfo

// Time
AdminTeamDetail, TeamMember, TeamSettings, TeamInvitation

// Métricas & Revenue
PlatformMetrics, RevenueMetrics, SubscriptionMetrics
UserMetrics, ContentMetrics, CreditMetrics
RevenueSnapshot, MetricsDateRange, DateRange

// SaaS (tabela business_metrics_snapshots V016)
SaasMetricsSnapshot, Currency ('USD' | 'BRL')

// Financeiro
CashFlowEntry, CashFlowSummary, UserActivityEvent, UserSocialConnection

// Compras Pendentes
PendingPurchase  // status: 'pending' | 'claimed' | 'expired'
```

## Importante
- Todos os hooks usam `api-client` para chamadas reais (exceto `useAdminUserAffiliate` que mantém mock — sem endpoint backend)
- O `api-client` auto-converte snake_case/camelCase: responses chegam camelCase, request bodies saem snake_case. Mappers nos hooks apenas extraem/tipam campos — sem conversao de case manual
- Query params permanecem snake_case (ex: `per_page`, `date_from`) — nao sao auto-convertidos
- Api* interfaces foram movidas para JSDoc comments — documentam o shape snake_case do backend
- Types devem espelhar o schema do backend — quando o schema mudar, atualizar aqui primeiro
- `SaasMetricsSnapshot` espelha a tabela `business_metrics_snapshots` (migration V016)
