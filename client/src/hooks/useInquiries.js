import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { inquiryService } from '../services/api'

export function useInquiries(enabled = true) {
  const queryClient = useQueryClient()

  const inquiriesQuery = useQuery({
    queryKey: ['inquiries'],
    queryFn: inquiryService.getMyInquiries,
    enabled,
  })

  const createInquiry = useMutation({
    mutationFn: inquiryService.createInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    },
  })

  const updateInquiryStatus = useMutation({
    mutationFn: ({ id, status }) => inquiryService.updateInquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    },
  })

  return {
    inquiries: inquiriesQuery.data?.data || [],
    isLoading: inquiriesQuery.isLoading,
    isError: inquiriesQuery.isError,
    error: inquiriesQuery.error,
    refetch: inquiriesQuery.refetch,
    createInquiry,
    updateInquiryStatus,
  }
}

export default useInquiries
