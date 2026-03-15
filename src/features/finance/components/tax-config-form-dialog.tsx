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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useTaxConfigMutations } from '../hooks/use-tax-config-mutations'

const TAX_TYPES = ['iss', 'pis', 'cofins', 'csll', 'irpj', 'inss', 'cbs', 'ibs'] as const
const TAX_REGIMES = ['simples_nacional', 'lucro_presumido', 'lucro_real'] as const

const taxConfigSchema = z.object({
  taxType: z.string().min(1, 'Tipo de imposto obrigatorio'),
  rate: z.number().min(0, 'Aliquota deve ser positiva').max(100, 'Aliquota maxima 100%'),
  municipalityCode: z.string().nullable(),
  taxRegime: z.string().min(1, 'Regime tributario obrigatorio'),
  effectiveFrom: z.string().min(1, 'Data de inicio obrigatoria'),
  effectiveTo: z.string().nullable(),
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
      taxType: '',
      rate: 0,
      municipalityCode: null,
      taxRegime: 'simples_nacional',
      effectiveFrom: '',
      effectiveTo: null,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(
        tax
          ? {
              taxType: tax.taxType,
              rate: tax.rate,
              municipalityCode: tax.municipalityCode,
              taxRegime: tax.taxRegime,
              effectiveFrom: tax.effectiveFrom,
              effectiveTo: tax.effectiveTo,
            }
          : {
              taxType: '',
              rate: 0,
              municipalityCode: null,
              taxRegime: 'simples_nacional',
              effectiveFrom: '',
              effectiveTo: null,
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
      <DialogContent className="max-h-[90svh] overflow-y-auto">
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
              name="taxType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.taxType')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TAX_TYPES.map((tt) => (
                        <SelectItem key={tt} value={tt}>{tt.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="municipalityCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.form.municipalityCode')}</FormLabel>
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
                name="taxRegime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.form.taxRegime')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                      <FormControl>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TAX_REGIMES.map((tr) => (
                          <SelectItem key={tr} value={tr}>{t(`finance.taxRegimes.${tr}`)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="effectiveFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.form.effectiveFrom')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="effectiveTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.form.effectiveTo')}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
