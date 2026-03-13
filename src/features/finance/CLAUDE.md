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
// Queries (todas usam api-client)
useCostEntries(filters)         → CostEntry[]           (GET /cost-entries)
useBankAccounts()               → BankAccount[]         (GET /bank-accounts)
useFinancialCategories()        → FinancialCategory[]   (GET /financial-categories)
useTaxConfig()                  → TaxConfig[]           (GET /tax-configurations)
useCostCenters()                → CostCenter[]          (GET /cost-centers)
useReceivables(filters)         → Receivable[]          (GET /receivables)

// Mutations (CRUD)
useCostEntryMutations()         → { create, update, remove, approve, pay }
useBankAccountMutations()       → { create, update, remove }
useCategoryMutations()          → { create, update, remove }
useTaxConfigMutations()         → { create, update, remove }

// Notas financeiras
useFinancialNotes(entityType, entityId)          → FinancialNote[]
useCreateFinancialNote(entityType, entityId)     → mutation (POST /financial-notes)
useDeleteFinancialNote(entityType, entityId)     → mutation (DELETE /financial-notes/{id})

// Cash flow: re-importado de @/features/admin/hooks/use-admin-cash-flow
// useAdminCashFlow(currency, dateRange) → CashFlowSummary
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
FinancialCategoryType // 'revenue' | 'cogs' | 'opex' | 'tax' | 'asset' | 'liability' | 'equity'
FinancialCategory     // árvore: { id, parentId, code, name, type, costGroup, level, displayOrder, description, isActive, children? }
BankAccount           // { name, bank, accountType, agency, accountNumber, currency, initialBalance, balance, isActive }
CostEntryStatus       // 'draft' | 'approved' | 'paid' | 'cancelled'
RecurrenceInterval    // 'monthly' | 'quarterly' | 'annual'
CostAllocation        // 'cogs' | 'r_and_d' | 'sales_marketing' | 'general_admin'
CostEntry             // { vendor, description, amount, currency, isRecurring, recurrenceInterval, status, billingDate, dueDate, competenceMonth, costAllocation, ... 30+ campos }
TaxConfig             // { taxType, rate, municipalityCode, taxRegime, effectiveFrom, effectiveTo }
ReceivableSourceType  // 'gateway_payout' | 'invoice' | 'manual'
Receivable            // { id, sourceType, sourceReference, description, customerName, customerExternalId, amount, currency, expectedDate, receivedAt, status, notes, costCenterId/Name, categoryId/Name, financialTransactionId, createdBy, createdByEmail, createdAt, updatedAt }
CostCenter            // { slug, name, description, budget, spent, isActive }
FinancialNoteEntityType  // 'financial_transaction' | 'cost_entry' | 'receivable'
FinancialNoteCreator     // { id: string, name: string, email: string }
FinancialNote            // { id, content, createdBy: FinancialNoteCreator, createdAt, entityType, entityId }
// Input types (para mutations/form dialogs)
CreateBankAccountInput     // Omit<BankAccount, 'id' | 'balance'>
CreateFinancialCategoryInput // { code, name, type, parentId, level, displayOrder, costGroup?, description? }
CreateCostEntryInput       // { categoryId, costCenterId?, vendor, description, amount, currency, isRecurring, recurrenceInterval?, recurringUntil?, recurringSince?, billingDate, dueDate?, competenceMonth, costAllocation, isVariable?, unitMetric?, unitQuantity?, unitCost?, receiptUrl?, notes? }
// re-exportado de admin/types
CashFlowEntry, CashFlowSummary, Currency
```

## API Integration
- Hooks de custo, recebíveis, contas bancárias e cash-flow usam `@/lib/api-client`
- Em dev: MSW intercepta as chamadas e responde com dados mock realistas (`src/mocks/handlers/finance.ts`)
- Em prod: as mesmas chamadas vão para `VITE_API_URL` (real API)
- Hooks de notas financeiras usam chave de query `['financial-notes', entityType, entityId]`

## Responsive Design Patterns

Todos os componentes finance seguem mobile-first:
- **Tab icons**: `hidden sm:block` nos ícones das 7 tabs (reduz scroll no mobile)
- **Entry rows**: `flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between` (empilha no mobile)
- **Currency values**: `whitespace-nowrap text-sm font-bold` (evita quebra em valores formatados)
- **Summary cards**: `grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4`
- **Text scaling**: `text-base font-bold sm:text-lg` para valores de resumo
- **Search inputs**: `w-full sm:w-56` (full width no mobile)
- **Card headers**: `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`
- **Badges/metadata**: `flex flex-wrap items-center gap-1.5` para evitar overflow

## Importante
- `finance-saas-metrics-tab.tsx` está nesta feature mas é **usada na página `/revenue`**, não aqui
- A tab de SaaS Metrics foi intencionalmente separada da Contabilidade interna
- Sidebar mostra apenas 1 item (Finance) — tabs acessadas via `?tab=` na página
- `CostEntryFormDialog` exibe "Será registrado como: [nome]" no rodapé (via auth-store) ao criar
