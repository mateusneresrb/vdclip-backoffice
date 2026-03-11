# Features

Módulos auto-contidos. Cada feature exporta via `index.ts` e tem seus próprios `components/`, `hooks/`, `types/`.

## Mapa de Features

| Feature | Rota | Permissão | CLAUDE.md |
|---------|------|-----------|-----------|
| `dashboard` | `/dashboard` | `METRICS_READ` | [ver](dashboard/CLAUDE.md) |
| `revenue` | `/revenue` | `SUBSCRIPTIONS_READ` | [ver](revenue/CLAUDE.md) |
| `finance` | `/finance` | `FINANCE_READ` | [ver](finance/CLAUDE.md) |
| `auth` | `/login`, `/profile` | — | [ver](auth/CLAUDE.md) |
| `users` | `/users`, `/users/:id` | `USERS_READ` | [ver](users/CLAUDE.md) |
| `teams` | `/teams`, `/teams/:id` | `TEAMS_READ` | [ver](teams/CLAUDE.md) |
| `admin-users` | `/admin` | `ADMIN_READ` | [ver](admin-users/CLAUDE.md) |
| `audit` | `/audit` | `AUDIT_READ` | [ver](audit/CLAUDE.md) |
| `business` | `/business/companies`, `/business/users` | `USERS_READ` | [ver](business/CLAUDE.md) |
| `providers` | `/providers` | `PROVIDERS_READ` | [ver](providers/CLAUDE.md) |
| `admin` | (biblioteca central) | — | [ver](admin/CLAUDE.md) |

## Estrutura Padrão

```
features/{name}/
  components/    → componentes React da feature
  hooks/         → TanStack Query hooks (queries + mutations)
  types/         → tipos TypeScript (index.ts)
  index.ts       → barrel export público
```

## Padrão de Hook (Query)

```ts
// query key factory
const myKeys = {
  all: ['resource'] as const,
  list: (filters?: Filters) => [...myKeys.all, 'list', filters] as const,
  detail: (id: string) => [...myKeys.all, id] as const,
}

export function useMyResource(id: string) {
  return useQuery({
    queryKey: myKeys.detail(id),
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 400)) // mock delay
      return MOCK_DATA
    },
  })
}
```

## Padrão de Hook (Mutation)

```ts
export function useCreateResource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateInput) => { /* ... */ },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: myKeys.all }),
  })
}
```

## Padrão de index.ts

```ts
// Exportar apenas o que é usado externamente
export { MyPage } from './components/my-page'
export { useMyResource } from './hooks/use-my-resource'
export type { MyType } from './types'
```

## Convenções

- Hooks de query: `use-{resource}.ts` — apenas reads
- Hooks de mutation: `use-{resource}-mutations.ts` — create/update/delete
- Componente de página: `{name}-page.tsx` — ponto de entrada do route
- Tabs: `{name}-{tab}-tab.tsx` — um arquivo por tab
- Dialogs de form: `{entity}-form-dialog.tsx`
- `PermissionGuard` para esconder UI sem permissão (não redireciona — apenas oculta)
- Todo text user-facing via `t('key')` — NUNCA hardcode
