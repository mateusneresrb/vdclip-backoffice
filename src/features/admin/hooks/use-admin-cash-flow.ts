import type { CashFlowSummary, Currency } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'
import { getDateParams } from '@/lib/date-utils'

/**
 * Backend JSON shape (snake_case) — kept for documentation.
 * After auto case-transform, keys arrive as camelCase.
 *
 * ApiCashFlowResponse:
 *   currency, total_inflow, total_outflow, total_net,
 *   entries: [{ period, inflow, outflow, net, currency }]
 *
 * ApiTransactionItem:
 *   id, type, direction, category_name, amount, currency,
 *   description, transaction_date, created_at?
 */

function mapCategory(direction: string, type: string): CashFlowSummary['entries'][number]['category'] {
  if (type === 'tax') 
return 'tax'
  if (type === 'refund') 
return 'refund'
  if (type === 'investment') 
return 'investment'
  if (direction === 'inflow') 
return 'revenue'
  if (direction === 'outflow') 
return 'expense'
  return 'other'
}

function toFrontend(
  summary: Record<string, unknown>,
  transactions: Record<string, unknown>[],
  currency: Currency,
): CashFlowSummary {
  const entries = (summary.entries ?? []) as Record<string, unknown>[]
  return {
    currency,
    totalInflow: Number.parseFloat(String(summary.totalInflow ?? '0')),
    totalOutflow: Number.parseFloat(String(summary.totalOutflow ?? '0')),
    netFlow: Number.parseFloat(String(summary.totalNet ?? '0')),
    entries: transactions.map((t) => ({
      id: String(t.id ?? ''),
      date: String(t.transactionDate ?? ''),
      description: String(t.description ?? ''),
      category: mapCategory(String(t.direction ?? ''), String(t.type ?? '')),
      type: String(t.direction ?? '') as 'inflow' | 'outflow',
      currency: String(t.currency ?? '') as Currency,
      amount: Number.parseFloat(String(t.amount ?? '0')),
      createdAt: String(t.createdAt ?? t.transactionDate ?? ''),
    })),
    monthlyBreakdown: entries.map((e) => ({
      month: String(e.period ?? ''),
      inflow: Number.parseFloat(String(e.inflow ?? '0')),
      outflow: Number.parseFloat(String(e.outflow ?? '0')),
    })),
  }
}

const adminCashFlowKeys = {
  all: ['admin-cash-flow'] as const,
  byCurrency: (currency: Currency, dateRange: string) =>
    [...adminCashFlowKeys.all, currency, dateRange] as const,
}

export function useAdminCashFlow(currency: Currency = 'USD', dateRange: string = '30d') {
  return useQuery({
    queryKey: adminCashFlowKeys.byCurrency(currency, dateRange),
    queryFn: async () => {
      const dates = getDateParams(dateRange)
      const [summary, txPage] = await Promise.all([
        apiClient.get<Record<string, unknown>>('/dashboard/cash-flow', {
          currency,
          ...dates,
        }),
        apiClient.get<{ items: Record<string, unknown>[] }>('/financial-transactions', {
          currency,
          per_page: 100,
          ...dates,
        }),
      ])
      return toFrontend(summary, txPage.items, currency)
    },
  })
}
