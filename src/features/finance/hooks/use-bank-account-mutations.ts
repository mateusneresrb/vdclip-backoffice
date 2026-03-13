import type { BankAccount, CreateBankAccountInput } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Currency } from '@/features/admin/types'

import i18n from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showSuccessToast } from '@/lib/toast'

interface ApiBankAccount {
  id: string
  external_id: string
  name: string
  type: string
  bank_name: string | null
  agency: string | null
  account_number: string | null
  currency: string
  initial_balance: string
  current_balance: string
  is_active: boolean
}

function toFrontend(row: ApiBankAccount): BankAccount {
  return {
    id: row.external_id ?? row.id,
    name: row.name,
    bank: row.bank_name ?? null,
    accountType: row.type as BankAccount['accountType'],
    agency: row.agency ?? null,
    accountNumber: row.account_number ?? null,
    currency: row.currency as Currency,
    initialBalance: Number.parseFloat(row.initial_balance),
    balance: Number.parseFloat(row.current_balance),
    isActive: row.is_active,
  }
}

function toCreateBody(data: CreateBankAccountInput) {
  return {
    name: data.name,
    type: data.accountType,
    bank_name: data.bank ?? null,
    agency: data.agency ?? null,
    account_number: data.accountNumber ?? null,
    currency: data.currency,
    initial_balance: String(data.initialBalance),
    is_active: data.isActive,
  }
}

function toUpdateBody(data: BankAccount) {
  return {
    name: data.name,
    type: data.accountType,
    bank_name: data.bank ?? null,
    agency: data.agency ?? null,
    account_number: data.accountNumber ?? null,
    currency: data.currency,
    initial_balance: String(data.initialBalance),
    is_active: data.isActive,
  }
}

export function useBankAccountMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: CreateBankAccountInput) => {
      const res = await apiClient.post<ApiBankAccount>('/bank-accounts', toCreateBody(data))
      return toFrontend(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] })
      showSuccessToast({ title: i18n.t('admin:toast.bankAccountCreated') })
    },
  })

  const update = useMutation({
    mutationFn: async (data: BankAccount) => {
      const res = await apiClient.patch<ApiBankAccount>(`/bank-accounts/${data.id}`, toUpdateBody(data))
      return toFrontend(res)
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
