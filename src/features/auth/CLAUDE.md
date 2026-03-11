# Feature: Auth

Autenticação e perfil de administradores do backoffice.

## Estado Atual: MOCK
`useAuth().login()` usa `MOCK_ADMIN` hardcoded. Quando integrar API real:
1. Substituir `queryFn` em `use-auth.ts`
2. Manter store + guards inalterados

## Componentes
- `LoginForm` — formulário de login (rota pública `/login`)
- `AdminProfilePage` — página de perfil com 4 tabs
- `ProfileGeneralTab` — nome, email, avatar
- `ProfileSecurityTab` — troca de senha, MFA
- `ProfileActivityTab` — histórico de login/ações
- `ProfilePreferencesTab` — tema, idioma, notificações
- `PermissionGuard` — wrapper que esconde UI sem permissão

## Store (`useAuthStore`)
```ts
// Zustand + persist
interface AuthState {
  admin: AdminAccount | null
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  setAdmin(admin): void
  setStatus(status): void
  clearAuth(): void
}
```
Persistência: localStorage key `auth-store`. Apenas para UX (evitar flicker) — não é fonte de verdade de segurança.

## Permissões
```ts
// lib/permissions.ts
PERMISSIONS.{USERS_READ, TEAMS_READ, FINANCE_READ, METRICS_READ, ADMIN_READ, AUDIT_READ, ...}
ROLE_PERMISSIONS['super_admin'] = todos os PERMISSIONS
```

## Hooks
```ts
useAuth()                    → { admin, status, login, logout }
useHasPermission(perm)       → boolean
useHasAnyPermission([perms]) → boolean
useProfileSessions()         → ProfileSession[]
useProfileActivity()         → ProfileActivityEvent[]
```

## Route Guard
`src/routes/_app.tsx` usa `beforeLoad` que lê `useAuthStore.getState()` — redireciona
para `/login` se `status !== 'authenticated'`. Não usar hooks aqui, usar `.getState()`.

## Types
```ts
AdminAccount   // { id, name, email, role: AdminRole, mfaEnabled, lastLoginAt }
AuthStatus     // 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
AdminRole      // 'super_admin' | 'finance_admin' | 'finance_viewer' | 'support' | 'viewer'
```
