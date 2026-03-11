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

function toFrontend(row: ApiNote): FinancialNote {
  return {
    id: row.id,
    entityType: row.entity_type as FinancialNoteEntityType,
    entityId: row.entity_id,
    content: row.content,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
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
      return rows.map(toFrontend)
    },
    enabled: Boolean(entityId),
  })
}

export function useCreateFinancialNote(entityType: FinancialNoteEntityType, entityId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (content: string) => {
      const row = await apiClient.post<ApiNote>('/financial-notes', {
        entity_type: entityType,
        entity_id: entityId,
        content,
      })
      return toFrontend(row)
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
