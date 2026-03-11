# Feature: Revenue / Métricas SaaS

**Route**: `/revenue` | **Permission**: `FINANCE_READ`
**Nav label**: "Métricas SaaS" (`nav.saasMetrics`)

Foco exclusivo nas métricas de negócio do VDClip como produto SaaS. Não inclui conteúdo/créditos
(esses ficam no Dashboard).

## Tabs
| Tab | Componente | Conteúdo |
|-----|-----------|----------|
| `saas-metrics` | `FinanceSaasMetricsTab` | Health score, KPIs completos, unit economics, P&L |
| `revenue` | `RevenueSummaryTab` | Receita USD/BRL, entradas vs saídas, tendência MRR |
| `transactions` | `RevenueTransactionsTab` | Listagem paginada de transações com filtros |

## Componentes
- `RevenuePage` — orquestra as 3 tabs (sem filtro de data no nível da página)
- `RevenueSummaryTab` — tem seu próprio `DateRangeFilter` interno
- `RevenueTransactionsTab` — filtro por status, tipo, moeda + busca

## Hooks
```ts
useAdminRevenue(dateRange): { data: RevenueSnapshot[] }
useAdminTransactions(filters): { data: TransactionPage }
```
`RevenueSnapshot` tem por moeda (USD/BRL): `mrr`, `newMrr`, `expansionMrr`,
`contractionMrr`, `churnedMrr`, `reactivationMrr`, `creditRevenue`, `activeSubscriptionsCount`.

## FinanceSaasMetricsTab (complexo)
Importado de `@/features/finance/components/finance-saas-metrics-tab.tsx`.
Seções: Revenue & Growth → Unit Economics → Customer Metrics → Cash & Runway → Charts → Historical Table → P&L.
Hook: `useSaasMetrics()` retorna `SaasMetricsSnapshot[]` (série histórica mensal).
Health score calculado por `computeHealthScore()` baseado em LTV/CAC, NRR, gross margin, churn, quick ratio.

## Types
```ts
// em features/admin/types
SaasMetricsSnapshot  // espelho da tabela business_metrics_snapshots (V016)
Currency             // 'USD' | 'BRL'
// em features/revenue/types
RevenueSnapshot, Transaction, TransactionStatus, TransactionType
```
