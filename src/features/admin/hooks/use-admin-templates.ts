import type { AdminTemplate } from '../types'

import { useQuery } from '@tanstack/react-query'

const defaultSettings = {
  layout: {
    aspectRatio: 'auto' as const,
    faceTracking: true,
    layouts: ['fit' as const],
  },
  caption: {
    enabled: true,
    presetModel: 'karaoke',
    animation: 'karaoke' as const,
    position: 'bottom' as const,
    captionsPerPage: 'auto' as const,
    fontFamily: 'Inter',
    fontSize: 24,
    bold: true,
    italic: false,
    underline: false,
    fontColor: '#FFFFFF',
    highlightColor: '#FACC15',
    outlineEnabled: true,
    outlineColor: '#000000',
    outlineWidth: 2,
    shadowEnabled: false,
    shadowColor: '#000000',
    shadowBlur: 4,
    removePunctuation: false,
    removeProfanity: false,
    uppercaseAll: true,
  },
  hook: { enabled: false },
  logo: { enabled: false, imageUrl: null, scale: 30, opacity: 100, alternatePosition: false, positions: ['top-left' as const, 'top-right' as const] },
}

const mockUserTemplates: Record<string, AdminTemplate[]> = {
  '1': [
    {
      id: 'tpl-1',
      name: 'Karaoke Default',
      isDefault: true,
      aspectRatio: '9:16',
      settings: { ...defaultSettings },
      createdAt: '2025-06-10',
      updatedAt: '2026-02-15',
    },
    {
      id: 'tpl-2',
      name: 'Clean Horizontal',
      isDefault: false,
      aspectRatio: '16:9',
      settings: {
        ...defaultSettings,
        layout: { aspectRatio: '16:9', faceTracking: false, layouts: ['fill'] },
        caption: { ...defaultSettings.caption, animation: 'none', highlightColor: '#FFFFFF', outlineWidth: 1 },
      },
      createdAt: '2025-08-20',
      updatedAt: '2026-01-10',
    },
    {
      id: 'tpl-3',
      name: 'Bounce Shorts',
      isDefault: false,
      aspectRatio: '9:16',
      settings: {
        ...defaultSettings,
        caption: { ...defaultSettings.caption, animation: 'bounce', highlightColor: '#F97316', fontSize: 28 },
        hook: { enabled: true },
      },
      createdAt: '2025-12-01',
      updatedAt: '2026-02-28',
    },
  ],
  '2': [
    {
      id: 'tpl-4',
      name: 'Agency Standard',
      isDefault: true,
      aspectRatio: '9:16',
      settings: { ...defaultSettings },
      createdAt: '2024-12-15',
      updatedAt: '2026-03-01',
    },
    {
      id: 'tpl-5',
      name: 'Neon Style',
      isDefault: false,
      aspectRatio: '9:16',
      settings: {
        ...defaultSettings,
        caption: {
          ...defaultSettings.caption,
          animation: 'underline',
          fontColor: '#EC4899',
          highlightColor: '#EC4899',
          outlineWidth: 0,
          shadowColor: '#EC4899',
          shadowBlur: 12,
        },
      },
      createdAt: '2025-05-20',
      updatedAt: '2026-02-10',
    },
  ],
  '7': [
    {
      id: 'tpl-6',
      name: 'Kim Productions Default',
      isDefault: true,
      aspectRatio: 'auto',
      settings: { ...defaultSettings },
      createdAt: '2024-09-01',
      updatedAt: '2026-03-02',
    },
    {
      id: 'tpl-7',
      name: 'Word Box Style',
      isDefault: false,
      aspectRatio: '9:16',
      settings: {
        ...defaultSettings,
        caption: { ...defaultSettings.caption, animation: 'word-box', highlightColor: '#8B5CF6', fontSize: 32 },
      },
      createdAt: '2025-03-10',
      updatedAt: '2026-01-20',
    },
    {
      id: 'tpl-8',
      name: 'Split Layout',
      isDefault: false,
      aspectRatio: '9:16',
      settings: {
        ...defaultSettings,
        layout: { aspectRatio: '9:16', faceTracking: true, layouts: ['split'] },
      },
      createdAt: '2025-07-15',
      updatedAt: '2025-12-05',
    },
    {
      id: 'tpl-9',
      name: 'Square Posts',
      isDefault: false,
      aspectRatio: '1:1',
      settings: {
        ...defaultSettings,
        layout: { aspectRatio: '1:1', faceTracking: false, layouts: ['fit'] },
        caption: { ...defaultSettings.caption, animation: 'scale', position: 'middle', fontSize: 20 },
      },
      createdAt: '2025-10-08',
      updatedAt: '2026-02-18',
    },
  ],
}

const mockTeamTemplates: Record<string, AdminTemplate[]> = {
  t1: [
    {
      id: 'ttpl-1',
      name: 'Studio Template',
      isDefault: true,
      aspectRatio: '9:16',
      settings: { ...defaultSettings },
      createdAt: '2025-04-10',
      updatedAt: '2026-02-20',
    },
  ],
  t3: [
    {
      id: 'ttpl-2',
      name: 'Agency Vertical',
      isDefault: true,
      aspectRatio: '9:16',
      settings: { ...defaultSettings },
      createdAt: '2025-01-05',
      updatedAt: '2026-03-01',
    },
    {
      id: 'ttpl-3',
      name: 'Agency Horizontal',
      isDefault: false,
      aspectRatio: '16:9',
      settings: {
        ...defaultSettings,
        layout: { aspectRatio: '16:9', faceTracking: true, layouts: ['fill'] },
      },
      createdAt: '2025-02-18',
      updatedAt: '2026-02-28',
    },
  ],
  t5: [
    {
      id: 'ttpl-4',
      name: 'Kim Prod Standard',
      isDefault: true,
      aspectRatio: '9:16',
      settings: { ...defaultSettings, hook: { enabled: true } },
      createdAt: '2024-10-15',
      updatedAt: '2026-03-02',
    },
    {
      id: 'ttpl-5',
      name: 'Kim Prod Clean',
      isDefault: false,
      aspectRatio: '9:16',
      settings: {
        ...defaultSettings,
        caption: { ...defaultSettings.caption, animation: 'none', outlineWidth: 1, uppercaseAll: false },
      },
      createdAt: '2025-06-01',
      updatedAt: '2026-01-15',
    },
    {
      id: 'ttpl-6',
      name: 'Kim Prod Square',
      isDefault: false,
      aspectRatio: '1:1',
      settings: {
        ...defaultSettings,
        layout: { aspectRatio: '1:1', faceTracking: false, layouts: ['fit'] },
        logo: { enabled: true, imageUrl: '/logo.png', scale: 25, opacity: 80, alternatePosition: true, positions: ['top-left', 'bottom-right'] },
      },
      createdAt: '2025-09-20',
      updatedAt: '2026-02-10',
    },
  ],
}

const adminTemplateKeys = {
  all: ['admin-templates'] as const,
  user: (userId: string) => [...adminTemplateKeys.all, 'user', userId] as const,
  team: (teamId: string) => [...adminTemplateKeys.all, 'team', teamId] as const,
}

export function useAdminUserTemplates(userId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminTemplateKeys.user(userId),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return mockUserTemplates[userId] ?? []
    },
    enabled,
  })
}

export function useAdminTeamTemplates(teamId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminTemplateKeys.team(teamId),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return mockTeamTemplates[teamId] ?? []
    },
    enabled,
  })
}
