import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { propertyService } from '../services/api'

export const useProperties = (params = {}) => {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => propertyService.getProperties(params),
    placeholderData: keepPreviousData,
  })
}
