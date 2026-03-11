import type { FinancialCategory } from '../types'
import { FolderTree, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/empty-state'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'
import { useFinancialCategories } from '../hooks/use-financial-categories'
import { CategoryFormDialog } from './category-form-dialog'

const typeLabels: Record<FinancialCategory['type'], string> = {
  asset: 'finance.categoryTypes.asset',
  liability: 'finance.categoryTypes.liability',
  revenue: 'finance.categoryTypes.revenue',
  expense: 'finance.categoryTypes.expense',
}

const typeColors: Record<FinancialCategory['type'], string> = {
  asset: 'text-blue-600 dark:text-blue-400',
  liability: 'text-red-600 dark:text-red-400',
  revenue: 'text-emerald-600 dark:text-emerald-400',
  expense: 'text-amber-600 dark:text-amber-400',
}

function buildTree(categories: FinancialCategory[]): FinancialCategory[] {
  const map = new Map<string, FinancialCategory>()
  const roots: FinancialCategory[] = []

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] })
  }

  for (const cat of categories) {
    const node = map.get(cat.id)!
    if (cat.parentId) {
      const parent = map.get(cat.parentId)
      if (parent) {
        parent.children = parent.children ?? []
        parent.children.push(node)
      }
    } else {
      roots.push(node)
    }
  }

  return roots
}

function CategoryNode({
  category,
  depth,
  onEdit,
  onDelete,
}: {
  category: FinancialCategory
  depth: number
  onEdit: (cat: FinancialCategory) => void
  onDelete: (cat: FinancialCategory) => void
}) {
  const isRoot = depth === 0
  const [hovered, setHovered] = useState(false)

  return (
    <div>
      <div
        className={cn('group flex items-center gap-2 rounded-md px-3 py-1.5', isRoot && 'mt-2')}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="font-mono text-xs text-muted-foreground">{category.code}</span>
        <span className={cn('flex-1 text-sm', isRoot ? 'font-semibold' : 'font-normal', isRoot && typeColors[category.type])}>
          {category.name}
        </span>
        {hovered && (
          <div className="flex gap-1">
            <button type="button" onClick={() => onEdit(category)} className="rounded p-0.5 text-muted-foreground hover:text-foreground">
              <Pencil className="h-3 w-3" />
            </button>
            <button type="button" onClick={() => onDelete(category)} className="rounded p-0.5 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      {category.children?.map((child) => (
        <CategoryNode key={child.id} category={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

export function FinanceChartOfAccountsTab() {
  const { t } = useTranslation('admin')
  const { data: categories, isLoading } = useFinancialCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<FinancialCategory | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<FinancialCategory | null>(null)
  const [search, setSearch] = useState('')

  const filteredCategories = useMemo(() => {
    const all = categories ?? []
    const q = search.trim().toLowerCase()
    if (!q) 
return all
    return all.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.code?.toLowerCase().includes(q),
    )
  }, [categories, search])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    )
  }

  const allCategories = categories ?? []
  const tree = buildTree(filteredCategories)
  const grouped = {
    asset: tree.filter((c) => c.type === 'asset'),
    liability: tree.filter((c) => c.type === 'liability'),
    revenue: tree.filter((c) => c.type === 'revenue'),
    expense: tree.filter((c) => c.type === 'expense'),
  }

  const hasChildren = (cat: FinancialCategory) => (cat.children?.length ?? 0) > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{t('finance.tabDescriptions.chartOfAccounts')}</p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-9 w-52 pl-8 text-sm"
              placeholder={t('finance.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={() => { setEditCategory(undefined); setFormOpen(true) }}>
            <Plus className="mr-1 h-4 w-4" />
            {t('finance.addCategory')}
          </Button>
        </div>
      </div>

      {!allCategories.length ? (
        <EmptyState
          icon={FolderTree}
          title={t('finance.noCategories')}
          action={{ label: t('finance.addCategory'), onClick: () => setFormOpen(true) }}
        />
      ) : !filteredCategories.length ? (
        <EmptyState icon={FolderTree} title={t('finance.noResults')} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(Object.keys(grouped) as FinancialCategory['type'][]).map((type) => (
            <Card key={type}>
              <CardHeader className="pb-2">
                <CardTitle className={cn('text-sm font-medium', typeColors[type])}>
                  {t(typeLabels[type])}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {grouped[type].map((root) => (
                  <CategoryNode
                    key={root.id}
                    category={root}
                    depth={0}
                    onEdit={(cat) => { setEditCategory(cat); setFormOpen(true) }}
                    onDelete={(cat) => setDeleteTarget(cat)}
                  />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editCategory}
        categories={allCategories}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('finance.deleteCategoryTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && hasChildren(deleteTarget)
                ? t('finance.deleteCategoryHasChildren')
                : t('finance.deleteCategoryDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('finance.form.cancel')}</AlertDialogCancel>
            {deleteTarget && !hasChildren(deleteTarget) && (
              <AlertDialogAction onClick={() => setDeleteTarget(null)}>
                {t('finance.confirmDelete')}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
