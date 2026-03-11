# Feature: Dashboard

**Route**: `/dashboard` | **Permission**: `METRICS_READ`

Visão geral da plataforma VDClip. Não é financeiro profundo — é uma visão operacional geral.

## Tabs
| Tab | Componente | Conteúdo |
|-----|-----------|----------|
| `summary` | `DashboardSummaryTab` | MRR básico, usuários, projetos, créditos, movimentação MRR, gráficos de tendência |
| `users` | `DashboardUsersTab` | Métricas de usuários, crescimento ao longo do tempo |
| `content` | `DashboardContentTab` | Projetos criados/completados/falhos, posts, por AI type/provider |
| `credits` | `DashboardCreditsTab` | Créditos emitidos/usados/expirados, utilização, tipo |

## Componentes
- `DashboardPage` — orquestra `MetricsQuickPanel` + tabs + filtro de período
- `MetricCard` — card reutilizável com ícone, valor, tooltip, subtítulo
- `DateRangeFilter` — filtro de período (1d, 7d, 30d, 90d, ytd, all)
- `MetricsQuickPanel` — 6 cards de KPIs SaaS críticos (Runway, MRR, LTV/CAC, Churn, NRR, Clientes) acima das tabs; código de cor por threshold; links `<a href>` para `/revenue?tab=saas-metrics`
- Tabs importam `DashboardContentTab` e `DashboardCreditsTab` diretamente

## Hook
```ts
useDashboardMetrics(dateRange: MetricsDateRange): { data: PlatformMetrics }
```
Retorna `PlatformMetrics` com: `revenue`, `subscriptions`, `users`, `content`, `credits`,
`mrrHistory[]`, `userGrowth[]`, `revenueComposition[]`.

## Regras de Design
- **NÃO** colocar métricas financeiras profundas aqui (P&L, LTV, CAC, etc.) — essas ficam em `/revenue`
- MRR aqui deve ser básico: valor atual + movimentação simples
- Foco: saúde operacional da plataforma (quantos usuários, projetos, créditos)
- Gráficos: `AreaChart` para tendências temporais, `BarChart` para composição, `DonutChart` para distribuição

## Types (re-exportados de `@/features/admin/types`)
`PlatformMetrics`, `RevenueMetrics`, `SubscriptionMetrics`, `UserMetrics`, `ContentMetrics`,
`CreditMetrics`, `MetricsDateRange`
