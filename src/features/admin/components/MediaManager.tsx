import { useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  ExternalLink,
  Film,
  Globe,
  Hash,
  Image,
  Play,
  RefreshCw,
  Save,
  Search,
  Server,
  Sparkles,
  Trash2,
  Video,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'

import { useAdminUserMedia, useAdminMediaResults } from '../hooks/use-admin-media'
import type { AdminMedia, MediaResult, MediaStatus, RenderingStatus } from '../types'

// ── Helpers ──────────────────────────────────────────────────────

const statusStyles: Record<MediaStatus, string> = {
  completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  processing: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  failed: 'bg-destructive/15 text-destructive',
  pending: 'bg-muted text-muted-foreground',
}

const statusDot: Record<MediaStatus, string> = {
  completed: 'bg-emerald-500',
  processing: 'bg-amber-500 animate-pulse',
  failed: 'bg-red-500',
  pending: 'bg-muted-foreground/50',
}

const renderStyles: Record<RenderingStatus, string> = {
  completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  rendering: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  pending: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  failed: 'bg-destructive/15 text-destructive',
}

function scoreBg(score: number) {
  if (score >= 90) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
  if (score >= 75) return 'bg-orange-500/15 text-orange-700 dark:text-orange-400'
  if (score >= 50) return 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
  return 'bg-muted text-muted-foreground'
}

function scoreBar(score: number) {
  if (score >= 90) return 'bg-emerald-500'
  if (score >= 75) return 'bg-orange-500'
  if (score >= 50) return 'bg-amber-500'
  return 'bg-muted-foreground/30'
}

type View = 'list' | 'detail' | 'results'

function InfoItem({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">{label}</p>
      <p className={`text-sm font-medium ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}

// ── Media Card ───────────────────────────────────────────────────

function MediaCard({
  item,
  onSelect,
  t,
}: {
  item: AdminMedia
  onSelect: () => void
  t: (key: string) => string
}) {
  return (
    <div
      className="group cursor-pointer rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 bg-card"
      onClick={onSelect}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Image className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* AI type */}
        {item.aiType && (
          <div className="absolute top-2.5 left-2.5">
            <Badge className="bg-black/50 text-white text-[10px] backdrop-blur-md border-0 shadow-sm">
              <Sparkles className="mr-1 h-2.5 w-2.5" />
              {item.aiType}
            </Badge>
          </div>
        )}
        {/* Status */}
        <div className="absolute top-2.5 right-2.5">
          <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-md shadow-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${statusDot[item.status]}`} />
            <span className="text-[10px] font-medium text-white">{t(`media.status.${item.status}`)}</span>
          </span>
        </div>
        {/* Title on image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <h4 className="text-sm font-semibold text-white line-clamp-2 drop-shadow-md leading-tight">
            {item.title}
          </h4>
        </div>
        {/* Deleted overlay */}
        {item.deletedAt && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <Badge variant="destructive" className="text-xs shadow-lg">
              <Trash2 className="mr-1 h-3 w-3" />
              {t('media.deleted')}
            </Badge>
          </div>
        )}
      </div>
      <div className="px-3 py-2.5 flex flex-wrap gap-1.5">
        {item.provider && (
          <Badge variant="outline" className="text-[10px] rounded-full">
            <Server className="mr-1 h-2.5 w-2.5" />
            {item.provider}
          </Badge>
        )}
        <Badge variant="outline" className="text-[10px] rounded-full">
          <Globe className="mr-1 h-2.5 w-2.5" />
          {item.language}
        </Badge>
        {item.resultsCount > 0 && (
          <Badge variant="outline" className="text-[10px] rounded-full">
            <Video className="mr-1 h-2.5 w-2.5" />
            {item.resultsCount}
          </Badge>
        )}
        {item.clipLengths && (
          <Badge variant="outline" className="text-[10px] rounded-full">
            <Clock className="mr-1 h-2.5 w-2.5" />
            {item.clipLengths.join(', ')}s
          </Badge>
        )}
      </div>
    </div>
  )
}

// ── List View ────────────────────────────────────────────────────

