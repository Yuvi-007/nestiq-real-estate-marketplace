import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('nestiq-auth-token')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isAuthRefresh = originalRequest?.url?.includes('/auth/refresh')
    const isAuthLogout = originalRequest?.url?.includes('/auth/logout')

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRefresh && !isAuthLogout) {
      originalRequest._retry = true

      try {
        const response = await api.post('/auth/refresh')
        const nextToken = response.data.accessToken

        localStorage.setItem('nestiq-auth-token', nextToken)
        originalRequest.headers.Authorization = `Bearer ${nextToken}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('nestiq-auth-token')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export const authService = {
  register: async (payload) => {
    const response = await api.post('/auth/register', payload)
    return response.data
  },
  login: async (payload) => {
    const response = await api.post('/auth/login', payload)
    return response.data
  },
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
  refresh: async () => {
    const response = await api.post('/auth/refresh')
    return response.data
  },
}

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },
  getSavedProperties: async () => {
    const response = await api.get('/users/saved-properties')
    return response.data
  },
  getMyListings: async () => {
    const response = await api.get('/users/me/listings')
    return response.data
  },
}

export const inquiryService = {
  createInquiry: async (payload) => {
    const response = await api.post('/inquiries', payload)
    return response.data
  },
  getMyInquiries: async () => {
    const response = await api.get('/inquiries/mine')
    return response.data
  },
  updateInquiryStatus: async (id, status) => {
    const response = await api.patch(`/inquiries/${id}/status`, { status })
    return response.data
  },
}

export const visitService = {
  createVisit: async (payload) => {
    const response = await api.post('/visits', payload)
    return response.data
  },
  getVisits: async () => {
    const response = await api.get('/visits')
    return response.data
  },
  updateVisitStatus: async (id, status) => {
    const response = await api.patch(`/visits/${id}/status`, { status })
    return response.data
  },
}

export const propertyService = {
  getProperties: async (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
    )

    // TODO: Move q into the main backend list endpoint when full-text marketplace search is added.
    if (cleanParams.q) {
      const response = await api.get('/properties/search', { params: cleanParams })
      const count = response.data.count || response.data.data?.length || 0

      return {
        success: response.data.success,
        count,
        total: count,
        page: 1,
        pages: 1,
        data: response.data.data || [],
      }
    }

    const response = await api.get('/properties', { params: cleanParams })
    return response.data
  },
  getPropertyById: async (id) => {
    const response = await api.get(`/properties/${id}`)
    return response.data
  },
  toggleSavedProperty: async (id) => {
    const response = await api.post(`/properties/${id}/save`)
    return response.data
  },
  createProperty: async (payload) => {
    const response = await api.post('/properties', payload)
    return response.data
  },
  updateProperty: async (id, payload) => {
    const response = await api.put(`/properties/${id}`, payload)
    return response.data
  },
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`)
    return response.data
  },
}

export const uploadService = {
  uploadPropertyImages: async (files) => {
    const formData = new FormData()

    files.forEach((file) => {
      formData.append('images', file)
    })

    const response = await api.post('/uploads/property-images', formData)

    return response.data
  },
}

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats')
    return response.data
  },
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },
  updateUser: async (id, payload) => {
    const response = await api.patch(`/admin/users/${id}`, payload)
    return response.data
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },
  getProperties: async () => {
    const response = await api.get('/admin/properties')
    return response.data
  },
  approveProperty: async (id) => {
    const response = await api.patch(`/admin/properties/${id}/approve`)
    return response.data
  },
  rejectProperty: async (id, rejectionReason = '') => {
    const response = await api.patch(`/admin/properties/${id}/reject`, { rejectionReason })
    return response.data
  },
  updatePropertyStatus: async (id, status) => {
    const response = await api.patch(`/admin/properties/${id}/status`, { status })
    return response.data
  },
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`)
    return response.data
  },
}

export default api
