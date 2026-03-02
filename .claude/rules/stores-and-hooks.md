---
paths:
  - "src/stores/**/*.ts"
  - "src/hooks/**/*.ts"
  - "src/providers/**/*.tsx"
---

# State Management Rules

## Zustand Stores

- Use `persist` middleware for user preferences (theme, sidebar, language)
- Use selectors for performance: `useStore((s) => s.field)` not `useStore()`
- Keep stores focused — one domain per store
- Interface at top of file with state + actions

## TanStack Query

- Define query key factories: `featureKeys.all`, `featureKeys.list(filters)`, `featureKeys.detail(id)`
- `staleTime: 5 minutes` default (override per query if needed)
- Invalidate correct keys after mutations
- Use `queryFn` with typed return values

## Custom Hooks

- Prefix with `use-` (file and function)
- Export as named export
- Keep hooks pure — side effects in `useEffect` only
