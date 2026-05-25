import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminService } from '../services/api'

export function useAdmin(roleFilter = '', enabled = true) {
  const queryClient = useQueryClient()

  const statsQuery = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getStats,
    enabled,
  })

  const usersQuery = useQuery({
    queryKey: ['adminUsers', roleFilter],
    queryFn: () => adminService.getUsers(roleFilter ? { role: roleFilter } : {}),
    enabled,
  })

  const propertiesQuery = useQuery({
    queryKey: ['adminProperties'],
    queryFn: adminService.getProperties,
    enabled,
  })

  const refreshAdminData = () => {
    queryClient.invalidateQueries({ queryKey: ['adminStats'] })
    queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    queryClient.invalidateQueries({ queryKey: ['adminProperties'] })
    queryClient.invalidateQueries({ queryKey: ['properties'] })
  }

  const updateUser = useMutation({
    mutationFn: ({ id, payload }) => adminService.updateUser(id, payload),
    onSuccess: refreshAdminData,
  })

  const deleteUser = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: refreshAdminData,
  })

  const approveProperty = useMutation({
    mutationFn: adminService.approveProperty,
    onSuccess: refreshAdminData,
  })

  const rejectProperty = useMutation({
    mutationFn: ({ id, rejectionReason }) => adminService.rejectProperty(id, rejectionReason),
    onSuccess: refreshAdminData,
  })

  const updatePropertyStatus = useMutation({
    mutationFn: ({ id, status }) => adminService.updatePropertyStatus(id, status),
    onSuccess: refreshAdminData,
  })

  const approveVerification = useMutation({
    mutationFn: adminService.approveVerification,
    onSuccess: refreshAdminData,
  })

  const rejectVerification = useMutation({
    mutationFn: ({ id, rejectionReason }) => adminService.rejectVerification(id, rejectionReason),
    onSuccess: refreshAdminData,
  })

  const deleteProperty = useMutation({
    mutationFn: adminService.deleteProperty,
    onSuccess: refreshAdminData,
  })

  return {
    stats: statsQuery.data?.data || null,
    users: usersQuery.data?.data || [],
    properties: propertiesQuery.data?.data || [],
    isLoading: statsQuery.isLoading || usersQuery.isLoading || propertiesQuery.isLoading,
    isError: statsQuery.isError || usersQuery.isError || propertiesQuery.isError,
    error: statsQuery.error || usersQuery.error || propertiesQuery.error,
    refetch: refreshAdminData,
    updateUser,
    deleteUser,
    approveProperty,
    rejectProperty,
    updatePropertyStatus,
    approveVerification,
    rejectVerification,
    deleteProperty,
  }
}

export default useAdmin
