# Translations (public/locales)

Carregadas em runtime via `i18next-http-backend`. NÃO são bundled.

## Estrutura

```
public/locales/
  pt-BR/
    common.json   → namespace 'common' (defaultNS)
    admin.json    → namespace 'admin'
```

## `common.json` — seções principais

- `nav.*` — navegação do vdclip-dashboard (legado — não usar no backoffice)
- `theme.*` — light/dark/system
- `language.*` — rótulos de idioma
- `common.*` — ações globais: save, cancel, edit, delete, confirm, back, noData
- `sidebar.*` — estado da sidebar

## `admin.json` — seções principais

- `nav.*` — todos os labels de navegação do backoffice
- `auth.*` — login, MFA
- `dashboard.*` — tabs e métricas do dashboard
- `revenue.*` — tabs e dados de receita/SaaS
- `finance.*` — fluxo de caixa, custos, contas, etc.
- `users.*` — busca, detalhe, tabs de usuário
- `teams.*` — overview, detalhe
- `adminUsers.*` — administradores, roles, sessões
- `audit.*` — logs de auditoria e auth
- `providers.*` — integrações por categoria
- `business.*` — empresas e usuários B2B
- `profile.*` — perfil do admin logado
- `metrics.*` — labels de métricas SaaS

## Regras

- Apenas PT-BR — nunca criar outra pasta de idioma
- Novo namespace: registrar em `src/i18n.ts` `ns: [...]`
- Chaves aninhadas: `section.subsection.key`
- Ver `.claude/rules/translations.md` para convenções de naming
