import type { AdminMedia, MediaResult, MediaStatus, RenderingStatus } from '@/features/admin/types'
import { ArrowLeft, Download, Film, Image, MoreVertical, Play, RefreshCw, RotateCcw, Search, Server, Sparkles, Tag, Trash2, Video, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { useAdminMediaResults, useAdminUserMedia, useMediaMutations  } from '@/features/admin/hooks/use-admin-media'

import { usePagination } from '@/hooks/use-pagination'

const statusStyles: Record<MediaStatus, string> = {
  completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  processing: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  failed: 'bg-destructive/15 text-destructive',
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
}

const renderingStatusStyles: Record<string, string> = {
  created: 'bg-muted text-muted-foreground',
  completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  rendering: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  failed: 'bg-destructive/15 text-destructive',
}

const MEDIA_URL = 'https://media.vdclip.com'
const PLAYER_URL = 'https://player.vdclip.com'

function buildProjectUrl(ownerType: string, ownerId: string, processId: string, resultId: string): string {
  return `${MEDIA_URL}/${ownerType}/${ownerId}/${processId}/results/${resultId}/project/autosave.json`
}

interface ResultCardProps {
  result: MediaResult
  t: (key: string) => string
  processId: string
  newVersion: boolean
  ownerId: string
  ownerType: 'USER' | 'TEAM'
  onRender: (resultId: string) => void
  isRendering?: boolean
}

function ResultCard({ result, t, processId, newVersion, ownerId, ownerType, onRender, isRendering }: ResultCardProps) {
  const validTags = (result.highlightTags ?? []).filter(
    (tag) => tag.length > 1 && /^[a-zA-Z0-9À-ÿ]/.test(tag),
  )

  const projectUrl = newVersion && processId && ownerId
    ? buildProjectUrl(ownerType, ownerId, processId, result.id)
    : undefined

  return (
    <div className="group rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-[9/16] overflow-hidden bg-muted">
        {projectUrl ? (
          <iframe
            src={`${PLAYER_URL}/?url=${encodeURIComponent(projectUrl)}&muted=true&lazyload=true`}
            className="h-full w-full border-0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={result.title}
          />
        ) : result.thumbnailUrl ? (
          <img
            src={result.thumbnailUrl}
            alt={result.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <Video className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}
        {result.viralityScore != null && (
          <div className="absolute top-2 right-2">
            <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 backdrop-blur-md text-[10px] font-bold text-amber-400">
              <Zap className="h-2.5 w-2.5" />
              {result.viralityScore}
            </span>
          </div>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-xs font-semibold leading-snug line-clamp-2">{result.title}</p>
        {result.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2">{result.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-1">
          <Badge
            variant="secondary"
            className={`text-[10px] ${renderingStatusStyles[result.renderingStatus] ?? ''}`}
          >
            {t(`users.media.renderingStatus.${result.renderingStatus}`)}
          </Badge>
          {result.projectVersion > 0 && (
            <Badge variant="outline" className="text-[10px]">
              v{result.projectVersion}
            </Badge>
          )}
        </div>
        {validTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {validTags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                <Tag className="h-2.5 w-2.5" />#{tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-1.5 pt-0.5">
          {result.renderingStatus === 'completed' ? (
            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs gap-1">
              <Download className="h-3 w-3" />
              {t('users.media.download')}
            </Button>
          ) : result.renderingStatus === 'rendering' ? (
            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs gap-1" disabled>
              <RefreshCw className="h-3 w-3 animate-spin" />
              {t('users.media.renderingStatus.rendering')}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="default"
              className="flex-1 h-7 text-xs gap-1"
              disabled={isRendering}
              onClick={(e) => { e.stopPropagation(); onRender(result.id) }}
            >
              <Play className="h-3 w-3" />
              {t('users.media.render')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function MediaDetailView({
  media,
  onBack,
  t,
  userId,
}: {
  media: AdminMedia
  onBack: () => void
  t: (key: string) => string
  userId: string
}) {
  const { data: results, isLoading } = useAdminMediaResults(media.id, true, userId)
  const { renderResult } = useMediaMutations()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<RenderingStatus | 'all'>('all')
  const [renderTarget, setRenderTarget] = useState<MediaResult | null>(null)

  const handleConfirmRender = () => {
    if (!renderTarget) 
return
    renderResult.mutate(renderTarget.id, {
      onSuccess: () => { toast.success(t('users.media.actions.renderSuccess')); setRenderTarget(null) },
      onError: () => toast.error(t('users.media.actions.renderError')),
    })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (results ?? []).filter((r) => {
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.highlightTags?.some((tag) => tag.toLowerCase().includes(q))
      const matchStatus = statusFilter === 'all' || r.renderingStatus === statusFilter
      return matchSearch && matchStatus
    })
  }, [results, search, statusFilter])

  const pagination = usePagination(filtered, 12)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-8 shrink-0 gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          {t('users.media.backToList')}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold leading-snug">{media.title}</h3>
        <Badge variant="secondary" className={`text-[10px] ${statusStyles[media.status]}`}>
          {t(`users.media.status.${media.status}`)}
        </Badge>
        {media.provider && (
          <Badge variant="outline" className="text-[10px] rounded-full">
            <Server className="mr-1 h-2.5 w-2.5" />
            {media.provider}
          </Badge>
        )}
        {media.externalId && (
          <Badge variant="outline" className="text-[10px] rounded-full font-mono">
            {media.externalId}
          </Badge>
        )}
      </div>

      {/* Filtros de results */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={t('users.media.searchResults')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); pagination.setPage(1) }}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => { setStatusFilter(v as RenderingStatus | 'all'); pagination.setPage(1) }}
        >
          <SelectTrigger className="w-full sm:w-44 h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('users.media.allStatuses')}</SelectItem>
            <SelectItem value="created">{t('users.media.renderingStatus.created')}</SelectItem>
            <SelectItem value="completed">{t('users.media.renderingStatus.completed')}</SelectItem>
            <SelectItem value="rendering">{t('users.media.renderingStatus.rendering')}</SelectItem>
            <SelectItem value="pending">{t('users.media.renderingStatus.pending')}</SelectItem>
            <SelectItem value="failed">{t('users.media.renderingStatus.failed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[9/16] rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <EmptyState
          icon={Video}
          title={search || statusFilter !== 'all' ? t('users.media.noResultsFilter') : t('users.media.noResults')}
        />
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            {filtered.length} {t('users.media.resultsTotal')}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {pagination.paginatedItems.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                t={t}
                processId={media.id}
                newVersion={media.newVersion}
                ownerId={media.ownerId}
                ownerType={media.ownerType}
                onRender={(resultId) => setRenderTarget(results?.find(r => r.id === resultId) ?? null)}
                isRendering={renderResult.isPending}
              />
            ))}
          </div>
          <PaginationControls {...pagination} />
        </div>
      )}

      {/* Render confirmation dialog */}
      <AlertDialog open={!!renderTarget} onOpenChange={(open) => { if (!open) 
setRenderTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.media.actions.renderTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {(t as Function)('users.media.actions.renderDescription', { title: renderTarget?.title ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('users.media.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRender}>
              <Play className="mr-2 h-3.5 w-3.5" />
              {t('users.media.actions.confirmRender')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function MediaCard({
  item,
  t,
  onClick,
  onDelete,
  onRestore,
  onReprocess,
}: {
  item: AdminMedia
  t: (key: string) => string
  onClick: () => void
  onDelete: () => void
  onRestore: () => void
  onReprocess: () => void
}) {
  const isDeleted = !!item.deletedAt

  return (
    <div className={`group relative rounded-xl border bg-card transition-all hover:shadow-lg hover:-translate-y-0.5 ${isDeleted ? 'opacity-60' : ''}`}>
      {/* Menu 3 pontos */}
      <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-opacity hover:bg-black/70"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {isDeleted ? (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRestore() }}>
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                {t('users.media.actions.restore')}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete() }} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                {t('users.media.actions.delete')}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onReprocess() }}>
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              {t('users.media.actions.reprocess')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="w-full overflow-hidden rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-video overflow-hidden bg-muted">
          {item.thumbnailUrl ? (
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Image className="h-8 w-8 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {item.aiType && (
            <div className="absolute top-2.5 left-2.5">
              <Badge className="bg-black/50 text-white text-[10px] backdrop-blur-md border-0 shadow-sm">
                <Sparkles className="mr-1 h-2.5 w-2.5" />
                {item.aiType}
              </Badge>
            </div>
          )}

          {isDeleted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Badge variant="destructive" className="text-xs">{t('users.media.actions.deleted')}</Badge>
            </div>
          )}

          <div className="absolute bottom-2.5 left-2.5 right-10">
            <h4 className="text-sm font-semibold text-white line-clamp-2 drop-shadow-md leading-tight">
              {item.title}
            </h4>
          </div>
        </div>

        <div className="px-3 py-2.5 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className={`text-[10px] ${statusStyles[item.status]}`}>
            {t(`users.media.status.${item.status}`)}
          </Badge>
          {item.provider && (
            <Badge variant="outline" className="text-[10px] rounded-full">
              <Server className="mr-1 h-2.5 w-2.5" />
              {item.provider}
            </Badge>
          )}
          {item.resultsCount > 0 && (
            <Badge variant="outline" className="text-[10px] rounded-full">
              <Video className="mr-1 h-2.5 w-2.5" />
              {item.resultsCount} {t('users.media.results')}
            </Badge>
          )}
        </div>
      </button>
    </div>
  )
}

export function UserMediaTab({ userId }: { userId: string }) {
  const { t } = useTranslation('admin')
  const { data: media, isLoading } = useAdminUserMedia(userId, true)
  const { softDelete, restore, reprocess } = useMediaMutations()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<MediaStatus | 'all'>('all')
  const [selectedMedia, setSelectedMedia] = useState<AdminMedia | null>(null)
  const [reprocessTarget, setReprocessTarget] = useState<AdminMedia | null>(null)

  const handleDelete = (item: AdminMedia) => {
    softDelete.mutate(item.id, {
      onSuccess: () => toast.success(t('users.media.actions.deleteSuccess')),
      onError: () => toast.error(t('users.media.actions.deleteError')),
    })
  }

  const handleRestore = (item: AdminMedia) => {
    restore.mutate(item.id, {
      onSuccess: () => toast.success(t('users.media.actions.restoreSuccess')),
      onError: () => toast.error(t('users.media.actions.restoreError')),
    })
  }

  const handleReprocess = () => {
    if (!reprocessTarget) 
return
    reprocess.mutate(reprocessTarget.id, {
      onSuccess: () => { toast.success(t('users.media.actions.reprocessSuccess')); setReprocessTarget(null) },
      onError: () => toast.error(t('users.media.actions.reprocessError')),
    })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (media ?? []).filter((m) => {
      const matchSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        (m.externalId ?? '').toLowerCase().includes(q) ||
        (m.id ?? '').toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || m.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [media, search, statusFilter])

  const pagination = usePagination(filtered, 9)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!media || media.length === 0) {
    return <EmptyState icon={Film} title={t('users.media.noMedia')} />
  }

  if (selectedMedia) {
    return (
      <MediaDetailView
        media={selectedMedia}
        onBack={() => setSelectedMedia(null)}
        t={t}
        userId={userId}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={t('users.media.searchMedia')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); pagination.setPage(1) }}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => { setStatusFilter(v as MediaStatus | 'all'); pagination.setPage(1) }}
        >
          <SelectTrigger className="w-full sm:w-44 h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('users.media.allStatuses')}</SelectItem>
            <SelectItem value="completed">{t('users.media.status.completed')}</SelectItem>
            <SelectItem value="processing">{t('users.media.status.processing')}</SelectItem>
            <SelectItem value="pending">{t('users.media.status.pending')}</SelectItem>
            <SelectItem value="failed">{t('users.media.status.failed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Film} title={t('users.media.noMediaFilter')} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
            {pagination.paginatedItems.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                t={t}
                onClick={() => setSelectedMedia(item)}
                onDelete={() => handleDelete(item)}
                onRestore={() => handleRestore(item)}
                onReprocess={() => setReprocessTarget(item)}
              />
            ))}
          </div>
          <PaginationControls {...pagination} />
        </>
      )}

      {/* Reprocess confirmation dialog */}
      <AlertDialog open={!!reprocessTarget} onOpenChange={(open) => { if (!open) 
setReprocessTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.media.actions.reprocessTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {(t as Function)('users.media.actions.reprocessDescription', { title: reprocessTarget?.title ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('users.media.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleReprocess}>
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              {t('users.media.actions.confirmReprocess')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