function ListView({
  media,
  onSelect,
  t,
}: {
  media: AdminMedia[]
  onSelect: (m: AdminMedia) => void
  t: (key: string) => string
}) {
  const [search, setSearch] = useState('')
  const filtered = media.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t('media.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <span className="text-sm text-muted-foreground shrink-0">{filtered.length} {t('media.items')}</span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">{t('media.noResults')}</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {filtered.map((item) => (
            <MediaCard key={item.id} item={item} onSelect={() => onSelect(item)} t={t} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Detail View ──────────────────────────────────────────────────

function DetailView({
  item,
  onBack,
  onViewResults,
  t,
}: {
  item: AdminMedia
  onBack: () => void
  onViewResults: () => void
  t: (key: string) => string
}) {
  const [deletedAt, setDeletedAt] = useState(item.deletedAt)
  const [status, setStatus] = useState<MediaStatus>(item.status)
  const [editing, setEditing] = useState(false)

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        {t('media.backToList')}
      </button>

      {/* Header card — thumbnail + title + status */}
      <div className="flex gap-3 sm:gap-4 rounded-xl border p-3 sm:p-4">
        <div className="relative h-20 w-28 sm:h-24 sm:w-40 shrink-0 overflow-hidden rounded-lg bg-muted">
          {item.thumbnailUrl ? (
            <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Image className="h-8 w-8 text-muted-foreground/40" />
            </div>
          )}
          {deletedAt && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
              <Trash2 className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold leading-snug line-clamp-2">{item.title}</h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={`text-[10px] ${statusStyles[status]}`}>
                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${statusDot[status]}`} />
                {t(`media.status.${status}`)}
              </Badge>
              {deletedAt && (
                <Badge variant="destructive" className="text-[10px]">{t('media.deleted')}</Badge>
              )}
            </div>
          </div>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium mt-1">
              <ExternalLink className="h-3 w-3" />{t('media.viewOriginal')}
            </a>
          )}
        </div>
      </div>

      {/* Info grid — clean, consistent layout */}
      <div className="rounded-xl border p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-5">
          <InfoItem label="ID" value={item.id} mono />
          {item.aiType && <InfoItem label={t('media.aiType')} value={item.aiType} />}
          <InfoItem label={t('media.aspectRatio')} value={item.aspectRatio} />
          <InfoItem label={t('media.language')} value={item.language.toUpperCase()} />
          {item.provider && <InfoItem label={t('media.provider')} value={item.provider} />}
          {item.category && <InfoItem label={t('media.category')} value={item.category} />}
          <InfoItem label={t('media.processStep')} value={`${item.processStep} / 5`} />
          {item.clipLengths && <InfoItem label={t('media.clipLengths')} value={`${item.clipLengths.join(', ')}s`} />}
          <InfoItem label={t('media.resultsCount')} value={item.resultsCount} />
        </div>

        {item.errorCode && (
          <>
            <Separator className="my-4" />
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-destructive/70">{t('media.errorCode')}</p>
                <p className="text-sm font-mono font-medium text-destructive">{item.errorCode}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Management */}
      <div className="rounded-xl border p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">{t('media.management')}</h4>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>{t('media.edit')}</Button>
          )}
        </div>

        {editing ? (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">{t('media.markDeleted')}</Label>
                <p className="text-[11px] text-muted-foreground mt-0.5">{t('media.markDeletedHint')}</p>
              </div>
              <Switch checked={!!deletedAt} onCheckedChange={(v) => setDeletedAt(v ? new Date().toISOString() : null)} />
            </div>
            <Separator />
            <div className="space-y-1.5">
              <Label className="text-sm">{t('media.processingStatus')}</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as MediaStatus)}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['completed', 'processing', 'failed', 'pending'] as const).map((s) => (
                    <SelectItem key={s} value={s}>{t(`media.status.${s}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" size="sm" onClick={() => { setDeletedAt(item.deletedAt); setStatus(item.status); setEditing(false) }}>
                <X className="mr-1.5 h-3 w-3" />{t('media.cancel')}
              </Button>
              <Button size="sm" onClick={() => setEditing(false)}>
                <Save className="mr-1.5 h-3 w-3" />{t('media.saveChanges')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className={deletedAt ? 'bg-destructive/15 text-destructive' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'}>
              {deletedAt ? t('media.deleted') : t('media.notDeleted')}
            </Badge>
            <Badge variant="secondary" className={statusStyles[status]}>{t(`media.status.${status}`)}</Badge>
          </div>
        )}
      </div>

      {/* View Results */}
      <Button className="w-full" size="lg" onClick={onViewResults} disabled={item.resultsCount === 0}>
        <Video className="mr-2 h-4 w-4" />{t('media.viewResults')} ({item.resultsCount})
      </Button>

      {/* Reprocess — dangerous action, separated and with confirmation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 px-4 sm:px-5 py-4 gap-3 sm:gap-6">
        <div>
          <p className="text-sm font-medium">{t('media.reprocess')}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{t('media.reprocessHint')}</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="shrink-0">
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />{t('media.reprocess')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('media.reprocessConfirmTitle')}</AlertDialogTitle>
              <AlertDialogDescription>{t('media.reprocessConfirmDescription')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('media.cancel')}</AlertDialogCancel>
              <AlertDialogAction>{t('media.reprocessConfirm')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

// ── Result Card ──────────────────────────────────────────────────

function ResultCard({ result, t }: { result: MediaResult; t: (key: string) => string }) {
  const [playing, setPlaying] = useState(false)
  const score = result.viralityScore ?? 0

  return (
    <div className="rounded-xl border overflow-hidden bg-card shadow-sm">
      {/* Score bar */}
      <div className={`h-1 ${scoreBar(score)}`} />

      {/* Player / Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {playing ? (
          <div className="h-full w-full flex items-center justify-center bg-black">
            <div className="text-center text-white/60 text-xs space-y-2">
              <Play className="h-10 w-10 mx-auto opacity-40" />
              <p>{t('media.playerPlaceholder')}</p>
            </div>
          </div>
        ) : result.thumbnailUrl ? (
          <>
            <img src={result.thumbnailUrl} alt={result.title} className="h-full w-full object-cover" />
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20"
            >
              <div className="h-12 w-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                <Play className="h-5 w-5 text-white ml-0.5" />
              </div>
            </button>
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Image className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
        {/* Score badge on thumbnail */}
        {result.viralityScore != null && (
          <div className="absolute top-2.5 right-2.5">
            <Badge variant="secondary" className={`text-xs font-bold shadow-sm ${scoreBg(score)}`}>
              {result.viralityScore}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Status + version row */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={`text-[10px] ${renderStyles[result.renderingStatus]}`}>
            {t(`media.renderingStatus.${result.renderingStatus}`)}
          </Badge>
          <span className="text-[11px] text-muted-foreground font-medium">
            v{result.projectVersion}
          </span>
        </div>

        {/* Title + description */}
        <div>
          <h4 className="text-sm font-semibold leading-snug">{result.title}</h4>
          {result.description && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{result.description}</p>
          )}
        </div>

        {/* Tags */}
        {result.highlightTags && result.highlightTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {result.highlightTags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                <Hash className="mr-0.5 h-2.5 w-2.5" />{tag}
              </span>
            ))}
          </div>
        )}

        {/* ID */}
        <div className="pt-1 border-t">
          <span className="text-[11px] text-muted-foreground font-mono">#{result.id}</span>
        </div>
      </div>
    </div>
  )
}

