import type { BankAccount, Currency } from '../types'
import { Building2, CircleDot, MoreVertical, Pencil, Plus, Search, Trash2 } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'
import { useBankAccounts } from '../hooks/use-bank-accounts'
import { BankAccountFormDialog } from './bank-account-form-dialog'

const accountTypeMap: Record<BankAccount['accountType'], string> = {
  checking: 'finance.accountTypes.checking',
  savings: 'finance.accountTypes.savings',
  investment: 'finance.accountTypes.investment',
}

function formatCurrency(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function FinanceBankAccountsTab() {
  const { t } = useTranslation('admin')
  const { data: accounts, isLoading } = useBankAccounts()
  const [formOpen, setFormOpen] = useState(false)
  const [editAccount, setEditAccount] = useState<BankAccount | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!accounts) 
return []
    const q = search.trim().toLowerCase()
    if (!q) 
return accounts
    return accounts.filter(
      (a) =>
        a.name?.toLowerCase().includes(q) ||
        a.bank?.toLowerCase().includes(q),
    )
  }, [accounts, search])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{t('finance.tabDescriptions.bankAccounts')}</p>
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
          <Button size="sm" onClick={() => { setEditAccount(undefined); setFormOpen(true) }}>
            <Plus className="mr-1 h-4 w-4" />
            {t('finance.addAccount')}
          </Button>
        </div>
      </div>

      {!accounts?.length ? (
        <EmptyState
          icon={Building2}
          title={t('finance.noAccounts')}
          action={{ label: t('finance.addAccount'), onClick: () => setFormOpen(true) }}
        />
      ) : !filtered.length ? (
        <EmptyState icon={Building2} title={t('finance.noResults')} />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {filtered.map((account) => (
            <Card key={account.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {account.bank}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {t(accountTypeMap[account.accountType])}
                  </Badge>
                  <CircleDot className={cn('h-4 w-4', account.isActive ? 'text-emerald-500' : 'text-muted-foreground')} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setEditAccount(account); setFormOpen(true) }}>
                        <Pencil className="mr-2 h-4 w-4" />{t('common.edit', { ns: 'common' })}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(account.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />{t('common.delete', { ns: 'common' })}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-2xl font-bold">{formatCurrency(account.balance, account.currency)}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t('finance.lastSync')}: {new Date(account.lastSyncAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <BankAccountFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        account={editAccount}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('finance.deleteAccountTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('finance.deleteAccountDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('finance.form.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => setDeleteId(null)}>
              {t('finance.confirmDelete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
