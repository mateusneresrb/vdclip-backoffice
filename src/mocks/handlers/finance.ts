/**
 * MSW handlers for finance endpoints.
 * Mirrors the exact routes served by vdclip-backoffice-api in production.
 */

import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:8001/api'

// ── Mock data ──────────────────────────────────────────────────────────────

const mockCostEntries = [
  { id: 'ce-1', description: 'AWS Infrastructure', category_id: 'fc-1', category_name: 'Infraestrutura', cost_center_id: null, cost_center_name: null, vendor: 'AWS', amount: '2800.00', currency: 'USD', is_recurring: true, recurrence_interval: 'monthly', status: 'approved', billing_date: '2026-03-01', due_date: '2026-03-15', competence_month: '2026-03-01', cost_allocation: 'r_and_d', is_variable: false, notes: null, created_by: 'admin@vdclip.com', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'ce-2', description: 'OpenAI API', category_id: 'fc-1', category_name: 'Infraestrutura', cost_center_id: null, cost_center_name: null, vendor: 'OpenAI', amount: '1200.00', currency: 'USD', is_recurring: true, recurrence_interval: 'monthly', status: 'approved', billing_date: '2026-03-01', due_date: '2026-03-15', competence_month: '2026-03-01', cost_allocation: 'cogs', is_variable: true, notes: null, created_by: 'admin@vdclip.com', created_at: '2026-02-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z' },
  { id: 'ce-3', description: 'Marketing Ads', category_id: 'fc-2', category_name: 'Marketing', cost_center_id: null, cost_center_name: null, vendor: 'Meta', amount: '5000.00', currency: 'BRL', is_recurring: true, recurrence_interval: 'monthly', status: 'draft', billing_date: '2026-03-01', due_date: '2026-03-20', competence_month: '2026-03-01', cost_allocation: 'sales_marketing', is_variable: false, notes: null, created_by: 'admin@vdclip.com', created_at: '2026-01-15T00:00:00Z', updated_at: '2026-01-15T00:00:00Z' },
  { id: 'ce-4', description: 'Salários Dev Team', category_id: 'fc-3', category_name: 'Pessoal', cost_center_id: null, cost_center_name: null, vendor: 'Folha de Pagamento', amount: '45000.00', currency: 'BRL', is_recurring: true, recurrence_interval: 'monthly', status: 'paid', billing_date: '2026-03-05', due_date: '2026-03-05', competence_month: '2026-03-01', cost_allocation: 'r_and_d', is_variable: false, notes: null, created_by: 'finance@vdclip.com', created_at: '2024-06-01T00:00:00Z', updated_at: '2026-03-05T00:00:00Z' },
  { id: 'ce-5', description: 'Legal & Accounting', category_id: 'fc-4', category_name: 'Administrativo', cost_center_id: null, cost_center_name: null, vendor: 'Escritório XYZ', amount: '2800.00', currency: 'BRL', is_recurring: true, recurrence_interval: 'monthly', status: 'approved', billing_date: '2026-03-10', due_date: '2026-03-20', competence_month: '2026-03-01', cost_allocation: 'general_admin', is_variable: false, notes: null, created_by: 'admin@vdclip.com', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
]

const mockReceivables = [
  { id: 'rec-1', source_type: 'subscription', description: 'Assinatura Pro - Plano Anual', customer_name: 'TechCorp Ltda', amount: '2388.00', currency: 'BRL', expected_date: '2026-03-15', received_at: null, status: 'pending', notes: null, created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
  { id: 'rec-2', source_type: 'subscription', description: 'Assinatura Enterprise', customer_name: 'MediaHouse Inc', amount: '499.00', currency: 'USD', expected_date: '2026-02-28', received_at: '2026-02-28', status: 'received', notes: null, created_at: '2026-02-01T00:00:00Z', updated_at: '2026-02-28T00:00:00Z' },
  { id: 'rec-3', source_type: 'one_time', description: 'Pacote de Créditos Extra', customer_name: 'Studio Criativo', amount: '750.00', currency: 'BRL', expected_date: '2026-02-10', received_at: null, status: 'overdue', notes: 'Cliente solicitou prazo extra', created_at: '2026-02-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z' },
  { id: 'rec-4', source_type: 'subscription', description: 'Assinatura Pro - Mensal', customer_name: 'Agência Digital BR', amount: '199.00', currency: 'BRL', expected_date: '2026-03-01', received_at: '2026-03-01', status: 'received', notes: null, created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
  { id: 'rec-5', source_type: 'manual', description: 'Licença SDK Corporativa', customer_name: 'SoftTech Solutions', amount: '4200.00', currency: 'USD', expected_date: '2026-04-01', received_at: null, status: 'pending', notes: null, created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
]

const mockBankAccounts = [
  { id: 'ba-1', name: 'Conta Corrente Principal', bank: 'Itaú', account_type: 'checking', currency: 'BRL', balance: '125430.50', last_sync_at: '2026-03-06T10:30:00Z', is_active: true },
  { id: 'ba-2', name: 'Business Account', bank: 'Mercury', account_type: 'checking', currency: 'USD', balance: '48200.00', last_sync_at: '2026-03-06T08:15:00Z', is_active: true },
  { id: 'ba-3', name: 'Reserva', bank: 'Nubank', account_type: 'savings', currency: 'BRL', balance: '250000.00', last_sync_at: '2026-03-05T23:59:00Z', is_active: true },
]

const mockCashFlowUSD = {
  currency: 'USD',
  total_inflow: '28450.00',
  total_outflow: '4680.00',
  net_flow: '23770.00',
  monthly_breakdown: [
    { month: '2025-10', inflow: '22000.00', outflow: '3800.00' },
    { month: '2025-11', inflow: '24500.00', outflow: '4100.00' },
    { month: '2025-12', inflow: '26200.00', outflow: '4300.00' },
    { month: '2026-01', inflow: '25800.00', outflow: '4500.00' },
    { month: '2026-02', inflow: '27100.00', outflow: '4600.00' },
    { month: '2026-03', inflow: '28450.00', outflow: '4680.00' },
  ],
  entries: [
    { id: 'ft-1', transaction_date: '2026-03-05', description: 'Paddle subscription payments', category_name: 'Receita SaaS', direction: 'inflow', currency: 'USD', amount: '12500.00', type: 'revenue', created_at: '2026-03-05T00:00:00Z' },
    { id: 'ft-2', transaction_date: '2026-03-04', description: 'AWS infrastructure costs', category_name: 'Infraestrutura', direction: 'outflow', currency: 'USD', amount: '2800.00', type: 'expense', created_at: '2026-03-04T00:00:00Z' },
    { id: 'ft-3', transaction_date: '2026-03-03', description: 'Credit package purchases', category_name: 'Créditos', direction: 'inflow', currency: 'USD', amount: '8950.00', type: 'revenue', created_at: '2026-03-03T00:00:00Z' },
    { id: 'ft-4', transaction_date: '2026-03-02', description: 'Stripe processing fees', category_name: 'Taxas', direction: 'outflow', currency: 'USD', amount: '450.00', type: 'tax', created_at: '2026-03-02T00:00:00Z' },
  ],
}

const mockCashFlowBRL = {
  currency: 'BRL',
  total_inflow: '85200.00',
  total_outflow: '12400.00',
  net_flow: '72800.00',
  monthly_breakdown: [
    { month: '2025-10', inflow: '68000.00', outflow: '9500.00' },
    { month: '2025-11', inflow: '72000.00', outflow: '10200.00' },
    { month: '2025-12', inflow: '78000.00', outflow: '11000.00' },
    { month: '2026-01', inflow: '80000.00', outflow: '11500.00' },
    { month: '2026-02', inflow: '82500.00', outflow: '12000.00' },
    { month: '2026-03', inflow: '85200.00', outflow: '12400.00' },
  ],
  entries: [
    { id: 'ft-9', transaction_date: '2026-03-05', description: 'PIX subscription payments', category_name: 'Receita SaaS', direction: 'inflow', currency: 'BRL', amount: '35000.00', type: 'revenue', created_at: '2026-03-05T00:00:00Z' },
    { id: 'ft-10', transaction_date: '2026-03-04', description: 'Woovi gateway fees', category_name: 'Taxas', direction: 'outflow', currency: 'BRL', amount: '1200.00', type: 'tax', created_at: '2026-03-04T00:00:00Z' },
    { id: 'ft-11', transaction_date: '2026-03-03', description: 'PIX subscription payments', category_name: 'Receita SaaS', direction: 'inflow', currency: 'BRL', amount: '28200.00', type: 'revenue', created_at: '2026-03-03T00:00:00Z' },
    { id: 'ft-12', transaction_date: '2026-03-02', description: 'ISS/PIS/COFINS', category_name: 'Impostos', direction: 'outflow', currency: 'BRL', amount: '5400.00', type: 'tax', created_at: '2026-03-02T00:00:00Z' },
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

  // Business metrics (SaaS)
  http.get(`${BASE}/business-metrics`, () =>
    HttpResponse.json({
      items: mockBusinessMetrics,
      total: mockBusinessMetrics.length,
      page: 1,
      per_page: 20,
      total_pages: 1,
    }),  ),

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
]
