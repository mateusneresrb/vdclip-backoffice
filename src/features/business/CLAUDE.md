# Feature: Business (Empresas)

**Routes**: `/companies`, `/companies/:companyId`
**Permission**: `USERS_READ`

Gestão de empresas cadastradas no VDClip. Anteriormente separado como "VDClip Business", agora integrado à seção VDClip na sidebar.

## Componentes

- `business-companies-page.tsx` — listagem de empresas com busca e filtros
- `business-company-detail.tsx` — detalhe de empresa (membros, configurações)

## Hooks

```ts
useBusinessCompanies(search?: string)        → BusinessCompany[]
useBusinessCompanyDetail(companyId: string)  → BusinessCompany (com membros)
```

## Types

```ts
BusinessCompany {
  id, externalId, name
  document?: string            // CNPJ, opcional
  plan: 'business' | 'enterprise' | 'trial'
  status: 'active' | 'inactive' | 'trial'
  userCount: number
  contactEmail?: string
  createdAt: string
}
```

## Rotas

Arquivos em `src/routes/_app/companies/`:
- `/companies` → `index.tsx`
- `/companies/:companyId` → `$companyId.tsx`

## Relação com Usuários

Usuários (`AdminUser`) podem ter `companyId` e `companyName` associados.
O link para a empresa aparece em:
- `UserSearch` (listagem de usuários)
- `user-detail-header.tsx` (header do detalhe)
- `user-overview-tab.tsx` (card de empresa no overview)
