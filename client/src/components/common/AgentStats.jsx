import { BadgeCheck, BriefcaseBusiness, Home, MessageCircle, Star } from 'lucide-react'

import Card from '../ui/Card'

function AgentStats({ agent }) {
  const stats = [
    [Star, 'Rating', agent.averageRating],
    [BriefcaseBusiness, 'Experience', agent.experience],
    [MessageCircle, 'Response rate', agent.responseRate],
    [Home, 'Active listings', agent.activeListings],
    [BadgeCheck, 'Deals handled', agent.totalDeals],
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map(([Icon, label, value]) => (
        <Card key={label}>
          <Icon className="text-accent" size={22} />
          <p className="mt-4 text-xs font-extrabold uppercase text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-extrabold text-primary">{value}</p>
        </Card>
      ))}
    </div>
  )
}

export default AgentStats
