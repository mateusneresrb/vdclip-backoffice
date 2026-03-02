---
paths:
  - "src/routes/**/*.tsx"
---

# Route File Rules

## Structure

- Use `createFileRoute` with the exact path matching the file location
- Component function is private (not exported), only `Route` is exported
- Layout routes (`_authenticated.tsx`) use `<Outlet />` for children

## When Creating a Route

1. Create file in `src/routes/_authenticated/{name}.tsx`
2. Add nav item in `src/components/layout/app-sidebar.tsx` (`navItems` or `footerItems`)
3. Add label in `src/components/layout/header.tsx` `routeLabels` map
4. Add translations in ALL 3 locale files (`en`, `pt-BR`, `es`)
5. Run `bun dev` to regenerate `routeTree.gen.ts`

## Page Template

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_authenticated/{name}')({
  component: PageComponent,
})

function PageComponent() {
  const { t } = useTranslation()
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{t('nav.{name}')}</h1>
      </div>
    </div>
  )
}
```

## Constraints

- NEVER edit `routeTree.gen.ts` — auto-generated
- Route paths must match file paths exactly
- Protected routes go inside `_authenticated/` directory
- Public routes (login, etc.) go in `src/routes/` root
