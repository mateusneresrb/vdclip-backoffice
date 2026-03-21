# Feature: Providers (Integrações)

**Route**: `/providers` | **Permission**: `PROVIDERS_READ` / `PROVIDERS_WRITE`

Gerenciamento de integrações externas do VDClip agrupadas por categoria.

## Componentes

- `ProvidersManager` — página principal; filtra providers por categoria e renderiza seções
- `ProviderSection` — seção agrupada por categoria com título e lista de cards
- `ProviderCard` — card individual com status toggle e informações do provider
- `ProviderIcons` — mapa de ícones SVG por nome de provider

## Categorias

```ts
type ProviderCategory = 'video_source' | 'payment' | 'ai_processing' | 'publishing'
```

Exibidas nessa ordem: Video Source → Payment → AI Processing → Publishing.

## Hook

```ts
useAdminProviders()  // re-exportado de @/features/admin/hooks/use-admin-providers
```

Retorna `SupportedProvider[]` com todos os providers configurados.

## Mutation Hook

```ts
useToggleProvider()  // from ./hooks/use-provider-mutations
```

Calls `PATCH /platform/providers/{slug}` with `{ enabled: boolean }`. On success, invalidates `adminProviderKeys.all` query and shows success toast.

## Types

```ts
// Re-exportado de @/features/admin/types
SupportedProvider {
  id, name, category: ProviderCategory
  status: 'active' | 'inactive' | 'error'
  config: Record<string, unknown>
  lastSyncAt?: string
}
```

## Nota

Este feature é um thin wrapper. Dados e tipos reais ficam em `@/features/admin`.
`useProviders` e `SupportedProvider` re-exportam de lá via `index.ts`.
O toggle de providers persiste o estado enabled/disabled no DynamoDB via API (`PATCH /platform/providers/{slug}`).
