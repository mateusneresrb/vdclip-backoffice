import type { Currency } from '@/features/admin/types'

export type { CashFlowEntry, CashFlowSummary, Currency } from '@/features/admin/types'

export interface FinancialCategory {
  id: string
  parentId: string | null
  code: string
  name: string
  type: 'revenue' | 'expense' | 'asset' | 'liability'
  children?: FinancialCategory[]
}

export interface BankAccount {
  id: string
  name: string
  bank: string
  accountType: 'checking' | 'savings' | 'investment'
  currency: Currency
  balance: number
  lastSyncAt: string
  isActive: boolean
}

export interface CostEntry {
  id: string
  description: string
  categoryId: string
  categoryName: string
  costCenter: string
  type: 'recurring' | 'one_time'
  frequency: 'monthly' | 'quarterly' | 'yearly' | null
  currency: Currency
  amount: number
  startDate: string
  endDate: string | null
  isActive: boolean
}

export interface TaxConfig {
  id: string
  name: string
  code: string
  rate: number
  type: 'federal' | 'state' | 'municipal'
  isActive: boolean
  appliesTo: 'revenue' | 'payroll' | 'services' | 'all'
}

export type ReceivableStatus = 'pending' | 'received' | 'overdue' | 'written_off' | 'cancelled'
export type ReceivableSourceType = 'subscription' | 'one_time' | 'refund_reversal' | 'manual'

export interface Receivable {
  id: string
  sourceType: ReceivableSourceType
  description: string
  customerName: string
  amount: number
  currency: Currency
  expectedDate: string
  receivedAt: string | null
  status: ReceivableStatus
  notes: string | null
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
  code: string
  name: string
  description: string
  responsible: string
  budget: number
  spent: number
  currency: Currency
  isActive: boolean
  createdAt: string
}
