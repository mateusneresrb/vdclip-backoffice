# Components: Shared

Componentes reutilizáveis entre features. Sem dependência de domínio específico.

## `PageHeader` (`page-header.tsx`)

Cabeçalho padrão de página com título, descrição opcional e área de ação.

```tsx
<PageHeader
  title={t('nav.dashboard')}
  description={t('dashboard.pageDescription')}
>
  <Button>Exportar</Button>   {/* children = actions (opcional) */}
</PageHeader>
```

## `EmptyState` (`empty-state.tsx`)

Estado vazio para listas e tabelas sem dados.

```tsx
<EmptyState
  icon={Users}
  title={t('users.emptyTitle')}
  description={t('users.emptyDescription')}
  action={<Button>Convidar</Button>}   {/* opcional */}
/>
```

## `PaginationControls` (`src/components/pagination-controls.tsx`)

Controles de paginação para usar com `usePagination()`.

```tsx
const pagination = usePagination(items)

<PaginationControls
  page={pagination.page}
  totalPages={pagination.totalPages}
  onPrevious={pagination.previousPage}
  onNext={pagination.nextPage}
  canPrevious={pagination.canPreviousPage}
  canNext={pagination.canNextPage}
/>
```

## `ErrorFallback` (`error-fallback.tsx`)

Error boundary fallback para TanStack Router `errorComponent`. Exibe mensagem amigavel, botao de retry e link para /dashboard.

```tsx
import { ErrorFallback } from '@/components/shared/error-fallback'

export const Route = createFileRoute('/_app/my-route')({
  component: MyComponent,
  errorComponent: ErrorFallback,
})
```

Recebe `ErrorComponentProps` do TanStack Router (`error`, `reset`). Usa chaves i18n `error.*` do namespace `common`.

## `InfoTooltip` (`src/components/info-tooltip.tsx`)

Ícone de interrogação com tooltip. Usar em labels de métricas e campos complexos.

```tsx
<InfoTooltip content={t('metrics.mrrDescription')} />
```
