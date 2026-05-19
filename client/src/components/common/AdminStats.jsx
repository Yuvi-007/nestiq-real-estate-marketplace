import { Eye, Home, Hourglass, ShieldCheck, Users, UserRoundCheck } from 'lucide-react'

const statsConfig = [
  { key: 'totalUsers', label: 'Total Users', icon: Users },
  { key: 'totalProperties', label: 'Total Properties', icon: Home },
  { key: 'activeProperties', label: 'Active Listings', icon: ShieldCheck },
  { key: 'pendingProperties', label: 'Pending Listings', icon: Hourglass },
  { key: 'totalAgents', label: 'Total Agents', icon: UserRoundCheck },
  { key: 'totalViews', label: 'Total Views', icon: Eye },
]

function AdminStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      {statsConfig.map(({ key, label, icon: Icon }) => (
        <div key={key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <Icon size={18} />
          </span>
          <p className="mt-4 text-3xl font-extrabold text-primary">{stats?.[key] || 0}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  )
}

export default AdminStats
