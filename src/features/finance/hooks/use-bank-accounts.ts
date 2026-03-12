import type { BankAccount } from '../types'

import { useQuery } from '@tanstack/react-query'

import type { Currency } from '@/features/admin/types'

import { apiClient } from '@/lib/api-client'

interface ApiBankAccount {
  id: string
  external_id: string
  name: string
  type: string
  bank_name: string | null
  agency: string | null
  account_number: string | null
  currency: string
  initial_balance: string
  current_balance: string
  is_active: boolean
}

function toFrontend(row: ApiBankAccount): BankAccount {
  return {
    id: row.external_id ?? row.id,
    name: row.name,
    bank: row.bank_name ?? null,
    accountType: row.type as BankAccount['accountType'],
    agency: row.agency ?? null,
    accountNumber: row.account_number ?? null,
    currency: row.currency as Currency,
    initialBalance: Number.parseFloat(row.initial_balance),
    balance: Number.parseFloat(row.current_balance),
    isActive: row.is_active,
  }
}

const bankAccountKeys = {
  all: ['bank-accounts'] as const,
  list: () => [...bankAccountKeys.all, 'list'] as const,
}

export function useBankAccounts() {
  return useQuery({
    queryKey: bankAccountKeys.list(),
    queryFn: async () => {
      const res = await apiClient.get<{ items: ApiBankAccount[] }>('/bank-accounts')
      return res.items.map(toFrontend)
    },
  })
}
