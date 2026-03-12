# Feature: Admin (Core Data Layer)

Este módulo é o **hub central de tipos e hooks** do backoffice.
Não tem rota própria — fornece tipos e hooks para todos os outros features.

## Responsabilidades
1. **Tipos centrais** (`types/index.ts`) — shared por quase todos os features
2. **Hooks de dados** — queries para dashboard, métricas, usuários, times, revenue

## Hooks disponíveis
```ts
useAdminMetrics(dateRange)   → PlatformMetrics          // Dashboard geral
useSaasMetrics()             → SaasMetricsSnapshot[]    // Métricas SaaS históricas
useAdminRevenue(dateRange)   → RevenueSnapshot[]        // Receita por moeda
useAdminUsers(filters)       → { users, total, page }   // Listagem de usuários
useAdminUser(userId)         → AdminUser                // Detalhe usuário
useAdminTeams(filters)       → AdminTeamDetail[]        // Times
useAdminTransactions(filters)→ TransactionPage          // Transações
useAdminSubscriptions(filters)→ Subscription[]         // Assinaturas
useAdminCashFlow(filters)    → CashFlowSummary          // Fluxo de caixa
useAdminAuthLogs(filters)    → AuthLog[]                // Logs de auth
useAdminMedia(userId)        → Media[]                  // Mídias de um usuário
useAdminProviders()          → Provider[]               // Integrações
useAdminTemplates()          → Template[]               // Templates admin
useAdminPendingPurchases(filters) → PendingPurchasePage // Compras pendentes (api-client)
useDismissPendingPurchase()  → mutation                  // POST dismiss
useCancelPendingPurchase()   → mutation                  // POST cancel on provider
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
- Hooks aqui são **maioria mock** atualmente (exceto `useAdminPendingPurchases` e mutations que usam `api-client`)
- Ao integrar API real: substituir `queryFn` inline por chamadas HTTP autenticadas
- Types devem espelhar o schema do backend — quando o schema mudar, atualizar aqui primeiro
- `SaasMetricsSnapshot` espelha a tabela `business_metrics_snapshots` (migration V016)
