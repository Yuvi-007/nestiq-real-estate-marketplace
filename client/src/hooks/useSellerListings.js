import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { propertyService, userService } from '../services/api'

export function useSellerListings() {
  const queryClient = useQueryClient()

  const listingsQuery = useQuery({
    queryKey: ['sellerListings'],
    queryFn: userService.getMyListings,
  })

  const createListing = useMutation({
    mutationFn: propertyService.createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerListings'] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })

  const deleteListing = useMutation({
    mutationFn: propertyService.deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerListings'] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })

  return {
    listings: listingsQuery.data?.data || [],
    isLoading: listingsQuery.isLoading,
    isError: listingsQuery.isError,
    error: listingsQuery.error,
    refetch: listingsQuery.refetch,
    createListing,
    deleteListing,
  }
}

export default useSellerListings
