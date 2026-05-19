import { Building2, LogOut, Search, UserRound } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

const navItems = [
  { label: 'Buy', to: '/properties?mode=buy' },
  { label: 'Rent', to: '/properties?mode=rent' },
  { label: 'Sell', to: '/dashboard/seller' },
  { label: 'Agents', to: '/properties?verifiedOnly=true' },
  { label: 'Dashboard', to: '/dashboard' },
]

function Navbar() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <Building2 size={21} />
          </span>
          <span>
            <span className="block text-lg font-extrabold text-primary">NestIQ</span>
            <span className="block text-xs font-medium text-muted">Smart property decisions</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive ? 'text-primary' : 'text-charcoal hover:text-primary'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/properties"
            className="hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-charcoal transition hover:border-accent hover:text-primary sm:flex"
            aria-label="Search properties"
          >
            <Search size={18} />
          </Link>
          {isAuthenticated ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-primary transition hover:border-accent"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
                  <UserRound size={15} />
                </span>
                <span className="max-w-[120px] truncate">{user?.name || 'Account'}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-charcoal transition hover:border-danger hover:text-danger disabled:opacity-60"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-charcoal sm:inline-flex"
            >
              Sign In
            </Link>
          )}
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-primary transition hover:border-accent lg:hidden"
            aria-label={isAuthenticated ? 'Open dashboard' : 'Sign in'}
          >
            <UserRound size={19} />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
