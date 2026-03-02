---
name: create-route
description: Create a new TanStack Router route with all required boilerplate — route file, translations, sidebar nav item, and header label. Use when adding a new page to the dashboard.
argument-hint: "[route-path] [description]"
---

# Create Route

Create a new authenticated route for the VDClip Dashboard.

## Route

$ARGUMENTS

## Step-by-step

1. **Create the route file** at `src/routes/_authenticated/{route-name}.tsx`:

   ```typescript
   import { createFileRoute } from '@tanstack/react-router'
   import { useTranslation } from 'react-i18next'

   export const Route = createFileRoute('/_authenticated/{route-name}')({
     component: PageComponent,
   })

   function PageComponent() {
     const { t } = useTranslation()

     return (
       <div className="space-y-4 md:space-y-6">
         <div>
           <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
             {t('nav.{route-name}')}
           </h1>
           <p className="text-sm text-muted-foreground sm:text-base">
             {t('{route-name}.description')}
           </p>
         </div>
         {/* Page content here */}
       </div>
     )
   }
   ```

   - For nested routes, use `{route-name}/index.tsx`
   - Follow mobile-first responsive design patterns
   - Use semantic Tailwind colors for dark mode compatibility
   - All text must use `t()` from react-i18next

2. **Add nav item** to `src/components/layout/app-sidebar.tsx`:
   - Import the appropriate icon from `lucide-react`
   - Add to `navItems` or `footerItems` array:
     ```typescript
     { to: '/{route-name}', icon: IconName, labelKey: 'nav.{route-name}' },
     ```

3. **Add header label** to `src/components/layout/header.tsx`:
   - Add entry to `routeLabels` map:
     ```typescript
     '{route-name}': 'nav.{route-name}',
     ```

4. **Add translations** to all 3 locale files in `public/locales/`:
   - `en/common.json`: Add `nav.{route-name}` key
   - `pt-BR/common.json`: Add `nav.{route-name}` key
   - `es/common.json`: Add `nav.{route-name}` key

5. **Remind user**: Run `bun dev` to auto-generate `routeTree.gen.ts`
