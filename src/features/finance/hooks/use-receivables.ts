import type { Receivable, ReceivableStatus } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiReceivable {
  id: string
  source_type: string
  source_reference: string | null
  description: string
  customer_name: string
  customer_external_id: string | null
  amount: string
  currency: string
  expected_date: string
  received_at: string | null
  status: string
  notes: string | null
  cost_center_id: string | null
  cost_center_name: string | null
  category_id: string | null
  category_name: string | null
  financial_transaction_id: string | null
  created_by: string | null
  created_by_email: string | null
  created_at: string
  updated_at: string
}

function toFrontend(row: ApiReceivable): Receivable {
  return {
    id: row.id,
    sourceType: row.source_type as Receivable['sourceType'],
    sourceReference: row.source_reference,
    description: row.description,
    customerName: row.customer_name,
    customerExternalId: row.customer_external_id,
    amount: Number.parseFloat(row.amount),
    currency: row.currency as Receivable['currency'],
    expectedDate: row.expected_date,
    receivedAt: row.received_at,
    status: row.status as ReceivableStatus,
    notes: row.notes,
    costCenterId: row.cost_center_id,
    costCenterName: row.cost_center_name,
    categoryId: row.category_id,
    categoryName: row.category_name,
    financialTransactionId: row.financial_transaction_id,
    createdBy: row.created_by,
    createdByEmail: row.created_by_email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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
