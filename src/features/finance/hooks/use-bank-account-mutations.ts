import type { BankAccount, CreateBankAccountInput } from '../types'

import type { Currency } from '@/features/admin/types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { i18n } from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showSuccessToast } from '@/lib/toast'

interface ApiBankAccount {
  id: string
  name: string
  type: string
  bank_name: string | null
  agency: string | null
  account_number: string | null
  currency: string
  initial_balance: string
  current_balance: string
  is_active: boolean
  created_at: string
  updated_at: string
}

function toBankAccount(row: Record<string, unknown>): BankAccount {
  return {
    id: row.id as string,
    name: row.name as string,
    bank: (row.bankName as string) ?? null,
    accountType: row.type as BankAccount['accountType'],
    agency: (row.agency as string) ?? null,
    accountNumber: (row.accountNumber as string) ?? null,
    currency: row.currency as Currency,
    initialBalance: Number.parseFloat(String(row.initialBalance)),
    balance: Number.parseFloat(String(row.currentBalance)),
    isActive: row.isActive as boolean,
  }
}

export function useBankAccountMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: CreateBankAccountInput) => {
      const res = await apiClient.post<ApiBankAccount>('/bank-accounts', {
        name: data.name,
        type: data.accountType,
        bankName: data.bank ?? null,
        agency: data.agency ?? null,
        accountNumber: data.accountNumber ?? null,
        currency: data.currency,
        initialBalance: String(data.initialBalance),
      })
      return toBankAccount(res as unknown as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] })
      showSuccessToast({ title: i18n.t('admin:toast.bankAccountCreated') })
    },
  })

  const update = useMutation({
    mutationFn: async (data: BankAccount) => {
      const res = await apiClient.patch<ApiBankAccount>(`/bank-accounts/${data.id}`, {
        name: data.name,
        bankName: data.bank ?? null,
        agency: data.agency ?? null,
        accountNumber: data.accountNumber ?? null,
        isActive: data.isActive,
      })
      return toBankAccount(res as unknown as Record<string, unknown>)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] })
      showSuccessToast({ title: i18n.t('admin:toast.bankAccountUpdated') })
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/bank-accounts/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] })
      showSuccessToast({ title: i18n.t('admin:toast.bankAccountDeleted') })
    },
  })

  return { create, update, remove }
}
