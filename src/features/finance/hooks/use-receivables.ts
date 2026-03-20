import type { Receivable, ReceivableStatus } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiReceivable {
  id: string
  source_type: string
  source_reference: string | null
  description: string
  customer_name: string | null
  customer_external_id: string | null
  amount: string
  currency: string
  expected_date: string
  received_at: string | null
  status: string
  notes: string | null
  cost_center_id: string | null
  cost_center_name: string | null
  category_id: string
  category_name: string | null
  financial_transaction_id: string | null
  created_by: string | null
  created_by_email: string | null
  created_at: string
  updated_at: string
}

const receivableKeys = {
  all: ['receivables'] as const,
  list: (status?: ReceivableStatus) =>
    [...receivableKeys.all, 'list', status ?? 'all'] as const,
}

export function useReceivables(status?: ReceivableStatus) {
  return useQuery({
    queryKey: receivableKeys.list(status),
    queryFn: async () => {
      const res = await apiClient.get<{ items: ApiReceivable[] }>('/receivables', {
        per_page: 100,
        ...(status ? { status } : {}),
      })
      return res.items.map((row): Receivable => ({
        ...row,
        sourceType: row.sourceType as Receivable['sourceType'],
        amount: Number.parseFloat(String(row.amount)),
        currency: row.currency as Receivable['currency'],
        status: row.status as ReceivableStatus,
      }))
    },
  })
}
