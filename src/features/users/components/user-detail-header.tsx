import type { AdminUser, UserPlan, UserStatus } from '@/features/admin/types'
import { Link } from '@tanstack/react-router'
import { Building2, Check, Copy, CreditCard, MoreVertical, UserCog } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { showErrorToast, showSuccessToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

import { useUserMutations } from '../hooks/use-user-mutations'

const statusVariant: Record<UserStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  inactive: 'bg-muted text-muted-foreground',
  suspended: 'bg-destructive/15 text-destructive',
}

const planBadgeVariants: Record<UserPlan, string> = {
  free: 'bg-muted text-muted-foreground',
  lite: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  premium: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  ultimate: 'bg-violet-600/15 text-violet-700 dark:text-violet-400',
}

const statusOptions: UserStatus[] = ['active', 'inactive', 'suspended']

export function UserDetailHeader({ user }: { user: AdminUser }) {
  const { t } = useTranslation('admin')
  const { updateStatus } = useUserMutations()

  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<UserStatus | null>(null)
  const [showStatusSelect, setShowStatusSelect] = useState(false)
  const [copiedId, setCopiedId] = useState(false)

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleStatusChange = (value: UserStatus) => {
    setPendingStatus(value)
    setShowStatusDialog(true)
  }

  const confirmStatusChange = () => {
    if (pendingStatus) {
      updateStatus.mutate({ userId: user.id, status: pendingStatus })
    }
    setShowStatusDialog(false)
    setShowStatusSelect(false)
    setPendingStatus(null)
  }

  const handleCopyExternalId = async () => {
    try {
      await navigator.clipboard.writeText(user.externalId)
      setCopiedId(true)
      showSuccessToast({ title: t('userDetail.externalIdCopied') })
      setTimeout(() => setCopiedId(false), 2000)
    } catch {
      showErrorToast({ title: t('userDetail.externalIdCopyError') })
    }
  }

  // Subscription event timeline summary
  const subscriptionEvents = [
    user.planExpiresAt && {
      label: t('userDetail.subscriptionTimeline.planExpires'),
      date: new Date(user.planExpiresAt).toLocaleDateString(),
    },
    {
      label: t('userDetail.subscriptionTimeline.currentPlan'),
      value: t(`plan.${user.plan}`),
      provider: user.planProvider,
    },
    user.subscriptionId && {
      label: t('userDetail.subscriptionTimeline.subscriptionActive'),
      value: user.subscriptionId,
    },
  ].filter(Boolean) as Array<{ label: string; date?: string; value?: string; provider?: string }>

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-lg font-bold sm:text-xl">{user.name}</h2>
          <Badge variant="secondary" className={statusVariant[user.status]}>
            {t(`status.${user.status}`)}
          </Badge>
          <Badge variant="secondary" className={planBadgeVariants[user.plan]}>{t(`plan.${user.plan}`)}</Badge>
        </div>
        <p className="truncate text-sm text-muted-foreground">{user.email}</p>

        {/* Company association */}
        {user.companyName && (
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <Link
              to="/companies/$companyId"
              params={{ companyId: user.companyId! }}
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              {user.companyName}
            </Link>
          </div>
        )}

        {/* External ID with copy button */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="truncate text-xs text-muted-foreground font-mono">{user.externalId}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopyExternalId}
                >
                  {copiedId
                    ? <Check className="h-3 w-3 text-emerald-500" />
                    : <Copy className="h-3 w-3 text-muted-foreground" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copiedId ? t('userDetail.copied') : t('userDetail.copyExternalId')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
          <span>{t('userDetail.createdAt')}: {new Date(user.createdAt).toLocaleDateString()}</span>
          <span>{t('userDetail.lastLogin')}: {new Date(user.lastLoginAt).toLocaleDateString()}</span>
        </div>

        {/* Subscription timeline summary */}
        {subscriptionEvents.length > 0 && (
          <div className="mt-2 flex items-start gap-2 rounded-md border border-border/50 bg-muted/30 p-2.5">
            <CreditCard className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {subscriptionEvents.map((event, i) => (
                <span key={i} className="flex items-center gap-1 text-muted-foreground">
                  <span className="font-medium text-foreground">{event.label}:</span>
                  {event.date && <span>{event.date}</span>}
                  {event.value && (
                    <Badge variant="outline" className="h-4 text-[10px] font-mono">
                      {event.value}
                    </Badge>
                  )}
                  {event.provider && (
                    <span className="capitalize">({event.provider})</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {showStatusSelect && (
          <div className="mt-3 flex items-center gap-2">
            <Select
              defaultValue={user.status}
              onValueChange={(value) => handleStatusChange(value as UserStatus)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t('users.actions.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`status.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStatusSelect(false)}
            >
              {t('userDetail.cancel')}
            </Button>
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0" aria-label={t('userDetail.actions')}>
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">{t('userDetail.actions')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowStatusSelect(true)}>
            <UserCog className="mr-2 h-4 w-4" />
            {t('users.actions.changeStatus')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status change confirmation dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.actions.statusChangeTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.actions.statusChangeDescription', {
                name: user.name,
                status: pendingStatus ? t(`status.${pendingStatus}`) : '',
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingStatus(null)}>
              {t('userDetail.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                pendingStatus === 'suspended' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
              )}
              onClick={confirmStatusChange}
            >
              {t('users.actions.confirmStatusChange')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
