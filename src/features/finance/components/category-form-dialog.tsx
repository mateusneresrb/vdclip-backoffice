import type { FinancialCategory } from '../types'
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
import { useCategoryMutations } from '../hooks/use-category-mutations'

const categorySchema = z.object({
  code: z.string().min(1, 'Codigo obrigatorio'),
  name: z.string().min(1, 'Nome obrigatorio'),
  type: z.enum(['revenue', 'cogs', 'opex', 'tax', 'asset', 'liability', 'equity']),
  parentId: z.string().nullable(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: FinancialCategory
  categories: FinancialCategory[]
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  categories,
}: CategoryFormDialogProps) {
  const { t } = useTranslation('admin')
  const { create, update } = useCategoryMutations()
  const isEditing = !!category

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      code: '',
      name: '',
      type: 'opex',
      parentId: null,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(
        category
          ? {
              code: category.code,
              name: category.name,
              type: category.type,
              parentId: category.parentId,
            }
          : {
              code: '',
              name: '',
              type: 'opex',
              parentId: null,
            },
      )
    }
  }, [open, category, form])

  const isPending = create.isPending || update.isPending

  const onSubmit = (values: CategoryFormValues) => {
    if (isEditing) {
      update.mutate(
        { ...category, ...values },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      const parent = values.parentId
        ? categories.find((c) => c.id === values.parentId)
        : null
      const level = parent ? parent.level + 1 : 1
      const siblings = categories.filter((c) => c.parentId === values.parentId)
      const displayOrder = siblings.length
      create.mutate(
        { ...values, level, displayOrder },
        { onSuccess: () => onOpenChange(false) },
      )
    }
  }

  const parentOptions = categories.filter(
    (c) => !category || c.id !== category.id,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('finance.form.editCategory')
              : t('finance.form.newCategory')}
          </DialogTitle>
          <DialogDescription>
            {t('finance.form.categoryDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <SelectItem value="revenue">
                        {t('finance.categoryTypes.revenue')}
                      </SelectItem>
                      <SelectItem value="cogs">
                        {t('finance.categoryTypes.cogs')}
                      </SelectItem>
                      <SelectItem value="opex">
                        {t('finance.categoryTypes.opex')}
                      </SelectItem>
                      <SelectItem value="tax">
                        {t('finance.categoryTypes.tax')}
                      </SelectItem>
                      <SelectItem value="asset">
                        {t('finance.categoryTypes.asset')}
                      </SelectItem>
                      <SelectItem value="liability">
                        {t('finance.categoryTypes.liability')}
                      </SelectItem>
                      <SelectItem value="equity">
                        {t('finance.categoryTypes.equity')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('finance.form.parentCategory')}</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === '__none__' ? null : value)
                    }
                    value={field.value ?? '__none__'}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none__">
                        {t('finance.form.noParent')}
                      </SelectItem>
                      {parentOptions.map((c) => (
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
