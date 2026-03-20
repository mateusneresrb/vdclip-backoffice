# Financeiro da Empresa VDClip — Guia Completo

## Visao Geral

O modulo financeiro do backoffice gerencia **todas as financas internas** da empresa VDClip (nao as metricas SaaS do produto). Ele e composto por 7 abas, cada uma com uma funcao especifica.

---

## 1. Fluxo de Caixa

**O que e:** Visao consolidada de todas as entradas e saidas de dinheiro, com indicadores de saude financeira.

**O que mostra:**
- **KPIs**: Total de Entradas, Total de Saidas, Fluxo Liquido, Margem Operacional, Burn Rate
- **Saude Financeira**: Indicador colorido (Excelente >= 20%, Bom 5-20%, Atencao 0-5%, Critico < 0%)
- **Graficos**: Entradas vs Saidas mensais em USD e BRL
- **Lista de Lancamentos**: Todas as transacoes financeiras

**Acoes disponiveis:**
- Adicionar entrada de fluxo de caixa (receita, despesa, investimento, reembolso, imposto)
- Cada entrada requer: descricao, valor, moeda, tipo (entrada/saida), conta bancaria, categoria

**Quando usar:** Para ter uma visao geral da saude financeira da empresa e registrar movimentacoes que nao sao custos recorrentes.

---

## 2. Custos (Contas a Pagar)

**O que e:** Gerenciamento de todos os custos fixos e variaveis da empresa, com workflow de aprovacao e pagamento.

**O que mostra:**
- Lista de lancamentos de custo com status, categoria, fornecedor, valor
- Indicador de recorrencia (mensal, trimestral, anual)
- Centro de custo associado

**Workflow de status:**
```
Rascunho -> Aprovado -> Pago
    |           |
    v           v
 Cancelado   Cancelado
```

**Acoes disponiveis:**
- **Criar**: Novo lancamento com fornecedor, categoria, valor, data de vencimento, alocacao de custo
- **Editar**: Alterar dados (apenas em status Rascunho)
- **Aprovar**: Marcar como aprovado para pagamento
- **Pagar**: Registrar pagamento (selecionar conta bancaria e metodo) — cria automaticamente uma transacao financeira
- **Cancelar**: Cancelar o lancamento
- **Excluir**: Remover permanentemente
- **Notas**: Adicionar anotacoes ao lancamento

**Campos do formulario:**
| Campo | Obrigatorio | Descricao |
|-------|-------------|-----------|
| Descricao | Sim | Descricao do custo |
| Fornecedor | Sim | Nome do fornecedor (ex: AWS, Google) |
| Categoria | Sim | Categoria do plano de contas |
| Centro de Custo | Nao | Area/departamento responsavel |
| Valor | Sim | Valor em BRL ou USD |
| Moeda | Sim | BRL ou USD |
| Data de Vencimento | Sim | Data de vencimento do pagamento |
| Mes de Competencia | Sim | Mes a que se refere o custo |
| Alocacao de Custo | Sim | CPV, P&D, Vendas/Marketing ou Administrativo |
| Recorrente | Nao | Se e um custo que se repete |
| Frequencia | Condicional | Mensal, Trimestral ou Anual (se recorrente) |
| Status | Sim | Rascunho, Aprovado, Pago ou Cancelado |

---

## 3. Plano de Contas

**O que e:** Estrutura hierarquica de categorias financeiras para classificar receitas e despesas.

**Tipos de categoria:**
| Tipo | Descricao | Exemplo |
|------|-----------|---------|
| Receita | Entradas de dinheiro | Receita de Assinaturas, Receita de Creditos |
| CPV | Custo dos Produtos Vendidos | Infraestrutura Cloud, APIs de IA, CDN |
| OPEX | Despesas Operacionais | Salarios, Marketing, Ferramentas |
| Impostos | Impostos e taxas | ISS, PIS/COFINS |
| Ativo | Bens da empresa | Equipamentos, Investimentos |
| Passivo | Dividas e obrigacoes | Emprestimos |
| Patrimonio Liquido | Capital dos socios | Capital Social |

**Acoes disponiveis:**
- Criar categoria (com codigo hierarquico, ex: 1.1, 2.1.01)
- Editar nome, descricao, status
- Excluir (somente se nao tiver subcategorias)

---

## 4. Contas Bancarias

**O que e:** Cadastro de todas as contas bancarias e gateways de pagamento da empresa.

**Tipos de conta:**
- Corrente (ex: Itau, Banco do Brasil)
- Poupanca
- Gateway de Pagamento (ex: Paddle, Stripe)
- Investimento

**Informacoes:**
- Nome, banco, agencia, numero da conta
- Moeda (BRL ou USD)
- Saldo inicial e saldo atual (calculado automaticamente)
- Status (ativo/inativo)

---

## 5. Impostos

**O que e:** Configuracao dos impostos aplicaveis ao negocio.

**Tipos de imposto disponiveis:**
| Sigla | Nome |
|-------|------|
| ISS | Imposto Sobre Servicos |
| PIS | Programa de Integracao Social |
| COFINS | Contribuicao para Financiamento da Seguridade Social |
| CSLL | Contribuicao Social sobre o Lucro Liquido |
| IRPJ | Imposto de Renda Pessoa Juridica |
| INSS | Instituto Nacional do Seguro Social |
| CBS | Contribuicao sobre Bens e Servicos (reforma 2026) |
| IBS | Imposto sobre Bens e Servicos (reforma 2026) |

**Regimes tributarios:**
- Simples Nacional
- Lucro Presumido
- Lucro Real

---

## 6. Centros de Custo

**O que e:** Divisao por areas/departamentos para controle de orcamento.

