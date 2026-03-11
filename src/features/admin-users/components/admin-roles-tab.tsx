import type { AdminRole } from '@/features/auth/lib/permissions'
import { Check, ChevronDown, ChevronUp, Pencil, Plus, Shield, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PERMISSIONS, ROLE_PERMISSIONS } from '@/features/auth/lib/permissions'
import { showSuccessToast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { useAdminRoles } from '../hooks/use-admin-roles'

const SYSTEM_ROLES: AdminRole[] = ['super_admin']

const RESOURCES = ['users', 'teams', 'finance', 'metrics', 'admin', 'audit', 'providers', 'subscriptions'] as const
const ACTIONS = ['read', 'write', 'delete', 'export'] as const

type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

function buildPermissionGrid() {
  const allPermissions = Object.values(PERMISSIONS)
  const grid: Record<string, Record<string, PermissionKey | null>> = {}
  for (const resource of RESOURCES) {
    grid[resource] = {}
    for (const action of ACTIONS) {
      const key = `${resource}:${action}`
      grid[resource][action] = allPermissions.includes(key as PermissionKey) ? (key as PermissionKey) : null
    }
  }
  return grid
}

const permissionGrid = buildPermissionGrid()

export function AdminRolesTab() {
  const { t } = useTranslation('admin')
  const { data: roles, isLoading } = useAdminRoles()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingRole, setEditingRole] = useState<{
    id: string
    name: AdminRole
    displayName: string
    description: string
    permissionCount: number
    adminCount: number
  } | null>(null)

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    )
  }

  if (!roles?.length) {
    return <EmptyState icon={Shield} title={t('adminUsers.noRoles')} description={t('adminUsers.noRolesHint')} />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="gap-1.5" onClick={() => setShowCreateDialog(true)}>
          <Plus className="size-4" />
          {t('adminUsers.createRole')}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            t={t}
            onEdit={() => setEditingRole(role)}
            isSystem={SYSTEM_ROLES.includes(role.name)}
          />
        ))}
      </div>

      {/* Create Role Dialog */}
      <CreateRoleDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />

      {/* Edit Role Dialog */}
      <EditRoleDialog
        role={editingRole}
        onClose={() => setEditingRole(null)}
      />
    </div>
  )
}

function RoleCard({
  role,
  t,
  onEdit,
  isSystem,
}: {
  role: { id: string; name: AdminRole; displayName: string; description: string; permissionCount: number; adminCount: number }
  t: (key: string) => string
  onEdit: () => void
  isSystem: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const permissions = ROLE_PERMISSIONS[role.name] ?? []

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              {role.displayName}
            </CardTitle>
            <CardDescription className="text-xs">
              {role.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={isSystem}
            onClick={onEdit}
            title={isSystem ? t('adminUsers.systemRoleHint') : t('adminUsers.edit')}
          >
            <Pencil className="size-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>
              {role.permissionCount} {t('adminUsers.permissions')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              {role.adminCount} {t('adminUsers.admins')}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="mr-1 size-3" />
              {t('adminUsers.hidePermissions')}
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 size-3" />
              {t('adminUsers.viewPermissions')}
            </>
          )}
        </Button>

        {expanded && (
          <div className="flex flex-wrap gap-1.5">
            {permissions.map((perm) => (
              <Badge key={perm} variant="secondary" className="text-[10px] font-normal">
                {perm}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PermissionGridEditor({
  selectedPermissions,
  onToggle,
  t,
}: {
  selectedPermissions: Set<string>
  onToggle: (perm: string) => void
  t: (key: string) => string
}) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">{t('adminUsers.resource')}</TableHead>
            {ACTIONS.map((action) => (
              <TableHead key={action} className="text-center text-xs">
                {t(`adminUsers.permAction.${action}`)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {RESOURCES.map((resource) => (
            <TableRow key={resource}>
              <TableCell className="text-xs font-medium capitalize">{t(`adminUsers.permResource.${resource}`)}</TableCell>
              {ACTIONS.map((action) => {
                const perm = permissionGrid[resource][action]
                if (!perm) {
                  return (
                    <TableCell key={action} className="text-center">
                      <span className="text-muted-foreground">-</span>
                    </TableCell>
                  )
                }
                const isChecked = selectedPermissions.has(perm)
                return (
                  <TableCell key={action} className="text-center">
                    <button
                      type="button"
                      onClick={() => onToggle(perm)}
                      className={cn(
                        'inline-flex size-6 items-center justify-center rounded border transition-colors',
                        isChecked
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input bg-background hover:bg-accent',
                      )}
                    >
                      {isChecked && <Check className="size-3.5" />}
                    </button>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function CreateRoleDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { t } = useTranslation('admin')
  const [displayName, setDisplayName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set())

  const handleToggle = (perm: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev)
      if (next.has(perm)) {
        next.delete(perm)
      } else {
        next.add(perm)
      }
      return next
    })
  }

  const handleCreate = () => {
    // TODO: API call
    showSuccessToast({ title: t('toast.roleCreated') })
    onClose()
    setDisplayName('')
    setDescription('')
    setSelectedPermissions(new Set())
  }

  const handleOpenChange = (v: boolean) => {
    if (!v) 
onClose()
  }

  const isValid = displayName.trim() && selectedPermissions.size > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('adminUsers.createRoleTitle')}</DialogTitle>
          <DialogDescription>{t('adminUsers.createRoleDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t('adminUsers.roleName')}</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={t('adminUsers.roleNamePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('adminUsers.roleDescription')}</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('adminUsers.roleDescriptionPlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('adminUsers.permissions')}</Label>
            <PermissionGridEditor
              selectedPermissions={selectedPermissions}
              onToggle={handleToggle}
              t={t}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('adminUsers.cancel')}
          </Button>
          <Button onClick={handleCreate} disabled={!isValid}>
            {t('adminUsers.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditRoleDialog({
  role,
  onClose,
}: {
  role: { id: string; name: AdminRole; displayName: string; description: string; permissionCount: number; adminCount: number } | null
  onClose: () => void
}) {
  const { t } = useTranslation('admin')

  const initialPermissions = useMemo(() => {
    if (!role) 
return new Set<string>()
    return new Set(ROLE_PERMISSIONS[role.name] ?? [])
  }, [role])

  const [displayName, setDisplayName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set())

  const open = !!role

  // Sync state when role changes
  useEffect(() => {
    if (role) {
      setDisplayName(role.displayName)
      setDescription(role.description)
      setSelectedPermissions(initialPermissions)
    }
  }, [role, initialPermissions])

  const handleToggle = (perm: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev)
      if (next.has(perm)) {
        next.delete(perm)
      } else {
        next.add(perm)
      }
      return next
    })
  }

  const handleSave = () => {
    // TODO: API call
    showSuccessToast({ title: t('toast.roleUpdated') })
    onClose()
  }

  const handleOpenChange = (v: boolean) => {
    if (!v) 
onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('adminUsers.editRoleTitle')}</DialogTitle>
          <DialogDescription>{t('adminUsers.editRoleDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t('adminUsers.roleName')}</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('adminUsers.roleDescription')}</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('adminUsers.permissions')}</Label>
            <PermissionGridEditor
              selectedPermissions={selectedPermissions}
              onToggle={handleToggle}
              t={t}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('adminUsers.cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('adminUsers.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
