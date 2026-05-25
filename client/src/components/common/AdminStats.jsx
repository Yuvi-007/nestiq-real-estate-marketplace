import { Eye, FileWarning, Home, Hourglass, ShieldCheck, ShieldQuestion, ShieldX, Users, UserRoundCheck } from 'lucide-react'

import Card from '../ui/Card'

const statsConfig = [
  { key: 'totalUsers', label: 'Total Users', icon: Users },
  { key: 'totalProperties', label: 'Total Properties', icon: Home },
  { key: 'activeProperties', label: 'Active Listings', icon: ShieldCheck },
  { key: 'pendingProperties', label: 'Pending Listings', icon: Hourglass },
  { key: 'totalAgents', label: 'Total Agents', icon: UserRoundCheck },
  { key: 'totalViews', label: 'Total Views', icon: Eye },
  { key: 'verificationPending', label: 'Verification Pending', icon: ShieldQuestion },
  { key: 'verificationVerified', label: 'Verified Properties', icon: ShieldCheck },
  { key: 'verificationRejected', label: 'Rejected Verification', icon: ShieldX },
  { key: 'propertiesMissingDocuments', label: 'Missing Documents', icon: FileWarning },
]

function AdminStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {statsConfig.map(({ key, label, icon: Icon }) => (
        <Card key={key}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <Icon size={18} />
          </span>
          <p className="mt-4 text-3xl font-extrabold text-primary">{stats?.[key] || 0}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
        </Card>
      ))}
    </div>
  )
}

export default AdminStats
