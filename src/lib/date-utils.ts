import type { MetricsDateRange } from '@/features/admin/types'

/**
 * Converts a MetricsDateRange (or plain string period) into
 * `{ date_from, date_to }` query params (YYYY-MM-DD, snake_case).
 *
 * Handles all predefined periods: '1d', '3d', '7d', '30d', '90d', '12m', 'ytd', 'all'.
 * Falls back to 30 days for unrecognized values (including 'custom' without implementation).
 */
export function getDateParams(range: MetricsDateRange | string): {
  date_from: string
  date_to: string
} {
  const now = new Date()
  const to = now.toISOString().split('T')[0]
  const from = new Date(now)

  switch (range) {
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
    case '12m':
      from.setFullYear(from.getFullYear() - 1)
      break
    case 'ytd':
      from.setMonth(0, 1)
      break
    case 'all':
      from.setFullYear(2024, 0, 1)
      break
    default:
      from.setDate(from.getDate() - 30)
      break
  }

  return {
    date_from: from.toISOString().split('T')[0],
    date_to: to,
  }
}
