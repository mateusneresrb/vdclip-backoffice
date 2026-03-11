---
paths:
  - "public/locales/**/*.json"
  - "src/i18n.ts"
  - "src/**/*.tsx"
  - "src/**/*.ts"
---

# Translation Rules

## APENAS PT-BR

Único idioma. Nunca criar `en/`, `es/` ou qualquer outra pasta.

## Namespaces (src/i18n.ts `ns` array)

| Namespace | Arquivo | Uso |
|-----------|---------|-----|
| `common` | `public/locales/pt-BR/common.json` | Ações globais, tema, layout |
| `admin` | `public/locales/pt-BR/admin.json` | Tudo do backoffice admin |

- `defaultNS: 'common'` — `useTranslation()` sem args usa common
- Backoffice usa quase sempre `useTranslation('admin')`
- Adicionar namespace: registrar em `src/i18n.ts` `ns: [...]` antes de usar

## Key Naming Conventions

```
nav.{routeName}               → labels de navegação
{feature}.pageDescription     → subtítulo da página
{feature}.tabs.{tabName}      → labels de tab
{feature}.{entity}Title       → título de seção/card
{feature}.empty{Entity}       → empty state title
form.{field}.label            → label de campo
form.{field}.placeholder      → placeholder de campo
actions.save / .cancel / .delete / .edit / .add / .confirm
messages.success / .error / .confirmDelete
status.{value}                → badge de status (active, inactive, suspended)
```

## PT-BR — Acentuação Obrigatória

**SEMPRE use acentuação correta em português brasileiro.** Nunca omitir acentos.

Exemplos comuns que DEVEM ter acento:
- `Usuário/Usuários` (NÃO "Usuario/Usuarios")
- `Ação/Ações` (NÃO "Acao/Acoes")
- `Configuração/Configurações` (NÃO "Configuracao/Configuracoes")
- `Não` (NÃO "Nao"), `Também` (NÃO "Tambem"), `Período` (NÃO "Periodo")
- `Função/Funções` (NÃO "Funcao/Funcoes"), `Sessão/Sessões`
- `Crédito/Créditos` (NÃO "Credito/Creditos"), `Métricas` (NÃO "Metricas")
- `Histórico` (NÃO "Historico"), `Publicação` (NÃO "Publicacao")
- `Conexão/Conexões` (NÃO "Conexao/Conexoes"), `Mídias` (NÃO "Midias")
- `Visão Geral` (NÃO "Visao Geral"), `Transações` (NÃO "Transacoes")

Ao adicionar qualquer nova chave em `admin.json` ou `common.json`, revisar se há acentos faltando.

## Constraints

- NUNCA hardcode texto user-facing — sempre `t('key')`
- NUNCA passar string diretamente como prop sem `t()`: `<Button>Salvar</Button>` ❌
- Incluir placeholders e aria-labels: `placeholder={t('form.search.placeholder')}`
- Chaves inexistentes retornam a própria chave — checar typos
- Carregar em runtime de `/locales/pt-BR/{ns}.json` — NÃO é bundled
