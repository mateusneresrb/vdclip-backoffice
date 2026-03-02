---
name: create-test
description: Generate test files for components, hooks, or utilities. Creates tests using Vitest + React Testing Library following project testing patterns. Use when you need to test a component or module.
argument-hint: "[file-path or component-name]"
---

# Create Test

Generate comprehensive tests for the specified component, hook, or utility.

## Target

$ARGUMENTS

## Testing Stack

- **Test runner**: Vitest
- **Component testing**: @testing-library/react + @testing-library/user-event
- **Assertions**: Vitest built-in (expect, vi)
- **Mocking**: Vitest `vi.mock()`, `vi.fn()`, `vi.spyOn()`

> Note: If Vitest is not yet installed, install it first:
> `bun add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
> Then add to `vite.config.ts`:
> ```typescript
> test: {
>   globals: true,
>   environment: 'jsdom',
>   setupFiles: './src/test/setup.ts',
> }
> ```

## Test File Location

Place test files next to the source file with `.test.tsx` or `.test.ts` extension:
- `src/components/layout/header.tsx` → `src/components/layout/header.test.tsx`
- `src/features/auth/hooks/use-auth.ts` → `src/features/auth/hooks/use-auth.test.ts`
- `src/lib/utils.ts` → `src/lib/utils.test.ts`

## Test Categories

### Component Tests

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
```

Write tests for:

1. **Rendering**: Component renders without crashing
2. **Content**: Correct text/elements appear
3. **Responsiveness**: Elements show/hide at breakpoints (mock `window.matchMedia`)
4. **Accessibility**:
   - `getByRole` over `getByTestId` — tests screen reader experience
   - Verify `aria-*` attributes
   - Tab navigation order
   - Screen reader text exists for icon-only buttons
5. **Interactions**: Click, type, submit events work correctly
6. **i18n**: Text renders through translation keys (mock i18next)
7. **Dark mode**: Theme-dependent classes apply correctly
8. **Edge cases**: Empty states, loading states, error states
9. **Props**: Each prop variant renders correctly

### Hook Tests

```typescript
import { renderHook, waitFor } from '@testing-library/react'
```

Write tests for:
1. **Initial state**: Hook returns correct initial values
2. **State updates**: Actions change state correctly
3. **Side effects**: API calls, localStorage, etc.
4. **Error handling**: Hook handles errors gracefully
5. **Cleanup**: Subscriptions/timers are cleaned up

### Utility Tests

Write tests for:
1. **Happy path**: Function returns expected output
2. **Edge cases**: Empty input, null, undefined, boundary values
3. **Type safety**: TypeScript types are correct (compile-time check)

## Mocking Patterns

### Mock react-i18next
```typescript
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn(), resolvedLanguage: 'en' },
  }),
}))
```

### Mock TanStack Router
```typescript
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual,
    Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    useNavigate: () => vi.fn(),
    useMatchRoute: () => vi.fn(() => null),
    useMatches: () => [{ pathname: '/dashboard' }],
  }
})
```

### Mock Zustand Store
```typescript
vi.mock('@/stores/sidebar-store', () => ({
  useSidebarStore: () => ({
    isOpen: true,
    toggle: vi.fn(),
    setOpen: vi.fn(),
  }),
}))
```

## Test Naming Convention

```typescript
describe('ComponentName', () => {
  it('renders the page title', () => {})
  it('shows navigation items', () => {})
  it('navigates to dashboard on click', () => {})
  it('toggles theme when button is clicked', () => {})
  it('displays loading state while data fetches', () => {})
  it('shows error message on API failure', () => {})
})
```

Use descriptive `it()` names that read as sentences. Prefix with the behavior being tested.

## Output

- Test file with comprehensive coverage
- Any required test utilities or setup files
- List of test scenarios covered
