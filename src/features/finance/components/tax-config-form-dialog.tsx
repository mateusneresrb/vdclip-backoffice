import type { TaxConfig } from '../types'
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
import { useTaxConfigMutations } from '../hooks/use-tax-config-mutations'

const taxConfigSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio'),
  code: z.string().min(1, 'Codigo obrigatorio'),
  rate: z.number().min(0, 'Aliquota deve ser positiva').max(100, 'Aliquota maxima 100%'),
  type: z.enum(['federal', 'state', 'municipal']),
  appliesTo: z.enum(['revenue', 'payroll', 'services', 'all']),
  isActive: z.boolean(),
})

type TaxConfigFormValues = z.infer<typeof taxConfigSchema>

interface TaxConfigFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tax?: TaxConfig
}

export function TaxConfigFormDialog({
  open,
  onOpenChange,
  tax,
}: TaxConfigFormDialogProps) {
  const { t } = useTranslation('admin')
  const { create, update } = useTaxConfigMutations()
  const isEditing = !!tax

  const form = useForm<TaxConfigFormValues>({
    resolver: zodResolver(taxConfigSchema),
    defaultValues: {
      name: '',
      code: '',
      rate: 0,
      type: 'federal',
      appliesTo: 'all',
      isActive: true,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(
        tax
          ? {
              name: tax.name,
              code: tax.code,
              rate: tax.rate,
              type: tax.type,
              appliesTo: tax.appliesTo,
              isActive: tax.isActive,
            }
          : {
              name: '',
              code: '',
              rate: 0,
              type: 'federal',
              appliesTo: 'all',
              isActive: true,
            },
      )
    }
  }, [open, tax, form])

  const isPending = create.isPending || update.isPending

  const onSubmit = (values: TaxConfigFormValues) => {
    if (isEditing) {
      update.mutate(
        { ...tax, ...values },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      create.mutate(values, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('finance.form.editTax')
              : t('finance.form.newTax')}
          </DialogTitle>
          <DialogDescription>
            {t('finance.form.taxDescription')}
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.code')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.rate')}</FormLabel>
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.taxType')}</FormLabel>
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
                      <SelectItem value="federal">
                        {t('finance.taxTypes.federal')}
                      </SelectItem>
                      <SelectItem value="state">
                        {t('finance.taxTypes.state')}
                      </SelectItem>
                      <SelectItem value="municipal">
                        {t('finance.taxTypes.municipal')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appliesTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.appliesTo')}</FormLabel>
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
                      <SelectItem value="revenue">
                        {t('finance.appliesToOptions.revenue')}
                      </SelectItem>
                      <SelectItem value="payroll">
                        {t('finance.appliesToOptions.payroll')}
                      </SelectItem>
                      <SelectItem value="services">
                        {t('finance.appliesToOptions.services')}
                      </SelectItem>
                      <SelectItem value="all">
                        {t('finance.appliesToOptions.all')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="taxIsActive">
                    {t('finance.form.active')}
                  </Label>
                  <FormControl>
                    <Switch
                      id="taxIsActive"
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
