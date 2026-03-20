import type { FinancialNote, FinancialNoteEntityType } from '../types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface ApiNote {
  id: string
  entity_type: string
  entity_id: string
  content: string
  created_by: { id: string; name: string; email: string }
  created_at: string
  updated_at: string
}

const noteKeys = {
  all: ['financial-notes'] as const,
  forEntity: (entityType: FinancialNoteEntityType, entityId: string) =>
    [...noteKeys.all, entityType, entityId] as const,
}

export function useFinancialNotes(entityType: FinancialNoteEntityType, entityId: string) {
  return useQuery({
    queryKey: noteKeys.forEntity(entityType, entityId),
    queryFn: async () => {
      const rows = await apiClient.get<ApiNote[]>('/financial-notes', {
        entity_type: entityType,
        entity_id: entityId,
      })
      return rows.map((row): FinancialNote => ({
        ...row,
        entityType: row.entityType as FinancialNoteEntityType,
      }))
    },
    enabled: Boolean(entityId),
  })
}

export function useCreateFinancialNote(entityType: FinancialNoteEntityType, entityId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (content: string) => {
      const row = await apiClient.post<ApiNote>('/financial-notes', {
        entityType,
        entityId,
        content,
      })
      return {
        ...row,
        entityType: (row as unknown as Record<string, unknown>).entityType as FinancialNoteEntityType,
      } as FinancialNote
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.forEntity(entityType, entityId) })
    },
  })
}

export function useDeleteFinancialNote(entityType: FinancialNoteEntityType, entityId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (noteId: string) => {
      await apiClient.delete(`/financial-notes/${noteId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.forEntity(entityType, entityId) })
    },
  })
}
