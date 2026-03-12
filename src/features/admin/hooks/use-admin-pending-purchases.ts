import type { PendingPurchase } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiPendingPurchase {
  id: string
  email: string
  plan_tier: string
  billing_period: string
  provider: string
  provider_subscription_id: string | null
  provider_transaction_id: string | null
  provider_customer_id: string | null
  currency: string
  amount: string
  credits_amount: number
  period_start: string | null
  period_end: string | null
  is_trial: boolean
  status: 'pending' | 'claimed' | 'expired'
  claimed_by_user_id: string | null
  claimed_by_user_email: string | null
  claimed_at: string | null
  created_at: string
  updated_at: string
}

interface ApiPendingPurchasesResponse {
  items: ApiPendingPurchase[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

function toFrontend(item: ApiPendingPurchase): PendingPurchase {
  return {
    id: item.id,
    email: item.email,
    planTier: item.plan_tier,
    billingPeriod: item.billing_period,
    provider: item.provider,
    providerSubscriptionId: item.provider_subscription_id,
    providerTransactionId: item.provider_transaction_id,
    providerCustomerId: item.provider_customer_id,
    currency: item.currency,
    amount: item.amount,
    creditsAmount: item.credits_amount,
    periodStart: item.period_start,
    periodEnd: item.period_end,
    isTrial: item.is_trial,
    status: item.status,
    claimedByUserId: item.claimed_by_user_id,
    claimedByUserEmail: item.claimed_by_user_email,
    claimedAt: item.claimed_at,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

export interface PendingPurchaseFilters {
  page?: number
  perPage?: number
  status?: string
  provider?: string
  email?: string
}

export const pendingPurchasesKeys = {
  all: ['pending-purchases'] as const,
  filtered: (filters: PendingPurchaseFilters) =>
    [...pendingPurchasesKeys.all, filters] as const,
}

export function useAdminPendingPurchases(filters: PendingPurchaseFilters = {}) {
  const { page = 1, perPage = 10, status, provider, email } = filters

  return useQuery({
    queryKey: pendingPurchasesKeys.filtered(filters),
    queryFn: async () => {
      const params: Record<string, string | number | boolean | undefined> = {
        page,
        per_page: perPage,
      }
      if (status && status !== 'all')
        params.status = status
      if (provider && provider !== 'all')
        params.provider = provider
      if (email)
        params.email = email

      const data = await apiClient.get<ApiPendingPurchasesResponse>(
        '/platform/pending-purchases',
        params,
      )

      return {
        items: data.items.map(toFrontend),
        total: data.total,
        page: data.page,
        perPage: data.per_page,
        totalPages: data.total_pages,
      }
    },
  })
}
