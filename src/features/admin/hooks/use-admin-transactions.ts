import type { AdminTransaction } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockTransactions: AdminTransaction[] = [
  // USD
  { id: '1', userId: '101', userName: 'John Doe', teamId: null, teamName: null, provider: 'paddle', transactionType: 'subscription_payment', status: 'completed', currency: 'USD', amount: 29.99, completedAt: '2026-03-05T10:00:00Z', createdAt: '2026-03-05T10:00:00Z' },
  { id: '3', userId: null, userName: null, teamId: '1', teamName: 'VDClip Core', provider: 'paddle', transactionType: 'subscription_payment', status: 'completed', currency: 'USD', amount: 99.99, completedAt: '2026-03-04T15:00:00Z', createdAt: '2026-03-04T15:00:00Z' },
  { id: '4', userId: '104', userName: 'Ana Costa', teamId: null, teamName: null, provider: 'paddle', transactionType: 'refund', status: 'completed', currency: 'USD', amount: 9.99, completedAt: '2026-03-04T12:00:00Z', createdAt: '2026-03-04T12:00:00Z' },
  { id: '7', userId: '107', userName: 'Carla Braga', teamId: null, teamName: null, provider: 'paddle', transactionType: 'subscription_payment', status: 'completed', currency: 'USD', amount: 29.99, completedAt: '2026-03-03T16:00:00Z', createdAt: '2026-03-03T16:00:00Z' },
  { id: '8', userId: '108', userName: 'Emma Davis', teamId: null, teamName: null, provider: 'paddle', transactionType: 'credit_purchase', status: 'completed', currency: 'USD', amount: 19.99, completedAt: '2026-03-03T14:00:00Z', createdAt: '2026-03-03T14:00:00Z' },
  { id: '9', userId: '109', userName: 'Frank Miller', teamId: null, teamName: null, provider: 'paddle', transactionType: 'subscription_payment', status: 'processing', currency: 'USD', amount: 59.99, completedAt: null, createdAt: '2026-03-03T11:00:00Z' },
  { id: '10', userId: null, userName: null, teamId: '2', teamName: 'Design Studio', provider: 'paddle', transactionType: 'subscription_payment', status: 'completed', currency: 'USD', amount: 99.99, completedAt: '2026-03-02T17:00:00Z', createdAt: '2026-03-02T17:00:00Z' },
  { id: '11', userId: '111', userName: 'George Harris', teamId: null, teamName: null, provider: 'paddle', transactionType: 'refund', status: 'completed', currency: 'USD', amount: 29.99, completedAt: '2026-03-02T13:00:00Z', createdAt: '2026-03-02T13:00:00Z' },
  { id: '12', userId: '112', userName: 'Helen Clark', teamId: null, teamName: null, provider: 'paddle', transactionType: 'subscription_payment', status: 'completed', currency: 'USD', amount: 29.99, completedAt: '2026-03-01T10:00:00Z', createdAt: '2026-03-01T10:00:00Z' },
  { id: '13', userId: '113', userName: 'Ivan Torres', teamId: null, teamName: null, provider: 'paddle', transactionType: 'credit_purchase', status: 'failed', currency: 'USD', amount: 9.99, completedAt: null, createdAt: '2026-02-28T16:00:00Z' },
  { id: '14', userId: '114', userName: 'Julia Roberts', teamId: null, teamName: null, provider: 'paddle', transactionType: 'subscription_payment', status: 'completed', currency: 'USD', amount: 59.99, completedAt: '2026-02-28T12:00:00Z', createdAt: '2026-02-28T12:00:00Z' },
  { id: '15', userId: null, userName: null, teamId: '3', teamName: 'Content Hub', provider: 'paddle', transactionType: 'subscription_payment', status: 'completed', currency: 'USD', amount: 99.99, completedAt: '2026-02-27T09:00:00Z', createdAt: '2026-02-27T09:00:00Z' },
  // BRL
  { id: '2', userId: '102', userName: 'Maria Silva', teamId: null, teamName: null, provider: 'pix', transactionType: 'credit_purchase', status: 'completed', currency: 'BRL', amount: 49.90, completedAt: '2026-03-05T09:30:00Z', createdAt: '2026-03-05T09:30:00Z' },
  { id: '5', userId: '105', userName: 'Pedro Lima', teamId: null, teamName: null, provider: 'pix', transactionType: 'subscription_payment', status: 'failed', currency: 'BRL', amount: 149.90, completedAt: null, createdAt: '2026-03-04T10:00:00Z' },
  { id: '6', userId: '106', userName: 'Lucas Mendes', teamId: null, teamName: null, provider: 'pix', transactionType: 'credit_purchase', status: 'pending', currency: 'BRL', amount: 29.90, completedAt: null, createdAt: '2026-03-04T08:00:00Z' },
  { id: '16', userId: '116', userName: 'Renata Alves', teamId: null, teamName: null, provider: 'pix', transactionType: 'subscription_payment', status: 'completed', currency: 'BRL', amount: 89.90, completedAt: '2026-03-03T15:00:00Z', createdAt: '2026-03-03T15:00:00Z' },
  { id: '17', userId: '117', userName: 'Sérgio Nunes', teamId: null, teamName: null, provider: 'pix', transactionType: 'credit_purchase', status: 'completed', currency: 'BRL', amount: 49.90, completedAt: '2026-03-03T12:00:00Z', createdAt: '2026-03-03T12:00:00Z' },
  { id: '18', userId: '118', userName: 'Tatiana Moura', teamId: null, teamName: null, provider: 'pix', transactionType: 'subscription_payment', status: 'completed', currency: 'BRL', amount: 149.90, completedAt: '2026-03-02T10:00:00Z', createdAt: '2026-03-02T10:00:00Z' },
  { id: '19', userId: '119', userName: 'Uriel Barbosa', teamId: null, teamName: null, provider: 'pix', transactionType: 'refund', status: 'completed', currency: 'BRL', amount: 89.90, completedAt: '2026-03-01T16:00:00Z', createdAt: '2026-03-01T16:00:00Z' },
  { id: '20', userId: '120', userName: 'Viviane Carmo', teamId: null, teamName: null, provider: 'pix', transactionType: 'subscription_payment', status: 'completed', currency: 'BRL', amount: 89.90, completedAt: '2026-02-28T14:00:00Z', createdAt: '2026-02-28T14:00:00Z' },
  { id: '21', userId: '121', userName: 'Wagner Dias', teamId: null, teamName: null, provider: 'pix', transactionType: 'credit_purchase', status: 'failed', currency: 'BRL', amount: 29.90, completedAt: null, createdAt: '2026-02-28T10:00:00Z' },
  { id: '22', userId: '122', userName: 'Xuxa Fonseca', teamId: null, teamName: null, provider: 'pix', transactionType: 'subscription_payment', status: 'completed', currency: 'BRL', amount: 149.90, completedAt: '2026-02-27T11:00:00Z', createdAt: '2026-02-27T11:00:00Z' },
  { id: '23', userId: '123', userName: 'Yara Guimarães', teamId: null, teamName: null, provider: 'pix', transactionType: 'subscription_payment', status: 'processing', currency: 'BRL', amount: 89.90, completedAt: null, createdAt: '2026-02-26T09:00:00Z' },
  { id: '24', userId: '124', userName: 'Zelia Pinto', teamId: null, teamName: null, provider: 'pix', transactionType: 'credit_purchase', status: 'completed', currency: 'BRL', amount: 49.90, completedAt: '2026-02-25T15:00:00Z', createdAt: '2026-02-25T15:00:00Z' },
]

const adminTransactionsKeys = {
  all: ['admin-transactions'] as const,
  filtered: (search: string, type: string) =>
    [...adminTransactionsKeys.all, search, type] as const,
}

export function useAdminTransactions(search: string = '', typeFilter: string = 'all') {
  return useQuery({
    queryKey: adminTransactionsKeys.filtered(search, typeFilter),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      let result = mockTransactions
      if (typeFilter !== 'all') {
        result = result.filter((t) => t.transactionType === typeFilter)
      }
      if (search) {
        const q = search.toLowerCase()
        result = result.filter(
          (t) =>
            t.userName?.toLowerCase().includes(q) ||
            t.teamName?.toLowerCase().includes(q),
        )
      }
      return result
    },
  })
}
