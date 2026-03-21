import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

interface VideoSourcesResponse {
  providers: Record<string, boolean>
}

const videoSourceKeys = {
  all: ['video-sources'] as const,
}

export function useVideoSources() {
  return useQuery({
    queryKey: videoSourceKeys.all,
    queryFn: () => apiClient.get<VideoSourcesResponse>('/platform/video-sources'),
  })
}

export function useUpdateVideoSources() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (providers: Record<string, boolean>) =>
      apiClient.patch<VideoSourcesResponse>('/platform/video-sources', { providers }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoSourceKeys.all })
    },
  })
}
