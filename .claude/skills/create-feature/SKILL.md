---
name: create-feature
description: Scaffold a new feature module with the standard directory structure, components, hooks, types, and route integration. Use when building a new feature from scratch.
argument-hint: "[feature-name] [description]"
---

# Create Feature Module

Scaffold a complete feature module for the VDClip Dashboard.

## Feature

$ARGUMENTS

## Feature Structure

Create the following structure inside `src/features/{feature-name}/`:

```
src/features/{feature-name}/
  components/       # Feature-specific components
  hooks/            # Feature-specific hooks (queries, mutations)
  types/            # Feature-specific TypeScript types
  index.ts          # Public API barrel export
```

## Step-by-step

1. **Create the directory structure** above

2. **Define types** in `types/index.ts`:
   - Define the main entity type(s) for this feature
   - Export all types

3. **Create hooks** in `hooks/`:
   - `use-{feature}.ts` — TanStack Query hook for fetching data
   - Structure:
     ```typescript
     import { useQuery } from '@tanstack/react-query'
     import type { FeatureType } from '../types'

     export const featureKeys = {
       all: ['{feature}'] as const,
       lists: () => [...featureKeys.all, 'list'] as const,
       list: (filters: Record<string, unknown>) => [...featureKeys.lists(), filters] as const,
       details: () => [...featureKeys.all, 'detail'] as const,
       detail: (id: string) => [...featureKeys.details(), id] as const,
     }
     ```
   - Include placeholder `queryFn` that returns mock data (for development before API integration)

4. **Create components** in `components/`:
   - At least one main component for the feature
   - Follow ALL rules from the `ui-component` skill:
     - Mobile-first responsive design
     - Full accessibility
     - i18n for all text
     - Dark mode with semantic colors
     - Named exports only

5. **Create barrel export** in `index.ts`:
   - Export components, hooks, and types for use in route files

6. **Create the route** in `src/routes/_authenticated/{feature-name}.tsx` (or `{feature-name}/index.tsx` for nested routes):
   - Import from the feature module
   - Use `createFileRoute`
   - Add page heading with `useTranslation`

7. **Add navigation**:
   - Add nav item to `src/components/layout/app-sidebar.tsx` (icon + translation key)
   - Add route label to `src/components/layout/header.tsx` `routeLabels` map

8. **Add translations** to all 3 locale files:
   - `public/locales/en/common.json` — nav label
   - `public/locales/pt-BR/common.json` — nav label
   - `public/locales/es/common.json` — nav label
   - Create feature namespace files if the feature has substantial text:
     - `public/locales/{en,pt-BR,es}/{feature-name}.json`
     - Register namespace in `src/i18n.ts` `ns` array

9. **Verify**:
   - All TypeScript types are correct
   - Translations exist in all 3 languages
   - Route will be auto-generated when `bun dev` runs
