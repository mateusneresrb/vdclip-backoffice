import type { BankAccount } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiBankAccount {
  id: string
  name: string
  bank: string
  account_type: string
  currency: string
  balance: string
  last_sync_at: string | null
  is_active: boolean
}

function toFrontend(row: ApiBankAccount): BankAccount {
  return {
    id: row.id,
    name: row.name,
    bank: row.bank,
    accountType: row.account_type as BankAccount['accountType'],
    currency: row.currency as BankAccount['currency'],
    balance: Number.parseFloat(row.balance),
    lastSyncAt: row.last_sync_at ?? new Date().toISOString(),
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
