import { useMemo, useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import useAuth from '../../hooks/useAuth'

const roles = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'agent', label: 'Agent' },
]

const initialForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'buyer',
}

const getPasswordStrength = (password) => {
  let score = 0

  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score <= 1) return { label: 'Weak', width: 'w-1/4', color: 'bg-danger' }
  if (score <= 3) return { label: 'Good', width: 'w-2/3', color: 'bg-accent' }
  return { label: 'Strong', width: 'w-full', color: 'bg-success' }
}

const validateForm = (form) => {
  const errors = {}

  if (!form.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (!roles.some((role) => role.value === form.role)) {
    errors.role = 'Choose a valid role'
  }

  return errors
}

function Register() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
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
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setServerError(error.message)
    }
  }

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Join NestIQ"
      subtitle="Choose your role and create a secure profile for property discovery and listing workflows."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {serverError && (
          <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {serverError}
          </div>
        )}

        <Input
          id="name"
          name="name"
          label="Full name"
          icon={UserRound}
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          error={errors.name}
        />

        <div className="grid gap-4 sm:grid-cols-2">
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
            id="phone"
            name="phone"
            label="Phone"
            icon={Phone}
            value={form.phone}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>

        <div>
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            icon={LockKeyhole}
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            error={errors.password}
          />
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${strength.width} ${strength.color}`} />
            </div>
            <span className="text-xs font-bold text-slate-500">{strength.label}</span>
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-bold text-primary">Role</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {roles.map((role) => (
              <label
                key={role.value}
                className={`flex h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-extrabold transition ${
                  form.role === role.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-accent hover:text-primary'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={form.role === role.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                {role.label}
              </label>
            ))}
          </div>
          {errors.role && <p className="mt-2 text-sm font-semibold text-danger">{errors.role}</p>}
          <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
            Admin accounts are created internally for platform moderation.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          icon={!isLoading ? ArrowRight : undefined}
          iconPosition="right"
          className="w-full"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>

        <p className="text-center text-sm font-semibold text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary underline decoration-accent decoration-2 underline-offset-4">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Register
