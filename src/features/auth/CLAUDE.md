# Feature: Auth

Autenticação e perfil de administradores do backoffice.

## Estado Atual: INTEGRADO COM API
Integrado com `vdclip-backoffice-api` (FastAPI). Autenticação via JWT + refresh token (httpOnly cookie).

## Auth Flow
1. **Login** → `POST /api/auth/login` → retorna `TokenResponse`, `MfaTokenResponse` ou `PasswordChangeRequiredResponse`
1b. **Password Change (se necessario)** → `POST /api/auth/force-change-password` → retorna `TokenResponse` ou `MfaTokenResponse`
2. **MFA (se habilitado)** → `POST /api/auth/mfa/verify` → retorna `TokenResponse`
3. **Profile** → `GET /api/auth/me` → retorna `AdminProfileResponse`
4. **Session restore** → `POST /api/auth/refresh` (cookie httpOnly) → novo access token
5. **MFA Setup Wall** → `POST /api/auth/mfa/setup` + `POST /api/auth/mfa/enable`

## Componentes
- `LoginForm` — formulário de login com email/senha + step password change + step MFA (rota pública `/login`)
- `MfaSetupWall` — tela obrigatória de setup 2FA (chama API real para QR + verificação)
- `AdminProfilePage` — página de perfil com 4 tabs
- `ProfileGeneralTab` — nome, email, avatar
- `ProfileSecurityTab` — troca de senha (API), MFA enable/disable (API), sessões (API)
- `ProfileActivityTab` — histórico de login/ações (mock — sem endpoint backend)
- `ProfilePreferencesTab` — tema, idioma, notificações
- `PermissionGuard` — wrapper que esconde UI sem permissão

## Store (`useAuthStore`)
```ts
interface AuthState {
  admin: AdminAccount | null
  permissions: Set<string>
  status: AuthStatus
  _token: string | null      // JWT access token (30min)
  _mfaToken: string | null   // temporary MFA challenge token (5min)
  _passwordChangeToken: string | null  // temporary password change token (5min)
  setPasswordChangeToken(token): void
  setAdmin(admin, permissions?): void
  setToken(token): void
  setMfaToken(token): void
  clearAuth(): void
  setStatus(status): void
  completeMfaSetup(): void
}
```
NÃO persistido em localStorage — sessão restaurada via refresh token cookie no bootstrap (`main.tsx`).

## Auth API (`lib/auth-api.ts`)
```ts
authApi.login(email, password)        → LoginResponse
authApi.verifyMfa(mfaToken, code)     → TokenResponse
authApi.refresh()                     → TokenResponse
authApi.logout()                      → void
authApi.logoutAll()                   → void
authApi.getProfile(token?)            → AdminProfileResponse
authApi.changePassword(current, new)  → void
authApi.getSessions()                 → { sessions: SessionResponse[] }
authApi.revokeSession(sessionId)      → void
authApi.setupMfa()                    → MfaSetupResponse
authApi.enableMfa(code)               → void
authApi.disableMfa(code)              → void
authApi.forceChangePassword(token, newPassword) → LoginResponse
```

## API Client (`lib/api-client.ts`)
- Usa `credentials: 'include'` para enviar cookies
- Intercepta 401 → tenta refresh → retry (ou logout)
- Deduplica refresh requests concorrentes

## Permissões
```ts
// lib/permissions.ts
PERMISSIONS.{USERS_READ, TEAMS_READ, FINANCE_READ, METRICS_READ, ADMIN_READ, AUDIT_READ, ...}
ROLE_PERMISSIONS['super_admin'] = todos os PERMISSIONS
```
Permissões podem vir do backend (`setAdmin(admin, permissions)`) ou serem derivadas do role.

## Hooks
```ts
useAuth()                    → { admin, status, login(email, pwd), verifyMfa(code), forceChangePassword(newPassword), logout }
restoreSession()             → Promise<boolean> (chamado no bootstrap)
useHasPermission(perm)       → boolean
useHasAnyPermission([perms]) → boolean
useProfileSessions()         → ProfileSession[] (API real)
useRevokeSession()           → mutation
useProfileActivity()         → ProfileActivityEvent[] (mock)
```

## Route Guard
`src/routes/_app.tsx` usa `beforeLoad` que lê `useAuthStore.getState()` — redireciona
para `/login` se `status !== 'authenticated'`. Não usar hooks aqui, usar `.getState()`.

## MFA Setup Wall
`_app.tsx` verifica `admin.mfaEnabled === false` → mostra `MfaSetupWall`.
Wall chama `authApi.setupMfa()` para gerar QR e `authApi.enableMfa(code)` para ativar.
Dev bypass disponível em `import.meta.env.DEV`.

## Types
```ts
AdminAccount           // { id, name, email, role, avatar?, mfaEnabled, lastLoginAt?, createdAt? }
AuthStatus             // 'authenticated' | 'unauthenticated' | 'loading' | 'mfa_required' | 'password_change_required'
AdminRole              // 'super_admin' | 'finance_admin' | 'finance_viewer' | 'support' | 'viewer'
TokenResponse          // { access_token, token_type, expires_in }
MfaTokenResponse       // { mfa_required, mfa_token }
PasswordChangeRequiredResponse // { password_change_required, password_change_token }
AdminProfileResponse   // { id, email, first_name, last_name?, picture_url, has_mfa_enabled, roles[], permissions[] }
MfaSetupResponse       // { secret, qr_code, provisioning_uri }
SessionResponse        // { id, ip_address, city, region, country, user_agent, last_activity_at, created_at }
```
