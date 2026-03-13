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
    costCenterId: (s.cost_center_id ?? s.costCenterId ?? null) as string | null,
    currency: (s.currency as SaasMetricsSnapshot['currency']) ?? 'USD',
    grossRevenue: Number(s.gross_revenue ?? s.grossRevenue ?? 0),
    netRevenue: Number(s.net_revenue ?? s.netRevenue ?? 0),
    cogs: Number(s.cogs ?? 0),
    grossProfit: Number(s.gross_profit ?? s.grossProfit ?? 0),
    grossMarginPct: Number(s.gross_margin_pct ?? s.grossMarginPct ?? 0),
    totalOpex: Number(s.total_opex ?? s.totalOpex ?? 0),
    rAndDCost: Number(s.r_and_d_cost ?? s.rAndDCost ?? 0),
    salesMarketingCost: Number(s.sales_marketing_cost ?? s.salesMarketingCost ?? 0),
    generalAdminCost: Number(s.general_admin_cost ?? s.generalAdminCost ?? 0),
    netIncome: Number(s.net_income ?? s.netIncome ?? 0),
    burnRate: Number(s.burn_rate ?? s.burnRate ?? 0),
    runwayMonths: Number(s.runway_months ?? s.runwayMonths ?? 0),
    cashBalance: Number(s.cash_balance ?? s.cashBalance ?? 0),
    totalCustomers: Number(s.total_customers ?? s.totalCustomers ?? 0),
    newCustomers: Number(s.new_customers ?? s.newCustomers ?? 0),
    churnedCustomers: Number(s.churned_customers ?? s.churnedCustomers ?? 0),
    churnRatePct: Number(s.churn_rate_pct ?? s.churnRatePct ?? 0),
    revenueChurnRatePct: Number(s.revenue_churn_rate_pct ?? s.revenueChurnRatePct ?? 0),
    arpu: Number(s.arpu ?? 0),
    ltv: Number(s.ltv ?? 0),
    cac: Number(s.cac ?? 0),
    ltvCacRatio: Number(s.ltv_cac_ratio ?? s.ltvCacRatio ?? 0),
    paybackMonths: Number(s.payback_months ?? s.paybackMonths ?? 0),
    nrrPct: Number(s.nrr_pct ?? s.nrrPct ?? 0),
    quickRatio: Number(s.quick_ratio ?? s.quickRatio ?? 0),
    trialToPaidRatePct: Number(s.trial_to_paid_rate_pct ?? s.trialToPaidRatePct ?? 0),
    createdAt: String(s.created_at ?? s.createdAt ?? ''),
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
