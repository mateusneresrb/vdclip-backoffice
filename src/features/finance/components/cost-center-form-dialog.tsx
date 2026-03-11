import type { CostCenter } from '../types'
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

const costCenterSchema = z.object({
  code: z.string().min(1, 'Codigo obrigatorio'),
  name: z.string().min(1, 'Nome obrigatorio'),
  description: z.string().min(1, 'Descricao obrigatoria'),
  responsible: z.string().min(1, 'Responsavel obrigatorio'),
  budget: z.number().positive('Orcamento deve ser positivo'),
  currency: z.enum(['USD', 'BRL']),
  isActive: z.boolean(),
})

type CostCenterFormValues = z.infer<typeof costCenterSchema>

interface CostCenterFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  costCenter?: CostCenter
}

export function CostCenterFormDialog({
  open,
  onOpenChange,
  costCenter,
}: CostCenterFormDialogProps) {
  const { t } = useTranslation('admin')
  const isEditing = !!costCenter

  const form = useForm<CostCenterFormValues>({
    resolver: zodResolver(costCenterSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      responsible: '',
      budget: 0,
      currency: 'BRL',
      isActive: true,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(
        costCenter
          ? {
              code: costCenter.code,
              name: costCenter.name,
              description: costCenter.description,
              responsible: costCenter.responsible,
              budget: costCenter.budget,
              currency: costCenter.currency,
              isActive: costCenter.isActive,
            }
          : {
              code: '',
              name: '',
              description: '',
              responsible: '',
              budget: 0,
              currency: 'BRL',
              isActive: true,
            },
      )
    }
  }, [open, costCenter, form])

  const isPending = false

  const onSubmit = (_values: CostCenterFormValues) => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('finance.costCenters.editCostCenter')
              : t('finance.costCenters.addCostCenter')}
          </DialogTitle>
          <DialogDescription>
            {t('finance.costCenters.formDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.costCenters.code')}</FormLabel>
                    <FormControl>
                      <Input placeholder="ENG-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.costCenters.name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.costCenters.description')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.costCenters.responsible')}</FormLabel>
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
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.costCenters.budget')}</FormLabel>
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

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="ccIsActive">
                    {t('finance.costCenters.active')}
                  </Label>
                  <FormControl>
                    <Switch
                      id="ccIsActive"
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