**Exemplos:**
- Marketing (slug: marketing)
- Engenharia (slug: engineering)
- Infraestrutura (slug: infrastructure)
- Administrativo (slug: admin)

**Funcionalidades:**
- Definir orcamento por centro de custo
- Acompanhar gasto vs orcamento (barra de progresso)
- Indicador de uso: verde (< 75%), amarelo (75-90%), vermelho (> 90%)

---

## 7. Contas a Receber

**O que e:** Gerenciamento de valores a receber (payouts de gateways, faturas, entradas manuais).

**Tipos de fonte:**
- Gateway Payout (ex: repasse do Paddle)
- Fatura (B2B)
- Manual

**Workflow:**
```
Pendente -> Recebido (cria transacao financeira)
    |
    v
Atrasado -> Recebido
    |
    v
Baixado (divida perdida)
```

---

## Como Migrar da Planilha para o Sistema

### Sua estrutura atual (planilha):
> Tabela dividida por meses, com tipo de gasto, nome e valor.
> Ex: Fev/AWS/$200, Mar/AWS/$350, Mar/Anuncio/R$100

### Passo a passo para usar o sistema:

#### 1. Configurar a Base (fazer uma vez)

**a) Criar Contas Bancarias:**
- Conta USD (onde paga AWS, APIs, etc)
- Conta BRL (onde paga anuncios, salarios, etc)

**b) Criar Centros de Custo:**
- `infrastructure` — Infraestrutura (AWS, CDN, etc)
- `ai` — Inteligencia Artificial (APIs de IA)
- `marketing` — Marketing e Anuncios
- `engineering` — Engenharia e Desenvolvimento
- `admin` — Administrativo

**c) Criar Categorias no Plano de Contas:**
```
Receita (tipo: revenue)
  1.1 Receita de Assinaturas
  1.2 Receita de Creditos

CPV (tipo: cogs)
  2.1 Infraestrutura Cloud (AWS, GCP)
  2.2 APIs de IA (OpenAI, etc)
  2.3 CDN e Storage

OPEX (tipo: opex)
  3.1 Salarios
  3.2 Marketing e Anuncios
  3.3 Ferramentas e Software

Impostos (tipo: tax)
  4.1 ISS
  4.2 PIS/COFINS
```

#### 2. Registrar Custos Mensais

**Para custos recorrentes (ex: AWS todo mes):**

1. Va em **Custos** > **Adicionar Custo**
2. Preencha:
   - Descricao: "AWS — Infraestrutura Cloud"
   - Fornecedor: "Amazon Web Services"
   - Categoria: "2.1 Infraestrutura Cloud"
   - Centro de Custo: "infrastructure"
   - Valor: 200.00
   - Moeda: USD
   - Mes de Competencia: 2026-02
   - Alocacao: CPV
   - Recorrente: Sim
   - Frequencia: Mensal
3. Salve como Rascunho
4. Quando a fatura chegar, **Aprove**
5. Quando pagar, clique **Pagar** (selecione conta USD)

**Para custos que variam (ex: anuncio so em alguns meses):**

1. Mesmo processo, mas sem marcar como Recorrente
2. Crie um lancamento separado para cada mes que tiver o gasto
3. Ex: Marco — Anuncio R$100:
   - Descricao: "Google Ads — Campanha Marco"
   - Fornecedor: "Google"
   - Categoria: "3.2 Marketing e Anuncios"
   - Centro de Custo: "marketing"
   - Valor: 100.00
   - Moeda: BRL
   - Mes de Competencia: 2026-03

#### 3. Exemplo Completo (seus dados)

| Mes | Gasto | Fornecedor | Valor | Moeda | Categoria | Centro de Custo |
|-----|-------|-----------|-------|-------|-----------|----------------|
| Jan | — | — | — | — | — | — |
| Fev | AWS | Amazon | 200 | USD | 2.1 Infraestrutura Cloud | infrastructure |
| Mar | AWS | Amazon | 350 | USD | 2.1 Infraestrutura Cloud | infrastructure |
| Mar | Anuncio | Google | 100 | BRL | 3.2 Marketing e Anuncios | marketing |

**Resultado no sistema:**
- O **Fluxo de Caixa** vai mostrar automaticamente que em Fevereiro saiu $200 e em Marco saiu $350 + R$100
- Os **Centros de Custo** vao mostrar quanto cada area gastou vs orcamento
- O **Plano de Contas** vai agrupar por tipo: quanto foi CPV vs OPEX
- Os **KPIs** vao calcular margem operacional e burn rate automaticamente

#### 4. Vantagens sobre a Planilha

| Planilha | Sistema |
|----------|---------|
| Dados estaticos | Calculos automaticos (margem, burn rate, runway) |
| Sem controle de aprovacao | Workflow: Rascunho > Aprovado > Pago |
| Sem rastreabilidade | Audit log de quem criou, aprovou e pagou |
| Multi-moeda manual | Separacao automatica USD/BRL |
| Sem orcamento por area | Centros de custo com % de uso |
| Sem classificacao padrao | Plano de contas hierarquico |
| Sem contas a receber | Controle de payouts e faturas |
| Sem impostos | Configuracao de aliquotas por regime |
| Sem notas/comentarios | Notas financeiras por lancamento |

---

## Dicas de Uso

1. **Custos recorrentes**: Configure uma vez como recorrente e o sistema gera todo mes
2. **Aprovacao**: Use o workflow para controle — ninguem paga sem aprovar
3. **Centros de Custo**: Defina orcamento mensal para cada area e acompanhe
4. **Fluxo de Caixa**: Consulte diariamente para ver a saude financeira
5. **Notas**: Adicione anotacoes em lancamentos que precisam de contexto (ex: "Negociado desconto de 15%")
6. **Multi-moeda**: Mantenha contas separadas por moeda — o sistema consolida automaticamente
