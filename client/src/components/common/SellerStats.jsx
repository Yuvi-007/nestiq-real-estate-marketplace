import { Eye, Home, MessageCircle, ShieldCheck } from 'lucide-react'

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white">
        <Icon size={20} />
      </span>
      <p className="mt-4 text-3xl font-extrabold text-primary">{value}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
    </div>
  )
}

function SellerStats({ listings }) {
  const totalViews = listings.reduce((sum, property) => sum + Number(property.views || 0), 0)
  const activeListings = listings.filter((property) => property.status === 'active').length

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard icon={Home} label="My Listings" value={listings.length} />
      <StatCard icon={Eye} label="Total Views" value={totalViews} />
      <StatCard icon={ShieldCheck} label="Active Listings" value={activeListings} />
      <StatCard icon={MessageCircle} label="Inquiries" value="0" />
    </div>
  )
}

export default SellerStats
