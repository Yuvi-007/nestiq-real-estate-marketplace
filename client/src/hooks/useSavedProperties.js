import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'

import useAuth from './useAuth'
import { propertyService } from '../services/api'

const getPropertyId = (property) => {
  if (!property) return ''
  return typeof property === 'string' ? property : property._id
}

export function useSavedProperties() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { user, isAuthenticated, updateSavedProperties, clearAuth } = useAuth()
  const [savingPropertyId, setSavingPropertyId] = useState(null)

  const savedPropertyIds = useMemo(
    () => new Set((user?.savedProperties || []).map(getPropertyId).filter(Boolean)),
    [user?.savedProperties],
  )

  const isPropertySaved = (propertyId) => savedPropertyIds.has(propertyId)

  const toggleSavedProperty = async (propertyId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return null
    }

    setSavingPropertyId(propertyId)

    try {
      const response = await propertyService.toggleSavedProperty(propertyId)
      updateSavedProperties(response.savedProperties || [])
      queryClient.invalidateQueries({ queryKey: ['savedProperties'] })
      return response
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuth()
        navigate('/login', { state: { from: location } })
        return null
      }

      throw new Error(error.response?.data?.message || 'Unable to update saved property', { cause: error })
    } finally {
      setSavingPropertyId(null)
    }
  }

  return {
    savedProperties: user?.savedProperties || [],
    savedPropertyIds,
    savingPropertyId,
    isPropertySaved,
    toggleSavedProperty,
  }
}

export default useSavedProperties
