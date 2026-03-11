import { AlertCircle, CheckCircle2, Link2, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
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
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { useTeamSocialConnections } from '../hooks/use-team-social-connections'

function PlatformIcon ({ platform }: { platform: string }) {
  if (platform === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  }
  if (platform === 'tiktok') {
    return (
      <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    )
  }
  if (platform === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="url(#ig-team-grad)">
        <defs>
          <linearGradient id="ig-team-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F58529" />
            <stop offset="50%" stopColor="#DD2A7B" />
            <stop offset="100%" stopColor="#8134AF" />
          </linearGradient>
        </defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    )
  }
  return (
    <div className="flex size-5 items-center justify-center rounded-full bg-muted">
      <Link2 className="size-3 text-muted-foreground" />
    </div>
  )
}

const platformBg: Record<string, string> = {
  youtube: 'bg-red-500/10',
  tiktok: 'bg-foreground/8',
  instagram: 'bg-pink-500/10',
}

export function TeamConnectionsTab({ teamId }: { teamId: string }) {
  const { t } = useTranslation('admin')
  const { data: connections, isLoading } = useTeamSocialConnections(teamId)
  const [removeTarget, setRemoveTarget] = useState<{ id: string; platform: string } | null>(null)

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    )
  }

  if (!connections?.length) {
    return <EmptyState icon={Link2} title={t('socialConnections.noConnections')} />
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {connections.map((conn) => (
          <Card key={conn.id} className={conn.hasError ? 'border-destructive/40' : ''}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`flex size-9 items-center justify-center rounded-lg ${platformBg[conn.platform] ?? 'bg-muted'}`}>
                    <PlatformIcon platform={conn.platform} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold capitalize">{conn.platform}</p>
                    <p className="text-xs text-muted-foreground">{conn.username}</p>
                  </div>
                </div>
                {conn.hasError ? (
                  <Badge variant="secondary" className="shrink-0 bg-destructive/15 text-destructive">
                    <AlertCircle className="mr-1 size-3" />
                    {t('socialConnections.error')}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="shrink-0 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="mr-1 size-3" />
                    {t('socialConnections.connected')}
                  </Badge>
                )}
              </div>

              {conn.postsCount !== undefined && (
                <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1.5">
                  <Upload className="size-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{conn.postsCount}</span>
                  <span className="text-xs text-muted-foreground">{t('socialConnections.posts')}</span>
                </div>
              )}

              <div className="space-y-0.5 text-[11px] text-muted-foreground">
                <p>{t('socialConnections.connectedAt')}: {new Date(conn.connectedAt).toLocaleDateString()}</p>
                <p>{t('socialConnections.lastUsed')}: {conn.lastUsedAt ? new Date(conn.lastUsedAt).toLocaleDateString() : t('socialConnections.never')}</p>
              </div>

              {conn.hasError && conn.errorMessage && (
                <p className="rounded bg-destructive/10 px-2 py-1 text-[11px] text-destructive">{conn.errorMessage}</p>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full border-destructive/40 text-destructive hover:bg-destructive/10"
                onClick={() => setRemoveTarget({ id: conn.id, platform: conn.platform })}
              >
                <Trash2 className="mr-1.5 size-3" />
                {t('socialConnections.remove')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!removeTarget} onOpenChange={(open) => { if (!open) 
setRemoveTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('socialConnections.removeTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('socialConnections.removeDescription', { platform: removeTarget?.platform ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('userDetail.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => setRemoveTarget(null)}
            >
              {t('socialConnections.removeConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
