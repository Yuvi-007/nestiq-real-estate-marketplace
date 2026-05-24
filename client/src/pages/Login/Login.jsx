import { useEffect, useState } from 'react'
import { ArrowRight, KeyRound, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
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
          <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {serverError}
          </div>
        )}

        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          icon={KeyRound}
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
        />

        <Card
          as="button"
          padded={false}
          type="button"
          onClick={useDemoCredentials}
          className="w-full bg-surface px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:border-accent hover:bg-accent/10 hover:text-primary"
        >
          <span className="block text-xs font-extrabold uppercase tracking-wide text-accent">Demo helper</span>
          <span className="mt-1 block">Buyer: buyer@nestiq.com / Demo@1234</span>
        </Card>

        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          icon={!isLoading ? ArrowRight : undefined}
          iconPosition="right"
          className="w-full"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

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
