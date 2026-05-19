import { Heart, Home, LayoutDashboard, Search, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const mobileItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Search', to: '/properties', icon: Search },
  { label: 'Saved', to: '/dashboard', icon: Heart },
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', to: '/login', icon: UserRound },
]

function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-2 py-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {mobileItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition ${
                  isActive ? 'text-accent' : 'text-muted hover:text-primary'
                }`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
