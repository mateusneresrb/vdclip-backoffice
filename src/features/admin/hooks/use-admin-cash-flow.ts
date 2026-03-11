import type { CashFlowSummary, Currency } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiCashFlowSummary {
  currency: string
  total_inflow: string
  total_outflow: string
  net_flow: string
  entries: Array<{
    id: string
    transaction_date: string
    description: string
    category_name: string
    direction: string
    currency: string
    amount: string
    type: string
    created_at: string
  }>
  monthly_breakdown: Array<{
    month: string
    inflow: string
    outflow: string
  }>
}

function toFrontend(data: ApiCashFlowSummary, currency: Currency): CashFlowSummary {
  return {
    currency,
    totalInflow: Number.parseFloat(data.total_inflow),
    totalOutflow: Number.parseFloat(data.total_outflow),
    netFlow: Number.parseFloat(data.net_flow),
    entries: data.entries.map((e) => ({
      id: e.id,
      date: e.transaction_date,
      description: e.description,
      category: e.type as CashFlowSummary['entries'][number]['category'],
      type: e.direction as 'inflow' | 'outflow',
      currency: e.currency as Currency,
      amount: Number.parseFloat(e.amount),
      createdAt: e.created_at,
    })),
    monthlyBreakdown: data.monthly_breakdown.map((m) => ({
      month: m.month,
      inflow: Number.parseFloat(m.inflow),
      outflow: Number.parseFloat(m.outflow),
    })),
  }
}

const adminCashFlowKeys = {
  all: ['admin-cash-flow'] as const,
  byCurrency: (currency: Currency) =>
    [...adminCashFlowKeys.all, currency] as const,
}

export function useAdminCashFlow(currency: Currency = 'USD') {
  return useQuery({
    queryKey: adminCashFlowKeys.byCurrency(currency),
    queryFn: async () => {
      const data = await apiClient.get<ApiCashFlowSummary>('/dashboard/cash-flow', { currency })
      return toFrontend(data, currency)
    },
  })
}
