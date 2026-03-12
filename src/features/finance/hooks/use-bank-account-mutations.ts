import type { BankAccount, CreateBankAccountInput } from '../types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import i18n from '@/i18n'

import { showSuccessToast } from '@/lib/toast'

export function useBankAccountMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: CreateBankAccountInput) => {
      await new Promise((r) => setTimeout(r, 500))
      return {
        ...data,
        id: crypto.randomUUID(),
        balance: data.initialBalance,
      } as BankAccount
    },
    onSuccess: (newAccount) => {
      queryClient.setQueryData<BankAccount[]>(
        ['bank-accounts', 'list'],
        (old) => [...(old ?? []), newAccount],
      )
      showSuccessToast({ title: i18n.t('admin:toast.bankAccountCreated') })
    },
  })

  const update = useMutation({
    mutationFn: async (data: BankAccount) => {
      await new Promise((r) => setTimeout(r, 500))
      return data
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<BankAccount[]>(
        ['bank-accounts', 'list'],
        (old) =>
          (old ?? []).map((item) => (item.id === updated.id ? updated : item)),
      )
      showSuccessToast({ title: i18n.t('admin:toast.bankAccountUpdated') })
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 500))
      return id
    },
    onSuccess: (id) => {
      queryClient.setQueryData<BankAccount[]>(
        ['bank-accounts', 'list'],
        (old) => (old ?? []).filter((item) => item.id !== id),
      )
      showSuccessToast({ title: i18n.t('admin:toast.bankAccountDeleted') })
    },
  })

  return { create, update, remove }
}
