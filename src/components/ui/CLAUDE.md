# Components: UI (shadcn/ui)

**NUNCA editar manualmente.** Todos gerados via `bunx shadcn@latest add <name>`.

Para adicionar novo componente: `bunx shadcn@latest add <name>` — sobrescreve o existente com a versão atualizada.

## Componentes Instalados

| Componente | Arquivo | Uso principal |
|-----------|---------|--------------|
| `AlertDialog` | `alert-dialog.tsx` | Confirmação destrutiva (delete) |
| `Avatar` | `avatar.tsx` | Foto de perfil de usuário |
| `Badge` | `badge.tsx` | Status, plano, tags inline |
| `Breadcrumb` | `breadcrumb.tsx` | Navegação no `AdminHeader` |
| `Button` | `button.tsx` | Ações, CTAs — variantes: default, outline, ghost, destructive |
| `Calendar` | `calendar.tsx` | Seletor de data em `DateRangeFilter` |
| `Card` | `card.tsx` | Container de seção/métrica |
| `Checkbox` | `checkbox.tsx` | Seleção em tabelas e formulários |
| `Collapsible` | `collapsible.tsx` | Seções expansíveis na sidebar |
| `Dialog` | `dialog.tsx` | Modais de criação/edição |
| `DropdownMenu` | `dropdown-menu.tsx` | Menu de ações por item |
| `Form` | `form.tsx` | react-hook-form + zod integration |
| `Input` | `input.tsx` | Campos de texto |
| `InputOTP` | `input-otp.tsx` | Código MFA no login |
| `Label` | `label.tsx` | Labels de formulário |
| `Pagination` | `pagination.tsx` | Controles de paginação |
| `Popover` | `popover.tsx` | Calendário e popovers |
| `Select` | `select.tsx` | Dropdowns de seleção |
| `Separator` | `separator.tsx` | Divisores visuais |
| `Sheet` | `sheet.tsx` | Painel lateral (mobile sidebar) |
| `Sidebar` | `sidebar.tsx` | Sistema completo de sidebar — usa `SidebarProvider` |
| `Skeleton` | `skeleton.tsx` | Loading states |
| `Slider` | `slider.tsx` | Controle numérico por arraste |
| `Sonner` | `sonner.tsx` | Toasts (via `toast()` do sonner) |
| `Switch` | `switch.tsx` | Toggle on/off |
| `Table` | `table.tsx` | Tabelas de dados |
| `Tabs` | `tabs.tsx` | Navegação por abas |
| `Toggle` / `ToggleGroup` | `toggle.tsx` / `toggle-group.tsx` | Seleção exclusiva/múltipla |
| `Tooltip` | `tooltip.tsx` | Dicas de contexto |

## Padrões de Uso

```tsx
// Dialog de confirmação (delete)
<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive">Excluir</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{t('messages.confirmDelete')}</AlertDialogTitle>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>{t('actions.confirm')}</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// Toast
import { toast } from 'sonner'
toast.success(t('messages.success'))
toast.error(t('messages.error'))
```

## Estilo: New York

shadcn configurado com estilo `New York` — bordas mais definidas, menos rounded por padrão.
