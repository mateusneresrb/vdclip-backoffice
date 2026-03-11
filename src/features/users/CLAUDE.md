# Feature: Users

**Route**: `/users` e `/users/$userId` | **Permission**: `USERS_READ` / `USERS_WRITE`

Gestão de usuários do produto VDClip.

## Componentes
- `user-search.tsx` — página de listagem com busca, filtros por plano/status, paginação
- `user-detail.tsx` — página de detalhe do usuário com 5 tabs
- `user-detail-header.tsx` — header da página de detalhe (nome, plano, status, ações)
- `user-overview-tab.tsx` — dados gerais: plano, créditos, packages, afiliado
- `user-teams-tab.tsx` — times que o usuário pertence
- `user-media-tab.tsx` — projetos de mídia criados pelo usuário
- `user-social-tab.tsx` — conexões sociais (YouTube, Instagram, TikTok)
- `user-activity-tab.tsx` — histórico de atividades (subscrição, login, etc.)

## Hooks

```ts
// Queries (re-exportam de @/features/admin/hooks)
useAdminUsers(filters)             → { users: AdminUser[], total, page }
useAdminUser(userId)               → AdminUser

// Específicos do detalhe
useUserActivity(userId)            → UserActivityEvent[]
useUserMedia(userId)               → Media[]
useUserSocialConnections(userId)   → UserSocialConnection[]
useUserTemplates(userId)           → Template[]

// Mutations
useUserMutations()  → {
  updateStatus: mutation({ userId, status })  // otimista: atualiza cache local + toast
  deleteUser: mutation(userId)                // remove do cache + navega para /users
}
```

## Types (de `@/features/admin/types`)
```ts
AdminUser      // { id, name, email, status, plan, planProvider, credits, creditPackages, companyId?, companyName?, ... }
UserStatus     // 'active' | 'inactive' | 'suspended'
UserPlan       // 'free' | 'lite' | 'premium' | 'ultimate'
PlanProvider   // 'paddle' | 'pix' | 'internal'
SocialProvider // 'google' | 'github' | 'discord'
CreditType     // 'plan_cycle' | 'purchased' | 'promotional' | 'bonus' | 'adjustment'
CreditPackage  // { id, type, amount, used, startDate, expiresAt }
```

## Rota de detalhe
`/users/$userId` — parâmetro `$userId` via TanStack Router.
Componente `user-detail.tsx` busca com `useAdminUser(userId)` do hook `use-admin-users.ts`.
