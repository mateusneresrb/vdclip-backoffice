# Routes (TanStack Router)

File-based routing. `routeTree.gen.ts` é auto-gerado — NUNCA editar manualmente.

## Estrutura de Arquivos

```
routes/
  __root.tsx                          → root (providers, Toaster, ThemeProvider)
  login.tsx                           → /login (pública)
  _app.tsx                            → layout protegido (auth guard + sidebar)
  _app/
    index.tsx                         → / (redirect para /dashboard)
    dashboard.tsx                     → /dashboard
    revenue.tsx                       → /revenue
    finance.tsx                       → /finance?tab=
    users/
      index.tsx                       → /users
      $userId.tsx                     → /users/:userId
    teams.tsx                         → /teams
    teams/
      $teamId.tsx                     → /teams/:teamId
    business/
      companies.tsx                   → /business/companies
      companies.$companyId.tsx        → /business/companies/:companyId
      users.tsx                       → /business/users
    admin.tsx                         → /admin?tab=
    audit.tsx                         → /audit?tab=
    providers.tsx                     → /providers
    profile.tsx                       → /profile?tab=
```

## Auth Guard

`_app.tsx` usa `beforeLoad` com `useAuthStore.getState()` — não hooks aqui:

```ts
export const Route = createFileRoute('/_app')({
  beforeLoad: () => {
    const { status } = useAuthStore.getState()
    if (status !== 'authenticated') throw redirect({ to: '/login' })
  },
  component: AdminLayout,
})
```

## Rotas com Search Params (`?tab=`)

Validar search no `createFileRoute`:

```ts
export const Route = createFileRoute('/_app/finance')({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) || undefined,
  }),
  component: FinanceRoute,
})
```

Consumir com `useSearch({ from: '/_app/finance' })`.

## Template de Nova Rota

```ts
import { createFileRoute } from '@tanstack/react-router'
import { MyPage } from '@/features/my-feature'

export const Route = createFileRoute('/_app/my-route')({
  component: MyRouteComponent,
})

function MyRouteComponent() {
  return <MyPage />
}
```

## Checklist para Nova Rota

1. Criar `src/routes/_app/{name}.tsx`
2. Adicionar item em `src/components/layout/admin-sidebar.tsx` → `sections[]`
3. Adicionar em `src/components/layout/admin-header.tsx` → `routeLabels`
4. Adicionar `nav.{name}` em `public/locales/pt-BR/admin.json`
5. Rodar `bun dev` para regenerar `routeTree.gen.ts`

## Rotas com Parâmetro Dinâmico

Arquivo: `$paramName.tsx` → acesso via `useParams({ from: '/_app/users/$userId' })`.

## Layout (`_app.tsx`)

```
SidebarProvider
  AdminSidebar
  div.flex.min-h-svh.flex-1.flex-col
    [DevBanner]       ← visível apenas quando import.meta.env.DEV === true
    AdminHeader
    main.flex.flex-1.flex-col.overflow-auto.p-4.md:p-6
      <Outlet />
```

`min-h-svh` no div pai — NUNCA `min-h-screen`.

O `isDev` é calculado no nível do módulo (`const isDev = import.meta.env.DEV`) fora do componente — dead code elimination em produção garante que o banner não chegue no bundle final.
