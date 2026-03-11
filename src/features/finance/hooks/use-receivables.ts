import type { Receivable, ReceivableStatus } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiReceivable {
  id: string
  source_type: string
  description: string
  customer_name: string
  amount: string
  currency: string
  expected_date: string
  received_at: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

function toFrontend(row: ApiReceivable): Receivable {
  return {
    id: row.id,
    sourceType: row.source_type as Receivable['sourceType'],
    description: row.description,
    customerName: row.customer_name,
    amount: Number.parseFloat(row.amount),
    currency: row.currency as Receivable['currency'],
    expectedDate: row.expected_date,
    receivedAt: row.received_at,
    status: row.status as ReceivableStatus,
    notes: row.notes,
  }
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
      return res.items.map(toFrontend)
    },
  })
}
