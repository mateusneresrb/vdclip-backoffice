import type { AdminTemplate, TemplateCaptionSettings, TemplateSettings } from '../types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

export const adminTemplateKeys = {
  all: ['admin-templates'] as const,
  user: (userId: string) => [...adminTemplateKeys.all, 'user', userId] as const,
  team: (teamId: string) => [...adminTemplateKeys.all, 'team', teamId] as const,
}

function mapSettings(raw: Record<string, unknown> | null | undefined): TemplateSettings {
  if (!raw) {
    return {
      layout: { aspectRatio: '9:16', faceTracking: false, layouts: [] },
      caption: { enabled: false, animation: 'none', position: 'bottom', captionsPerPage: 'auto', fontFamily: 'Inter', fontSize: 14, bold: false, italic: false, underline: false, fontColor: '#FFFFFF', highlightColor: '#FFFFFF', outlineEnabled: false, outlineColor: '#000000', outlineWidth: 0, shadowEnabled: false, shadowColor: '#000000', shadowBlur: 0, removePunctuation: false, removeProfanity: false, uppercaseAll: false } as TemplateCaptionSettings,
      hook: { enabled: false },
      logo: { enabled: false, scale: 1, opacity: 1, alternatePosition: false, positions: [] },
    }
  }

  const layout = raw.layout as Record<string, unknown> | undefined
  const caption = raw.caption as Record<string, unknown> | undefined
  const hook = raw.hook as Record<string, unknown> | undefined
  const logo = raw.logo as Record<string, unknown> | undefined

  return {
    layout: {
      aspectRatio: String(layout?.aspect_ratio ?? layout?.aspectRatio ?? '9:16') as TemplateSettings['layout']['aspectRatio'],
      faceTracking: Boolean(layout?.face_tracking ?? layout?.faceTracking ?? false),
      layouts: (Array.isArray(layout?.layouts) ? layout.layouts.map((l: string) => l.toLowerCase()) : []) as TemplateSettings['layout']['layouts'],
    },
    caption: {
      enabled: Boolean(caption?.enabled ?? false),
      animation: String(caption?.animation ?? 'none') as TemplateCaptionSettings['animation'],
      position: String(caption?.position ?? 'bottom') as TemplateCaptionSettings['position'],
      captionsPerPage: String(caption?.captions_per_page ?? caption?.captionsPerPage ?? caption?.format ?? 'auto') as TemplateCaptionSettings['captionsPerPage'],
      fontFamily: String(caption?.font_family ?? caption?.fontFamily ?? 'Inter'),
      fontSize: Number(caption?.font_size ?? caption?.fontSize ?? 14),
      bold: Boolean(caption?.bold ?? false),
      italic: Boolean(caption?.italic ?? false),
      underline: Boolean(caption?.underline ?? false),
      fontColor: String(caption?.font_color ?? caption?.text_color ?? caption?.fontColor ?? '#FFFFFF'),
      highlightColor: String(caption?.highlight_color ?? caption?.highlightColor ?? '#FFFFFF'),
      outlineEnabled: Boolean(caption?.outline_enabled ?? caption?.outlineEnabled ?? (Number(caption?.stroke_thickness ?? caption?.outline_width ?? 0) > 0)),
      outlineColor: String(caption?.outline_color ?? caption?.stroke_color ?? caption?.outlineColor ?? '#000000'),
      outlineWidth: Number(caption?.outline_width ?? caption?.stroke_thickness ?? caption?.outlineWidth ?? 0),
      shadowEnabled: Boolean(caption?.shadow_enabled ?? caption?.shadowEnabled ?? (Number(caption?.shadow_blur ?? 0) > 0)),
      shadowColor: String(caption?.shadow_color ?? caption?.shadowColor ?? '#000000'),
      shadowBlur: Number(caption?.shadow_blur ?? caption?.shadowBlur ?? 0),
      removePunctuation: Boolean(caption?.remove_punctuation ?? caption?.removePunctuation ?? false),
      removeProfanity: Boolean(caption?.remove_profanity ?? caption?.removeProfanity ?? false),
      uppercaseAll: Boolean(caption?.uppercase_all ?? caption?.uppercase ?? caption?.uppercaseAll ?? false),
      presetModel: caption?.preset_model ? String(caption.preset_model) : undefined,
      format: caption?.format ? String(caption.format) : undefined,
    } as TemplateCaptionSettings,
    hook: {
      enabled: Boolean(hook?.enabled ?? false),
    },
    logo: {
      enabled: Boolean(logo?.enabled ?? false),
      imageUrl: logo?.image_url ? String(logo.image_url) : undefined,
      scale: Number(logo?.scale ?? 1),
      opacity: Number(logo?.opacity ?? 1),
      alternatePosition: Boolean(logo?.alternate_position ?? logo?.alternatePosition ?? false),
      positions: (Array.isArray(logo?.positions) ? logo.positions : []) as TemplateSettings['logo']['positions'],
    },
  }
}

