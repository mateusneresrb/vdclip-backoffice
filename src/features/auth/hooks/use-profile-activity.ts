import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/features/auth/stores/auth-store'

export interface ProfileActivityEvent {
  id: string
  type: string
  description: string
  createdAt: string
}

const profileActivityKeys = {
  all: ['profile-activity'] as const,
}

function actionToType(action: string): string {
  if (action.includes('login') || action.includes('auth')) return 'login'
  if (action.includes('password')) return 'password_changed'
  if (action.includes('mfa')) return 'mfa_enabled'
  if (action.includes('oauth')) return 'oauth_connected'
  if (action.includes('session')) return 'session_revoked'
  return action
}

function actionToDescription(action: string, entityType?: string): string {
  const descriptions: Record<string, string> = {
    'admin.created': 'Conta de administrador criada.',
    'admin.role_changed': 'Cargo do administrador alterado.',
    'admin.permissions_updated': 'Permissoes do administrador atualizadas.',
    'admin.deactivated': 'Conta de administrador desativada.',
    'admin.session_revoked': 'Sessao de administrador revogada.',
    'user.status_changed': 'Status de usuario alterado.',
    'user.plan_changed': 'Plano de usuario alterado.',
    'user.credit_added': 'Creditos adicionados a usuario.',
    'user.deleted': 'Usuario excluido.',
    'user.refund_issued': 'Reembolso emitido.',
    'user.account_unlocked': 'Conta de usuario desbloqueada.',
    'team.settings_updated': 'Configuracoes do time atualizadas.',
    'team.member_removed': 'Membro removido do time.',
    'provider.toggled': 'Provedor ativado/desativado.',
    'provider.config_updated': 'Configuracao do provedor atualizada.',
    'subscription.cancelled': 'Assinatura cancelada.',
    'subscription.extended': 'Assinatura estendida.',
    'subscription.reactivated': 'Assinatura reativada.',
  }
  return descriptions[action] ?? `Acao realizada: ${action}${entityType ? ` em ${entityType}` : ''}`
}

function mapAuditToActivity(data: Record<string, unknown>): ProfileActivityEvent {
  const action = String(data.action ?? '')
  const entityType = data.entity_type as string | undefined
  return {
    id: String(data.id),
    type: actionToType(action),
    description: actionToDescription(action, entityType),
    createdAt: String(data.created_at ?? data.createdAt ?? ''),
  }
}

export function useProfileActivity() {
  const adminId = useAuthStore((s) => s.admin?.id)

  return useQuery({
    queryKey: profileActivityKeys.all,
    queryFn: async () => {
      if (!adminId) return []

      const data = await apiClient.get<
        Record<string, unknown>[]
        | { items: Record<string, unknown>[] }
      >('/audit-logs', {
        admin_user_id: adminId,
        per_page: 50,
        page: 1,
      })
      const items = Array.isArray(data) ? data : (data.items ?? [])
      return items.map(mapAuditToActivity)
    },
    enabled: !!adminId,
  })
}
