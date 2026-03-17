import type { PendingPurchase } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

/**
 * Backend JSON shape (snake_case) — kept for documentation.
 * After auto case-transform, keys arrive as camelCase.
 *
 * ApiPendingPurchase:
 *   id, email, plan_tier, billing_period, provider,
 *   provider_subscription_id, provider_transaction_id, provider_customer_id,
 *   currency, amount, credits_amount, period_start, period_end, is_trial,
 *   status ('pending' | 'claimed' | 'expired'),
 *   claimed_by_user_id, claimed_by_user_email, claimed_at,
 *   created_at, updated_at
 *
 * ApiPendingPurchasesResponse:
 *   items: ApiPendingPurchase[], total, page, per_page, total_pages
 */

function toFrontend(item: Record<string, unknown>): PendingPurchase {
  return {
    id: String(item.id ?? ''),
    email: String(item.email ?? ''),
    planTier: String(item.planTier ?? ''),
    billingPeriod: String(item.billingPeriod ?? ''),
    provider: String(item.provider ?? ''),
    providerSubscriptionId: (item.providerSubscriptionId ?? null) as string | null,
    providerTransactionId: (item.providerTransactionId ?? null) as string | null,
    providerCustomerId: (item.providerCustomerId ?? null) as string | null,
    currency: String(item.currency ?? ''),
    amount: String(item.amount ?? ''),
    creditsAmount: Number(item.creditsAmount ?? 0),
    periodStart: (item.periodStart ?? null) as string | null,
    periodEnd: (item.periodEnd ?? null) as string | null,
    isTrial: Boolean(item.isTrial ?? false),
    status: (item.status as PendingPurchase['status']) ?? 'pending',
    claimedByUserId: (item.claimedByUserId ?? null) as string | null,
    claimedByUserEmail: (item.claimedByUserEmail ?? null) as string | null,
    claimedAt: (item.claimedAt ?? null) as string | null,
    createdAt: String(item.createdAt ?? ''),
    updatedAt: String(item.updatedAt ?? ''),
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

      const data = await apiClient.get<Record<string, unknown>>(
        '/platform/pending-purchases',
        params,
      )

      const items = (data.items ?? []) as Record<string, unknown>[]
      return {
        items: items.map(toFrontend),
        total: Number(data.total ?? 0),
        page: Number(data.page ?? 1),
        perPage: Number(data.perPage ?? perPage),
        totalPages: Number(data.totalPages ?? 1),
      }
    },
  })
}
