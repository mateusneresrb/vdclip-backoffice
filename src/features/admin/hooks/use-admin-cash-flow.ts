import type { CashFlowSummary, Currency } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiCashFlowResponse {
  currency: string
  total_inflow: string
  total_outflow: string
  total_net: string
  entries: Array<{
    period: string
    inflow: string
    outflow: string
    net: string
    currency: string
  }>
}

interface ApiTransactionItem {
  id: string
  type: string
  direction: string
  category_name: string
  amount: string
  currency: string
  description: string
  transaction_date: string
  created_at?: string
}

function dateRangeToDates(dateRange: string): { date_from: string; date_to: string } {
  const to = new Date()
  const from = new Date()
  switch (dateRange) {
    case '1d':
      from.setDate(from.getDate() - 1)
      break
    case '3d':
      from.setDate(from.getDate() - 3)
      break
    case '7d':
      from.setDate(from.getDate() - 7)
      break
    case '30d':
      from.setDate(from.getDate() - 30)
      break
    case '90d':
      from.setDate(from.getDate() - 90)
      break
    case 'ytd':
      from.setMonth(0, 1)
      break
    case 'all':
      from.setFullYear(from.getFullYear() - 5)
      break
    default:
      from.setDate(from.getDate() - 30)
  }
  return {
    date_from: from.toISOString().split('T')[0],
    date_to: to.toISOString().split('T')[0],
  }
}

function mapCategory(direction: string, type: string): CashFlowSummary['entries'][number]['category'] {
  if (type === 'tax') return 'tax'
  if (type === 'refund') return 'refund'
  if (type === 'investment') return 'investment'
  if (direction === 'inflow') return 'revenue'
  if (direction === 'outflow') return 'expense'
  return 'other'
}

function toFrontend(
  summary: ApiCashFlowResponse,
  transactions: ApiTransactionItem[],
  currency: Currency,
): CashFlowSummary {
  return {
    currency,
    totalInflow: Number.parseFloat(summary.total_inflow),
    totalOutflow: Number.parseFloat(summary.total_outflow),
    netFlow: Number.parseFloat(summary.total_net),
    entries: transactions.map((t) => ({
      id: t.id,
      date: t.transaction_date,
      description: t.description,
      category: mapCategory(t.direction, t.type),
      type: t.direction as 'inflow' | 'outflow',
      currency: t.currency as Currency,
      amount: Number.parseFloat(t.amount),
      createdAt: t.created_at ?? t.transaction_date,
    })),
    monthlyBreakdown: summary.entries.map((e) => ({
      month: e.period,
      inflow: Number.parseFloat(e.inflow),
      outflow: Number.parseFloat(e.outflow),
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
      const dates = dateRangeToDates(dateRange)
      const [summary, txPage] = await Promise.all([
        apiClient.get<ApiCashFlowResponse>('/dashboard/cash-flow', {
          currency,
          ...dates,
        }),
        apiClient.get<{ items: ApiTransactionItem[] }>('/financial-transactions', {
          currency,
          per_page: 100,
          ...dates,
        }),
      ])
      return toFrontend(summary, txPage.items, currency)
    },
  })
}
