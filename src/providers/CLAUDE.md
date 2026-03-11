# Providers

Providers React de nível de aplicação.

## `QueryProvider` (`query-provider.tsx`)

Wrapper do `QueryClient` do TanStack Query. Montado em `main.tsx` na raiz da árvore.

```tsx
// main.tsx
<QueryProvider>
  <RouterProvider router={router} />
</QueryProvider>
```

Configurações do `QueryClient` (padrões do TanStack Query):
- `staleTime`: 0 (refetch ao focar janela)
- `retry`: 3 tentativas em falha
- Para alterar por query: passar `staleTime` / `retry` diretamente no `useQuery()`

## Não confundir com

- `SidebarProvider` — do shadcn, montado no layout `_app.tsx`
- `ThemeProvider` — em `src/components/layout/theme-provider.tsx`, montado em `main.tsx`
