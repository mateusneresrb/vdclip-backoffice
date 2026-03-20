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

## Hooks

```ts
useAdminProviders()      // re-exportado de @/features/admin/hooks/use-admin-providers
useVideoSources()        // GET /platform/video-sources — retorna { providers: Record<string, boolean> }
useUpdateVideoSources()  // PATCH /platform/video-sources — mutation para toggle de providers
```

- `useAdminProviders()` retorna `SupportedProvider[]` com todos os providers configurados.
- `useVideoSources()` retorna o estado enabled/disabled de cada provider no DynamoDB.
- `ProvidersManager` faz merge dos dois: lista de providers vem de `useAdminProviders`, estado enabled vem de `useVideoSources`.
- Toggle chama `useUpdateVideoSources` (PATCH real) e invalida ambas as queries.

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

Tipos e lista de providers ficam em `@/features/admin`. Estado de toggle (enabled/disabled) vem do DynamoDB via `use-video-sources.ts` (hook próprio deste feature).
