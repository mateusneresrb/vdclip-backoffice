# Feature: Teams

**Route**: `/teams` e `/teams/$teamId` | **Permission**: `TEAMS_READ` / `TEAMS_WRITE`

Gestão de times do produto VDClip.

## Componentes
- `teams-overview.tsx` — listagem de times com busca e paginação
- `team-detail.tsx` — detalhe do time com 2 tabs
- `team-members-tab.tsx` — membros do time, roles, ações
- `team-invitations-tab.tsx` — convites pendentes/expirados

## Hooks
```ts
useTeams(filters)              → { teams: AdminTeamDetail[], total }
useTeamDetail(teamId)          → AdminTeamDetail
useTeamMembers(teamId)         → TeamMember[]
useTeamInvitations(teamId)     → TeamInvitation[]
```

## Types (de `@/features/admin/types`)
```ts
AdminTeamDetail  // { id, name, picture, plan, memberCount, maxMembers, storageUsed, credits, ... }
TeamInvitation   // { email, role, status: 'pending'|'accepted'|'expired', expiresAt }
TeamMember       // { id, name, email, role: 'owner'|'admin'|'member' }
```
