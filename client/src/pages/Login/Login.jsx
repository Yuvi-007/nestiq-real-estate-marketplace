import { useEffect, useState } from 'react'
import { ArrowRight, KeyRound, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import AuthLayout from '../../components/layout/AuthLayout'
import useAuth from '../../hooks/useAuth'

const initialForm = {
  email: '',
  password: '',
}

const validateForm = (form) => {
  const errors = {}

  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  }

  return errors
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const fromLocation = location.state?.from
  const from = fromLocation ? `${fromLocation.pathname || '/dashboard'}${fromLocation.search || ''}` : '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [from, isAuthenticated, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setServerError('')
  }

  const useDemoCredentials = () => {
    setForm({
      email: 'buyer@nestiq.com',
      password: 'Demo@1234',
    })
    setErrors({})
    setServerError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      })
      navigate(from, { replace: true })
    } catch (error) {
      setServerError(error.message)
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to NestIQ"
      subtitle="Access saved homes, listing tools, and your private property workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {serverError && (
          <div className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {serverError}
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-bold text-primary">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`h-12 w-full rounded-lg border bg-white pl-10 pr-4 text-sm font-semibold text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15 ${
                errors.email ? 'border-danger' : 'border-slate-200'
              }`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-2 text-sm font-semibold text-danger">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-bold text-primary">
            Password
          </label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`h-12 w-full rounded-lg border bg-white pl-10 pr-4 text-sm font-semibold text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15 ${
                errors.password ? 'border-danger' : 'border-slate-200'
              }`}
              placeholder="Enter your password"
            />
          </div>
          {errors.password && <p className="mt-2 text-sm font-semibold text-danger">{errors.password}</p>}
        </div>

        <button
          type="button"
          onClick={useDemoCredentials}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:border-accent hover:bg-accent/10 hover:text-primary"
        >
          Demo credentials: buyer@nestiq.com / Demo@1234
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-extrabold text-white shadow-sm transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
          {!isLoading && <ArrowRight size={18} />}
        </button>

        <p className="text-center text-sm font-semibold text-slate-500">
          New to NestIQ?{' '}
          <Link to="/register" className="text-primary underline decoration-accent decoration-2 underline-offset-4">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Login
