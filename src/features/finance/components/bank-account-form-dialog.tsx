import type { BankAccount } from '../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { z } from 'zod/v4'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Switch } from '@/components/ui/switch'
import { useBankAccountMutations } from '../hooks/use-bank-account-mutations'

const bankAccountSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio'),
  bank: z.string().nullable(),
  accountType: z.enum(['checking', 'savings', 'payment_gateway', 'investment']),
  agency: z.string().nullable(),
  accountNumber: z.string().nullable(),
  currency: z.enum(['USD', 'BRL']),
  initialBalance: z.number().min(0, 'Saldo inicial deve ser positivo'),
  isActive: z.boolean(),
})

type BankAccountFormValues = z.infer<typeof bankAccountSchema>

interface BankAccountFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: BankAccount
}

export function BankAccountFormDialog({
  open,
  onOpenChange,
  account,
}: BankAccountFormDialogProps) {
  const { t } = useTranslation('admin')
  const { create, update } = useBankAccountMutations()
  const isEditing = !!account

  const form = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      name: '',
      bank: null,
      accountType: 'checking',
      agency: null,
      accountNumber: null,
      currency: 'BRL',
      initialBalance: 0,
      isActive: true,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(
        account
          ? {
              name: account.name,
              bank: account.bank,
              accountType: account.accountType,
              agency: account.agency,
              accountNumber: account.accountNumber,
              currency: account.currency,
              initialBalance: account.initialBalance,
              isActive: account.isActive,
            }
          : {
              name: '',
              bank: null,
              accountType: 'checking',
              agency: null,
              accountNumber: null,
              currency: 'BRL',
              initialBalance: 0,
              isActive: true,
            },
      )
    }
  }, [open, account, form])

  const isPending = create.isPending || update.isPending

  const onSubmit = (values: BankAccountFormValues) => {
    if (isEditing) {
      update.mutate(
        { ...account, ...values },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      create.mutate(values, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('finance.form.editAccount')
              : t('finance.form.newAccount')}
          </DialogTitle>
          <DialogDescription>
            {t('finance.form.accountDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.bank')}</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.accountType')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="checking">
                        {t('finance.accountTypes.checking')}
                      </SelectItem>
                      <SelectItem value="savings">
                        {t('finance.accountTypes.savings')}
                      </SelectItem>
                      <SelectItem value="payment_gateway">
                        {t('finance.accountTypes.paymentGateway')}
                      </SelectItem>
                      <SelectItem value="investment">
                        {t('finance.accountTypes.investment')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="agency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.form.agency')}</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.form.accountNumber')}</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.currency')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BRL">BRL</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.initialBalance')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="isActive">{t('finance.form.active')}</Label>
                  <FormControl>
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {t('finance.form.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('finance.form.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
