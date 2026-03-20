import type { SaasMetricsSnapshot } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

const saasMetricsKeys = {
  all: ['saas-metrics'] as const,
  snapshots: () => [...saasMetricsKeys.all, 'snapshots'] as const,
}

function mapSnapshot(s: Record<string, unknown>): SaasMetricsSnapshot {
  return {
    id: String(s.id ?? ''),
    month: String(s.month ?? ''),
    costCenterId: (s.costCenterId ?? null) as string | null,
    currency: (s.currency as SaasMetricsSnapshot['currency']) ?? 'USD',
    grossRevenue: Number(s.grossRevenue ?? 0),
    netRevenue: Number(s.netRevenue ?? 0),
    cogs: Number(s.cogs ?? 0),
    grossProfit: Number(s.grossProfit ?? 0),
    grossMarginPct: Number(s.grossMarginPct ?? 0),
    totalOpex: Number(s.totalOpex ?? 0),
    rAndDCost: Number(s.rAndDCost ?? 0),
    salesMarketingCost: Number(s.salesMarketingCost ?? 0),
    generalAdminCost: Number(s.generalAdminCost ?? 0),
    netIncome: Number(s.netIncome ?? 0),
    burnRate: Number(s.burnRate ?? 0),
    runwayMonths: Number(s.runwayMonths ?? 0),
    cashBalance: Number(s.cashBalance ?? 0),
    totalCustomers: Number(s.totalCustomers ?? 0),
    newCustomers: Number(s.newCustomers ?? 0),
    churnedCustomers: Number(s.churnedCustomers ?? 0),
    churnRatePct: Number(s.churnRatePct ?? 0),
    revenueChurnRatePct: Number(s.revenueChurnRatePct ?? 0),
    arpu: Number(s.arpu ?? 0),
    ltv: Number(s.ltv ?? 0),
    cac: Number(s.cac ?? 0),
    ltvCacRatio: Number(s.ltvCacRatio ?? 0),
    paybackMonths: Number(s.paybackMonths ?? 0),
    nrrPct: Number(s.nrrPct ?? 0),
    quickRatio: Number(s.quickRatio ?? 0),
    trialToPaidRatePct: Number(s.trialToPaidRatePct ?? 0),
    createdAt: String(s.createdAt ?? ''),
  }
}

export function useSaasMetrics() {
  return useQuery({
    queryKey: saasMetricsKeys.snapshots(),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[]>('/business-metrics')
      return data.map(mapSnapshot)
    },
  })
}
