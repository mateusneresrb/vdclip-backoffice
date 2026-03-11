# Components: Layout

Componentes de estrutura do backoffice — sidebar, header, tema.

## `AdminSidebar` (`admin-sidebar.tsx`)
Sidebar colapsável com seções e itens de navegação.

### Estrutura de dados
```ts
sections: NavSection[]
  NavSection { labelKey, items: NavItem[], defaultOpen? }
  NavItem    { to, search?, icon, labelKey, permission?, children?: NavSubItem[] }
```

### Comportamento
- `PermissionNavItem` — item padrão (leaf), suporta `search` params para rota com `?tab=`
- `CollapsibleNavItem` — item com filhos expansível (não usado atualmente)
- `CollapsibleNavGroup` — seção colapsável pelo título
- Estado ativo: `matchRoute({ to, fuzzy: true })`
- Mobile: `setOpenMobile(false)` ao navegar E botão `X` no header da sidebar
- O botão `X` é renderizado apenas quando `isMobile === true` (via `useSidebar()`)

### Adicionar item ao sidebar (checklist)
1. Adicionar entrada em `sections[]` em `admin-sidebar.tsx`
2. Adicionar `routeLabels` em `admin-header.tsx`
3. Adicionar `nav.{name}` em `public/locales/pt-BR/admin.json`

### Itens com tabs
```ts
{ to: '/finance', search: { tab: 'cash-flow' }, icon: Banknote, labelKey: 'nav.finCashFlow' }
```
O `search` é passado via `<Link to={item.to} search={item.search}>`.

## `AdminHeader` (`admin-header.tsx`)
Header com comportamento diferente por breakpoint.

### Mobile (< sm)
- `[≡ SidebarTrigger]` + `[vdclip-logo.svg + badge "BackOffice"]` (clicável, vai para /dashboard)
- Quick links **ocultos** no mobile
- Breadcrumb oculto no mobile

### Desktop (≥ sm)
- `[≡ SidebarTrigger]` + `|` + `[Breadcrumb]` + `[Quick links]`
- Quick links: Documentação, Tawk, Paddle, Woovi, AWS — `hidden sm:flex`

### Quick links
Definidos em `quickLinks: QuickLink[]`. Dois tipos via discriminated union:
```ts
type QuickLink =
  | { href, label, type: 'icon', icon: typeof BookOpen, color }
  | { href, label, type: 'favicon', favicon: string }
```
Favicons via Google S2: `https://www.google.com/s2/favicons?domain=X&sz=32`

### Mapa de labels
```ts
routeLabels: Record<string, string>    // segmento → chave i18n
parentLabels: Record<string, string>   // segmento pai → label (ex: business)
productRoutes: Record<string, string>  // segmento → grupo de produto
childLabels: Record<string, Record<string, string>>  // pai.filho → label
```
**Ao criar nova rota, sempre adicionar em `routeLabels`.**

## Dev Banner (`_app.tsx`)
Banner âmbar acima do header, visível apenas quando `import.meta.env.DEV === true`.
Oculto automaticamente em produção. Não requer configuração adicional.

## `ThemeProvider` + `useTheme()`
- Estratégia: classe `.dark` no `<html>` (não `prefers-color-scheme`)
- Valores: `'light' | 'dark' | 'system'`
- `system` observa `matchMedia('(prefers-color-scheme: dark)')`
- Persistido no localStorage com chave `vdclip-backoffice-theme`
