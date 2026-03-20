import type { Currency } from '@/features/admin/types'

export type { CashFlowEntry, CashFlowSummary, Currency } from '@/features/admin/types'

export interface ApiCostEntry {
  id: string
  category_id: string
  category_name: string | null
  cost_center_id: string | null
  cost_center_name: string | null
  recurring_parent_id: string | null
  vendor: string
  description: string
  amount: string
  currency: string
  is_recurring: boolean
  recurrence_interval: string | null
  recurring_since: string | null
  recurring_until: string | null
  status: string
  billing_date: string
  due_date: string | null
  competence_month: string
  cost_allocation: string
  is_variable: boolean
  unit_metric: string | null
  unit_quantity: string | null
  unit_cost: string | null
  paid_at: string | null
  payment_method: string | null
  financial_transaction_id: string | null
  receipt_url: string | null
  notes: string | null
  created_by: string | null
  created_by_email: string | null
  created_at: string
  updated_at: string
}

export type FinancialCategoryType = 'revenue' | 'cogs' | 'opex' | 'tax' | 'asset' | 'liability' | 'equity'

export interface FinancialCategory {
  id: string
  parentId: string | null
  code: string
  name: string
  type: FinancialCategoryType
  costGroup: string | null
  level: number
  displayOrder: number
  description: string | null
  isActive: boolean
  children?: FinancialCategory[]
}

export interface CreateFinancialCategoryInput {
  code: string
  name: string
  type: FinancialCategoryType
  parentId: string | null
  level: number
  displayOrder: number
  costGroup?: string | null
  description?: string | null
}

export interface BankAccount {
  id: string
  name: string
  bank: string | null
  accountType: 'checking' | 'savings' | 'payment_gateway' | 'investment'
  agency: string | null
  accountNumber: string | null
  currency: Currency
  initialBalance: number
  balance: number
  isActive: boolean
}

export type CreateBankAccountInput = Omit<BankAccount, 'id' | 'balance'>

export type CostEntryStatus = 'draft' | 'approved' | 'paid' | 'cancelled'
export type RecurrenceInterval = 'monthly' | 'quarterly' | 'annual'
export type CostAllocation = 'cogs' | 'r_and_d' | 'sales_marketing' | 'general_admin'

export interface CostEntry {
  id: string
  categoryId: string
  categoryName: string
  categoryExternalId: string
  costCenterId: string | null
  costCenterName: string | null
  costCenterExternalId: string | null
  recurringParentId: string | null
  vendor: string
  description: string
  amount: number
  currency: Currency
  isRecurring: boolean
  recurrenceInterval: RecurrenceInterval | null
  recurringSince: string | null
  recurringUntil: string | null
  status: CostEntryStatus
  billingDate: string
  dueDate: string | null
  competenceMonth: string
  costAllocation: CostAllocation
  isVariable: boolean
  unitMetric: string | null
  unitQuantity: number | null
  unitCost: number | null
  paidAt: string | null
  paymentMethod: string | null
  financialTransactionId: string | null
  receiptUrl: string | null
  notes: string | null
  createdBy: string | null
  createdByEmail: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCostEntryInput {
  categoryId: string
  costCenterId?: string | null
  vendor: string
  description: string
  amount: number
  currency: Currency
  isRecurring: boolean
  recurrenceInterval?: RecurrenceInterval | null
  recurringUntil?: string | null
  recurringSince?: string | null
  billingDate: string
  dueDate?: string | null
  competenceMonth: string
  costAllocation: CostAllocation
  isVariable?: boolean
  unitMetric?: string | null
  unitQuantity?: number | null
  unitCost?: number | null
  receiptUrl?: string | null
  notes?: string | null
}

export interface TaxConfig {
  id: string
  taxType: string
  rate: number
  municipalityCode: string | null
  taxRegime: string
  effectiveFrom: string
  effectiveTo: string | null
}

export type ReceivableStatus = 'pending' | 'received' | 'overdue' | 'written_off' | 'cancelled'
export type ReceivableSourceType = 'gateway_payout' | 'invoice' | 'manual'

export interface Receivable {
  id: string
  sourceType: ReceivableSourceType
  sourceReference: string | null
  description: string
  customerName: string | null
  customerExternalId: string | null
  amount: number
  currency: Currency
  expectedDate: string
  receivedAt: string | null
  status: ReceivableStatus
  notes: string | null
  costCenterId: string | null
  costCenterName: string | null
  categoryId: string
  categoryName: string | null
  financialTransactionId: string | null
  createdBy: string | null
  createdByEmail: string | null
  createdAt: string
  updatedAt: string
}

export type FinancialNoteEntityType = 'financial_transaction' | 'cost_entry' | 'receivable'

export interface FinancialNoteCreator {
  id: string
  name: string
  email: string
}

export interface FinancialNote {
  id: string
  entityType: FinancialNoteEntityType
  entityId: string
  content: string
  createdBy: FinancialNoteCreator
  createdAt: string
  updatedAt: string
}

export interface CostCenter {
  id: string
  slug: string
  name: string
  description: string | null
  budget: number | null
  spent: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
