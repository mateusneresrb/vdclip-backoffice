# Feature: Finance (Contabilidade)

**Route**: `/finance?tab=*` | **Permission**: `FINANCE_READ` / `FINANCE_WRITE`

Gestão financeira interna da empresa VDClip (não métricas SaaS do produto).

## Tabs (via `?tab=` query param)
| Tab | Componente | Conteúdo |
|-----|-----------|----------|
| `cash-flow` (default) | `FinanceCashFlowTab` | Fluxo de caixa por moeda, entradas/saídas mensais |
| `costs` | `FinanceCostEntriesTab` | Custos recorrentes e pontuais + CRUD |
| `receivables` | `FinanceReceivablesTab` | Contas a receber, status, vencimentos |
| `bank-accounts` | `FinanceBankAccountsTab` | Contas bancárias + CRUD |
| `chart-of-accounts` | `FinanceChartOfAccountsTab` | Plano de contas hierárquico |
| `taxes` | `FinanceTaxConfigTab` | Configuração de impostos + CRUD |
| `cost-centers` | `FinanceCostCentersTab` | Centros de custo |

## Padrão de CRUD
Cada tab com CRUD usa um Form Dialog: `{entity}-form-dialog.tsx`.
Dialogs usam `react-hook-form` + `zod` para validação.
Mutations via `use-{entity}-mutations.ts` com invalidação de queries.

## Hooks
```ts
useCashFlow(filters)            → CashFlowSummary       (usa api-client → GET /dashboard/cash-flow)
useCostEntries(filters)         → CostEntry[]           (usa api-client → GET /cost-entries)
useBankAccounts()               → BankAccount[]         (usa api-client → GET /bank-accounts)
useFinancialCategories()        → FinancialCategory[]   (usa api-client → GET /financial-categories)
useTaxConfig()                  → TaxConfig[]
useCostCenters()                → CostCenter[]
useReceivables(filters)         → Receivable[]          (usa api-client → GET /receivables)

// Notas financeiras
useFinancialNotes(entityType, entityId)          → FinancialNote[]
useCreateFinancialNote(entityType, entityId)     → mutation (POST /financial-notes)
useDeleteFinancialNote(entityType, entityId)     → mutation (DELETE /financial-notes/{id})
```

## Componentes
```ts
FinancialNotes  // src/features/finance/components/financial-notes.tsx
// Props: { entityType: FinancialNoteEntityType, entityId: string, className?: string }
// Lista notas com avatar/iniciais, timestamp relativo, botão de deletar (só próprias)
// Input Textarea + Ctrl+Enter para adicionar, "Registrado como: [nome]" no rodapé
// Integrado via <Sheet> em FinanceCostEntriesTab e FinanceReceivablesTab
```

## Types
```ts
// em features/finance/types
FinancialCategory     // árvore: { id, parentId, code, name, type, children? }
BankAccount           // { name, bank, accountType, currency, balance, isActive }
CostEntry             // { type: 'recurring'|'one_time', frequency, currency, amount }
TaxConfig             // { rate, type: 'federal'|'state'|'municipal', appliesTo }
Receivable            // { status: pending|received|overdue|written_off|cancelled }
FinancialNoteEntityType  // 'financial_transaction' | 'cost_entry' | 'receivable'
FinancialNoteCreator     // { id: string, name: string, email: string }
FinancialNote            // { id, content, createdBy: FinancialNoteCreator, createdAt, entityType, entityId }
// re-exportado de admin/types
CashFlowEntry, CashFlowSummary, Currency
```

## API Integration
- Hooks de custo, recebíveis, contas bancárias e cash-flow usam `@/lib/api-client`
- Em dev: MSW intercepta as chamadas e responde com dados mock realistas (`src/mocks/handlers/finance.ts`)
- Em prod: as mesmas chamadas vão para `VITE_API_URL` (real API)
- Hooks de notas financeiras usam chave de query `['financial-notes', entityType, entityId]`

## Importante
- `finance-saas-metrics-tab.tsx` está nesta feature mas é **usada na página `/revenue`**, não aqui
- A tab de SaaS Metrics foi intencionalmente separada da Contabilidade interna
- Sidebar mostra apenas 1 item (Finance) — tabs acessadas via `?tab=` na página
- `CostEntryFormDialog` exibe "Será registrado como: [nome]" no rodapé (via auth-store) ao criar
