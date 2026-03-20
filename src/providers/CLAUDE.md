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

Configurações do `QueryClient`:
- `staleTime`: 5 minutos (`1000 * 60 * 5`)
- `retry`: 1 tentativa em falha
- `refetchOnWindowFocus`: false
- Para alterar por query: passar `staleTime` / `retry` / `refetchOnWindowFocus` diretamente no `useQuery()`

## Não confundir com

- `SidebarProvider` — do shadcn, montado no layout `_app.tsx`
- `ThemeProvider` — em `src/components/layout/theme-provider.tsx`, montado em `main.tsx`
