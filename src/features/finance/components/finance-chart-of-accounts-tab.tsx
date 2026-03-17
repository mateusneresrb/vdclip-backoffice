import type { FinancialCategory } from '../types'
import {
  Banknote,
  ChevronRight,
  CircleDollarSign,
  FolderTree,
  Landmark,
  MoreHorizontal,
  Pencil,
  Plus,
  Receipt,
  Search,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'
import { useCategoryMutations } from '../hooks/use-category-mutations'
import { useFinancialCategories } from '../hooks/use-financial-categories'
import { CategoryFormDialog } from './category-form-dialog'

const typeConfig: Record<FinancialCategory['type'], {
  label: string
  icon: React.ComponentType<{ className?: string }>
  bg: string
  text: string
  badge: string
  border: string
}> = {
  revenue: {
    label: 'finance.categoryTypes.revenue',
    icon: TrendingUp,
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    border: 'border-l-emerald-500',
  },
  cogs: {
    label: 'finance.categoryTypes.cogs',
    icon: ShoppingCart,
    bg: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/20',
    border: 'border-l-orange-500',
  },
  opex: {
    label: 'finance.categoryTypes.opex',
    icon: Wallet,
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
    border: 'border-l-amber-500',
  },
  tax: {
    label: 'finance.categoryTypes.tax',
    icon: Receipt,
    bg: 'bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20',
    border: 'border-l-violet-500',
  },
  asset: {
    label: 'finance.categoryTypes.asset',
    icon: CircleDollarSign,
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20',
    border: 'border-l-blue-500',
  },
  liability: {
    label: 'finance.categoryTypes.liability',
    icon: Banknote,
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20',
    border: 'border-l-red-500',
  },
  equity: {
    label: 'finance.categoryTypes.equity',
    icon: Landmark,
    bg: 'bg-teal-500/10',
    text: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/20',
    border: 'border-l-teal-500',
  },
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

function CategoryItem({
  category,
  depth,
  config,
  onEdit,
  onDelete,
}: {
  category: FinancialCategory
  depth: number
  config: typeof typeConfig[FinancialCategory['type']]
  onEdit: (cat: FinancialCategory) => void
  onDelete: (cat: FinancialCategory) => void
}) {
  const hasChildren = (category.children?.length ?? 0) > 0

  return (
    <>
      <div
        className={cn(
          'group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-accent/50',
          depth > 0 && 'ml-6 border-l-2 border-muted',
        )}
      >
        {depth > 0 && (
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/50" />
        )}
        <Badge variant="outline" className="shrink-0 font-mono text-[10px] tabular-nums">
          {category.code}
        </Badge>
        <span className={cn('flex-1 truncate text-sm', depth === 0 ? 'font-semibold' : 'font-normal')}>
          {category.name}
        </span>
        {category.description && (
          <span className="hidden truncate text-xs text-muted-foreground lg:block lg:max-w-[200px]">
            {category.description}
          </span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(category)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {hasChildren && category.children!.map((child) => (
        <CategoryItem
          key={child.id}
          category={child}
          depth={depth + 1}
          config={config}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  )
}

function CategoryGroup({
  type,
  categories,
  onEdit,
  onDelete,
  t,
}: {
  type: FinancialCategory['type']
  categories: FinancialCategory[]
  onEdit: (cat: FinancialCategory) => void
  onDelete: (cat: FinancialCategory) => void
  t: (key: string) => string
}) {
  const config = typeConfig[type]
  const Icon = config.icon

  if (categories.length === 0) 
return null

  return (
    <div className={cn('overflow-hidden rounded-xl border border-l-[3px]', config.border)}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b bg-muted/30 px-4 py-3">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', config.bg)}>
          <Icon className={cn('h-4 w-4', config.text)} />
        </div>
        <div className="flex-1">
          <h3 className={cn('text-sm font-semibold', config.text)}>
            {t(config.label)}
          </h3>
        </div>
        <Badge variant="secondary" className={cn('text-[10px] font-medium', config.badge)}>
          {categories.reduce((acc, c) => acc + 1 + (c.children?.length ?? 0), 0)}
        </Badge>
      </div>

      {/* Items */}
      <div className="divide-y divide-muted/50 p-1.5">
        {categories.map((root) => (
          <CategoryItem
            key={root.id}
            category={root}
            depth={0}
            config={config}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}

export function FinanceChartOfAccountsTab() {
  const { t } = useTranslation('admin')
  const { data: categories, isLoading } = useFinancialCategories()
  const { remove } = useCategoryMutations()
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
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    )
  }

  const allCategories = categories ?? []
  const tree = buildTree(filteredCategories)

  const grouped: Record<FinancialCategory['type'], FinancialCategory[]> = {
    revenue: tree.filter((c) => c.type === 'revenue'),
    cogs: tree.filter((c) => c.type === 'cogs'),
    opex: tree.filter((c) => c.type === 'opex'),
    tax: tree.filter((c) => c.type === 'tax'),
    asset: tree.filter((c) => c.type === 'asset'),
    liability: tree.filter((c) => c.type === 'liability'),
    equity: tree.filter((c) => c.type === 'equity'),
  }

  const activeTypes = (Object.keys(grouped) as FinancialCategory['type'][]).filter(
    (type) => grouped[type].length > 0,
  )

  const hasChildren = (cat: FinancialCategory) => (cat.children?.length ?? 0) > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{t('finance.tabDescriptions.chartOfAccounts')}</p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-9 w-full pl-8 text-sm sm:w-52"
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
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {activeTypes.map((type) => (
            <CategoryGroup
              key={type}
              type={type}
              categories={grouped[type]}
              onEdit={(cat) => { setEditCategory(cat); setFormOpen(true) }}
              onDelete={(cat) => setDeleteTarget(cat)}
              t={t}
            />
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
              <AlertDialogAction onClick={() => { remove.mutate(deleteTarget.id); setDeleteTarget(null) }}>
                {t('finance.confirmDelete')}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
