import type {UpdateScheduledPostInput} from '../hooks/use-admin-scheduled-posts';
import type { ScheduledPost, ScheduledPostStatus } from '../types'
import { CalendarClock, CalendarIcon, ChevronLeft, ChevronRight, Clock, Pencil, RefreshCw, Save, XCircle } from 'lucide-react'

import { useCallback, useMemo, useState } from 'react'
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
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  
  useCancelScheduledPost,
  useUpdateScheduledPost
} from '../hooks/use-admin-scheduled-posts'

// ─── Calendar logic ──────────────────────────────────────────────────────────

interface CalendarDay {
  date: number
  month: number
  year: number
  isToday: boolean
  isCurrentMonth: boolean
}

function buildCalendarGrid(year: number, month: number): CalendarDay[][] {
  const today = new Date()
  const todayDate = today.getDate()
  const todayMonth = today.getMonth()
  const todayYear = today.getFullYear()

  const firstDay = new Date(year, month, 1)
  const startWeekday = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: CalendarDay[] = []

  for (let i = startWeekday - 1; i >= 0; i--) {
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const d = daysInPrevMonth - i
    cells.push({ date: d, month: prevMonth, year: prevYear, isToday: false, isCurrentMonth: false })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === todayDate && month === todayMonth && year === todayYear
    cells.push({ date: d, month, year, isToday, isCurrentMonth: true })
  }

  const remaining = 42 - cells.length
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: d, month: nextMonth, year: nextYear, isToday: false, isCurrentMonth: false })
  }

  const grid: CalendarDay[][] = []
  for (let row = 0; row < 6; row++) {
    grid.push(cells.slice(row * 7, row * 7 + 7))
  }

  return grid
}

function toDateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function groupByDate(posts: ScheduledPost[]): Record<string, ScheduledPost[]> {
  const map: Record<string, ScheduledPost[]> = {}
  for (const post of posts) {
    const dateStr = post.scheduledAt ?? post.createdAt
    const date = dateStr.slice(0, 10)
    if (!map[date]) 
map[date] = []
    map[date].push(post)
  }
  return map
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const statusStyles: Record<ScheduledPostStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  scheduled: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  published: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  failed: 'bg-destructive/15 text-destructive',
  cancelled: 'bg-muted text-muted-foreground',
}

const platformColors: Record<string, string> = {
  instagram: 'bg-pink-500 text-white',
  youtube: 'bg-red-500 text-white',
  tiktok: 'bg-foreground text-background',
  twitter: 'bg-sky-500 text-white',
  facebook: 'bg-blue-700 text-white',
}

const MONTH_NAMES = [
  'Janeiro', 
'Fevereiro', 
'Marco', 
'Abril', 
'Maio', 
'Junho',
  'Julho', 
'Agosto', 
'Setembro', 
'Outubro', 
'Novembro', 
'Dezembro',
]

const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

// ─── Platform dot ─────────────────────────────────────────────────────────────

function PlatformDot({ platform }: { platform: string }) {
  return (
    <span
      className={cn(
        'inline-block h-2 w-2 rounded-full',
        platform === 'instagram' && 'bg-pink-500',
        platform === 'youtube' && 'bg-red-500',
        platform === 'tiktok' && 'bg-foreground',
        platform === 'twitter' && 'bg-sky-500',
        platform === 'facebook' && 'bg-blue-700',
        !['instagram', 'youtube', 'tiktok', 'twitter', 'facebook'].includes(platform) && 'bg-muted-foreground',
      )}
    />
  )
}

// ─── Post Edit Dialog ─────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

function PostEditDialog({
  post,
  open,
  onClose,
  scope,
  scopeId,
}: {
  post: ScheduledPost | null
  open: boolean
  onClose: () => void
  scope: 'user' | 'team'
  scopeId: string
}) {
  const { t } = useTranslation('admin')
  const [title, setTitle] = useState(post?.title ?? '')
  const [description, setDescription] = useState(post?.description ?? '')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    post?.scheduledAt ? new Date(post.scheduledAt) : undefined,
  )
  const [selectedHour, setSelectedHour] = useState(
    post?.scheduledAt ? String(new Date(post.scheduledAt).getHours()).padStart(2, '0') : '12',
  )
  const [selectedMinute, setSelectedMinute] = useState(
    post?.scheduledAt ? String(Math.floor(new Date(post.scheduledAt).getMinutes() / 5) * 5).padStart(2, '0') : '00',
  )
  const [calendarOpen, setCalendarOpen] = useState(false)
  const { mutate: update, isPending } = useUpdateScheduledPost(scope, scopeId)

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && post) {
      setTitle(post.title)
      setDescription(post.description ?? '')
      const date = post.scheduledAt ? new Date(post.scheduledAt) : undefined
      setSelectedDate(date)
      setSelectedHour(date ? String(date.getHours()).padStart(2, '0') : '12')
      setSelectedMinute(date ? String(Math.floor(date.getMinutes() / 5) * 5).padStart(2, '0') : '00')
    }
    if (!isOpen) 
