import type { BackofficeAdmin } from '../types'
import { useAuthStore } from '@/features/auth/stores/auth-store'
import { useHasPermission } from '@/features/auth/hooks/use-permissions'
import { PERMISSIONS } from '@/features/auth/lib/permissions'
import { useQueryClient } from '@tanstack/react-query'
import {
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  ShieldX,
  Users,
} from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PaginationControls } from '@/components/pagination-controls'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usePagination } from '@/hooks/use-pagination'
import { apiClient } from '@/lib/api-client'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

import { cn } from '@/lib/utils'
import { useAdminAccounts } from '../hooks/use-admin-accounts'
import { useAdminRoles } from '../hooks/use-admin-roles'

const roleColors: Record<string, string> = {
  super_admin: 'bg-red-500/15 text-red-700 dark:text-red-400',
  finance_admin: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  finance_viewer: 'bg-teal-500/15 text-teal-700 dark:text-teal-400',
  support: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  viewer: 'bg-muted text-muted-foreground',
}


export function AdminUsersListTab() {
  const { t } = useTranslation('admin')
  const queryClient = useQueryClient()
  const currentAdmin = useAuthStore(s => s.admin)
  const canWrite = useHasPermission(PERMISSIONS.ADMIN_WRITE)
  const { data: admins, isLoading } = useAdminAccounts()
  const { data: availableRoles } = useAdminRoles()

  const getRoleDisplayName = (slug: string) => {
    const found = availableRoles?.find(r => r.name === slug)
    return found?.displayName ?? slug
  }

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingAdmin, setEditingAdmin] = useState<BackofficeAdmin | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [toggleAdmin, setToggleAdmin] = useState<BackofficeAdmin | null>(null)

  const filtered = useMemo(() => {
    if (!admins) 
return []
    return admins.filter((admin) => {
      const matchesSearch =
        !search ||
        admin.name.toLowerCase().includes(search.toLowerCase()) ||
        admin.email.toLowerCase().includes(search.toLowerCase())
      const matchesRole = roleFilter === 'all' || admin.role === roleFilter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && admin.isActive) ||
        (statusFilter === 'inactive' && !admin.isActive)
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [admins, search, roleFilter, statusFilter])

  const pagination = usePagination(filtered, 10)

  const handleToggleConfirm = async () => {
    if (!toggleAdmin)
      return
    const key = toggleAdmin.isActive ? 'toast.adminDeactivated' : 'toast.adminActivated'
    try {
      await apiClient.patch(`/admin-users/${toggleAdmin.id}`, { isActive: !toggleAdmin.isActive })
      await queryClient.invalidateQueries({ queryKey: ['admin-accounts'] })
      await queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
      showSuccessToast({ title: t(key) })
    } catch (error) {
      showErrorToast({
        title: t('toast.error'),
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setToggleAdmin(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters + Create */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('adminUsers.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder={t('adminUsers.filterRole')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('adminUsers.allRoles')}</SelectItem>
            {(availableRoles ?? []).map((r) => (
              <SelectItem key={r.name} value={r.name}>
                {r.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t('adminUsers.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('adminUsers.allStatuses')}</SelectItem>
            <SelectItem value="active">{t('adminUsers.active')}</SelectItem>
            <SelectItem value="inactive">{t('adminUsers.inactive')}</SelectItem>
          </SelectContent>
        </Select>
        {canWrite && (
          <Button className="gap-1.5" onClick={() => setShowCreateDialog(true)}>
            <Plus className="size-4" />
            {t('adminUsers.createAdmin')}
          </Button>
        )}
      </div>

      {/* Table */}
      {!filtered.length ? (
        <EmptyState icon={Users} title={t('adminUsers.noResults')} description={t('adminUsers.noResultsHint')} />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('adminUsers.name')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('adminUsers.email')}</TableHead>
                <TableHead>{t('adminUsers.role')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('adminUsers.mfa')}</TableHead>
                <TableHead>{t('adminUsers.status')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t('adminUsers.lastLogin')}</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedItems.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        {admin.avatar && <AvatarImage src={admin.avatar} alt={admin.name} />}
                        <AvatarFallback className="text-xs">
                          {admin.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{admin.name}</p>
                        <p className="truncate text-xs text-muted-foreground sm:hidden">{admin.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">{admin.email}</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                        roleColors[admin.role] ?? roleColors.viewer,
                      )}
                    >
                      {getRoleDisplayName(admin.role)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className={cn(
                        'gap-1 text-xs',
                        admin.mfaEnabled
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-amber-700 dark:text-amber-400',
                      )}
                    >
                      {admin.mfaEnabled ? (
                        <>
                          <ShieldCheck className="size-3" />
                          {t('adminUsers.mfaOn')}
                        </>
                      ) : (
                        <>
                          <Shield className="size-3" />
                          {t('adminUsers.mfaOff')}
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        admin.isActive
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-red-700 dark:text-red-400',
                      )}
                    >
                      {admin.isActive ? t('adminUsers.active') : t('adminUsers.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {new Date(admin.lastLoginAt).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {canWrite && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingAdmin(admin)}>
                          <Pencil className="mr-2 size-4" />
                          {t('adminUsers.edit')}
                        </DropdownMenuItem>
                        {currentAdmin?.id !== admin.id && (
                          <DropdownMenuItem onClick={() => setToggleAdmin(admin)}>
                            {admin.isActive ? (
                              <>
                                <ShieldX className="mr-2 size-4" />
                                {t('adminUsers.deactivate')}
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="mr-2 size-4" />
                                {t('adminUsers.activate')}
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PaginationControls {...pagination} />

      {/* Edit Dialog */}
      <EditAdminDialog
        admin={editingAdmin}
        onClose={() => setEditingAdmin(null)}
      />

      {/* Create Dialog */}
      <CreateAdminDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />

      {/* Toggle Active Confirmation */}
      <AlertDialog open={!!toggleAdmin} onOpenChange={(v) => { if (!v) 
setToggleAdmin(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleAdmin?.isActive
                ? t('adminUsers.confirmDeactivateTitle')
                : t('adminUsers.confirmActivateTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleAdmin?.isActive
                ? t('adminUsers.confirmDeactivateDescription', { name: toggleAdmin?.name })
                : t('adminUsers.confirmActivateDescription', { name: toggleAdmin?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('adminUsers.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                toggleAdmin?.isActive && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
              )}
              onClick={handleToggleConfirm}
            >
              {toggleAdmin?.isActive ? t('adminUsers.deactivate') : t('adminUsers.activate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function CreateAdminDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { t } = useTranslation('admin')
  const queryClient = useQueryClient()
  const { data: availableRoles } = useAdminRoles()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenChange = (v: boolean) => {
    if (!v)
onClose()
  }

  const handleCreate = async () => {
    setIsSubmitting(true)
    try {
      const [firstName, ...lastParts] = name.trim().split(/\s+/)
      const created = await apiClient.post<{ id: string }>('/admin-users', {
        firstName,
        lastName: lastParts.length > 0 ? lastParts.join(' ') : undefined,
        email,
        password: tempPassword,
      })
      if (role && availableRoles) {
        const matched = availableRoles.find(r => r.name === role)
        if (matched) {
          await apiClient.put(`/admin-users/${created.id}/roles`, { roleIds: [matched.id] })
        }
      }
      await queryClient.invalidateQueries({ queryKey: ['admin-accounts'] })
      await queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
      showSuccessToast({ title: t('toast.adminInvited') })
      onClose()
      setName('')
      setEmail('')
      setRole('')
      setTempPassword('')
    } catch (error: unknown) {
      const description = error && typeof error === 'object' && 'errorMessage' in error
        ? String((error as { errorMessage: string }).errorMessage)
        : error instanceof Error ? error.message : undefined
      showErrorToast({
        title: t('toast.error'),
        description,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = name.trim() && email.trim() && role && tempPassword.trim() && tempPassword.length >= 8

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('adminUsers.createAdminTitle')}</DialogTitle>
          <DialogDescription>{t('adminUsers.createAdminDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t('adminUsers.name')}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('adminUsers.namePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('adminUsers.email')}</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('adminUsers.emailPlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('adminUsers.role')}</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('adminUsers.selectRole')} />
              </SelectTrigger>
              <SelectContent>
                {(availableRoles ?? []).map((r) => (
                  <SelectItem key={r.name} value={r.name}>
                    {r.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('adminUsers.tempPassword')}</Label>
            <Input
              type="password"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              placeholder={t('adminUsers.tempPasswordPlaceholder')}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('adminUsers.cancel')}
          </Button>
          <Button onClick={handleCreate} disabled={!isValid || isSubmitting}>
            {t('adminUsers.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditAdminDialog({
  admin,
  onClose,
}: {
  admin: BackofficeAdmin | null
  onClose: () => void
}) {
  const { t } = useTranslation('admin')
  const queryClient = useQueryClient()
  const { data: availableRoles } = useAdminRoles()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const open = !!admin
  const handleOpenChange = (v: boolean) => {
    if (!v)
onClose()
  }

  useEffect(() => {
    if (admin) {
      setName(admin.name)
      setEmail(admin.email)
      setRole(admin.role)
    }
  }, [admin])

  const handleSave = async () => {
    if (!admin)
      return
    setIsSubmitting(true)
    try {
      const [firstName, ...lastParts] = name.trim().split(/\s+/)
      await apiClient.patch(`/admin-users/${admin.id}`, {
        firstName,
        lastName: lastParts.length > 0 ? lastParts.join(' ') : undefined,
        email,
      })
      if (role !== admin.role && availableRoles) {
        const matched = availableRoles.find(r => r.name === role)
        if (matched) {
          await apiClient.put(`/admin-users/${admin.id}/roles`, { roleIds: [matched.id] })
        }
      }
      await queryClient.invalidateQueries({ queryKey: ['admin-accounts'] })
      await queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
      showSuccessToast({ title: t('toast.adminUpdated') })
      onClose()
    } catch (error: unknown) {
      const description = error && typeof error === 'object' && 'errorMessage' in error
        ? String((error as { errorMessage: string }).errorMessage)
        : error instanceof Error ? error.message : undefined
      showErrorToast({
        title: t('toast.error'),
        description,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('adminUsers.editTitle')}</DialogTitle>
          <DialogDescription>{t('adminUsers.editDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t('adminUsers.name')}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('adminUsers.email')}</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('adminUsers.role')}</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(availableRoles ?? []).map((r) => (
                  <SelectItem key={r.name} value={r.name}>
                    {r.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('adminUsers.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {t('adminUsers.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