// ── Results View ─────────────────────────────────────────────────

function ResultsView({
  item,
  onBack,
  t,
}: {
  item: AdminMedia
  onBack: () => void
  t: (key: string) => string
}) {
  const { data: results, isLoading } = useAdminMediaResults(item.id, true)
  const [search, setSearch] = useState('')
  const filtered = (results ?? []).filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />{t('media.backToMedia')}
      </button>

      {/* Source media */}
      <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
        {item.thumbnailUrl && (
          <img src={item.thumbnailUrl} alt={item.title} className="h-10 w-16 sm:h-12 sm:w-20 rounded-lg object-cover shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{item.title}</p>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
            {item.aiType && <span>{item.aiType}</span>}
            {item.provider && <><span>·</span><span>{item.provider}</span></>}
            {item.clipLengths && <><span className="hidden sm:inline">·</span><span className="hidden sm:inline">{item.clipLengths.join(', ')}s</span></>}
          </div>
        </div>
        <Badge variant="secondary" className="hidden sm:inline-flex shrink-0 text-xs rounded-full">
          {item.resultsCount} {t('media.results')}
        </Badge>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t('media.searchResults')} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {!isLoading && (
          <span className="text-sm text-muted-foreground shrink-0">{filtered.length} {t('media.results')}</span>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">{t('media.noResults')}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((result) => <ResultCard key={result.id} result={result} t={t} />)}
        </div>
      )}
    </div>
  )
}

// ── Main Dialog ──────────────────────────────────────────────────

export function MediaManager({
  userId,
  open,
  onOpenChange,
}: {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('admin')
  const { data: media, isLoading } = useAdminUserMedia(userId, open)
  const [view, setView] = useState<View>('list')
  const [selectedMedia, setSelectedMedia] = useState<AdminMedia | null>(null)

  function handleClose(o: boolean) {
    if (!o) { setView('list'); setSelectedMedia(null) }
    onOpenChange(o)
  }

  const title = view === 'list' ? t('media.title') : view === 'detail' ? t('media.mediaDetail') : t('media.resultsTitle')

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0 w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            {view === 'results' ? <Video className="h-5 w-5" /> : <Film className="h-5 w-5" />}
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
          {isLoading ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
            </div>
          ) : !media || media.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">{t('media.empty')}</p>
          ) : view === 'list' ? (
            <ListView media={media} onSelect={(m) => { setSelectedMedia(m); setView('detail') }} t={t} />
          ) : view === 'detail' && selectedMedia ? (
            <DetailView
              item={selectedMedia}
              onBack={() => { setView('list'); setSelectedMedia(null) }}
              onViewResults={() => setView('results')}
              t={t}
            />
          ) : view === 'results' && selectedMedia ? (
            <ResultsView item={selectedMedia} onBack={() => setView('detail')} t={t} />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
