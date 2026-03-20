import type { BankAccount } from '../types'

import type { Currency } from '@/features/admin/types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiBankAccount {
  id: string
  name: string
  type: string
  bank_name: string | null
  agency: string | null
  account_number: string | null
  currency: string
  initial_balance: string
  current_balance: string
  is_active: boolean
  created_at: string
  updated_at: string
}

const bankAccountKeys = {
  all: ['bank-accounts'] as const,
  list: () => [...bankAccountKeys.all, 'list'] as const,
}

export function useBankAccounts() {
  return useQuery({
    queryKey: bankAccountKeys.list(),
    queryFn: async () => {
      const res = await apiClient.get<ApiBankAccount[]>('/bank-accounts')
      return res.map((row): BankAccount => ({
        id: row.id,
        name: row.name,
        bank: row.bankName ?? null,
        accountType: row.type as BankAccount['accountType'],
        agency: row.agency ?? null,
        accountNumber: row.accountNumber ?? null,
        currency: row.currency as Currency,
        initialBalance: Number.parseFloat(String(row.initialBalance)),
        balance: Number.parseFloat(String(row.currentBalance)),
        isActive: row.isActive,
      }))
    },
  })
}
