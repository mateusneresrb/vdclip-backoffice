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
      aspectRatio: String(layout?.aspectRatio ?? '9:16') as TemplateSettings['layout']['aspectRatio'],
      faceTracking: Boolean(layout?.faceTracking ?? false),
      layouts: (Array.isArray(layout?.layouts) ? layout.layouts.map((l: string) => l.toLowerCase()) : []) as TemplateSettings['layout']['layouts'],
    },
    caption: {
      enabled: Boolean(caption?.enabled ?? false),
      animation: String(caption?.animation ?? 'none') as TemplateCaptionSettings['animation'],
      position: String(caption?.position ?? 'bottom') as TemplateCaptionSettings['position'],
      captionsPerPage: String(caption?.captionsPerPage ?? caption?.format ?? 'auto') as TemplateCaptionSettings['captionsPerPage'],
      fontFamily: String(caption?.fontFamily ?? 'Inter'),
      fontSize: Number(caption?.fontSize ?? 14),
      bold: Boolean(caption?.bold ?? false),
      italic: Boolean(caption?.italic ?? false),
      underline: Boolean(caption?.underline ?? false),
      fontColor: String(caption?.fontColor ?? caption?.textColor ?? '#FFFFFF'),
      highlightColor: String(caption?.highlightColor ?? '#FFFFFF'),
      outlineEnabled: Boolean(caption?.outlineEnabled ?? (Number(caption?.strokeThickness ?? caption?.outlineWidth ?? 0) > 0)),
      outlineColor: String(caption?.outlineColor ?? caption?.strokeColor ?? '#000000'),
      outlineWidth: Number(caption?.outlineWidth ?? caption?.strokeThickness ?? 0),
      shadowEnabled: Boolean(caption?.shadowEnabled ?? (Number(caption?.shadowBlur ?? 0) > 0)),
      shadowColor: String(caption?.shadowColor ?? '#000000'),
      shadowBlur: Number(caption?.shadowBlur ?? 0),
      removePunctuation: Boolean(caption?.removePunctuation ?? false),
      removeProfanity: Boolean(caption?.removeProfanity ?? false),
      uppercaseAll: Boolean(caption?.uppercase ?? caption?.uppercaseAll ?? false),
      presetModel: caption?.presetModel ? String(caption.presetModel) : undefined,
      format: caption?.format ? String(caption.format) : undefined,
    } as TemplateCaptionSettings,
    hook: {
      enabled: Boolean(hook?.enabled ?? false),
    },
    logo: {
      enabled: Boolean(logo?.enabled ?? false),
      imageUrl: logo?.imageUrl ? String(logo.imageUrl) : undefined,
      scale: Number(logo?.scale ?? 1),
      opacity: Number(logo?.opacity ?? 1),
      alternatePosition: Boolean(logo?.alternatePosition ?? false),
      positions: (Array.isArray(logo?.positions) ? logo.positions : []) as TemplateSettings['logo']['positions'],
    },
  }
}

function mapTemplate(t: Record<string, unknown>): AdminTemplate {
  return {
    id: String(t.id ?? ''),
    name: String(t.name ?? ''),
    isDefault: Boolean(t.isDefault ?? false),
    aspectRatio: (t.aspectRatio ?? '9:16') as AdminTemplate['aspectRatio'],
    settings: mapSettings(t.settings as Record<string, unknown> | null),
    createdAt: String(t.createdAt ?? ''),
    updatedAt: String(t.updatedAt ?? ''),
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
            aspectRatio: settings.layout.aspectRatio,
            faceTracking: settings.layout.faceTracking,
            layouts: settings.layout.layouts,
          },
          caption: {
            enabled: settings.caption.enabled,
            animation: settings.caption.animation,
            position: settings.caption.position,
            captionsPerPage: settings.caption.captionsPerPage,
            fontFamily: settings.caption.fontFamily,
            fontSize: settings.caption.fontSize,
            bold: settings.caption.bold,
            italic: settings.caption.italic,
            underline: settings.caption.underline,
            fontColor: settings.caption.fontColor,
            highlightColor: settings.caption.highlightColor,
            outlineEnabled: settings.caption.outlineEnabled,
            outlineColor: settings.caption.outlineColor,
            outlineWidth: settings.caption.outlineWidth,
            shadowEnabled: settings.caption.shadowEnabled,
            shadowColor: settings.caption.shadowColor,
            shadowBlur: settings.caption.shadowBlur,
            removePunctuation: settings.caption.removePunctuation,
            removeProfanity: settings.caption.removeProfanity,
            uppercase: settings.caption.uppercaseAll,
          },
          hook: { enabled: settings.hook.enabled },
          logo: {
            enabled: settings.logo.enabled,
            scale: settings.logo.scale,
            opacity: settings.logo.opacity,
            alternatePosition: settings.logo.alternatePosition,
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
        userId: params.userId,
        teamId: params.teamId,
      })
      return mapTemplate(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTemplateKeys.all })
    },
  })
}
