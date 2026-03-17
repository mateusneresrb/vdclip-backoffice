# Guia de Uso — Modulo Financeiro

## Quando usar cada parte

### Fluxo de Caixa vs Custos — Qual a diferenca?

**Custos** e para despesas que seguem um processo: voce registra, alguem aprova, e quando paga, o sistema **automaticamente** cria a entrada no Fluxo de Caixa.

**Fluxo de Caixa direto** e para movimentacoes que nao precisam de aprovacao — como registrar uma receita que entrou, um aporte dos socios, ou uma movimentacao que ja aconteceu.

| Situacao | Onde criar |
|----------|-----------|
| Conta da AWS chegou, preciso pagar | **Custos** (Rascunho -> Aprovar -> Pagar) |
| Fatura do Google Ads | **Custos** |
| Salario dos funcionarios | **Custos** (recorrente mensal) |
| Receita de assinaturas que entrou na conta | **Fluxo de Caixa** (entrada) |
| Socio fez um aporte de R$ 10.000 | **Fluxo de Caixa** (entrada, tipo: investimento) |
| Reembolso de um cliente | **Fluxo de Caixa** (saida, tipo: reembolso) |
| Repasse do Paddle caiu na conta | **Contas a Receber** -> Marcar como recebido |

**Regra simples:**
- Se e **despesa** que precisa de controle -> **Custos**
- Se e **dinheiro que entrou/saiu** sem processo de aprovacao -> **Fluxo de Caixa**
- Se e **dinheiro que vai entrar** no futuro -> **Contas a Receber**

---

### Quando criar uma nova Categoria (Plano de Contas)

Voce cria uma categoria **quando surge um tipo de gasto/receita que nao se encaixa nas existentes**.

**Exemplos praticos:**

Ja tem:
```
2.1 Infraestrutura Cloud (AWS, GCP)
2.2 APIs de IA (OpenAI)
```

Cenarios:
- Contratou um servico de CDN novo -> **Nao precisa criar**, usa "2.1 Infraestrutura Cloud" ou "2.3 CDN e Storage" se ja existir
- Comecou a usar Anthropic alem de OpenAI -> **Nao precisa criar**, usa "2.2 APIs de IA" (a categoria agrupa por tipo, nao por fornecedor)
- Comecou a pagar um escritorio de advocacia -> **Precisa criar**: "3.4 Juridico e Compliance" (novo tipo de gasto que nao existia)
- Comecou a vender templates -> **Precisa criar**: "1.3 Receita de Templates" (nova fonte de receita)

**Regra simples:** Categoria = **tipo de gasto/receita**. Fornecedor e outro campo. So crie categoria nova se o **tipo** e novo.

---

### Quando criar um novo Centro de Custo

Centro de custo = **area da empresa** que gasta dinheiro. Crie quando surgir uma nova area.

| Evento | Acao |
|--------|------|
| Empresa comecou | Criar: `infrastructure`, `engineering`, `marketing`, `admin` |
| Contratou time de vendas | Criar: `sales` |
| Criou area de suporte | Criar: `support` |
| Abriu escritorio em SP | Criar: `office-sp` |

**Nao confundir:**
- AWS e um **fornecedor**, nao um centro de custo
- "infrastructure" e o centro de custo que **paga** a AWS

---

### Quando criar um novo Imposto

Crie quando a empresa passar a ter uma **nova obrigacao tributaria**.

| Evento | Acao |
|--------|------|
| Empresa abriu como Simples Nacional | Criar ISS (aliquota X%), PIS, COFINS |
| Migrou para Lucro Presumido | Criar IRPJ (15%), CSLL (9%) — novas aliquotas |
| Aliquota do ISS mudou de 3% para 5% | Colocar data de fim na antiga e criar nova |
| Reforma tributaria 2026 (CBS/IBS) | Criar CBS e IBS com as novas aliquotas |

**Vigencia:** Cada imposto tem data de inicio e fim. Se a aliquota muda, voce coloca data de fim na configuracao atual e cria uma nova com a aliquota atualizada.

**Hoje** os impostos sao apenas cadastro de referencia. No futuro, podem ser usados para calcular automaticamente o imposto sobre cada transacao.

---

### Quando criar uma Conta Bancaria

Crie quando a empresa **abrir uma nova conta ou usar um novo meio de pagamento**.

