# Feature: Audit

**Route**: `/audit?tab=audit|auth` | **Permission**: `AUDIT_READ`

Logs de auditoria do backoffice e logs de autenticacao da plataforma.

## Tabs
| Tab | Conteudo | Fonte |
|-----|----------|-------|
| `audit` | Acoes realizadas por admins (quem fez o que, quando) | `backoffice.admin_audit_logs` via `GET /api/audit-logs` |
| `auth` | Logs de autenticacao dos **usuarios da plataforma** (logins, signups) | `core.auth_events` via `GET /api/platform/auth-logs` |

**Nota:** Os logs de login dos admins do backoffice ficam em `backoffice.admin_login_attempts` (usados internamente para lockout). A tab `auth` mostra logins dos usuarios finais.

## Hooks
```ts
useAuditLogs(filters: AuditLogFilters)  → AuditLogEntry[]   // GET /audit-logs
useAdminAuthLogs(search)                → AuthLogEntry[]     // GET /platform/auth-logs (re-export de @/features/admin)
```

## Types
```ts
AuditLogEntry {
  id, adminId, adminEmail, adminRole,  // admin_role resolvido via subquery no backend
  action, resource, resourceId,
  oldValues, newValues,                // JSON com valores anteriores/novos (campos em camelCase apos conversao)
  ipAddress, userAgent, createdAt
}

AuthLogEntry {
  id, userId, userName, userEmail, userSource,
  eventType, ipAddress, userAgent, metadata, createdAt
}
```

## Detalhes de Implementacao

### Audit Logs Tab
- Filtros: busca, acao, recurso, admin, periodo (server-side via query params)
- DiffView: tabela 3 colunas (Campo, Valores Anteriores, Novos Valores)
- Campos formatados: camelCase convertido para human-readable via `formatFieldName()` (ex: `mfaSecretGenerated` → "MFA Secret Generated")
- Role do admin exibido ao lado do email (resolvido pelo backend via `admin_user_roles → admin_roles`)
- Exportar CSV: ate 100 itens

### Auth Logs Tab
- Fonte: `core.auth_events` (tabela particionada por mes)
- Filtros: busca (server-side), tipo de evento e periodo (client-side)
- Summary bar: total, logins sucesso, falhas, bloqueios
- Metadata expansivel por registro
