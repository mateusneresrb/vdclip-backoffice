# Feature: Admin Users (Administradores)

**Route**: `/admin` | **Permission**: `ADMIN_READ` / `ADMIN_WRITE`

Gerenciamento de contas, roles e sessões dos administradores do backoffice.

## Componentes

- `AdminUsersPage` — página com 3 tabs
- `AdminUsersListTab` — lista de contas de administrador
- `AdminRolesTab` — roles disponíveis e suas permissões
- `AdminSessionsTab` — sessões ativas do admin logado (API real via `GET /auth/sessions`)

## Tabs

```
users    → AdminUsersListTab    (padrão)
roles    → AdminRolesTab
sessions → AdminSessionsTab
```

Tab ativa via `?tab=` search param. Navegação via `useNavigate` + `useSearch({ from: '/_app/admin' })`.

## Hooks

```ts
useAdminAccounts()        → BackofficeAdmin[]
useAdminRoles()           → AdminRoleInfo[]
useAdminSessions()        → AdminSession[]        // GET /auth/sessions (admin logado)
useRevokeSession()        → mutation(sessionId)    // DELETE /auth/sessions/{id}
useRevokeOtherSessions()  → mutation(sessionIds[]) // revoga todas exceto a atual
```

## Types

```ts
BackofficeAdmin {
  id, name, email
  role: AdminRole          // 'super_admin' | 'finance_admin' | 'finance_viewer' | 'support' | 'viewer'
  avatar?: string
  mfaEnabled: boolean
  isActive: boolean
  lastLoginAt: string      // ISO 8601
  createdAt: string
}

AdminRoleInfo {
  id, name: AdminRole, displayName, description
  permissionCount: number
  adminCount: number
}

AdminSession {
  id, adminId, adminName
  ipAddress, userAgent
  city?, region?, country?
  lastActivityAt, createdAt: string
  isCurrent: boolean              // true para a sessão ativa no momento
}
```

## Roles e Permissões

| Role | Permissões |
|------|-----------|
| `super_admin` | Todas (17) |
| `finance_admin` | FINANCE_*, METRICS_READ, SUBSCRIPTIONS_* |
| `finance_viewer` | FINANCE_READ, METRICS_READ, SUBSCRIPTIONS_READ |
| `support` | USERS_READ/WRITE, TEAMS_READ, SUBSCRIPTIONS_READ |
| `viewer` | USERS_READ, TEAMS_READ, METRICS_READ |

## Nota

`AdminRole` e `ROLE_PERMISSIONS` definidos em `src/features/auth/lib/permissions.ts` — compartilhado com o sistema de auth.
