import type { BusinessCompanyDetail } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockCompanyDetail: Record<string, BusinessCompanyDetail> = {
  '1': {
    id: '1',
    externalId: 'bc_001',
    name: 'Acme Corp',
    document: '12.345.678/0001-90',
    plan: 'enterprise',
    status: 'active',
    userCount: 12,
    createdAt: '2025-04-01T00:00:00Z',
    contactEmail: 'contato@acmecorp.com',
    phone: '+55 11 99999-0001',
    address: 'Av. Paulista, 1000 - Sao Paulo, SP',
    subscription: {
      planTier: 'enterprise',
      status: 'active',
      currentPeriodStart: '2026-02-01T00:00:00Z',
      currentPeriodEnd: '2026-03-01T00:00:00Z',
      monthlyPrice: 499.00,
      currency: 'BRL',
      cancelAtPeriodEnd: false,
    },
    users: [
      { id: 'u1', name: 'Carlos Silva', email: 'carlos@acmecorp.com', role: 'owner', status: 'active', joinedAt: '2025-04-01T00:00:00Z', lastLogin: '2026-03-05T14:30:00Z' },
      { id: 'u2', name: 'Ana Santos', email: 'ana@acmecorp.com', role: 'admin', status: 'active', joinedAt: '2025-04-15T00:00:00Z', lastLogin: '2026-03-04T09:00:00Z' },
      { id: 'u3', name: 'Pedro Lima', email: 'pedro@acmecorp.com', role: 'member', status: 'active', joinedAt: '2025-05-01T00:00:00Z', lastLogin: '2026-03-03T16:45:00Z' },
      { id: 'u4', name: 'Julia Oliveira', email: 'julia@acmecorp.com', role: 'member', status: 'inactive', joinedAt: '2025-06-01T00:00:00Z', lastLogin: '2025-12-20T10:00:00Z' },
      { id: 'u5', name: 'Rafael Costa', email: 'rafael@acmecorp.com', role: 'viewer', status: 'active', joinedAt: '2025-07-10T00:00:00Z', lastLogin: '2026-03-05T11:20:00Z' },
    ],
    billingHistory: [
      { id: 'b1', date: '2026-03-01T00:00:00Z', description: 'Assinatura Enterprise - Marco 2026', amount: 499.00, currency: 'BRL', status: 'paid' },
      { id: 'b2', date: '2026-02-01T00:00:00Z', description: 'Assinatura Enterprise - Fevereiro 2026', amount: 499.00, currency: 'BRL', status: 'paid' },
      { id: 'b3', date: '2026-01-01T00:00:00Z', description: 'Assinatura Enterprise - Janeiro 2026', amount: 499.00, currency: 'BRL', status: 'paid' },
      { id: 'b4', date: '2025-12-01T00:00:00Z', description: 'Assinatura Enterprise - Dezembro 2025', amount: 499.00, currency: 'BRL', status: 'paid' },
      { id: 'b5', date: '2025-11-01T00:00:00Z', description: 'Assinatura Enterprise - Novembro 2025', amount: 399.00, currency: 'BRL', status: 'paid' },
    ],
    activityLog: [
      { id: 'a1', timestamp: '2026-03-05T14:30:00Z', action: 'login', actor: 'Carlos Silva', details: 'Login realizado com sucesso' },
      { id: 'a2', timestamp: '2026-03-04T16:00:00Z', action: 'user_invited', actor: 'Ana Santos', details: 'Convidou marcos@acmecorp.com como membro' },
      { id: 'a3', timestamp: '2026-03-03T10:15:00Z', action: 'settings_updated', actor: 'Carlos Silva', details: 'Atualizou as configuracoes da empresa' },
      { id: 'a4', timestamp: '2026-03-01T00:00:00Z', action: 'billing_paid', actor: 'Sistema', details: 'Pagamento de R$ 499,00 processado com sucesso' },
      { id: 'a5', timestamp: '2026-02-28T09:30:00Z', action: 'user_removed', actor: 'Ana Santos', details: 'Removeu julia@acmecorp.com da empresa' },
    ],
  },
  '2': {
    id: '2',
    externalId: 'bc_002',
    name: 'Tech Startup',
    document: '98.765.432/0001-10',
    plan: 'business',
    status: 'active',
    userCount: 5,
    createdAt: '2025-07-15T00:00:00Z',
    contactEmail: 'hello@techstartup.io',
    phone: '+55 21 98888-0002',
    address: 'Rua do Catete, 200 - Rio de Janeiro, RJ',
    subscription: {
      planTier: 'business',
      status: 'active',
      currentPeriodStart: '2026-02-15T00:00:00Z',
      currentPeriodEnd: '2026-03-15T00:00:00Z',
      monthlyPrice: 199.00,
      currency: 'BRL',
      cancelAtPeriodEnd: false,
    },
    users: [
      { id: 'u6', name: 'Mariana Souza', email: 'mariana@techstartup.io', role: 'owner', status: 'active', joinedAt: '2025-07-15T00:00:00Z', lastLogin: '2026-03-05T18:00:00Z' },
      { id: 'u7', name: 'Bruno Ferreira', email: 'bruno@techstartup.io', role: 'admin', status: 'active', joinedAt: '2025-08-01T00:00:00Z', lastLogin: '2026-03-05T12:00:00Z' },
    ],
    billingHistory: [
      { id: 'b6', date: '2026-02-15T00:00:00Z', description: 'Assinatura Business - Marco 2026', amount: 199.00, currency: 'BRL', status: 'paid' },
      { id: 'b7', date: '2026-01-15T00:00:00Z', description: 'Assinatura Business - Fevereiro 2026', amount: 199.00, currency: 'BRL', status: 'paid' },
    ],
    activityLog: [
      { id: 'a6', timestamp: '2026-03-05T18:00:00Z', action: 'login', actor: 'Mariana Souza', details: 'Login realizado com sucesso' },
      { id: 'a7', timestamp: '2026-03-02T14:00:00Z', action: 'settings_updated', actor: 'Bruno Ferreira', details: 'Atualizou dados de contato' },
    ],
  },
}

const businessCompanyDetailKeys = {
  all: ['business-company-detail'] as const,
  detail: (id: string) => [...businessCompanyDetailKeys.all, id] as const,
}

export function useBusinessCompanyDetail(companyId: string) {
  return useQuery({
    queryKey: businessCompanyDetailKeys.detail(companyId),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return mockCompanyDetail[companyId] ?? null
    },
  })
}
