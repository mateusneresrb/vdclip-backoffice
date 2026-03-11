import type { CostEntry, FinancialCategory } from '../types'
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

import { useAuthStore } from '@/features/auth/stores/auth-store'
import { useCostEntryMutations } from '../hooks/use-cost-entry-mutations'

const costEntrySchema = z
  .object({
    description: z.string().min(1, 'Descricao obrigatoria'),
    categoryId: z.string().min(1, 'Categoria obrigatoria'),
    categoryName: z.string(),
    costCenter: z.string().min(1, 'Centro de custo obrigatorio'),
    type: z.enum(['recurring', 'one_time']),
    frequency: z.enum(['monthly', 'quarterly', 'yearly']).nullable(),
    currency: z.enum(['USD', 'BRL']),
    amount: z.number().positive('Valor deve ser positivo'),
    startDate: z.string().min(1, 'Data de inicio obrigatoria'),
    endDate: z.string().nullable(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.type === 'recurring') 
return data.frequency !== null
      return true
    },
    {
      message: 'Frequencia obrigatoria para custos recorrentes',
      path: ['frequency'],
    },
  )

type CostEntryFormValues = z.infer<typeof costEntrySchema>

interface CostEntryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: CostEntry
  categories: FinancialCategory[]
}

export function CostEntryFormDialog({
  open,
  onOpenChange,
  entry,
  categories,
}: CostEntryFormDialogProps) {
  const { t } = useTranslation('admin')
  const { create, update } = useCostEntryMutations()
  const admin = useAuthStore((s) => s.admin)
  const isEditing = !!entry

  const form = useForm<CostEntryFormValues>({
    resolver: zodResolver(costEntrySchema),
    defaultValues: {
      description: '',
      categoryId: '',
      categoryName: '',
      costCenter: '',
      type: 'one_time',
      frequency: null,
      currency: 'BRL',
      amount: 0,
      startDate: '',
      endDate: null,
      isActive: true,
    },
  })

  const costType = form.watch('type')

  useEffect(() => {
    if (open) {
      form.reset(
        entry
          ? {
              description: entry.description,
              categoryId: entry.categoryId,
              categoryName: entry.categoryName,
              costCenter: entry.costCenter,
              type: entry.type,
              frequency: entry.frequency,
              currency: entry.currency,
              amount: entry.amount,
              startDate: entry.startDate,
              endDate: entry.endDate,
              isActive: entry.isActive,
            }
          : {
              description: '',
              categoryId: '',
              categoryName: '',
              costCenter: '',
              type: 'one_time',
              frequency: null,
              currency: 'BRL',
              amount: 0,
              startDate: '',
              endDate: null,
              isActive: true,
            },
      )
    }
  }, [open, entry, form])

  useEffect(() => {
    if (costType === 'one_time') {
      form.setValue('frequency', null)
    }
  }, [costType, form])

  const isPending = create.isPending || update.isPending

  const onSubmit = (values: CostEntryFormValues) => {
    const selectedCategory = categories.find((c) => c.id === values.categoryId)
    const data = {
      ...values,
      categoryName: selectedCategory?.name ?? values.categoryName,
    }

    if (isEditing) {
      update.mutate(
        { ...entry, ...data },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      create.mutate(data, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('finance.form.editCostEntry')
              : t('finance.form.newCostEntry')}
          </DialogTitle>
          <DialogDescription>
            {t('finance.form.costEntryDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.description')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.category')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t('finance.form.selectCategory')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.code} - {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="costCenter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.costCenter')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.form.type')}</FormLabel>
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
                        <SelectItem value="recurring">
                          {t('finance.costTypes.recurring')}
                        </SelectItem>
                        <SelectItem value="one_time">
                          {t('finance.costTypes.oneTime')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {costType === 'recurring' && (
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('finance.form.frequency')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t('finance.form.selectFrequency')}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">
                            {t('finance.frequencies.monthly')}
                          </SelectItem>
                          <SelectItem value="quarterly">
                            {t('finance.frequencies.quarterly')}
                          </SelectItem>
                          <SelectItem value="yearly">
                            {t('finance.frequencies.yearly')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.form.amount')}</FormLabel>
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.form.startDate')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.form.endDate')}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value || null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="costIsActive">
                    {t('finance.form.active')}
                  </Label>
                  <FormControl>
                    <Switch
                      id="costIsActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="flex-col gap-2 sm:flex-row sm:items-center">
              {admin && !isEditing && (
                <p className="mr-auto text-xs text-muted-foreground">
                  Será registrado como:{' '}
                  <span className="font-medium">{admin.name}</span>
                </p>
              )}
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
