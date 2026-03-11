import type { AdminMedia, MediaResult, MediaStatus, RenderingStatus } from '@/features/admin/types'
import { ArrowLeft, Download, Film, Image, Search, Server, Sparkles, Tag, Video, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { useAdminMediaResults, useAdminTeamMedia } from '@/features/admin/hooks/use-admin-media'
import { usePagination } from '@/hooks/use-pagination'

const statusStyles: Record<MediaStatus, string> = {
  completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  processing: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  failed: 'bg-destructive/15 text-destructive',
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
}

const statusDot: Record<MediaStatus, string> = {
  completed: 'bg-emerald-500',
  processing: 'bg-blue-500 animate-pulse',
  failed: 'bg-red-500',
  pending: 'bg-amber-500',
}

const renderingStatusStyles: Record<string, string> = {
  completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  rendering: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  failed: 'bg-destructive/15 text-destructive',
}

function ResultCard({ result, t }: { result: MediaResult; t: (key: string) => string }) {
  return (
    <div className="group rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-[9/16] overflow-hidden bg-muted">
        {result.thumbnailUrl ? (
          <img
            src={result.thumbnailUrl}
            alt={result.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Video className="h-8 w-8 text-muted-foreground/40" />
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
      <div className="p-2.5 space-y-1.5">
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
        {result.highlightTags && result.highlightTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {result.highlightTags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded text-[10px] text-muted-foreground"
              >
                <Tag className="h-2.5 w-2.5" />#{tag}
              </span>
            ))}
          </div>
        )}
        {result.renderingStatus === 'completed' && (
          <Button size="sm" variant="outline" className="w-full h-7 text-xs gap-1">
            <Download className="h-3 w-3" />
            {t('users.media.download')}
          </Button>
        )}
      </div>
    </div>
  )
}

function MediaDetailView({
  media,
  onBack,
  t,
}: {
  media: AdminMedia
  onBack: () => void
  t: (key: string) => string
}) {
  const { data: results, isLoading } = useAdminMediaResults(media.id, true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<RenderingStatus | 'all'>('all')

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
            <SelectItem value="completed">{t('users.media.renderingStatus.completed')}</SelectItem>
            <SelectItem value="rendering">{t('users.media.renderingStatus.rendering')}</SelectItem>
            <SelectItem value="pending">{t('users.media.renderingStatus.pending')}</SelectItem>
            <SelectItem value="failed">{t('users.media.renderingStatus.failed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {pagination.paginatedItems.map((result) => (
              <ResultCard key={result.id} result={result} t={t} />
            ))}
          </div>
          <PaginationControls {...pagination} />
        </div>
      )}
    </div>
  )
}

function MediaCard({
  item,
  t,
  onClick,
}: {
  item: AdminMedia
  t: (key: string) => string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
          <div className="absolute left-2.5 top-2.5">
            <Badge className="border-0 bg-black/50 text-[10px] text-white shadow-sm backdrop-blur-md">
              <Sparkles className="mr-1 h-2.5 w-2.5" />{item.aiType}
            </Badge>
          </div>
        )}
        <div className="absolute right-2.5 top-2.5">
          <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 shadow-sm backdrop-blur-md">
            <span className={`h-1.5 w-1.5 rounded-full ${statusDot[item.status]}`} />
            <span className="text-[10px] font-medium text-white">{t(`users.media.status.${item.status}`)}</span>
          </span>
        </div>
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <h4 className="line-clamp-2 text-sm font-semibold leading-tight text-white drop-shadow-md">{item.title}</h4>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5">
        <Badge variant="secondary" className={`text-[10px] ${statusStyles[item.status]}`}>
          {t(`users.media.status.${item.status}`)}
        </Badge>
        {item.provider && (
          <Badge variant="outline" className="rounded-full text-[10px]">
            <Server className="mr-1 h-2.5 w-2.5" />{item.provider}
          </Badge>
        )}
        {item.resultsCount > 0 && (
          <Badge variant="outline" className="rounded-full text-[10px]">
            <Video className="mr-1 h-2.5 w-2.5" />{item.resultsCount} {t('users.media.results')}
          </Badge>
        )}
        {item.externalId && (
          <Badge variant="outline" className="text-[10px] rounded-full font-mono ml-auto shrink-0 max-w-[120px] truncate">
            {item.externalId}
          </Badge>
        )}
      </div>
    </button>
  )
}

export function TeamMediaTab({ teamId }: { teamId: string }) {
  const { t } = useTranslation('admin')
  const { data: media, isLoading } = useAdminTeamMedia(teamId, true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<MediaStatus | 'all'>('all')
  const [selectedMedia, setSelectedMedia] = useState<AdminMedia | null>(null)

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pagination.paginatedItems.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                t={t}
                onClick={() => setSelectedMedia(item)}
              />
            ))}
          </div>
          <PaginationControls {...pagination} />
        </>
      )}
    </div>
  )
}
