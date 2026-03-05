import { useState } from 'react'
import {
  Check,
  ChevronUp,
  Edit2,
  Eye,
  FileText,
  Image,
  Layers,
  LetterText,
  MonitorPlay,
  Plus,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react'
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

import type {
  AdminTemplate,
  AspectRatio,
  CaptionAnimation,
  CaptionPosition,
  CaptionsPerPage,
  LayoutOption,
  LogoPosition,
} from '../types'

const animationOptions: CaptionAnimation[] = [
  'none', 'bounce', 'underline', 'karaoke', 'pulse', 'scale', 'box', 'word-box', 'one-word',
]
const positionOptions: CaptionPosition[] = ['auto', 'top', 'middle', 'bottom']
const captionsPerPageOptions: CaptionsPerPage[] = ['auto', 'one-word']
const aspectRatioOptions: { value: AspectRatio; label: string; icon: typeof Square }[] = [
  { value: 'auto', label: 'Auto', icon: Sparkles },
  { value: '9:16', label: '9:16', icon: RectangleVertical },
  { value: '16:9', label: '16:9', icon: RectangleHorizontal },
  { value: '1:1', label: '1:1', icon: Square },
]
const layoutOptionsTracking: LayoutOption[] = ['fit', 'fill', 'split', 'three', 'four', 'react']
const layoutOptionsNoTracking: LayoutOption[] = ['fit', 'fill']
const logoPositionOptions: LogoPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
const fontFamilyOptions = ['Inter', 'Roboto', 'Montserrat', 'Open Sans', 'Poppins', 'Oswald', 'Bebas Neue'] as const
const presetOptions = ['none', 'karaoke', 'beasty', 'deep-diver', 'youshaei', 'pod-p', 'clean', 'neon', 'bounce', 'one-word'] as const

interface TemplateManagerProps {
  templates: AdminTemplate[] | undefined
  isLoading: boolean
}

export function TemplateManager({ templates, isLoading }: TemplateManagerProps) {
  const { t } = useTranslation('admin')

  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [renameOpen, setRenameOpen] = useState(false)
  const [, setRenameId] = useState<string | null>(null)
  const [renameName, setRenameName] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [defaultId, setDefaultId] = useState<string | null>(
    () => templates?.find((tpl) => tpl.isDefault)?.id ?? null,
  )

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    )
  }

  const templateList = templates ?? []
  const deleteTarget = templateList.find((tpl) => tpl.id === deleteId)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {templateList.length} {t('templates.count')}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setNewName(''); setCreateOpen(true) }}
        >
          <Plus className="mr-1 h-3 w-3" />
          {t('templates.create')}
        </Button>
      </div>

      {templateList.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          {t('templates.empty')}
        </p>
      ) : (
        <div className="rounded-lg border divide-y">
          {templateList.map((tpl) => (
            <div key={tpl.id}>
              <div className="flex items-center gap-3 p-3">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{tpl.name}</p>
                    {defaultId === tpl.id && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        {t('templates.default')}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs">{tpl.aspectRatio}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {t('templates.updated')}: {tpl.updatedAt}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost" size="sm"
                    className={`h-7 w-7 p-0 ${defaultId === tpl.id ? 'text-amber-500' : 'text-muted-foreground'}`}
                    title={t('templates.setDefault')}
                    disabled={defaultId === tpl.id}
                    onClick={() => setDefaultId(tpl.id)}
                  >
                    <Star className={`h-3.5 w-3.5 ${defaultId === tpl.id ? 'fill-amber-500' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost" size="sm" className="h-7 w-7 p-0"
                    title={t('templates.viewSettings')}
                    onClick={() => setExpandedId(expandedId === tpl.id ? null : tpl.id)}
                  >
                    {expandedId === tpl.id ? <ChevronUp className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    variant="ghost" size="sm" className="h-7 w-7 p-0"
                    title={t('templates.rename')}
                    onClick={() => { setRenameId(tpl.id); setRenameName(tpl.name); setRenameOpen(true) }}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    title={t('templates.delete')}
                    disabled={defaultId === tpl.id}
                    onClick={() => { setDeleteId(tpl.id); setDeleteOpen(true) }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {expandedId === tpl.id && (
                <div className="border-t bg-muted/30 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium">{t('templates.settings')}</h5>
                    {editingId === tpl.id ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm" className="h-7 text-xs"
                          onClick={() => setEditingId(null)}
                        >
                          {t('userDetail.cancel')}
                        </Button>
                        <Button
                          variant="default"
                          size="sm" className="h-7 text-xs"
                          onClick={() => setEditingId(null)}
                        >
                          <Check className="mr-1 h-3 w-3" />
                          {t('templates.save')}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm" className="h-7 text-xs"
                        onClick={() => setEditingId(tpl.id)}
                      >
                        <Edit2 className="mr-1 h-3 w-3" />
                        {t('templates.edit')}
                      </Button>
                    )}
                  </div>
                  <TemplateSettingsView template={tpl} editing={editingId === tpl.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
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
            <Button className="w-full" disabled={!newName.trim()} onClick={() => { setCreateOpen(false); setNewName('') }}>
              {t('templates.confirmCreate')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
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

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('templates.deleteTitle')}</DialogTitle>
            <DialogDescription>{t('templates.deleteDescription', { name: deleteTarget?.name ?? '' })}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>{t('userDetail.cancel')}</Button>
            <Button variant="destructive" onClick={() => { setDeleteOpen(false); setDeleteId(null) }}>{t('templates.confirmDelete')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ──────────────── Settings View ──────────────── */

function TemplateSettingsView({ template, editing }: { template: AdminTemplate; editing: boolean }) {
  const { t } = useTranslation('admin')
  const s = template.settings

  // ── Layout state ──
  const [aspectRatio, setAspectRatio] = useState(s.layout.aspectRatio)
  const [faceTracking, setFaceTracking] = useState(s.layout.faceTracking)
  const [selectedLayouts, setSelectedLayouts] = useState<string[]>(s.layout.layouts)

  // ── Caption state ──
  const [captionEnabled, setCaptionEnabled] = useState(s.caption.enabled)
  const [preset, setPreset] = useState(s.caption.presetModel ?? 'karaoke')
  const [animation, setAnimation] = useState(s.caption.animation)
  const [position, setPosition] = useState(s.caption.position)
  const [captionsPerPage, setCaptionsPerPage] = useState(s.caption.captionsPerPage)
  const [fontFamily, setFontFamily] = useState(s.caption.fontFamily)
  const [fontSize, setFontSize] = useState(s.caption.fontSize)
  const [bold, setBold] = useState(s.caption.bold)
  const [italic, setItalic] = useState(s.caption.italic)
  const [underline, setUnderline] = useState(s.caption.underline)
  const [uppercaseAll, setUppercaseAll] = useState(s.caption.uppercaseAll)
  const [removePunctuation, setRemovePunctuation] = useState(s.caption.removePunctuation)
  const [removeProfanity, setRemoveProfanity] = useState(s.caption.removeProfanity)
  const [fontColor, setFontColor] = useState(s.caption.fontColor)
  const [highlightColor, setHighlightColor] = useState(s.caption.highlightColor)
  const [outlineEnabled, setOutlineEnabled] = useState(s.caption.outlineEnabled)
  const [outlineColor, setOutlineColor] = useState(s.caption.outlineColor)
  const [outlineWidth, setOutlineWidth] = useState(s.caption.outlineWidth)
  const [shadowEnabled, setShadowEnabled] = useState(s.caption.shadowEnabled)
  const [shadowColor, setShadowColor] = useState(s.caption.shadowColor)
  const [shadowBlur, setShadowBlur] = useState(s.caption.shadowBlur)

  // ── Hook state ──
  const [hookEnabled, setHookEnabled] = useState(s.hook.enabled)

  // ── Logo state ──
  const [logoEnabled, setLogoEnabled] = useState(s.logo.enabled)
  const [logoUrl, setLogoUrl] = useState(s.logo.imageUrl ?? '')
  const [logoScale, setLogoScale] = useState(s.logo.scale)
  const [logoOpacity, setLogoOpacity] = useState(s.logo.opacity)
  const [alternatePosition, setAlternatePosition] = useState(s.logo.alternatePosition)
  const [logoPositions, setLogoPositions] = useState<string[]>(s.logo.positions)

  // ── Layout handlers ──
  const handleFaceTrackingChange = (checked: boolean) => {
    setFaceTracking(checked)
    if (checked) {
      if (!selectedLayouts.includes('fit')) {
        setSelectedLayouts((prev) => ['fit', ...prev])
      }
    } else {
      const hasFill = selectedLayouts.includes('fill')
      setSelectedLayouts(hasFill ? ['fill'] : ['fit'])
    }
  }

  const handleLayoutToggle = (lo: string) => {
    if (faceTracking) {
      if (lo === 'fit') return
      setSelectedLayouts((prev) =>
        prev.includes(lo) ? prev.filter((l) => l !== lo) : [...prev, lo],
      )
    } else {
      setSelectedLayouts([lo])
    }
  }

  const handleLogoPositionToggle = (pos: string) => {
    setLogoPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos],
    )
  }

  if (!editing) {
    return <TemplateReadOnlyView
      t={t}
      aspectRatio={aspectRatio}
      faceTracking={faceTracking}
      selectedLayouts={selectedLayouts}
      captionEnabled={captionEnabled}
      preset={preset}
      animation={animation}
      position={position}
      captionsPerPage={captionsPerPage}
      fontFamily={fontFamily}
      fontSize={fontSize}
      bold={bold}
      italic={italic}
      underline={underline}
      uppercaseAll={uppercaseAll}
      removePunctuation={removePunctuation}
      removeProfanity={removeProfanity}
      fontColor={fontColor}
      highlightColor={highlightColor}
      outlineEnabled={outlineEnabled}
      outlineColor={outlineColor}
      outlineWidth={outlineWidth}
      shadowEnabled={shadowEnabled}
      shadowColor={shadowColor}
      shadowBlur={shadowBlur}
      hookEnabled={hookEnabled}
      logoEnabled={logoEnabled}
      logoUrl={logoUrl}
      logoScale={logoScale}
      logoOpacity={logoOpacity}
      alternatePosition={alternatePosition}
      logoPositions={logoPositions}
    />
  }

  return (
    <div className="space-y-6">
      {/* ── Layout ── */}
      <section className="space-y-4">
        <SectionHeader icon={Layers} label={t('templates.layout.title')} />

        {/* Aspect Ratio Cards */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">{t('templates.layout.aspectRatio')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {aspectRatioOptions.map((ar) => {
              const Icon = ar.icon
              const selected = aspectRatio === ar.value
              return (
                <button
                  key={ar.value}
                  type="button"
                  onClick={() => setAspectRatio(ar.value)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 p-3 transition-colors ${
                    selected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${selected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-xs font-medium ${selected ? 'text-primary' : 'text-muted-foreground'}`}>
                    {ar.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Face Tracking */}
        <ClickableRow label={t('templates.layout.faceTracking')} editing onToggle={() => handleFaceTrackingChange(!faceTracking)}>
          <Switch checked={faceTracking} onCheckedChange={handleFaceTrackingChange} />
        </ClickableRow>

        {/* Layout Options */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">{t('templates.layout.layouts')}</p>
          {faceTracking ? (
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
              {layoutOptionsTracking.map((lo) => {
                const selected = selectedLayouts.includes(lo)
                const locked = lo === 'fit'
                return (
                  <button
                    key={lo}
                    type="button"
                    onClick={() => handleLayoutToggle(lo)}
                    disabled={locked}
                    className={`flex items-center justify-center rounded-lg border-2 px-2 py-2 text-xs font-medium capitalize transition-colors ${
                      selected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    } ${locked ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    {lo}
                    {locked && <Check className="ml-1 h-3 w-3" />}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5 max-w-xs">
              {layoutOptionsNoTracking.map((lo) => {
                const selected = selectedLayouts.includes(lo)
                return (
                  <button
                    key={lo}
                    type="button"
                    onClick={() => handleLayoutToggle(lo)}
                    className={`flex items-center justify-center rounded-lg border-2 px-2 py-2 text-xs font-medium capitalize transition-colors ${
                      selected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {lo}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Separator />

      {/* ── Captions ── */}
      <section className="space-y-4">
        <SectionHeader icon={LetterText} label={t('templates.caption.title')} />

        <ClickableRow label={t('templates.caption.enabled')} editing onToggle={() => setCaptionEnabled(!captionEnabled)}>
          <Switch checked={captionEnabled} onCheckedChange={setCaptionEnabled} />
        </ClickableRow>

        {captionEnabled && (
          <>
            {/* Preset */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">{t('templates.caption.preset')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
                {presetOptions.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPreset(p)}
                    className={`rounded-lg border-2 px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
                      preset === p
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Animation */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">{t('templates.caption.animation')}</p>
              <div className="grid w-full grid-cols-3 gap-1.5 sm:grid-cols-5">
                {animationOptions.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAnimation(a)}
                    className={`rounded-lg border-2 px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
                      animation === a
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Position */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">{t('templates.caption.position')}</p>
              <div className="grid w-full grid-cols-4 gap-1.5">
                {positionOptions.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPosition(p)}
                    className={`rounded-lg border-2 px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
                      position === p
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Captions Per Page */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">{t('templates.caption.captionsPerPage')}</p>
              <div className="grid w-full grid-cols-2 gap-1.5 max-w-xs">
                {captionsPerPageOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCaptionsPerPage(c)}
                    className={`rounded-lg border-2 px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
                      captionsPerPage === c
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="!my-3" />

            {/* Font */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('templates.caption.font')}</p>
              <div className="flex items-center gap-3">
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="h-9 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilyOptions.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  min={8}
                  max={72}
                  className="h-9 w-20 text-center"
                />
              </div>

              {/* Style Toggles */}
              <div className="flex gap-1">
                <Button variant={bold ? 'default' : 'outline'} size="sm" className="h-8 w-8 p-0 font-bold" onClick={() => setBold(!bold)}>B</Button>
                <Button variant={italic ? 'default' : 'outline'} size="sm" className="h-8 w-8 p-0 italic" onClick={() => setItalic(!italic)}>I</Button>
                <Button variant={underline ? 'default' : 'outline'} size="sm" className="h-8 w-8 p-0 underline" onClick={() => setUnderline(!underline)}>U</Button>
                <Button variant={uppercaseAll ? 'default' : 'outline'} size="sm" className="h-8 px-3 text-xs font-semibold" onClick={() => setUppercaseAll(!uppercaseAll)}>AA</Button>
              </div>
            </div>

            <Separator className="!my-3" />

            {/* Filters */}
            <div className="space-y-2">
              <ClickableRow label={t('templates.caption.removePunctuation')} editing onToggle={() => setRemovePunctuation(!removePunctuation)}>
                <Switch checked={removePunctuation} onCheckedChange={setRemovePunctuation} />
              </ClickableRow>
              <ClickableRow label={t('templates.caption.removeProfanity')} editing onToggle={() => setRemoveProfanity(!removeProfanity)}>
                <Switch checked={removeProfanity} onCheckedChange={setRemoveProfanity} />
              </ClickableRow>
            </div>

            <Separator className="!my-3" />

            {/* Colors */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('templates.caption.colors')}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <ColorInput label={t('templates.caption.fontColor')} value={fontColor} onChange={setFontColor} editing />
                <ColorInput label={t('templates.caption.highlightColor')} value={highlightColor} onChange={setHighlightColor} editing />
              </div>
            </div>

            {/* Outline */}
            <div className="rounded-lg border bg-muted/20 p-3 space-y-3">
              <ClickableRow label={t('templates.caption.outline')} editing onToggle={() => setOutlineEnabled(!outlineEnabled)}>
                <Switch checked={outlineEnabled} onCheckedChange={setOutlineEnabled} />
              </ClickableRow>
              {outlineEnabled && (
                <div className="space-y-3 pt-1">
                  <ColorInput label={t('templates.caption.outlineColor')} value={outlineColor} onChange={setOutlineColor} editing />
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">{t('templates.caption.outlineWidth')}</span>
                      <span className="text-xs font-medium">{outlineWidth}px</span>
                    </div>
                    <Slider value={[outlineWidth]} onValueChange={([v]) => setOutlineWidth(v)} min={0} max={10} step={1} />
                  </div>
                </div>
              )}
            </div>

            {/* Shadow */}
            <div className="rounded-lg border bg-muted/20 p-3 space-y-3">
              <ClickableRow label={t('templates.caption.shadow')} editing onToggle={() => setShadowEnabled(!shadowEnabled)}>
                <Switch checked={shadowEnabled} onCheckedChange={setShadowEnabled} />
              </ClickableRow>
              {shadowEnabled && (
                <div className="space-y-3 pt-1">
                  <ColorInput label={t('templates.caption.shadowColor')} value={shadowColor} onChange={setShadowColor} editing />
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">{t('templates.caption.shadowBlur')}</span>
                      <span className="text-xs font-medium">{shadowBlur}px</span>
                    </div>
                    <Slider value={[shadowBlur]} onValueChange={([v]) => setShadowBlur(v)} min={0} max={20} step={1} />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <Separator />

      {/* ── Hook ── */}
      <section className="space-y-4">
        <SectionHeader icon={MonitorPlay} label={t('templates.hook.title')} />
        <ClickableRow label={t('templates.hook.enabled')} editing onToggle={() => setHookEnabled(!hookEnabled)}>
          <Switch checked={hookEnabled} onCheckedChange={setHookEnabled} />
        </ClickableRow>
      </section>

      <Separator />

      {/* ── Logo ── */}
      <section className="space-y-4">
        <SectionHeader icon={Image} label={t('templates.logo.title')} />

        <ClickableRow label={t('templates.logo.enabled')} editing onToggle={() => setLogoEnabled(!logoEnabled)}>
          <Switch checked={logoEnabled} onCheckedChange={setLogoEnabled} />
        </ClickableRow>

        {logoEnabled && (
          <>
            {/* Image URL */}
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">{t('templates.logo.image')}</p>
              <Input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." className="h-9" />
            </div>

            {/* Scale */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">{t('templates.logo.scale')}</span>
                <span className="text-xs font-medium">{logoScale}%</span>
              </div>
              <Slider value={[logoScale]} onValueChange={([v]) => setLogoScale(v)} min={10} max={100} step={5} />
            </div>

            {/* Opacity */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">{t('templates.logo.opacity')}</span>
                <span className="text-xs font-medium">{logoOpacity}%</span>
              </div>
              <Slider value={[logoOpacity]} onValueChange={([v]) => setLogoOpacity(v)} min={0} max={100} step={5} />
            </div>

            {/* Alternate Position */}
            <ClickableRow label={t('templates.logo.alternatePosition')} editing onToggle={() => setAlternatePosition(!alternatePosition)}>
              <Switch checked={alternatePosition} onCheckedChange={setAlternatePosition} />
            </ClickableRow>

            {/* Positions */}
            {alternatePosition && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">{t('templates.logo.positions')}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {logoPositionOptions.map((pos) => {
                    const selected = logoPositions.includes(pos)
                    return (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => handleLogoPositionToggle(pos)}
                        className={`rounded-lg border-2 px-3 py-2 text-xs font-medium transition-colors ${
                          selected
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        {t(`templates.logo.pos.${pos}`)}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

/* ──────────────── Read-Only View ──────────────── */

function TemplateReadOnlyView(props: {
  t: (key: string) => string
  aspectRatio: string; faceTracking: boolean; selectedLayouts: string[]
  captionEnabled: boolean; preset: string; animation: string; position: string
  captionsPerPage: string; fontFamily: string; fontSize: number
  bold: boolean; italic: boolean; underline: boolean; uppercaseAll: boolean
  removePunctuation: boolean; removeProfanity: boolean
  fontColor: string; highlightColor: string
  outlineEnabled: boolean; outlineColor: string; outlineWidth: number
  shadowEnabled: boolean; shadowColor: string; shadowBlur: number
  hookEnabled: boolean
  logoEnabled: boolean; logoUrl: string; logoScale: number; logoOpacity: number
  alternatePosition: boolean; logoPositions: string[]
}) {
  const { t } = props

  const styleLabels = [
    props.bold && 'B',
    props.italic && 'I',
    props.underline && 'U',
    props.uppercaseAll && 'AA',
  ].filter(Boolean) as string[]

  return (
    <div className="space-y-4">
      {/* Layout */}
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('templates.layout.title')}</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
          <ReadOnlyField label={t('templates.layout.aspectRatio')} value={props.aspectRatio} />
          <ReadOnlyField label={t('templates.layout.faceTracking')}>
            <StatusDot enabled={props.faceTracking} />
          </ReadOnlyField>
          <ReadOnlyField label={t('templates.layout.layouts')}>
            <div className="flex gap-1 flex-wrap">
              {props.selectedLayouts.map((lo) => (
                <Badge key={lo} variant="secondary" className="text-[10px] capitalize px-1.5 py-0">{lo}</Badge>
              ))}
            </div>
          </ReadOnlyField>
        </div>
      </div>

      {/* Captions */}
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <LetterText className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('templates.caption.title')}</h4>
          </div>
          <StatusDot enabled={props.captionEnabled} />
        </div>
        {props.captionEnabled && (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              <ReadOnlyField label={t('templates.caption.preset')} value={props.preset} capitalize />
              <ReadOnlyField label={t('templates.caption.animation')} value={props.animation} capitalize />
              <ReadOnlyField label={t('templates.caption.position')} value={props.position} capitalize />
              <ReadOnlyField label={t('templates.caption.captionsPerPage')} value={props.captionsPerPage} capitalize />
              <ReadOnlyField label={t('templates.caption.font')}>
                <span className="text-sm font-medium" style={{ fontFamily: props.fontFamily }}>{props.fontFamily}</span>
                <span className="text-xs text-muted-foreground ml-1">{props.fontSize}px</span>
              </ReadOnlyField>
              <ReadOnlyField label={t('templates.caption.style')}>
                {styleLabels.length > 0 ? (
                  <div className="flex gap-1">
                    {styleLabels.map((s) => (
                      <span key={s} className={`inline-flex items-center justify-center h-5 w-5 rounded bg-muted text-[10px] font-semibold ${
                        s === 'I' ? 'italic' : s === 'U' ? 'underline' : ''
                      }`}>{s}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </ReadOnlyField>
            </div>

            <Separator className="!my-2" />

            {/* Colors row */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
              <ReadOnlyField label={t('templates.caption.fontColor')}>
                <ReadOnlyColor value={props.fontColor} />
              </ReadOnlyField>
              <ReadOnlyField label={t('templates.caption.highlightColor')}>
                <ReadOnlyColor value={props.highlightColor} />
              </ReadOnlyField>
              {props.outlineEnabled && (
                <ReadOnlyField label={t('templates.caption.outline')}>
                  <div className="flex items-center gap-1.5">
                    <ReadOnlyColor value={props.outlineColor} />
                    <span className="text-xs text-muted-foreground">{props.outlineWidth}px</span>
                  </div>
                </ReadOnlyField>
              )}
              {props.shadowEnabled && (
                <ReadOnlyField label={t('templates.caption.shadow')}>
                  <div className="flex items-center gap-1.5">
                    <ReadOnlyColor value={props.shadowColor} />
                    <span className="text-xs text-muted-foreground">{props.shadowBlur}px</span>
                  </div>
                </ReadOnlyField>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-4 pt-1">
              <ReadOnlyField label={t('templates.caption.removePunctuation')}>
                <StatusDot enabled={props.removePunctuation} />
              </ReadOnlyField>
              <ReadOnlyField label={t('templates.caption.removeProfanity')}>
                <StatusDot enabled={props.removeProfanity} />
              </ReadOnlyField>
            </div>
          </>
        )}
      </div>

      {/* Hook + Logo compact row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MonitorPlay className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('templates.hook.title')}</h4>
            </div>
            <StatusDot enabled={props.hookEnabled} />
          </div>
        </div>

        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('templates.logo.title')}</h4>
            </div>
            <StatusDot enabled={props.logoEnabled} />
          </div>
          {props.logoEnabled && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <ReadOnlyField label={t('templates.logo.scale')} value={`${props.logoScale}%`} />
              <ReadOnlyField label={t('templates.logo.opacity')} value={`${props.logoOpacity}%`} />
              {props.alternatePosition && (
                <ReadOnlyField label={t('templates.logo.positions')}>
                  <div className="flex gap-1 flex-wrap">
                    {props.logoPositions.map((pos) => (
                      <Badge key={pos} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {t(`templates.logo.pos.${pos}`)}
                      </Badge>
                    ))}
                  </div>
                </ReadOnlyField>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ──────────────── Shared Components ──────────────── */

function SectionHeader({ icon: Icon, label }: { icon: typeof Layers; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</h4>
    </div>
  )
}

function ClickableRow({ label, editing, onToggle, children }: { label: string; editing: boolean; onToggle?: () => void; children: React.ReactNode }) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-colors ${
        editing && onToggle ? 'cursor-pointer hover:bg-muted/50' : ''
      }`}
    >
      <span className="text-sm">{label}</span>
      <div className="flex items-center">{children}</div>
    </div>
  )
}



function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void; editing?: boolean }) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <label className="relative h-8 w-8 shrink-0 cursor-pointer rounded-md border overflow-hidden" style={{ backgroundColor: value }}>
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
        </label>
        <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
      </div>
    </div>
  )
}

function ReadOnlyField({ label, value, capitalize, children }: { label: string; value?: string; capitalize?: boolean; children?: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      {children ?? (
        <p className={`text-sm font-medium ${capitalize ? 'capitalize' : ''}`}>{value}</p>
      )}
    </div>
  )
}

function ReadOnlyColor({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-4 w-4 rounded-sm border shrink-0" style={{ backgroundColor: value }} />
      <span className="text-xs font-mono text-muted-foreground">{value}</span>
    </div>
  )
}

function StatusDot({ enabled }: { enabled: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${enabled ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
      <span className={`text-xs ${enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
        {enabled ? 'On' : 'Off'}
      </span>
    </div>
  )
}
