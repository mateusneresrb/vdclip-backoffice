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

import { Switch } from '@/components/ui/switch'
import { useCostCenterMutations } from '../hooks/use-cost-center-mutations'

const costCenterSchema = z.object({
  slug: z.string().min(1, 'Slug obrigatorio'),
  name: z.string().min(1, 'Nome obrigatorio'),
  description: z.string().nullable(),
  budget: z.number().positive('Orcamento deve ser positivo').nullable(),
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
  const { create, update } = useCostCenterMutations()
  const isEditing = !!costCenter

  const form = useForm<CostCenterFormValues>({
    resolver: zodResolver(costCenterSchema),
    defaultValues: {
      slug: '',
      name: '',
      description: null,
      budget: null,
      isActive: true,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(
        costCenter
          ? {
              slug: costCenter.slug,
              name: costCenter.name,
              description: costCenter.description,
              budget: costCenter.budget,
              isActive: costCenter.isActive,
            }
          : {
              slug: '',
              name: '',
              description: null,
              budget: null,
              isActive: true,
            },
      )
    }
  }, [open, costCenter, form])

  const isPending = create.isPending || update.isPending

  const onSubmit = (values: CostCenterFormValues) => {
    if (isEditing && costCenter) {
      update.mutate(
        { id: costCenter.id, name: values.name, slug: values.slug, description: values.description, is_active: values.isActive },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      create.mutate(
        { name: values.name, slug: values.slug, description: values.description },
        { onSuccess: () => onOpenChange(false) },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
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
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('finance.costCenters.slug')}</FormLabel>
                    <FormControl>
                      <Input placeholder="eng-001" {...field} />
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
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.costCenters.budget')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
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
