/**
 * MSW handlers for finance endpoints.
 * Mirrors the exact routes served by vdclip-backoffice-api in production.
 */

import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:8001/api'

// ── Mock data ──────────────────────────────────────────────────────────────

const mockCostEntries = [
  { id: 'ce-1', description: 'AWS Infrastructure', category_id: 'fc-1', category_name: 'Infraestrutura', category_external_id: 'fc-1', cost_center_id: null, cost_center_name: null, cost_center_external_id: null, recurring_parent_id: null, vendor: 'AWS', amount: '2800.00', currency: 'USD', is_recurring: true, recurrence_interval: 'monthly', recurring_since: '2025-01-01', recurring_until: null, status: 'approved', billing_date: '2026-03-01', due_date: '2026-03-15', competence_month: '2026-03-01', cost_allocation: 'r_and_d', is_variable: false, unit_metric: null, unit_quantity: null, unit_cost: null, paid_at: null, payment_method: null, financial_transaction_id: null, receipt_url: null, notes: null, created_by: 'admin@vdclip.com', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'ce-2', description: 'OpenAI API', category_id: 'fc-1', category_name: 'Infraestrutura', category_external_id: 'fc-1', cost_center_id: null, cost_center_name: null, cost_center_external_id: null, recurring_parent_id: null, vendor: 'OpenAI', amount: '1200.00', currency: 'USD', is_recurring: true, recurrence_interval: 'monthly', recurring_since: '2025-06-01', recurring_until: null, status: 'approved', billing_date: '2026-03-01', due_date: '2026-03-15', competence_month: '2026-03-01', cost_allocation: 'cogs', is_variable: true, unit_metric: 'tokens', unit_quantity: 1000000, unit_cost: '0.0012', paid_at: null, payment_method: null, financial_transaction_id: null, receipt_url: null, notes: null, created_by: 'admin@vdclip.com', created_at: '2026-02-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z' },
  { id: 'ce-3', description: 'Marketing Ads', category_id: 'fc-2', category_name: 'Marketing', category_external_id: 'fc-2', cost_center_id: null, cost_center_name: null, cost_center_external_id: null, recurring_parent_id: null, vendor: 'Meta', amount: '5000.00', currency: 'BRL', is_recurring: true, recurrence_interval: 'monthly', recurring_since: '2025-03-01', recurring_until: null, status: 'draft', billing_date: '2026-03-01', due_date: '2026-03-20', competence_month: '2026-03-01', cost_allocation: 'sales_marketing', is_variable: false, unit_metric: null, unit_quantity: null, unit_cost: null, paid_at: null, payment_method: null, financial_transaction_id: null, receipt_url: null, notes: null, created_by: 'admin@vdclip.com', created_at: '2026-01-15T00:00:00Z', updated_at: '2026-01-15T00:00:00Z' },
  { id: 'ce-4', description: 'Salários Dev Team', category_id: 'fc-3', category_name: 'Pessoal', category_external_id: 'fc-3', cost_center_id: null, cost_center_name: null, cost_center_external_id: null, recurring_parent_id: null, vendor: 'Folha de Pagamento', amount: '45000.00', currency: 'BRL', is_recurring: true, recurrence_interval: 'monthly', recurring_since: '2024-06-01', recurring_until: null, status: 'paid', billing_date: '2026-03-05', due_date: '2026-03-05', competence_month: '2026-03-01', cost_allocation: 'r_and_d', is_variable: false, unit_metric: null, unit_quantity: null, unit_cost: null, paid_at: '2026-03-05T00:00:00Z', payment_method: 'bank_transfer', financial_transaction_id: 'ft-30', receipt_url: null, notes: null, created_by: 'finance@vdclip.com', created_at: '2024-06-01T00:00:00Z', updated_at: '2026-03-05T00:00:00Z' },
  { id: 'ce-5', description: 'Legal & Accounting', category_id: 'fc-4', category_name: 'Administrativo', category_external_id: 'fc-4', cost_center_id: null, cost_center_name: null, cost_center_external_id: null, recurring_parent_id: null, vendor: 'Escritório XYZ', amount: '2800.00', currency: 'BRL', is_recurring: true, recurrence_interval: 'monthly', recurring_since: '2025-01-01', recurring_until: null, status: 'approved', billing_date: '2026-03-10', due_date: '2026-03-20', competence_month: '2026-03-01', cost_allocation: 'general_admin', is_variable: false, unit_metric: null, unit_quantity: null, unit_cost: null, paid_at: null, payment_method: null, financial_transaction_id: null, receipt_url: null, notes: null, created_by: 'admin@vdclip.com', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
]

const mockReceivables = [
  { id: 'rec-1', source_type: 'gateway_payout', source_reference: 'PAD-2026-001', description: 'Assinatura Pro - Plano Anual', customer_name: 'TechCorp Ltda', customer_external_id: 'cust-1', amount: '2388.00', currency: 'BRL', expected_date: '2026-03-15', received_at: null, status: 'pending', notes: null, cost_center_id: null, cost_center_name: null, category_id: 'fc-1', category_name: 'Receita SaaS', financial_transaction_id: null, created_by: 'admin-1', created_by_email: 'admin@vdclip.com', created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
  { id: 'rec-2', source_type: 'gateway_payout', source_reference: 'PAD-2026-002', description: 'Assinatura Enterprise', customer_name: 'MediaHouse Inc', customer_external_id: 'cust-2', amount: '499.00', currency: 'USD', expected_date: '2026-02-28', received_at: '2026-02-28', status: 'received', notes: null, cost_center_id: null, cost_center_name: null, category_id: 'fc-1', category_name: 'Receita SaaS', financial_transaction_id: 'ft-20', created_by: 'admin-1', created_by_email: 'admin@vdclip.com', created_at: '2026-02-01T00:00:00Z', updated_at: '2026-02-28T00:00:00Z' },
  { id: 'rec-3', source_type: 'invoice', source_reference: 'INV-2026-010', description: 'Pacote de Créditos Extra', customer_name: 'Studio Criativo', customer_external_id: 'cust-3', amount: '750.00', currency: 'BRL', expected_date: '2026-02-10', received_at: null, status: 'overdue', notes: 'Cliente solicitou prazo extra', cost_center_id: null, cost_center_name: null, category_id: null, category_name: null, financial_transaction_id: null, created_by: 'admin-1', created_by_email: 'admin@vdclip.com', created_at: '2026-02-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z' },
  { id: 'rec-4', source_type: 'gateway_payout', source_reference: 'PAD-2026-003', description: 'Assinatura Pro - Mensal', customer_name: 'Agência Digital BR', customer_external_id: 'cust-4', amount: '199.00', currency: 'BRL', expected_date: '2026-03-01', received_at: '2026-03-01', status: 'received', notes: null, cost_center_id: null, cost_center_name: null, category_id: 'fc-1', category_name: 'Receita SaaS', financial_transaction_id: 'ft-21', created_by: 'admin-1', created_by_email: 'admin@vdclip.com', created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
  { id: 'rec-5', source_type: 'manual', source_reference: null, description: 'Licença SDK Corporativa', customer_name: 'SoftTech Solutions', customer_external_id: null, amount: '4200.00', currency: 'USD', expected_date: '2026-04-01', received_at: null, status: 'pending', notes: null, cost_center_id: null, cost_center_name: null, category_id: null, category_name: null, financial_transaction_id: null, created_by: 'admin-1', created_by_email: 'admin@vdclip.com', created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
]

const mockBankAccounts = [
  { id: 'ba-1', name: 'Conta Corrente Principal', bank_name: 'Itaú', account_type: 'checking', agency: '1234', account_number: '56789-0', currency: 'BRL', initial_balance: '100000.00', current_balance: '125430.50', is_active: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2026-03-06T10:30:00Z' },
  { id: 'ba-2', name: 'Business Account', bank_name: 'Mercury', account_type: 'checking', agency: null, account_number: 'ACT-001', currency: 'USD', initial_balance: '20000.00', current_balance: '48200.00', is_active: true, created_at: '2025-06-01T00:00:00Z', updated_at: '2026-03-06T08:15:00Z' },
  { id: 'ba-3', name: 'Reserva', bank_name: 'Nubank', account_type: 'savings', agency: null, account_number: null, currency: 'BRL', initial_balance: '200000.00', current_balance: '250000.00', is_active: true, created_at: '2025-03-01T00:00:00Z', updated_at: '2026-03-05T23:59:00Z' },
]

const mockCashFlowUSD = {
  currency: 'USD',
  total_inflow: '28450.00',
  total_outflow: '4680.00',
  total_net: '23770.00',
  entries: [
    { period: '2025-10', inflow: '22000.00', outflow: '3800.00', net: '18200.00', currency: 'USD' },
    { period: '2025-11', inflow: '24500.00', outflow: '4100.00', net: '20400.00', currency: 'USD' },
    { period: '2025-12', inflow: '26200.00', outflow: '4300.00', net: '21900.00', currency: 'USD' },
    { period: '2026-01', inflow: '25800.00', outflow: '4500.00', net: '21300.00', currency: 'USD' },
    { period: '2026-02', inflow: '27100.00', outflow: '4600.00', net: '22500.00', currency: 'USD' },
    { period: '2026-03', inflow: '28450.00', outflow: '4680.00', net: '23770.00', currency: 'USD' },
  ],
}

const mockCashFlowBRL = {
  currency: 'BRL',
  total_inflow: '85200.00',
  total_outflow: '12400.00',
  total_net: '72800.00',
  entries: [
    { period: '2025-10', inflow: '68000.00', outflow: '9500.00', net: '58500.00', currency: 'BRL' },
    { period: '2025-11', inflow: '72000.00', outflow: '10200.00', net: '61800.00', currency: 'BRL' },
    { period: '2025-12', inflow: '78000.00', outflow: '11000.00', net: '67000.00', currency: 'BRL' },
    { period: '2026-01', inflow: '80000.00', outflow: '11500.00', net: '68500.00', currency: 'BRL' },
    { period: '2026-02', inflow: '82500.00', outflow: '12000.00', net: '70500.00', currency: 'BRL' },
    { period: '2026-03', inflow: '85200.00', outflow: '12400.00', net: '72800.00', currency: 'BRL' },
  ],
}

const mockBusinessMetrics = [
  {
    id: 'bm-1',
    month: '2026-03-01',
    cost_center_id: null,
    currency: 'USD',
    gross_revenue: '18750.00',
    net_revenue: '17200.00',
    cogs: '4200.00',
    gross_profit: '13000.00',
    gross_margin_pct: '75.58',
    total_opex: '8500.00',
    r_and_d_cost: '4500.00',
    sales_marketing_cost: '2500.00',
    general_admin_cost: '1500.00',
    net_income: '4500.00',
    burn_rate: '4000.00',
    runway_months: 12,
    cash_balance: '48000.00',
    total_customers: 727,
    new_customers: 63,
    churned_customers: 18,
    churn_rate_pct: '2.48',
    revenue_churn_rate_pct: '1.80',
    arpu: '25.79',
    ltv: '1039.06',
    cac: '150.00',
    ltv_cac_ratio: '6.93',
    payback_months: 6,
    nrr_pct: '108.50',
    quick_ratio: '3.50',
    trial_to_paid_rate_pct: '22.00',
    created_at: '2026-03-01T00:00:00Z',
  },
]

// In-memory notes store for dev mock
const mockNotes: Record<string, Array<{
  id: string
  entity_type: string
  entity_id: string
  content: string
  created_by: { id: string; name: string; email: string }
  created_at: string
  updated_at: string
}>> = {}

const mockPendingPurchases = [
  {
    id: 'pp-1',
    email: 'joao.silva@gmail.com',
    plan_tier: 'premium',
    billing_period: 'monthly',
    provider: 'paddle',
    provider_subscription_id: 'sub_paddle_001',
    provider_transaction_id: 'txn_paddle_001',
    provider_customer_id: 'ctm_paddle_001',
    currency: 'USD',
    amount: '29.99',
    credits_amount: 0,
    period_start: '2026-03-01T00:00:00Z',
    period_end: '2026-04-01T00:00:00Z',
    is_trial: false,
    status: 'pending',
    claimed_by_user_id: null,
    claimed_by_user_email: null,
    claimed_at: null,
    created_at: '2026-03-10T14:30:00Z',
    updated_at: '2026-03-10T14:30:00Z',
  },
  {
    id: 'pp-2',
    email: 'maria.santos@hotmail.com',
    plan_tier: 'ultimate',
    billing_period: 'yearly',
    provider: 'paddle',
    provider_subscription_id: 'sub_paddle_002',
    provider_transaction_id: 'txn_paddle_002',
    provider_customer_id: 'ctm_paddle_002',
    currency: 'USD',
    amount: '199.99',
    credits_amount: 0,
    period_start: '2026-02-15T00:00:00Z',
    period_end: '2027-02-15T00:00:00Z',
    is_trial: true,
    status: 'claimed',
    claimed_by_user_id: 'usr-102',
    claimed_by_user_email: 'maria.santos@hotmail.com',
    claimed_at: '2026-02-16T10:00:00Z',
    created_at: '2026-02-15T08:00:00Z',
    updated_at: '2026-02-16T10:00:00Z',
  },
  {
    id: 'pp-3',
    email: 'carlos.ferreira@outlook.com',
    plan_tier: 'lite',
    billing_period: 'monthly',
    provider: 'woovi',
    provider_subscription_id: null,
    provider_transaction_id: 'txn_woovi_001',
    provider_customer_id: 'ctm_woovi_001',
    currency: 'BRL',
    amount: '49.90',
    credits_amount: 100,
    period_start: null,
    period_end: null,
    is_trial: false,
    status: 'expired',
    claimed_by_user_id: null,
    claimed_by_user_email: null,
    claimed_at: null,
    created_at: '2026-01-20T12:00:00Z',
    updated_at: '2026-02-20T00:00:00Z',
  },
  {
    id: 'pp-4',
    email: 'ana.costa@gmail.com',
    plan_tier: 'premium',
    billing_period: 'monthly',
    provider: 'paddle',
    provider_subscription_id: 'sub_paddle_003',
    provider_transaction_id: 'txn_paddle_003',
    provider_customer_id: 'ctm_paddle_003',
    currency: 'USD',
    amount: '29.99',
    credits_amount: 0,
    period_start: '2026-03-05T00:00:00Z',
    period_end: '2026-04-05T00:00:00Z',
    is_trial: false,
    status: 'pending',
    claimed_by_user_id: null,
    claimed_by_user_email: null,
    claimed_at: null,
    created_at: '2026-03-05T09:15:00Z',
    updated_at: '2026-03-05T09:15:00Z',
  },
]

// ── Handlers ───────────────────────────────────────────────────────────────

export const financeHandlers = [
  // Cost entries
  http.get(`${BASE}/cost-entries`, () =>
    HttpResponse.json({
      items: mockCostEntries,
      total: mockCostEntries.length,
      page: 1,
      per_page: 20,
      total_pages: 1,
    }),  ),

  // Receivables
  http.get(`${BASE}/receivables`, () =>
    HttpResponse.json({
      items: mockReceivables,
      total: mockReceivables.length,
      page: 1,
      per_page: 20,
      total_pages: 1,
    }),  ),

  // Bank accounts
  http.get(`${BASE}/bank-accounts`, () =>
    HttpResponse.json({
      items: mockBankAccounts,
      total: mockBankAccounts.length,
      page: 1,
      per_page: 20,
      total_pages: 1,
    }),  ),

  // Dashboard cash flow
  http.get(`${BASE}/dashboard/cash-flow`, ({ request }) => {
    const url = new URL(request.url)
    const currency = url.searchParams.get('currency') ?? 'USD'
    return HttpResponse.json(currency === 'BRL' ? mockCashFlowBRL : mockCashFlowUSD)
  }),

  // Business metrics (SaaS) — hook expects direct array, not paginated
  http.get(`${BASE}/business-metrics`, () =>
    HttpResponse.json(mockBusinessMetrics),
  ),

  // Financial notes — list
  http.get(`${BASE}/financial-notes`, ({ request }) => {
    const url = new URL(request.url)
    const entityType = url.searchParams.get('entity_type') ?? ''
    const entityId = url.searchParams.get('entity_id') ?? ''
    const key = `${entityType}:${entityId}`
    return HttpResponse.json(mockNotes[key] ?? [])
  }),

  // Financial notes — create
  http.post(`${BASE}/financial-notes`, async ({ request }) => {
    const body = await request.json() as {
      entity_type: string
      entity_id: string
      content: string
    }
    const note = {
      id: `fn-${crypto.randomUUID().slice(0, 10)}`,
      entity_type: body.entity_type,
      entity_id: body.entity_id,
      content: body.content,
      created_by: { id: 'admin-1', name: 'Admin', email: 'admin@vdclip.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const key = `${body.entity_type}:${body.entity_id}`
    mockNotes[key] = [note, ...(mockNotes[key] ?? [])]
    return HttpResponse.json(note, { status: 201 })
  }),

  // Financial notes — delete
  http.delete(`${BASE}/financial-notes/:noteId`, ({ params }) => {
    const noteId = params.noteId as string
    for (const key of Object.keys(mockNotes)) {
      mockNotes[key] = mockNotes[key].filter((n) => n.id !== noteId)
    }
    return HttpResponse.json({ message: 'Note deleted' })
  }),

  // Pending purchases — list
  http.get(`${BASE}/platform/pending-purchases`, ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const provider = url.searchParams.get('provider')
    const email = url.searchParams.get('email')
    const page = Number(url.searchParams.get('page') ?? '1')
    const perPage = Number(url.searchParams.get('per_page') ?? '10')

    let filtered = [...mockPendingPurchases]
    if (status)
      filtered = filtered.filter((p) => p.status === status)
    if (provider)
      filtered = filtered.filter((p) => p.provider === provider)
    if (email) {
      const q = email.toLowerCase()
      filtered = filtered.filter((p) => p.email.toLowerCase().includes(q))
    }

    const total = filtered.length
    const start = (page - 1) * perPage
    const items = filtered.slice(start, start + perPage)

    return HttpResponse.json({
      items,
      total,
      page,
      per_page: perPage,
      total_pages: Math.max(1, Math.ceil(total / perPage)),
    })
  }),

  // Pending purchases — dismiss
  http.post(`${BASE}/platform/pending-purchases/:id/dismiss`, ({ params }) => {
    const purchase = mockPendingPurchases.find((p) => p.id === params.id)
    if (purchase) {
      purchase.status = 'expired'
      purchase.updated_at = new Date().toISOString()
    }
    return HttpResponse.json({ message: 'Purchase dismissed' })
  }),

  // Pending purchases — cancel on provider
  http.post(`${BASE}/platform/pending-purchases/:id/cancel`, ({ params }) => {
    const purchase = mockPendingPurchases.find((p) => p.id === params.id)
    if (purchase) {
      purchase.status = 'expired'
      purchase.updated_at = new Date().toISOString()
    }
    return HttpResponse.json({ message: 'Purchase cancelled on provider' })
  }),
]
