import type {
  AdminTemplate,
  AspectRatio,
  CaptionAnimation,
  CaptionPosition,
  CaptionsPerPage,
  LayoutOption,
  LogoPosition,
  TemplateCaptionSettings,
  TemplateLayoutSettings,
  TemplateSettings,
} from '../types'
import {
  Check,
  ChevronDown,
  Grid2x2,
  Image,
  Layers,
  Monitor,
  MonitorPlay,
  Plus,
  Save,
  Scan,
  Sparkles,
  Star,
  Trash2,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { showErrorToast, showSuccessToast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { useCreateTemplate, useDeleteTemplate, useSetDefaultTemplate, useUpdateTemplateSettings } from '../hooks/use-admin-templates'

/* ──────────────── Static Data ──────────────── */

const animationItems = [
  { value: 'none', labelKey: 'templates.caption.animations.none' },
  { value: 'bounce', labelKey: 'templates.caption.animations.bounce' },
  { value: 'underline', labelKey: 'templates.caption.animations.underline' },
  { value: 'karaoke', labelKey: 'templates.caption.animations.karaoke' },
  { value: 'pulse', labelKey: 'templates.caption.animations.pulse' },
  { value: 'scale', labelKey: 'templates.caption.animations.scale' },
  { value: 'box', labelKey: 'templates.caption.animations.box' },
  { value: 'word-box', labelKey: 'templates.caption.animations.wordBox' },
  { value: 'one-word', labelKey: 'templates.caption.animations.oneWord' },
] as const

const positionItems = [
  { value: 'auto', labelKey: 'templates.caption.positions.auto' },
  { value: 'top', labelKey: 'templates.caption.positions.top' },
  { value: 'middle', labelKey: 'templates.caption.positions.middle' },
  { value: 'bottom', labelKey: 'templates.caption.positions.bottom' },
] as const

const captionsPerPageOptions: CaptionsPerPage[] = ['auto', 'one-word']

const ratioCards = [
  { value: 'auto' as AspectRatio, labelKey: 'templates.layout.ratios.auto', descKey: 'templates.layout.ratios.autoDesc', icon: Sparkles, recommended: true },
  { value: '9:16' as AspectRatio, labelKey: 'templates.layout.ratios.portrait', descKey: 'templates.layout.ratios.portraitDesc', icon: Scan },
  { value: '16:9' as AspectRatio, labelKey: 'templates.layout.ratios.landscape', descKey: 'templates.layout.ratios.landscapeDesc', icon: Monitor },
  { value: '1:1' as AspectRatio, labelKey: 'templates.layout.ratios.square', descKey: 'templates.layout.ratios.squareDesc', icon: Grid2x2 },
] as const

function FitIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <rect x="6" y="5" width="12" height="14" rx="1" />
    </svg>
  )
}

function SplitIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  )
}

function ReactIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <line x1="2" y1="9" x2="22" y2="9" />
    </svg>
  )
}

function ThreeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="12" y1="12" x2="12" y2="22" />
    </svg>
  )
}

const layoutItems = [
  { value: 'fill' as LayoutOption, labelKey: 'templates.layout.types.fill', icon: Scan },
  { value: 'fit' as LayoutOption, labelKey: 'templates.layout.types.fit', icon: FitIcon },
  { value: 'split' as LayoutOption, labelKey: 'templates.layout.types.split', icon: SplitIcon },
  { value: 'three' as LayoutOption, labelKey: 'templates.layout.types.three', icon: ThreeIcon },
  { value: 'four' as LayoutOption, labelKey: 'templates.layout.types.four', icon: Grid2x2 },
  { value: 'react' as LayoutOption, labelKey: 'templates.layout.types.react', icon: ReactIcon },
] as const

const TRACKING_OFF_LAYOUTS: LayoutOption[] = ['fit', 'fill']

const logoPositionItems = [
  { value: 'top-left' as LogoPosition, labelKey: 'templates.logo.pos.top-left' },
  { value: 'top-right' as LogoPosition, labelKey: 'templates.logo.pos.top-right' },
  { value: 'bottom-left' as LogoPosition, labelKey: 'templates.logo.pos.bottom-left' },
  { value: 'bottom-right' as LogoPosition, labelKey: 'templates.logo.pos.bottom-right' },
] as const

const fontFamilyOptions = ['Inter', 'Roboto', 'Montserrat', 'Open Sans', 'Poppins', 'Oswald', 'Bebas Neue'] as const

const presetOptions = [
  { id: 'none', color: '#666666' },
  { id: 'karaoke', color: '#FACC15' },
  { id: 'beasty', color: '#EF4444' },
  { id: 'deep-diver', color: '#22D3EE' },
  { id: 'youshaei', color: '#A3E635' },
  { id: 'pod-p', color: '#A855F7' },
  { id: 'clean', color: '#FFFFFF' },
  { id: 'neon', color: '#F472B6' },
  { id: 'bounce', color: '#FB923C' },
  { id: 'one-word', color: '#FACC15' },
] as const

