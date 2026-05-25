import { Building2, LogOut, Menu, Search, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

const navItems = [
  { label: 'Buy', to: '/buy' },
  { label: 'Rent', to: '/rent' },
  { label: 'Sell', to: '/sell' },
  { label: 'Agents', to: '/agents' },
  { label: 'Dashboard', to: '/dashboard' },
]

function Navbar() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setMobileOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/5 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setMobileOpen(false)}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
            <Building2 size={21} />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-extrabold leading-5 text-primary">NestIQ</span>
            <span className="block truncate text-xs font-semibold text-muted">Smart property decisions</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-surface p-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `rounded-xl px-3.5 py-2 text-sm font-extrabold transition ${
                  isActive ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:bg-white/80 hover:text-primary'
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
            className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-charcoal transition hover:border-accent hover:bg-accent/10 hover:text-primary sm:flex"
            aria-label="Search properties"
          >
            <Search size={18} />
          </Link>
          {isAuthenticated ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                to="/dashboard"
                className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-primary transition hover:border-accent hover:bg-accent/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white">
                  <UserRound size={15} />
                </span>
                <span className="max-w-[120px] truncate">{user?.name || 'Account'}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoading}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-charcoal transition hover:border-danger hover:bg-danger/10 hover:text-danger disabled:opacity-60"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden h-11 items-center rounded-2xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-charcoal sm:inline-flex"
            >
              Sign In
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-primary transition hover:border-accent lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg shadow-slate-900/5 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2">
            <Link
              to="/properties"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-surface px-4 py-3 text-sm font-extrabold text-primary"
            >
              <Search size={17} />
              Search properties
            </Link>
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                    isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-surface hover:text-primary'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoading}
                className="mt-2 flex items-center gap-3 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-extrabold text-danger disabled:opacity-60"
              >
                <LogOut size={17} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-2xl bg-primary px-4 py-3 text-center text-sm font-extrabold text-white"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