| Evento | Acao |
|--------|------|
| Abriu conta no Itau | Criar: tipo Corrente, BRL |
| Abriu conta na Mercury (USD) | Criar: tipo Corrente, USD |
| Comecou a receber pelo Paddle | Criar: tipo Gateway de Pagamento, USD |
| Comecou a receber pelo Woovi/PIX | Criar: tipo Gateway de Pagamento, BRL |
| Fez investimento em CDB | Criar: tipo Investimento, BRL |

---

### Quando criar uma Conta a Receber

Crie quando **sabe que vai receber dinheiro** mas ainda nao recebeu.

| Evento | Acao |
|--------|------|
| Paddle vai fazer repasse dia 15 | Criar: fonte "Gateway Payout", data esperada 15/03, valor $500 |
| Enviou fatura para cliente B2B | Criar: fonte "Fatura", data esperada 30/03, valor R$ 5.000 |
| Dinheiro caiu na conta | Marcar como **Recebido** (selecionar conta bancaria) |
| Passou da data e nao recebeu | Marcar como **Atrasado** |
| Cliente nao vai pagar | Marcar como **Baixado** (perda) |

---

## Fluxo Completo — Exemplo Real

### Mes de Marco/2026

**1. Custos que chegaram:**

| Fornecedor | Valor | O que fazer |
|-----------|-------|-------------|
| AWS | $350 | Custos -> Novo -> Fornecedor: AWS, Categoria: Infraestrutura Cloud, Centro: infrastructure, Valor: 350 USD |
| OpenAI | $120 | Custos -> Novo -> Fornecedor: OpenAI, Categoria: APIs de IA, Centro: ai, Valor: 120 USD |
| Google Ads | R$ 100 | Custos -> Novo -> Fornecedor: Google, Categoria: Marketing, Centro: marketing, Valor: 100 BRL |

**2. Aprovar e pagar:**
- AWS aprovado -> Pagar (conta Mercury USD, metodo: cartao)
- OpenAI aprovado -> Pagar (conta Mercury USD, metodo: cartao)
- Google Ads aprovado -> Pagar (conta Itau BRL, metodo: PIX)

**3. Receitas que entraram:**
- Paddle repassou $2.000 -> Contas a Receber -> Marcar como Recebido (conta Mercury)
- Woovi repassou R$ 3.500 -> Contas a Receber -> Marcar como Recebido (conta Itau)

**4. Resultado automatico no Fluxo de Caixa:**
- Entradas: $2.000 + R$ 3.500
- Saidas: $470 (AWS + OpenAI) + R$ 100 (Ads)
- Margem operacional calculada automaticamente
- Burn rate atualizado
- Centros de custo mostram quanto cada area gastou

**Voce nao precisa criar nada no Fluxo de Caixa manualmente** — tudo e gerado automaticamente pelos Custos e Contas a Receber.

O Fluxo de Caixa direto e so para movimentacoes atipicas (aporte, dividendos, etc).

---

## Migrando da Planilha para o Sistema

### Sua estrutura atual (planilha):
> Tabela dividida por meses, com tipo de gasto, nome e valor.
> Ex: Fev/AWS/$200, Mar/AWS/$350, Mar/Anuncio/R$100

### Passo a passo:

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

#### 3. Exemplo com seus dados

| Mes | Gasto | Fornecedor | Valor | Moeda | Categoria | Centro de Custo |
|-----|-------|-----------|-------|-------|-----------|----------------|
| Jan | — | — | — | — | — | — |
| Fev | AWS | Amazon | 200 | USD | 2.1 Infraestrutura Cloud | infrastructure |
| Mar | AWS | Amazon | 350 | USD | 2.1 Infraestrutura Cloud | infrastructure |
| Mar | Anuncio | Google | 100 | BRL | 3.2 Marketing e Anuncios | marketing |

**Resultado no sistema:**
- O **Fluxo de Caixa** mostra que em Fevereiro saiu $200 e em Marco saiu $350 + R$100
- Os **Centros de Custo** mostram quanto cada area gastou vs orcamento
- O **Plano de Contas** agrupa por tipo: quanto foi CPV vs OPEX
- Os **KPIs** calculam margem operacional e burn rate automaticamente

---

## Vantagens sobre a Planilha

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