onClose()
  }

  const buildDateTime = (): string | null => {
    if (!selectedDate) 
return null
    const dt = new Date(selectedDate)
    dt.setHours(Number(selectedHour), Number(selectedMinute), 0, 0)
    return dt.toISOString()
  }

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null

  const handleSave = () => {
    if (!post) 
return
    const data: UpdateScheduledPostInput = {
      title,
      description: description || null,
      scheduledAt: buildDateTime(),
    }
    update({ postId: post.id, data }, { onSuccess: onClose })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            {t('scheduledPosts.edit.title')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1">
          {/* Title */}
          <div className="space-y-2">
            <Label>{t('scheduledPosts.edit.titleField')}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>{t('scheduledPosts.edit.description')}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={t('scheduledPosts.edit.descriptionPlaceholder')}
              className="resize-none"
            />
          </div>

          {/* Date & Time Picker */}
          <div className="space-y-2">
            <Label>{t('scheduledPosts.edit.scheduledAt')}</Label>

            {/* Date selector */}
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start gap-2 text-left font-normal',
                    !selectedDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="h-4 w-4 shrink-0" />
                  {formattedDate ?? t('scheduledPosts.edit.selectDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setCalendarOpen(false)
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>

            {/* Time selector */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Select value={selectedHour} onValueChange={setSelectedHour}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm font-medium text-muted-foreground">:</span>
              <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MINUTES.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview */}
            {selectedDate && (
              <p className="text-xs text-muted-foreground">
                {formattedDate} {t('scheduledPosts.edit.atTime')} {selectedHour}:{selectedMinute}
              </p>
            )}
          </div>

          <Button className="w-full" onClick={handleSave} disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            {t('scheduledPosts.edit.save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Day Sheet (posts of selected day) ───────────────────────────────────────

function DaySheet({
  day,
  posts,
  open,
  onClose,
  scope,
  scopeId,
}: {
  day: CalendarDay | null
  posts: ScheduledPost[]
  open: boolean
  onClose: () => void
  scope: 'user' | 'team'
  scopeId: string
}) {
  const { t } = useTranslation('admin')
  const { mutate: cancel, isPending: cancelling } = useCancelScheduledPost(scope, scopeId)
  const [editPost, setEditPost] = useState<ScheduledPost | null>(null)
  const [cancelPost, setCancelPost] = useState<ScheduledPost | null>(null)

  const dateLabel = day
    ? `${day.date} de ${MONTH_NAMES[day.month]} de ${day.year}`
    : ''

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              {dateLabel}
            </SheetTitle>
          </SheetHeader>

          {posts.length === 0 ? (
            <EmptyState icon={CalendarClock} title={t('scheduledPosts.emptyDay')} />
          ) : (
            <div className="space-y-3">
              {posts.map((post) => {
                const canEdit = post.status === 'pending' || post.status === 'scheduled'
                const canCancel = post.status === 'pending' || post.status === 'scheduled'

                return (
                  <div key={post.id} className="rounded-lg border bg-card p-3 space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${platformColors[post.platform] ?? 'bg-muted text-muted-foreground'}`}
                      >
                        {post.platform}
                      </Badge>
                      <Badge variant="secondary" className={`text-[10px] ${statusStyles[post.status]}`}>
                        {t(`scheduledPosts.status.${post.status}`)}
                      </Badge>
                      {post.retryCount > 0 && (
                        <Badge variant="outline" className="text-[10px]">
                          {t('scheduledPosts.retries')}: {post.retryCount}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2.5">
                      {post.thumbnailUrl && (
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="h-14 w-10 shrink-0 rounded object-cover"
                        />
                      )}
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-sm font-medium leading-snug line-clamp-2">{post.title}</p>
                        {post.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{post.description}</p>
                        )}
                        {post.errorMessage && (
                          <p className="text-xs text-destructive line-clamp-2">{post.errorMessage}</p>
                        )}
                        {post.scheduledAt && (
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(post.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>

                    {(canEdit || canCancel) && (
                      <div className="flex gap-2 pt-1">
                        {canEdit && (
                          <Button size="sm" variant="outline" className="h-7 text-xs flex-1 gap-1" onClick={() => setEditPost(post)}>
                            <Pencil className="h-3 w-3" />
                            {t('scheduledPosts.actions.edit')}
                          </Button>
                        )}
                        {canCancel && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs flex-1 gap-1 text-destructive hover:text-destructive"
                            onClick={() => setCancelPost(post)}
                          >
                            <XCircle className="h-3 w-3" />
                            {t('scheduledPosts.actions.cancel')}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <PostEditDialog
        post={editPost}
        open={!!editPost}
        onClose={() => setEditPost(null)}
        scope={scope}
        scopeId={scopeId}
      />

      <AlertDialog open={!!cancelPost} onOpenChange={(v) => !v && setCancelPost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('scheduledPosts.cancelDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('scheduledPosts.cancelDialog.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('scheduledPosts.cancelDialog.keep')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelling}
              onClick={() => {
                if (cancelPost) 
cancel(cancelPost.id, { onSuccess: () => setCancelPost(null) })
              }}
            >
              {t('scheduledPosts.cancelDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─── Day Cell ─────────────────────────────────────────────────────────────────

function DayCell({
  day,
  posts,
  onClick,
}: {
  day: CalendarDay
  posts: ScheduledPost[]
  onClick: () => void
}) {
  const hasPosts = posts.length > 0
  const platformGroups = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of posts) {
      map.set(p.platform, (map.get(p.platform) ?? 0) + 1)
    }
    return Array.from(map.entries())
  }, [posts])

  return (
    <button
      type="button"
      onClick={hasPosts ? onClick : undefined}
      className={cn(
        'relative flex min-h-[76px] flex-col gap-1 rounded-md p-1.5 text-left transition-all duration-150 sm:min-h-[96px] sm:rounded-xl sm:p-2',
        day.isToday
          ? 'bg-sky-500/10 ring-1 ring-sky-500/40'
          : day.isCurrentMonth
          ? 'bg-card border border-border/60'
          : 'bg-muted/30',
        hasPosts && day.isCurrentMonth && 'hover:border-primary/40 hover:shadow-sm cursor-pointer',
        !hasPosts && 'cursor-default',
      )}
    >
      <span
        className={cn(
          'shrink-0 text-[10px] font-medium leading-none sm:text-xs',
          day.isToday
            ? 'flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 font-bold text-white sm:h-6 sm:w-6'
            : !day.isCurrentMonth && 'text-muted-foreground/50',
        )}
      >
        {day.date}
      </span>

      {hasPosts && (
        <div className="mt-auto flex flex-wrap gap-1">
          {platformGroups.map(([platform, count]) => (
            <span
              key={platform}
              className="flex items-center gap-0.5"
            >
              <PlatformDot platform={platform} />
              {count > 1 && (
                <span className="text-[9px] font-bold tabular-nums text-muted-foreground">
                  {count}
                </span>
              )}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ScheduledPostsCalendarProps {
  posts: ScheduledPost[]
  isLoading: boolean
  scope: 'user' | 'team'
  scopeId: string
}

export function ScheduledPostsCalendar({ posts, isLoading, scope, scopeId }: ScheduledPostsCalendarProps) {
  const { t } = useTranslation('admin')
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const grid = useMemo(() => buildCalendarGrid(year, month), [year, month])
  const byDate = useMemo(() => groupByDate(posts), [posts])

  const prev = useCallback(() => {
    setMonth((m) => {
      if (m === 0) { setYear(y => y - 1); return 11 }
      return m - 1
    })
  }, [])

  const next = useCallback(() => {
    setMonth((m) => {
      if (m === 11) { setYear(y => y + 1); return 0 }
      return m + 1
    })
  }, [])

  const goToToday = useCallback(() => {
    const today = new Date()
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }, [])

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day)
    setSheetOpen(true)
  }

  const selectedPosts = selectedDay
    ? (byDate[toDateKey(selectedDay.year, selectedDay.month, selectedDay.date)] ?? [])
    : []

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 rounded-lg" />
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 42 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-md" />
          ))}
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return <EmptyState icon={CalendarClock} title={t('scheduledPosts.empty')} />
  }

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[160px] text-center text-sm font-semibold">
              {MONTH_NAMES[month]} {year}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground" onClick={goToToday}>
            <RefreshCw className="h-3 w-3" />
            {t('scheduledPosts.today')}
          </Button>
        </div>

        {/* Grid */}
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {WEEKDAY_SHORT.map((d) => (
              <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
                {d}
              </div>
            ))}
            {grid.flat().map((day) => {
              const key = toDateKey(day.year, day.month, day.date)
              return (
                <DayCell
                  key={key}
                  day={day}
                  posts={byDate[key] ?? []}
                  onClick={() => handleDayClick(day)}
                />
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 border-t px-4 py-2.5 text-[11px] text-muted-foreground">
          {[
            { platform: 'instagram', label: 'Instagram' },
            { platform: 'youtube', label: 'YouTube' },
            { platform: 'tiktok', label: 'TikTok' },
          ].map(({ platform, label }) => (
            <span key={platform} className="flex items-center gap-1.5">
              <PlatformDot platform={platform} />
              {label}
            </span>
          ))}
          <span className="ml-auto">{t('scheduledPosts.clickDayHint')}</span>
        </div>
      </div>

      <DaySheet
        day={selectedDay}
        posts={selectedPosts}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        scope={scope}
        scopeId={scopeId}
      />
    </>
  )
}
