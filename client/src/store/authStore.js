import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { authService, userService } from '../services/api'

const getErrorMessage = (error, fallback) => error.response?.data?.message || fallback

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: ({ user, accessToken }) => {
        if (accessToken) {
          localStorage.setItem('nestiq-auth-token', accessToken)
        }

        set({
          user,
          accessToken,
          isAuthenticated: Boolean(accessToken && user),
        })
      },

      updateSavedProperties: (savedProperties) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                savedProperties,
              }
            : state.user,
        }))
      },

      clearAuth: () => {
        localStorage.removeItem('nestiq-auth-token')
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      login: async (payload) => {
        set({ isLoading: true })

        try {
          const response = await authService.login(payload)
          const authData = {
            user: response.data,
            accessToken: response.accessToken,
          }

          localStorage.setItem('nestiq-auth-token', response.accessToken)
          set({
            ...authData,
            isAuthenticated: true,
            isLoading: false,
          })

          return response
        } catch (error) {
          set({ isLoading: false })
          throw new Error(getErrorMessage(error, 'Unable to login'), { cause: error })
        }
      },

      register: async (payload) => {
        set({ isLoading: true })

        try {
          const response = await authService.register(payload)
          const authData = {
            user: response.data,
            accessToken: response.accessToken,
          }

          localStorage.setItem('nestiq-auth-token', response.accessToken)
          set({
            ...authData,
            isAuthenticated: true,
            isLoading: false,
          })

          return response
        } catch (error) {
          set({ isLoading: false })
          throw new Error(getErrorMessage(error, 'Unable to register'), { cause: error })
        }
      },

      logout: async () => {
        set({ isLoading: true })

        try {
          await authService.logout()
        } finally {
          localStorage.removeItem('nestiq-auth-token')
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      fetchMe: async () => {
        const storedToken = localStorage.getItem('nestiq-auth-token')

        if (!storedToken) {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
          return null
        }

        set({ isLoading: true, accessToken: storedToken })

        try {
          const response = await userService.getProfile()
          const latestToken = localStorage.getItem('nestiq-auth-token') || storedToken

          set({
            user: response.data,
            accessToken: latestToken,
            isAuthenticated: true,
            isLoading: false,
          })

          return response.data
        } catch (error) {
          localStorage.removeItem('nestiq-auth-token')
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
          throw new Error(getErrorMessage(error, 'Your session has expired'), { cause: error })
        }
      },
    }),
    {
      name: 'nestiq-auth',
      // Demo only: localStorage is acceptable for this project step. Production should prefer safer token handling.
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          localStorage.setItem('nestiq-auth-token', state.accessToken)
        }
      },
    },
  ),
)

export default useAuthStore