function mapTemplate(t: Record<string, unknown>): AdminTemplate {
  return {
    id: String(t.id ?? ''),
    name: String(t.name ?? ''),
    isDefault: Boolean(t.is_default ?? t.isDefault ?? false),
    aspectRatio: (t.aspect_ratio ?? t.aspectRatio ?? '9:16') as AdminTemplate['aspectRatio'],
    settings: mapSettings(t.settings as Record<string, unknown> | null),
    createdAt: String(t.created_at ?? t.createdAt ?? ''),
    updatedAt: String(t.updated_at ?? t.updatedAt ?? ''),
  }
}

export function useAdminUserTemplates(userId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminTemplateKeys.user(userId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[]>(`/platform/users/${userId}/templates`)
      return data.map(mapTemplate)
    },
    enabled,
  })
}

export function useAdminTeamTemplates(teamId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminTemplateKeys.team(teamId),
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[]>(`/platform/teams/${teamId}/templates`)
      return data.map(mapTemplate)
    },
    enabled,
  })
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (templateId: string) => {
      await apiClient.delete(`/platform/templates/${templateId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTemplateKeys.all })
    },
  })
}

export function useSetDefaultTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (templateId: string) => {
      await apiClient.patch(`/platform/templates/${templateId}/set-default`, {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTemplateKeys.all })
    },
  })
}

export function useUpdateTemplateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ templateId, settings }: { templateId: string; settings: TemplateSettings }) => {
      await apiClient.patch(`/platform/templates/${templateId}/settings`, {
        settings: {
          layout: {
            aspect_ratio: settings.layout.aspectRatio,
            face_tracking: settings.layout.faceTracking,
            layouts: settings.layout.layouts,
          },
          caption: {
            enabled: settings.caption.enabled,
            animation: settings.caption.animation,
            position: settings.caption.position,
            captions_per_page: settings.caption.captionsPerPage,
            font_family: settings.caption.fontFamily,
            font_size: settings.caption.fontSize,
            bold: settings.caption.bold,
            italic: settings.caption.italic,
            underline: settings.caption.underline,
            font_color: settings.caption.fontColor,
            highlight_color: settings.caption.highlightColor,
            outline_enabled: settings.caption.outlineEnabled,
            outline_color: settings.caption.outlineColor,
            outline_width: settings.caption.outlineWidth,
            shadow_enabled: settings.caption.shadowEnabled,
            shadow_color: settings.caption.shadowColor,
            shadow_blur: settings.caption.shadowBlur,
            remove_punctuation: settings.caption.removePunctuation,
            remove_profanity: settings.caption.removeProfanity,
            uppercase: settings.caption.uppercaseAll,
          },
          hook: { enabled: settings.hook.enabled },
          logo: {
            enabled: settings.logo.enabled,
            scale: settings.logo.scale,
            opacity: settings.logo.opacity,
            alternate_position: settings.logo.alternatePosition,
            positions: settings.logo.positions,
          },
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTemplateKeys.all })
    },
  })
}

export function useCreateTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: { name: string; userId?: string; teamId?: string }) => {
      const data = await apiClient.post<Record<string, unknown>>('/platform/templates', {
        name: params.name,
        user_id: params.userId,
        team_id: params.teamId,
      })
      return mapTemplate(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTemplateKeys.all })
    },
  })
}