/* ──────────────── Props ──────────────── */

interface TemplateManagerProps {
  templates: AdminTemplate[] | undefined
  isLoading: boolean
  userId?: string
  teamId?: string
}

/* ──────────────── Main Component ──────────────── */

export function TemplateManager({ templates, isLoading, userId, teamId }: TemplateManagerProps) {
  const { t } = useTranslation('admin')

  const [selectedId, setSelectedId] = useState<string | null>(
    () => templates?.find((tpl) => tpl.isDefault)?.id ?? templates?.[0]?.id ?? null,
  )
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [renameOpen, setRenameOpen] = useState(false)
  const [, setRenameId] = useState<string | null>(null)
  const [renameName, setRenameName] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingSettings, setEditingSettings] = useState<TemplateSettings | null>(null)

  const createMutation = useCreateTemplate()
  const deleteMutation = useDeleteTemplate()
  const setDefaultMutation = useSetDefaultTemplate()
  const updateSettingsMutation = useUpdateTemplateSettings()

  // Sync selectedId when templates load or change
  useEffect(() => {
    if (!templates || templates.length === 0) 
return
    const stillValid = templates.some((tpl) => tpl.id === selectedId)
    if (!stillValid) {
      const defaultId = templates.find((tpl) => tpl.isDefault)?.id ?? templates[0]?.id ?? null
      setSelectedId(defaultId)
      setEditingSettings(null)
    }
  }, [templates, selectedId])

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 rounded-xl" />
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <Skeleton className="h-[460px] rounded-xl" />
          <Skeleton className="h-[460px] rounded-xl" />
        </div>
      </div>
    )
  }

  const templateList = templates ?? []
  const selectedTemplate = templateList.find((tpl) => tpl.id === selectedId)
  const deleteTarget = templateList.find((tpl) => tpl.id === deleteId)
  const hasTemplates = templateList.length > 0

  // Current settings (editing or saved)
  const currentSettings = editingSettings ?? selectedTemplate?.settings

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setEditingSettings(null)
    setSelectorOpen(false)
  }

  const handleSettingsChange = (settings: TemplateSettings) => {
    setEditingSettings(settings)
  }

  const handleSetDefault = (id: string) => {
    setSelectorOpen(false)
    setDefaultMutation.mutate(id, {
      onSuccess: () => showSuccessToast({ title: t('templates.defaultSuccess') }),
      onError: () => showErrorToast({ title: t('templates.defaultError') }),
    })
  }

  const handleDelete = () => {
    if (!deleteId) 
return
    const wasSelected = deleteId === selectedId
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        showSuccessToast({ title: t('templates.deleteSuccess') })
        setDeleteOpen(false)
        setDeleteId(null)
        if (wasSelected) {
          setSelectedId(null)
          setEditingSettings(null)
        }
      },
      onError: () => {
        showErrorToast({ title: t('templates.deleteError') })
        setDeleteOpen(false)
        setDeleteId(null)
      },
    })
  }

  return (
    <div className="space-y-3">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-3 shadow-sm sm:gap-3">
        {hasTemplates ? (
          <Popover open={selectorOpen} onOpenChange={setSelectorOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="border-input flex h-9 min-w-0 flex-1 items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none hover:bg-accent/50"
              >
                <span className="truncate">
                  {selectedTemplate?.name ?? t('templates.selectTemplate')}
                </span>
                <ChevronDown className="size-4 shrink-0 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[var(--radix-popover-trigger-width)] min-w-[220px] max-h-[280px] overflow-y-auto space-y-1 p-1"
            >
              {templateList.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelect(tpl.id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm select-none',
                    tpl.id === selectedId
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {tpl.aspectRatio === 'auto' ? 'Auto' : tpl.aspectRatio}
                  </span>
                  <span className="min-w-0 truncate">{tpl.name}</span>
                  {tpl.isDefault && (
                    <span className="ml-auto shrink-0 rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      {t('templates.default')}
                    </span>
                  )}
                  {tpl.id === selectedId && (
                    <Check className="ml-auto h-4 w-4 shrink-0 text-primary" />
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        ) : (
          <button
            type="button"
            className="border-input text-muted-foreground flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
            onClick={() => { setNewName(''); setCreateOpen(true) }}
          >
            <Plus className="size-4 shrink-0" />
            <span className="truncate">{t('templates.createFirst')}</span>
          </button>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {selectedTemplate && editingSettings && (
            <Button
              size="sm"
              className="h-9 gap-1.5 rounded-lg"
              disabled={updateSettingsMutation.isPending}
              onClick={() => {
                updateSettingsMutation.mutate(
                  { templateId: selectedTemplate.id, settings: editingSettings },
                  {
                    onSuccess: () => {
                      showSuccessToast({ title: t('templates.saveSuccess') })
                      setEditingSettings(null)
                    },
                    onError: () => showErrorToast({ title: t('templates.saveError') }),
                  },
                )
              }}
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">{t('templates.save')}</span>
            </Button>
          )}
          {selectedTemplate && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 rounded-lg"
                disabled={selectedTemplate.isDefault || setDefaultMutation.isPending}
                onClick={() => handleSetDefault(selectedTemplate.id)}
              >
                <Star className={cn('h-4 w-4', selectedTemplate.isDefault && 'fill-primary text-primary')} />
                <span className="hidden sm:inline">{t('templates.setDefault')}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 rounded-lg text-destructive hover:text-destructive"
                disabled={selectedTemplate.isDefault || deleteMutation.isPending}
                onClick={() => {
                  setDeleteId(selectedTemplate.id)
                  setDeleteOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t('templates.delete')}</span>
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-lg"
            onClick={() => { setNewName(''); setCreateOpen(true) }}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('templates.create')}</span>
          </Button>
        </div>
      </div>

      {/* ── Main Content ── */}
      {hasTemplates && currentSettings && (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          {/* Preview — fixed height, centered */}
          <div className="flex items-start justify-center rounded-xl border bg-card p-4 shadow-sm lg:sticky lg:top-4 lg:self-start">
            <TemplateStaticPreview settings={currentSettings} t={t} />
          </div>

          {/* Editor Tabs — fixed max-height with internal scroll */}
          <div className="flex flex-col rounded-xl border bg-card shadow-sm max-h-[520px]">
            <Tabs defaultValue="layout" className="flex min-h-0 flex-1 flex-col">
              <div className="shrink-0 border-b px-2 py-2">
                <TabsList className="h-9 w-full bg-transparent p-0 gap-1">
                  <TabsTrigger value="layout" className="flex-1 rounded-md text-xs data-[state=active]:bg-background data-[state=active]:shadow sm:text-sm">
                    {t('templates.tabs.layout')}
                  </TabsTrigger>
                  <TabsTrigger value="caption" className="flex-1 rounded-md text-xs data-[state=active]:bg-background data-[state=active]:shadow sm:text-sm">
                    {t('templates.tabs.captions')}
                  </TabsTrigger>
                  <TabsTrigger value="others" className="flex-1 rounded-md text-xs data-[state=active]:bg-background data-[state=active]:shadow sm:text-sm">
                    {t('templates.tabs.other')}
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <TabsContent value="layout" className="mt-0">
                  <LayoutTab
                    settings={currentSettings.layout}
                    onChange={(layout) => handleSettingsChange({ ...currentSettings, layout })}
                    t={t}
                  />
                </TabsContent>
                <TabsContent value="caption" className="mt-0">
                  <CaptionTab
                    settings={currentSettings.caption}
                    onChange={(caption) => handleSettingsChange({ ...currentSettings, caption })}
                    t={t}
                  />
                </TabsContent>
                <TabsContent value="others" className="mt-0">
                  <OthersTab
                    settings={currentSettings}
                    onChange={handleSettingsChange}
                    t={t}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      )}

      {!hasTemplates && (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-12 shadow-sm">
          <Layers className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{t('templates.empty')}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => { setNewName(''); setCreateOpen(true) }}
          >
            <Plus className="mr-1 h-3 w-3" />
            {t('templates.create')}
          </Button>
        </div>
      )}

      {/* ── Dialogs ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('templates.createTitle')}</DialogTitle>
            <DialogDescription>{t('templates.createDescription')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t('templates.nameLabel')}</Label>
              <Input placeholder={t('templates.namePlaceholder')} value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <Button
              className="w-full"
              disabled={!newName.trim() || createMutation.isPending}
              onClick={() => {
                createMutation.mutate(
                  { name: newName.trim(), userId, teamId },
                  {
                    onSuccess: (data) => {
                      showSuccessToast({ title: t('templates.createSuccess') })
                      setCreateOpen(false)
                      setNewName('')
                      if (data?.id) 
setSelectedId(data.id)
                    },
                    onError: () => showErrorToast({ title: t('templates.createError') }),
                  },
                )
              }}
            >
              {t('templates.confirmCreate')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('templates.renameTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t('templates.nameLabel')}</Label>
              <Input value={renameName} onChange={(e) => setRenameName(e.target.value)} />
            </div>
            <Button className="w-full" disabled={!renameName.trim()} onClick={() => { setRenameOpen(false); setRenameId(null) }}>
              {t('templates.confirmRename')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('templates.deleteTitle')}</DialogTitle>
            <DialogDescription>{t('templates.deleteDescription', { name: deleteTarget?.name ?? '' })}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>{t('userDetail.cancel')}</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
            >
              {t('templates.confirmDelete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ──────────────── Static Preview ──────────────── */

function TemplateStaticPreview({ settings, t }: { settings: TemplateSettings; t: (key: string) => string }) {
  const caption = settings?.caption ?? { enabled: false, position: 'bottom' as const, fontSize: 14, fontFamily: 'Inter', textColor: '#FFFFFF', backgroundColor: '#000000', backgroundOpacity: 80, bold: false, italic: false, outline: false, maxLines: 2, animation: 'none' as const, presetModel: '' }
  const layout = settings?.layout ?? { aspectRatio: '9:16' as const, faceTracking: false, layouts: [] as string[] }
  const hook = settings?.hook ?? { enabled: false, text: '', duration: 3, position: 'top' as const, fontSize: 18, fontFamily: 'Inter', textColor: '#FFFFFF', backgroundColor: '#000000', backgroundOpacity: 80 }
  const logo = settings?.logo ?? { enabled: false, positions: [] as string[] }

  const isPortrait = layout.aspectRatio === '9:16' || layout.aspectRatio === 'auto'
  const isSquare = layout.aspectRatio === '1:1'

  // Caption position → CSS
  const captionPositionClass = caption.position === 'top'
    ? 'top-[15%]'
    : caption.position === 'middle'
      ? 'top-1/2 -translate-y-1/2'
      : 'bottom-[12%]'

  // Logo position
  const logoPos = logo.positions?.[0] ?? 'top-right'
  const logoPositionClass = cn(
    logoPos.includes('top') ? 'top-3' : 'bottom-3',
    logoPos.includes('left') ? 'left-3' : 'right-3',
  )

  // Feature summary badges
  const features = [
    caption.enabled && { label: t('templates.caption.title'), color: 'bg-blue-500/20 text-blue-400' },
    hook.enabled && { label: t('templates.hook.title'), color: 'bg-amber-500/20 text-amber-400' },
    logo.enabled && { label: t('templates.logo.title'), color: 'bg-emerald-500/20 text-emerald-400' },
    layout.faceTracking && { label: 'Face Tracking', color: 'bg-purple-500/20 text-purple-400' },
  ].filter(Boolean) as { label: string; color: string }[]

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 [contain:paint]',
          isPortrait
            ? 'aspect-[9/16] w-full max-w-[200px]'
            : isSquare
              ? 'aspect-square w-full max-w-[260px]'
              : 'aspect-video w-full max-w-[300px]',
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        {/* Layout indicator */}
        <div className="absolute inset-x-0 top-0 z-[1]">
          {layout.faceTracking && (
            <div className="mx-3 mt-3 flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 backdrop-blur-sm w-fit">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-medium text-white/70">{t('templates.preview.faceTracking')}</span>
            </div>
          )}
        </div>

        {/* Video placeholder content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 opacity-20">
            <MonitorPlay className="h-8 w-8 text-white" />
            <div className="flex gap-1">
              {(layout.layouts ?? []).map((lo) => (
                <Badge key={lo} variant="secondary" className="bg-white/20 text-[8px] text-white/70 capitalize px-1.5 py-0 border-0">
                  {lo}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Hook banner */}
        {hook.enabled && (
          <div className="absolute inset-x-3 top-[8%] z-[2] flex items-center gap-2 rounded-lg bg-amber-500/20 px-3 py-2 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[10px] font-semibold text-amber-300">HOOK</span>
          </div>
        )}

        {/* Caption preview */}
        {caption.enabled && (
          <div className={cn('absolute inset-x-4 z-[3] text-center', captionPositionClass)}>
            <div
              className="inline-block rounded-lg px-3 py-2"
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span
                className="leading-tight"
                style={{
                  fontFamily: caption.fontFamily,
                  fontSize: `${Math.min(caption.fontSize * 0.35, 16)}px`,
                  fontWeight: caption.bold ? 700 : 400,
                  fontStyle: caption.italic ? 'italic' : 'normal',
                  textDecoration: caption.underline ? 'underline' : 'none',
                  textTransform: caption.uppercaseAll ? 'uppercase' : 'none',
                  color: caption.fontColor,
                  textShadow: caption.shadowEnabled
                    ? `0 0 ${caption.shadowBlur}px ${caption.shadowColor}`
                    : 'none',
                  WebkitTextStroke: caption.outlineEnabled
                    ? `${Math.max(caption.outlineWidth * 0.3, 0.5)}px ${caption.outlineColor}`
                    : 'none',
                }}
              >
                {t('templates.preview.sampleWord1')}{' '}
                <span style={{ color: caption.highlightColor }}>
                  {t('templates.preview.sampleWord2')}
                </span>{' '}
                {t('templates.preview.sampleWord3')}
              </span>
            </div>

            {/* Preset + animation badge */}
            <div className="mt-1.5 flex items-center justify-center gap-1">
              {caption.presetModel && caption.presetModel !== 'none' && (
                <span
                  className="rounded px-1.5 py-0.5 text-[8px] font-bold uppercase text-white"
                  style={{ backgroundColor: presetOptions.find((p) => p.id === caption.presetModel)?.color ?? '#666' }}
                >
                  {caption.presetModel}
                </span>
              )}
              {caption.animation !== 'none' && (
                <span className="rounded bg-white/15 px-1.5 py-0.5 text-[8px] font-medium text-white/60">
                  {caption.animation}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Logo preview */}
        {logo.enabled && (
          <div className={cn('absolute z-[4]', logoPositionClass)}>
            {logo.imageUrl ? (
              <img
                src={logo.imageUrl}
                alt="Logo"
                className="block max-h-8 max-w-12 object-contain"
                style={{ opacity: logo.opacity / 100 }}
                draggable={false}
              />
            ) : (
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md border border-white/20 bg-white/10"
                style={{ opacity: logo.opacity / 100 }}
              >
                <Image className="h-3.5 w-3.5 text-white/50" />
              </div>
            )}
          </div>
        )}

        {/* Aspect ratio badge */}
        <div className="absolute bottom-2 right-2 z-[5] rounded-md bg-black/40 px-2 py-0.5 backdrop-blur-sm">
          <span className="text-[9px] font-semibold tabular-nums text-white/60">
            {layout.aspectRatio === 'auto' ? 'AUTO' : layout.aspectRatio}
          </span>
        </div>
      </div>

      {/* Feature summary */}
      {features.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {features.map((f) => (
            <span key={f.label} className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-medium', f.color)}>
              {f.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ──────────────── Layout Tab ──────────────── */

function LayoutTab({ settings, onChange, t }: {
  settings: TemplateLayoutSettings
  onChange: (s: TemplateLayoutSettings) => void
  t: (key: string) => string
}) {
  const handleFaceTrackingChange = (checked: boolean) => {
    if (checked) {
      const next = settings.layouts.includes('fill')
        ? settings.layouts
        : ['fill' as LayoutOption, ...settings.layouts]
      onChange({ ...settings, faceTracking: true, layouts: next })
    } else {
      const kept = settings.layouts.find((l) => TRACKING_OFF_LAYOUTS.includes(l)) ?? 'fit'
      onChange({ ...settings, faceTracking: false, layouts: [kept as LayoutOption] })
    }
  }

  const handleLayoutToggle = (value: LayoutOption) => {
    if (settings.faceTracking) {
      if (value === 'fill') 
return
      const isSelected = settings.layouts.includes(value)
      const next = isSelected
        ? settings.layouts.filter((l) => l !== value)
        : [...settings.layouts, value]
      if (next.length === 0) 
return
      onChange({ ...settings, layouts: next })
    } else {
      if (!TRACKING_OFF_LAYOUTS.includes(value)) 
return
      onChange({ ...settings, layouts: [value] })
    }
  }

  return (
    <div className="space-y-5">
      {/* Aspect Ratio */}
      <div className="space-y-3">
        <SectionHeader>{t('templates.layout.aspectRatio')}</SectionHeader>
        <div className="grid w-full grid-cols-2 gap-2">
          {ratioCards.map((card) => {
            const isSelected = settings.aspectRatio === card.value
            return (
              <button
                key={card.value}
                type="button"
                onClick={() => onChange({ ...settings, aspectRatio: card.value })}
                className={cn(
                  'flex min-h-24 flex-col items-center justify-center gap-1.5 overflow-hidden whitespace-normal rounded-lg border-2 px-3 py-3 text-center transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40',
                )}
              >
                <card.icon className={cn('h-5 w-5 shrink-0', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                {card.value !== 'auto' && (
                  <span className={cn('text-[11px] font-semibold tabular-nums', isSelected ? 'text-primary' : 'text-muted-foreground/70')}>
                    {card.value}
                  </span>
                )}
                <div className="min-w-0 w-full">
                  <span className={cn('text-sm font-semibold', isSelected && 'text-primary')}>
                    {t(card.labelKey)}
                  </span>
                  <span className="block text-[11px] leading-snug text-muted-foreground break-words">
                    {t(card.descKey)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Face Tracking */}
      <SettingRow
        label={t('templates.layout.faceTracking')}
        onClick={() => handleFaceTrackingChange(!settings.faceTracking)}
      >
        <Switch
          checked={settings.faceTracking}
          onCheckedChange={(checked) => handleFaceTrackingChange(checked === true)}
        />
      </SettingRow>

      <Separator />

      {/* Layouts */}
      <div className="space-y-3">
        <SectionHeader>{t('templates.layout.layouts')}</SectionHeader>
        <div className="grid w-full grid-cols-3 gap-1.5">
          {layoutItems.map((item) => {
            const isSelected = settings.layouts.includes(item.value)
            const isDisabled = !settings.faceTracking && !TRACKING_OFF_LAYOUTS.includes(item.value)
            const isLocked = settings.faceTracking && item.value === 'fill'

            return (
              <button
                key={item.value}
                type="button"
                disabled={isDisabled}
                onClick={() => handleLayoutToggle(item.value)}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-1 overflow-hidden whitespace-normal rounded-lg border-2 px-1 py-2 text-center transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40',
                  isDisabled && 'cursor-not-allowed opacity-40 hover:border-border',
                  isLocked && 'cursor-default',
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="w-full break-words text-[10px] font-medium leading-tight">{t(item.labelKey)}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ──────────────── Caption Tab ──────────────── */

function CaptionTab({ settings, onChange, t }: {
  settings: TemplateCaptionSettings
  onChange: (s: TemplateCaptionSettings) => void
  t: (key: string) => string
}) {
  const [presetOpen, setPresetOpen] = useState(false)
  const currentPreset = presetOptions.find((p) => p.id === settings.presetModel)

  const update = <K extends keyof TemplateCaptionSettings>(key: K, value: TemplateCaptionSettings[K]) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-5">
      {/* Master toggle */}
      <SettingRow
        label={t('templates.caption.enabled')}
        onClick={() => update('enabled', !settings.enabled)}
      >
        <Switch
          checked={settings.enabled}
          onCheckedChange={(checked) => update('enabled', checked === true)}
        />
      </SettingRow>

      {settings.enabled && (
        <>
          <Separator />

          {/* Preset Selector */}
          <div className="space-y-2">
            <SectionHeader>{t('templates.caption.preset')}</SectionHeader>
            <Popover open={presetOpen} onOpenChange={setPresetOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex h-auto w-full items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-md"
                      style={{ backgroundColor: currentPreset?.color ?? '#FACC15' }}
                    >
                      <span className="text-xs font-bold text-foreground">Aa</span>
                    </div>
                    <span className="text-sm font-medium capitalize">
                      {settings.presetModel ?? 'karaoke'}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="left" align="center" sideOffset={8} className="w-[300px] p-0">
                <div className="border-b px-4 py-3">
                  <h4 className="text-sm font-semibold">{t('templates.caption.presetTitle')}</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 overflow-y-auto p-3">
                  {presetOptions.map((preset) => {
                    const isSelected = settings.presetModel === preset.id
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          update('presetModel', preset.id)
                          setPresetOpen(false)
                        }}
                        className={cn(
                          'relative flex flex-col items-stretch overflow-hidden rounded-lg border-2 transition-colors',
                          isSelected
                            ? 'border-primary'
                            : 'border-transparent hover:border-primary/30',
                        )}
                      >
                        {isSelected && (
                          <div className="absolute right-1.5 top-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                            <Check className="h-2.5 w-2.5 text-primary-foreground" />
                          </div>
                        )}
                        <div className="flex h-16 items-end justify-center bg-muted pb-2">
                          {preset.id === 'none' ? (
                            <X className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <div className="flex items-center gap-0.5">
                              <span style={{ color: 'var(--muted-foreground)', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase' }}>Aa</span>
                              <span style={{ color: preset.color, fontWeight: 700, fontSize: '10px', textTransform: 'uppercase' }}>Bb</span>
                              <span style={{ color: 'var(--muted-foreground)', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase' }}>Cc</span>
                            </div>
                          )}
                        </div>
                        <div className="bg-muted/30 px-2 py-1.5 text-center">
                          <span className="text-[10px] font-semibold capitalize">{preset.id}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          {/* Text settings */}
          <div className="space-y-4">
            <SectionHeader>{t('templates.caption.textSettings')}</SectionHeader>

            <SettingRow
              label={t('templates.caption.removePunctuation')}
              onClick={() => update('removePunctuation', !settings.removePunctuation)}
            >
              <Switch
                checked={settings.removePunctuation}
                onCheckedChange={(checked) => update('removePunctuation', checked === true)}
              />
            </SettingRow>

            <SettingRow
              label={t('templates.caption.removeProfanity')}
              onClick={() => update('removeProfanity', !settings.removeProfanity)}
            >
              <Switch
                checked={settings.removeProfanity}
                onCheckedChange={(checked) => update('removeProfanity', checked === true)}
              />
            </SettingRow>

            <SettingRow
              label={t('templates.caption.uppercase')}
              onClick={() => update('uppercaseAll', !settings.uppercaseAll)}
            >
              <Switch
                checked={settings.uppercaseAll}
                onCheckedChange={(checked) => update('uppercaseAll', checked === true)}
              />
            </SettingRow>
          </div>

          <Separator />

          {/* Display settings */}
          <div className="space-y-4">
            <SectionHeader>{t('templates.caption.displaySettings')}</SectionHeader>

            {/* Captions Per Page */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('templates.caption.captionsPerPage')}</Label>
              <ToggleGroup
                type="single"
                value={settings.captionsPerPage}
                onValueChange={(val) => { if (val) 
update('captionsPerPage', val as CaptionsPerPage) }}
                className="grid w-full grid-cols-2 gap-1.5"
              >
                {captionsPerPageOptions.map((val) => (
                  <ToggleGroupItem
                    key={val}
                    value={val}
                    className="h-auto whitespace-normal rounded-md border-2 px-3 py-1.5 text-center text-xs font-medium capitalize data-[state=on]:border-primary data-[state=on]:bg-primary/5 data-[state=on]:text-primary data-[state=off]:border-transparent data-[state=off]:bg-muted/30 data-[state=off]:text-muted-foreground data-[state=off]:hover:bg-accent/50"
                  >
                    {val}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Animation */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('templates.caption.animation')}</Label>
              <ToggleGroup
                type="single"
                value={settings.animation}
                onValueChange={(val) => { if (val) 
update('animation', val as CaptionAnimation) }}
                className="grid w-full grid-cols-3 gap-1.5"
              >
                {animationItems.map((item) => (
                  <ToggleGroupItem
                    key={item.value}
                    value={item.value}
                    className="h-full whitespace-normal rounded-md border-2 px-1.5 py-1.5 text-center text-[10px] font-medium data-[state=on]:border-primary data-[state=on]:bg-primary/5 data-[state=on]:text-primary data-[state=off]:border-transparent data-[state=off]:bg-muted/30 data-[state=off]:text-muted-foreground data-[state=off]:hover:bg-accent/50"
                  >
                    {t(item.labelKey)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Highlight Color */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('templates.caption.highlightColor')}</Label>
              <ColorInput
                value={settings.highlightColor}
                onChange={(value) => update('highlightColor', value)}
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('templates.caption.position')}</Label>
              <ToggleGroup
                type="single"
                value={settings.position}
                onValueChange={(val) => { if (val) 
update('position', val as CaptionPosition) }}
                className="grid w-full grid-cols-4 gap-1.5"
              >
                {positionItems.map((item) => (
                  <ToggleGroupItem
                    key={item.value}
                    value={item.value}
                    className="h-auto whitespace-normal rounded-md border-2 px-2 py-1.5 text-center text-xs font-medium data-[state=on]:border-primary data-[state=on]:bg-primary/5 data-[state=on]:text-primary data-[state=off]:border-transparent data-[state=off]:bg-muted/30 data-[state=off]:text-muted-foreground data-[state=off]:hover:bg-accent/50"
                  >
                    {t(item.labelKey)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <Separator />

          {/* Font settings */}
          <div className="space-y-4">
            <SectionHeader>{t('templates.caption.font')}</SectionHeader>

            <div className="flex items-center gap-2">
              <Select value={settings.fontFamily} onValueChange={(value) => update('fontFamily', value)}>
                <SelectTrigger className="min-w-0 flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilyOptions.map((font) => (
                    <SelectItem key={font} value={font}>{font}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={settings.fontSize}
                onChange={(e) => update('fontSize', Number(e.target.value))}
                className="h-9 w-16 shrink-0 text-xs"
                min={8}
                max={72}
              />
            </div>

            <div className="flex items-center gap-1">
              <Button type="button" variant={settings.bold ? 'default' : 'outline'} size="sm" className="h-8 w-8 p-0 font-bold" onClick={() => update('bold', !settings.bold)}>B</Button>
              <Button type="button" variant={settings.italic ? 'default' : 'outline'} size="sm" className="h-8 w-8 p-0 italic" onClick={() => update('italic', !settings.italic)}>I</Button>
              <Button type="button" variant={settings.underline ? 'default' : 'outline'} size="sm" className="h-8 w-8 p-0 underline" onClick={() => update('underline', !settings.underline)}>U</Button>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('templates.caption.fontColor')}</Label>
              <ColorInput value={settings.fontColor} onChange={(value) => update('fontColor', value)} />
            </div>
          </div>

          <Separator />

          {/* Effects */}
          <div className="space-y-4">
            <SectionHeader>{t('templates.caption.effects')}</SectionHeader>

            <div className="space-y-3">
              <SettingRow
                label={t('templates.caption.outline')}
                onClick={() => update('outlineEnabled', !settings.outlineEnabled)}
              >
                <Switch
                  checked={settings.outlineEnabled}
                  onCheckedChange={(checked) => update('outlineEnabled', checked === true)}
                />
              </SettingRow>
              {settings.outlineEnabled && (
                <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
                  <ColorInput value={settings.outlineColor} onChange={(value) => update('outlineColor', value)} />
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{t('templates.caption.outlineWidth')}</span>
                      <span className="text-xs font-medium">{settings.outlineWidth}px</span>
                    </div>
                    <Slider value={[settings.outlineWidth]} onValueChange={([v]) => update('outlineWidth', v)} min={0} max={10} step={1} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <SettingRow
                label={t('templates.caption.shadow')}
                onClick={() => update('shadowEnabled', !settings.shadowEnabled)}
              >
                <Switch
                  checked={settings.shadowEnabled}
                  onCheckedChange={(checked) => update('shadowEnabled', checked === true)}
                />
              </SettingRow>
              {settings.shadowEnabled && (
                <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
                  <ColorInput value={settings.shadowColor} onChange={(value) => update('shadowColor', value)} />
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{t('templates.caption.shadowBlur')}</span>
                      <span className="text-xs font-medium">{settings.shadowBlur}px</span>
                    </div>
                    <Slider value={[settings.shadowBlur]} onValueChange={([v]) => update('shadowBlur', v)} min={0} max={20} step={1} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ──────────────── Others Tab (Hook + Logo) ──────────────── */

function OthersTab({ settings, onChange, t }: {
  settings: TemplateSettings
  onChange: (s: TemplateSettings) => void
  t: (key: string) => string
}) {
  const hookSettings = settings.hook
  const logoSettings = settings.logo

  const updateHook = (hook: typeof hookSettings) => onChange({ ...settings, hook })
  const updateLogo = (logo: typeof logoSettings) => onChange({ ...settings, logo })

  return (
    <div className="space-y-6">
      {/* Hook */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-amber-500/10"
            onClick={() => updateHook({ ...hookSettings, enabled: !hookSettings.enabled })}
          >
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => updateHook({ ...hookSettings, enabled: !hookSettings.enabled })}
            >
              <h3 className="text-sm font-semibold">{t('templates.hook.title')}</h3>
              <div onClick={(e) => e.stopPropagation()}>
                <Switch
                  checked={hookSettings.enabled}
                  onCheckedChange={(checked) => updateHook({ ...hookSettings, enabled: checked === true })}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('templates.hook.description')}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Logo */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-blue-500/10"
            onClick={() => updateLogo({ ...logoSettings, enabled: !logoSettings.enabled })}
          >
            <Image className="h-4 w-4 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => updateLogo({ ...logoSettings, enabled: !logoSettings.enabled })}
            >
              <h3 className="text-sm font-semibold">{t('templates.logo.title')}</h3>
              <div onClick={(e) => e.stopPropagation()}>
                <Switch
                  checked={logoSettings.enabled}
                  onCheckedChange={(checked) => updateLogo({ ...logoSettings, enabled: checked === true })}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('templates.logo.description')}
            </p>
          </div>
        </div>

        {logoSettings.enabled && (
          <div className="space-y-4 pl-12">
            {/* Image URL */}
            <div className="space-y-1.5">
              <Label className="text-xs">{t('templates.logo.image')}</Label>
              <Input
                type="text"
                value={logoSettings.imageUrl ?? ''}
                onChange={(e) => updateLogo({ ...logoSettings, imageUrl: e.target.value })}
                placeholder="https://..."
                className="h-9"
              />
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">{t('templates.logo.opacity')}</Label>
                <span className="text-xs text-muted-foreground">{Math.round(logoSettings.opacity)}%</span>
              </div>
              <Slider
                value={[Math.round(logoSettings.opacity)]}
                min={0}
                max={100}
                step={1}
                onValueChange={([v]) => updateLogo({ ...logoSettings, opacity: v })}
              />
            </div>

            {/* Scale */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">{t('templates.logo.scale')}</Label>
                <span className="text-xs text-muted-foreground">{Math.round(logoSettings.scale)}%</span>
              </div>
              <Slider
                value={[Math.round(logoSettings.scale)]}
                min={10}
                max={100}
                step={1}
                onValueChange={([v]) => updateLogo({ ...logoSettings, scale: v })}
              />
            </div>

            <Separator />

            {/* Alternate Position */}
            <div className="space-y-3">
              <SettingRow
                label={t('templates.logo.alternatePosition')}
                onClick={() => updateLogo({ ...logoSettings, alternatePosition: !logoSettings.alternatePosition })}
              >
                <Switch
                  checked={logoSettings.alternatePosition}
                  onCheckedChange={(checked) => updateLogo({ ...logoSettings, alternatePosition: checked === true })}
                />
              </SettingRow>

              {logoSettings.alternatePosition && (
                <ToggleGroup
                  type="multiple"
                  value={logoSettings.positions}
                  onValueChange={(val) => {
                    if (val.length >= 2) 
updateLogo({ ...logoSettings, positions: val as LogoPosition[] })
                  }}
                  className="grid w-full grid-cols-2 gap-1.5"
                >
                  {logoPositionItems.map((item, i) => (
                    <ToggleGroupItem
                      key={item.value}
                      value={item.value}
                      className="h-auto whitespace-normal border-2 px-3 py-2 text-center text-xs font-medium data-[state=on]:border-primary data-[state=on]:bg-primary/5 data-[state=on]:text-primary data-[state=off]:border-transparent data-[state=off]:bg-muted/30 data-[state=off]:text-muted-foreground data-[state=off]:hover:bg-accent/50"
                      style={{
                        borderRadius: 0,
                        ...(i === 0 && { borderTopLeftRadius: '0.5rem' }),
                        ...(i === 1 && { borderTopRightRadius: '0.5rem' }),
                        ...(i === 2 && { borderBottomLeftRadius: '0.5rem' }),
                        ...(i === 3 && { borderBottomRightRadius: '0.5rem' }),
                      }}
                    >
                      {t(item.labelKey)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ──────────────── Shared Components ──────────────── */

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h4>
  )
}

function SettingRow({ label, onClick, children }: {
  label: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className={cn('flex items-center justify-between gap-4', onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      <span className="text-sm font-medium">{label}</span>
      <div onClick={onClick ? (e) => e.stopPropagation() : undefined}>
        {children}
      </div>
    </div>
  )
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8 shrink-0">
        <div
          className="h-full w-full cursor-pointer rounded-md border"
          style={{ backgroundColor: value }}
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'color'
            input.value = value
            input.addEventListener('input', (e) => onChange((e.target as HTMLInputElement).value))
            input.click()
          }}
        />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-24 font-mono text-xs"
        maxLength={7}
      />
    </div>
  )
}
