import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { visitService } from '../services/api'

export function useVisits(enabled = true) {
  const queryClient = useQueryClient()

  const visitsQuery = useQuery({
    queryKey: ['visits'],
    queryFn: visitService.getVisits,
    enabled,
  })

  const createVisit = useMutation({
    mutationFn: visitService.createVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    },
  })

  const updateVisitStatus = useMutation({
    mutationFn: ({ id, status }) => visitService.updateVisitStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    },
  })

  return {
    visits: visitsQuery.data?.data || [],
    isLoading: visitsQuery.isLoading,
    isError: visitsQuery.isError,
    error: visitsQuery.error,
    refetch: visitsQuery.refetch,
    createVisit,
    updateVisitStatus,
  }
}

export default useVisits
