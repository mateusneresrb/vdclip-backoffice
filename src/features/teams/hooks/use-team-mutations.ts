import type { AdminTeamDetail, UserPlan } from '@/features/admin/types'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { i18n } from '@/i18n'
import { apiClient } from '@/lib/api-client'
import { showMutationError, showSuccessToast } from '@/lib/toast'

export function useTeamMutations() {
  const queryClient = useQueryClient()

  const invalidateTeam = (teamId: string) => {
    queryClient.invalidateQueries({ queryKey: ['team-detail', teamId] })
    queryClient.invalidateQueries({ queryKey: ['admin-teams'] })
  }

  const changePlan = useMutation({
    mutationFn: async ({ teamId, plan, reason }: { teamId: string; plan: UserPlan; reason?: string }) => {
      await apiClient.patch(`/platform/teams/${teamId}/plan`, { plan, reason })
      return { teamId, plan }
    },
    onSuccess: ({ teamId, plan }) => {
      queryClient.setQueryData<AdminTeamDetail>(
        ['team-detail', teamId],
        (old) => (old ? { ...old, plan } : old),
      )
      invalidateTeam(teamId)
      showSuccessToast({ title: i18n.t('admin:teams.toast.planChanged') })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:teams.toast.planChangeError'))
    },
  })

  const cancelPlan = useMutation({
    mutationFn: async ({ teamId }: { teamId: string }) => {
      await apiClient.post(`/platform/teams/${teamId}/cancel-plan`, {})
      return { teamId }
    },
    onSuccess: ({ teamId }) => {
      invalidateTeam(teamId)
      showSuccessToast({ title: i18n.t('admin:teams.toast.planCancelled') })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:teams.toast.planCancelError'))
    },
  })

  const updateTeam = useMutation({
    mutationFn: async ({ teamId, name, email, category }: {
      teamId: string
      name?: string
      email?: string
      category?: string
    }) => {
      await apiClient.patch(`/platform/teams/${teamId}`, { name, email, category })
      return { teamId }
    },
    onSuccess: ({ teamId }) => {
      invalidateTeam(teamId)
      showSuccessToast({ title: i18n.t('admin:teams.toast.teamUpdated') })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:teams.toast.teamUpdateError'))
    },
  })

  const deleteTeam = useMutation({
    mutationFn: async ({ teamId }: { teamId: string }) => {
      await apiClient.delete(`/platform/teams/${teamId}`)
      return { teamId }
    },
    onSuccess: ({ teamId }) => {
      invalidateTeam(teamId)
      showSuccessToast({ title: i18n.t('admin:teams.toast.teamDeleted') })
    },
    onError: (err) => {
      showMutationError(err, i18n.t('admin:teams.toast.teamDeleteError'))
    },
  })

  return { changePlan, cancelPlan, updateTeam, deleteTeam }
}
