import type { AdminTransaction } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const adminTransactionsKeys = {
  all: ['admin-transactions'] as const,
  filtered: (search: string, type: string) =>
    [...adminTransactionsKeys.all, search, type] as const,
}

function mapTransaction(t: Record<string, unknown>): AdminTransaction {
  return {
    id: String(t.id ?? ''),
    userId: (t.user_id ?? t.userId ?? null) as string | null,
    userName: (t.user_name ?? t.userName ?? null) as string | null,
    teamId: (t.team_id ?? t.teamId ?? null) as string | null,
    teamName: (t.team_name ?? t.teamName ?? null) as string | null,
    provider: (t.provider as AdminTransaction['provider']) ?? 'paddle',
    transactionType: (t.transaction_type ?? t.transactionType) as AdminTransaction['transactionType'],
    status: (t.status as AdminTransaction['status']) ?? 'pending',
    currency: (t.currency as AdminTransaction['currency']) ?? 'USD',
    amount: Number(t.amount ?? 0),
    completedAt: (t.completed_at ?? t.completedAt ?? null) as string | null,
    createdAt: String(t.created_at ?? t.createdAt ?? ''),
  }
}

export function useAdminTransactions(search: string = '', typeFilter: string = 'all') {
  return useQuery({
    queryKey: adminTransactionsKeys.filtered(search, typeFilter),
    queryFn: async () => {
      const params: Record<string, string | number | boolean | undefined> = {
        page: 1,
        per_page: 50,
      }
      if (search)
        params.search = search
      if (typeFilter !== 'all')
        params.transaction_type = typeFilter

      const data = await apiClient.get<{ items: Record<string, unknown>[] }>('/platform/transactions', params)
      return data.items.map(mapTransaction)
    },
  })
}
