import type { FinancialNote, FinancialNoteEntityType } from '../types'
import { Loader2, MessageSquare, Send, Trash2, UserCircle } from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/features/auth/stores/auth-store'

import { cn } from '@/lib/utils'
import {
  useCreateFinancialNote,
  useDeleteFinancialNote,
  useFinancialNotes,
} from '../hooks/use-financial-notes'

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) 
return 'agora'
  if (minutes < 60) 
return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) 
return `há ${hours}h`
  const days = Math.floor(hours / 24)
  return `há ${days}d`
}

interface NoteItemProps {
  note: FinancialNote
  currentAdminId: string | undefined
  onDelete: (id: string) => void
  isDeleting: boolean
}

function NoteItem({ note, currentAdminId, onDelete, isDeleting }: NoteItemProps) {
  const isOwn = currentAdminId === note.createdBy.id
  const initials = note.createdBy.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex gap-3 py-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        {initials || <UserCircle className="size-4" />}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{note.createdBy.name}</span>
          <span className="text-xs text-muted-foreground">{formatRelativeTime(note.createdAt)}</span>
        </div>
        <p className="whitespace-pre-wrap text-sm text-foreground">{note.content}</p>
      </div>
      {isOwn && (
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
          disabled={isDeleting}
          onClick={() => onDelete(note.id)}
          aria-label="Excluir nota"
        >
          <Trash2 className="size-3.5" />
        </Button>
      )}
    </div>
  )
}

interface FinancialNotesProps {
  entityType: FinancialNoteEntityType
  entityId: string
  className?: string
}

export function FinancialNotes({ entityType, entityId, className }: FinancialNotesProps) {
  const { t } = useTranslation('admin')
  const [content, setContent] = useState('')
  const admin = useAuthStore((s) => s.admin)

  const { data: notes = [], isLoading } = useFinancialNotes(entityType, entityId)
  const create = useCreateFinancialNote(entityType, entityId)
  const remove = useDeleteFinancialNote(entityType, entityId)

  function handleSubmit() {
    const trimmed = content.trim()
    if (!trimmed || create.isPending) 
return
    create.mutate(trimmed, {
      onSuccess: () => setContent(''),
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <MessageSquare className="size-4" />
        {t('finance.notes.title', { defaultValue: 'Notas' })}
        {notes.length > 0 && (
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">{notes.length}</span>
        )}
      </div>

      {/* Note list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 py-2">
              <Skeleton className="size-7 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('finance.notes.empty', { defaultValue: 'Nenhuma nota ainda.' })}
        </p>
      ) : (
        <div className="divide-y">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              currentAdminId={admin?.id}
              onDelete={(id) => remove.mutate(id)}
              isDeleting={remove.isPending}
            />
          ))}
        </div>
      )}

      <Separator />

      {/* New note form */}
      <div className="space-y-2">
        <Textarea
          placeholder={t('finance.notes.placeholder', { defaultValue: 'Adicionar uma nota… (Ctrl+Enter para salvar)' })}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="resize-none text-sm"
        />
        <div className="flex items-center justify-between">
          {admin && (
            <p className="text-xs text-muted-foreground">
              {t('finance.notes.createdAs', { defaultValue: 'Registrado como' })}{' '}
              <span className="font-medium">{admin.name}</span>
            </p>
          )}
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim() || create.isPending}
            className="ml-auto gap-1.5"
          >
            {create.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
            {t('finance.notes.save', { defaultValue: 'Salvar' })}
          </Button>
        </div>
      </div>
    </div>
  )
}
