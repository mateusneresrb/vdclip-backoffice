# Feature: Business (VDClip Business)

**Routes**: `/business/companies`, `/business/companies/:companyId`, `/business/users`
**Permission**: `USERS_READ`

Gestão do produto VDClip Business (B2B — separado do produto principal).

## Componentes

- `business-companies-page.tsx` — listagem de empresas com busca e filtros
- `business-company-detail.tsx` — detalhe de empresa (membros, configurações)
- `business-users-page.tsx` — usuários do VDClip Business

## Hooks

```ts
useBusinessCompanies(search?: string)        → BusinessCompany[]
useBusinessCompanyDetail(companyId: string)  → BusinessCompany (com membros)
useBusinessUsers()                           → BusinessUser[]
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

BusinessUser {
  id, name, email, companyId, companyName
  role: 'admin' | 'member'
  status: 'active' | 'inactive'
  createdAt: string
}
```

## Rotas Aninhadas

Arquivos em `src/routes/_app/business/`:
- `/business/companies` → `companies.tsx`
- `/business/companies/:companyId` → `companies.$companyId.tsx`
- `/business/users` → `users.tsx`

## Breadcrumb (AdminHeader)

Segmento `business` usa breadcrumb de dois níveis:
- `parentLabels['business'] = 'nav.productBusiness'`
- `childLabels.business = { users: 'nav.businessUsers', companies: 'nav.businessCompanies' }`
