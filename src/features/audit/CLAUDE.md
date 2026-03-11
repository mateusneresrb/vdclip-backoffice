# Feature: Audit

**Route**: `/audit?tab=audit|auth` | **Permission**: `AUDIT_READ`

Logs de auditoria e autenticação do backoffice.

## Tabs
| Tab | Conteúdo |
|-----|----------|
| `audit` | Ações realizadas por admins (quem fez o quê, quando) |
| `auth` | Logs de autenticação (logins, falhas, MFA) |

## Hooks
```ts
useAuditLogs(filters)   → AuditLog[]
useAuthLogs(filters)    → AuthLog[]
```

## Types
```ts
AuditLog  // { id, adminId, adminName, action, resource, resourceId, metadata, createdAt }
AuthLog   // { id, adminId, email, action: 'login'|'logout'|'failed', ip, userAgent, createdAt }
```
