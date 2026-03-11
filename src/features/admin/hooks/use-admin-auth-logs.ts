import type { AuthLogEntry } from '../types'

import { useQuery } from '@tanstack/react-query'

const mockLogs: AuthLogEntry[] = [
  // VDClip users
  { id: '1', userId: 101, userName: 'John Doe', userEmail: 'john@example.com', userSource: 'vdclip', eventType: 'login_success', ipAddress: '189.45.32.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0) Chrome/120', metadata: null, createdAt: '2026-03-06T09:30:00Z' },
  { id: '2', userId: 102, userName: 'Maria Silva', userEmail: 'maria@example.com', userSource: 'vdclip', eventType: 'login_failed', ipAddress: '201.12.45.88', userAgent: 'Mozilla/5.0 (iPhone) Safari/17', metadata: { reason: 'invalid_password' }, createdAt: '2026-03-06T09:25:00Z' },
  { id: '3', userId: 102, userName: 'Maria Silva', userEmail: 'maria@example.com', userSource: 'vdclip', eventType: 'login_failed', ipAddress: '201.12.45.88', userAgent: 'Mozilla/5.0 (iPhone) Safari/17', metadata: { reason: 'invalid_password' }, createdAt: '2026-03-06T09:24:00Z' },
  { id: '4', userId: 102, userName: 'Maria Silva', userEmail: 'maria@example.com', userSource: 'vdclip', eventType: 'login_failed', ipAddress: '201.12.45.88', userAgent: 'Mozilla/5.0 (iPhone) Safari/17', metadata: { reason: 'invalid_password' }, createdAt: '2026-03-06T09:23:00Z' },
  { id: '5', userId: 102, userName: 'Maria Silva', userEmail: 'maria@example.com', userSource: 'vdclip', eventType: 'login_failed', ipAddress: '201.12.45.88', userAgent: 'Mozilla/5.0 (iPhone) Safari/17', metadata: { reason: 'invalid_password' }, createdAt: '2026-03-06T09:22:00Z' },
  { id: '6', userId: 102, userName: 'Maria Silva', userEmail: 'maria@example.com', userSource: 'vdclip', eventType: 'account_locked', ipAddress: '201.12.45.88', userAgent: 'Mozilla/5.0 (iPhone) Safari/17', metadata: { attempts: 5, lockDurationMinutes: 30 }, createdAt: '2026-03-06T09:22:30Z' },
  { id: '7', userId: 103, userName: 'Carlos Souza', userEmail: 'carlos@example.com', userSource: 'vdclip', eventType: 'password_changed', ipAddress: '177.20.10.55', userAgent: 'Mozilla/5.0 (Macintosh) Firefox/121', metadata: null, createdAt: '2026-03-06T09:10:00Z' },
  { id: '8', userId: 104, userName: 'Ana Costa', userEmail: 'ana@example.com', userSource: 'vdclip', eventType: 'oauth_connected', ipAddress: '189.100.22.33', userAgent: 'Mozilla/5.0 (Windows NT 10.0) Chrome/120', metadata: { provider: 'google' }, createdAt: '2026-03-06T08:55:00Z' },
  { id: '9', userId: 105, userName: 'Pedro Lima', userEmail: 'pedro@example.com', userSource: 'vdclip', eventType: 'login_success', ipAddress: '200.150.60.44', userAgent: 'Mozilla/5.0 (Windows NT 10.0) Edge/120', metadata: null, createdAt: '2026-03-06T08:30:00Z' },
  { id: '10', userId: 106, userName: 'Lucas Mendes', userEmail: 'lucas@example.com', userSource: 'vdclip', eventType: 'login_failed', ipAddress: '189.33.44.55', userAgent: 'Mozilla/5.0 (Android) Chrome/120', metadata: { reason: 'mfa_failed' }, createdAt: '2026-03-06T08:10:00Z' },
  { id: '11', userId: 107, userName: 'Carla Braga', userEmail: 'carla@example.com', userSource: 'vdclip', eventType: 'login_success', ipAddress: '200.99.11.22', userAgent: 'Mozilla/5.0 (Macintosh) Firefox/121', metadata: null, createdAt: '2026-03-05T22:40:00Z' },
  { id: '12', userId: 108, userName: 'Elisa Porto', userEmail: 'elisa@example.com', userSource: 'vdclip', eventType: 'token_refreshed', ipAddress: '177.55.66.77', userAgent: 'Mozilla/5.0 (iPhone) Safari/17', metadata: null, createdAt: '2026-03-05T21:00:00Z' },
  { id: '13', userId: 109, userName: 'Fábio Gomes', userEmail: 'fabio@example.com', userSource: 'vdclip', eventType: 'oauth_disconnected', ipAddress: '189.88.12.77', userAgent: 'Mozilla/5.0 (Windows NT 10.0) Chrome/120', metadata: { provider: 'github' }, createdAt: '2026-03-05T18:20:00Z' },
  { id: '14', userId: 110, userName: 'Giovana Reis', userEmail: 'giovana@example.com', userSource: 'vdclip', eventType: 'login_success', ipAddress: '201.77.88.99', userAgent: 'Mozilla/5.0 (Windows NT 10.0) Edge/120', metadata: null, createdAt: '2026-03-05T14:30:00Z' },
  { id: '15', userId: 111, userName: 'Henrique Leal', userEmail: 'henrique@example.com', userSource: 'vdclip', eventType: 'oauth_connected', ipAddress: '200.11.22.33', userAgent: 'Mozilla/5.0 (Macintosh) Safari/17', metadata: { provider: 'google' }, createdAt: '2026-03-05T11:50:00Z' },
  // VDClip Business users
  { id: '16', userId: 501, userName: 'Rafael Nunes', userEmail: 'rafael@agencia.com.br', userSource: 'business', eventType: 'login_success', ipAddress: '179.22.100.10', userAgent: 'Mozilla/5.0 (Windows NT 10.0) Chrome/120', metadata: { companyId: 'comp_12', companyName: 'Agência Criativa' }, createdAt: '2026-03-06T09:00:00Z' },
  { id: '17', userId: 502, userName: 'Tatiane Borges', userEmail: 'tatiane@mediahouse.com', userSource: 'business', eventType: 'login_failed', ipAddress: '45.60.80.100', userAgent: 'Mozilla/5.0 (Macintosh) Chrome/120', metadata: { reason: 'invalid_password', companyId: 'comp_17' }, createdAt: '2026-03-06T08:45:00Z' },
  { id: '18', userId: 502, userName: 'Tatiane Borges', userEmail: 'tatiane@mediahouse.com', userSource: 'business', eventType: 'login_success', ipAddress: '45.60.80.100', userAgent: 'Mozilla/5.0 (Macintosh) Chrome/120', metadata: { companyId: 'comp_17', companyName: 'Media House' }, createdAt: '2026-03-06T08:46:00Z' },
  { id: '19', userId: 503, userName: 'Breno Cardoso', userEmail: 'breno@studio8.com', userSource: 'business', eventType: 'password_changed', ipAddress: '200.200.10.5', userAgent: 'Mozilla/5.0 (Windows NT 10.0) Firefox/121', metadata: { companyId: 'comp_8', companyName: 'Studio 8' }, createdAt: '2026-03-05T17:15:00Z' },
  { id: '20', userId: 504, userName: 'Lúcia Teixeira', userEmail: 'lucia@grupovid.com', userSource: 'business', eventType: 'login_failed', ipAddress: '187.50.30.90', userAgent: 'Mozilla/5.0 (Android) Chrome/120', metadata: { reason: 'mfa_failed', companyId: 'comp_3' }, createdAt: '2026-03-05T16:00:00Z' },
  { id: '21', userId: 504, userName: 'Lúcia Teixeira', userEmail: 'lucia@grupovid.com', userSource: 'business', eventType: 'login_failed', ipAddress: '187.50.30.90', userAgent: 'Mozilla/5.0 (Android) Chrome/120', metadata: { reason: 'mfa_failed', companyId: 'comp_3' }, createdAt: '2026-03-05T16:01:00Z' },
  { id: '22', userId: 504, userName: 'Lúcia Teixeira', userEmail: 'lucia@grupovid.com', userSource: 'business', eventType: 'account_locked', ipAddress: '187.50.30.90', userAgent: 'Mozilla/5.0 (Android) Chrome/120', metadata: { attempts: 3, reason: 'mfa_failed', companyId: 'comp_3', lockDurationMinutes: 15 }, createdAt: '2026-03-05T16:02:00Z' },
  { id: '23', userId: 505, userName: 'Eduardo Melo', userEmail: 'edu@producoramax.com', userSource: 'business', eventType: 'oauth_connected', ipAddress: '177.90.44.22', userAgent: 'Mozilla/5.0 (Macintosh) Safari/17', metadata: { provider: 'google', companyId: 'comp_5', companyName: 'Produtora Max' }, createdAt: '2026-03-05T14:10:00Z' },
  { id: '24', userId: 506, userName: 'Amanda Vieira', userEmail: 'amanda@contentlab.io', userSource: 'business', eventType: 'login_success', ipAddress: '200.44.88.120', userAgent: 'Mozilla/5.0 (Windows NT 10.0) Chrome/120', metadata: { companyId: 'comp_21', companyName: 'Content Lab' }, createdAt: '2026-03-05T10:30:00Z' },
  { id: '25', userId: 507, userName: 'Rodrigo Pinheiro', userEmail: 'rodrigo@clipfactory.com', userSource: 'business', eventType: 'login_success', ipAddress: '189.60.50.40', userAgent: 'Mozilla/5.0 (Windows NT 10.0) Edge/120', metadata: { companyId: 'comp_9', companyName: 'Clip Factory' }, createdAt: '2026-03-04T15:00:00Z' },
]

const adminAuthLogsKeys = {
  all: ['admin-auth-logs'] as const,
  search: (query: string) => [...adminAuthLogsKeys.all, query] as const,
}

export function useAdminAuthLogs(search: string = '') {
  return useQuery({
    queryKey: adminAuthLogsKeys.search(search),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      if (!search) 
return mockLogs
      const q = search.toLowerCase()
      return mockLogs.filter(
        (l) =>
          l.userName?.toLowerCase().includes(q) ||
          l.userEmail?.toLowerCase().includes(q) ||
          l.ipAddress?.includes(q),
      )
    },
  })
}
