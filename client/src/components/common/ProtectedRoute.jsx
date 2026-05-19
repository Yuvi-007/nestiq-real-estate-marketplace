import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { accessToken, isAuthenticated, isLoading, fetchMe } = useAuth()
  const [checkedSession, setCheckedSession] = useState(false)
  const [sessionValid, setSessionValid] = useState(Boolean(isAuthenticated))

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      if (!accessToken) {
        setSessionValid(false)
        setCheckedSession(true)
        return
      }

      try {
        await fetchMe()
        if (isMounted) {
          setSessionValid(true)
        }
      } catch {
        if (isMounted) {
          setSessionValid(false)
        }
      } finally {
        if (isMounted) {
          setCheckedSession(true)
        }
      }
    }

    checkSession()

    return () => {
      isMounted = false
    }
  }, [accessToken, fetchMe, isAuthenticated])

  if (!checkedSession || isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 shadow-sm">
          Checking your session...
        </div>
      </div>
    )
  }

  if (!sessionValid) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
