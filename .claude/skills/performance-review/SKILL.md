---
name: performance-review
description: Review code for performance issues — unnecessary re-renders, bundle size, lazy loading opportunities, memoization, and React best practices.
argument-hint: "[file-path or 'full' for complete review]"
allowed-tools: Read, Grep, Glob, Bash
---

# Performance Review

Analyze the VDClip Dashboard for performance issues and optimization opportunities.

## Target

$ARGUMENTS

## Review Categories

### 1. Re-render Prevention — High Impact

- [ ] Objects/arrays created inside JSX props cause child re-renders
  - Bad: `<Component style={{ color: 'red' }} />`
  - Fix: Extract to a constant or use `useMemo`
- [ ] Callback functions recreated every render and passed to children
  - Bad: `<Button onClick={() => doSomething(id)} />`
  - Fix: Use `useCallback` when passed to memoized children
- [ ] Context providers causing unnecessary re-renders of entire tree
  - Fix: Split contexts, memoize provider value
- [ ] Components re-rendering when unrelated state changes
  - Fix: Zustand selectors: `useSidebarStore((s) => s.isOpen)` not `useSidebarStore()`
- [ ] Missing `key` prop or using array index as key for dynamic lists

### 2. Bundle Size — High Impact

- [ ] Large libraries imported but barely used
  - Check: `import { one thing } from 'huge-library'` — is tree-shaking working?
- [ ] Icon imports: Use named imports (`import { Sun } from 'lucide-react'`), never full library
- [ ] Route-based code splitting: pages should use lazy imports
  - TanStack Router supports `lazyRouteComponent` and `route.lazy()`
- [ ] DevTools (React Query, Router) only in development
  - Use `import.meta.env.DEV` guards or Vite conditional imports
- [ ] Duplicate dependencies in bundle

### 3. Lazy Loading — Medium Impact

- [ ] Heavy page components should use `route.lazy()`:
  ```typescript
  export const Route = createFileRoute('/_authenticated/heavy-page')({
    component: () => import('./heavy-component').then(m => m.HeavyComponent),
  })
  ```
- [ ] Images below the fold use `loading="lazy"`
- [ ] Heavy third-party components (charts, editors) loaded on demand
- [ ] Consider `React.lazy()` for large feature components

### 4. Data Fetching — Medium Impact

- [ ] TanStack Query `staleTime` is appropriate (not too low causing refetches)
- [ ] Queries use proper `queryKey` arrays for caching
- [ ] No waterfall requests (parent fetches, then child fetches based on result)
  - Fix: Use `loader` in route definition or parallel queries
- [ ] Mutations invalidate correct query keys
- [ ] Prefetching used for likely navigation targets
- [ ] No unnecessary network requests on route change

### 5. CSS & Styling — Low Impact

- [ ] Tailwind purges unused CSS (automatic with Tailwind 4)
- [ ] No redundant/conflicting Tailwind classes
- [ ] CSS transitions use `transform` and `opacity` (GPU-accelerated)
- [ ] No layout thrashing (reading DOM then immediately writing)

### 6. React Patterns — Low Impact

- [ ] State updates batched correctly (React 19 batches by default)
- [ ] No state that can be derived (computed from other state/props)
- [ ] Effects have correct dependency arrays
- [ ] No effects that should be event handlers
- [ ] Controlled inputs don't cause excessive re-renders

## Bundle Analysis

If doing a full review, run:
```bash
bun run build && du -sh dist/assets/*
```

Check for:
- Main JS chunk > 250KB gzipped — needs code splitting
- CSS > 50KB gzipped — check for unused styles
- Multiple vendor chunks with same library

## Output Format

```
## Performance Review

### Bundle Size
- Total: X KB (gzipped)
- Main chunk: X KB
- Recommendation: [split if > 250KB gzipped]

### Critical (Fix now)
- [issue with location, impact, and fix]

### Optimization Opportunities
- [issue with location, estimated impact, and fix]

### Already Optimized
- [what's good]

### Recommended Next Steps
1. [prioritized action items]
```
