import { Mail, Phone, ShieldCheck, Star, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import Badge from '../ui/Badge'
import Button from '../ui/Button'

function AgentCard({ agent, variant = 'listing' }) {
  const agentName = agent?.name || 'NestIQ agent'

  if (variant === 'directory') {
    return (
      <section className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-accent hover:shadow-xl">
        <div className="flex items-start gap-4">
          {agent?.avatar ? (
            <img src={agent.avatar} alt={agentName} className="h-16 w-16 rounded-2xl object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface text-muted">
              <UserRound size={26} />
            </span>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-extrabold text-primary">{agentName}</h3>
              <Badge variant="success">{agent.trustLevel}</Badge>
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-600">{agent.role} in {agent.city}</p>
            <p className="mt-2 flex items-center gap-1 text-sm font-extrabold text-accent">
              <Star size={15} fill="currentColor" />
              {agent.averageRating} rating
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {agent.specialties.slice(0, 3).map((specialty) => (
            <span key={specialty} className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-slate-700">
              {specialty}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-surface p-3">
            <p className="text-xs font-extrabold uppercase text-slate-500">Response</p>
            <p className="mt-1 font-extrabold text-primary">{agent.responseRate}</p>
          </div>
          <div className="rounded-2xl bg-surface p-3">
            <p className="text-xs font-extrabold uppercase text-slate-500">Listings</p>
            <p className="mt-1 font-extrabold text-primary">{agent.activeListings}</p>
          </div>
        </div>

        <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
          <Button as={Link} to={`/agents/${agent.id}`} size="sm">
            View profile
          </Button>
          <Button variant="secondary" size="sm">
            Contact
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-primary">Listed by</h2>

      <div className="mt-5 flex items-center gap-4">
        {agent?.avatar ? (
          <img src={agent.avatar} alt={agentName} className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-muted">
            <UserRound size={24} />
          </span>
        )}

        <div>
          <p className="font-bold text-charcoal">{agentName}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-success">
            <ShieldCheck size={14} />
            Verified agent
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <p className="flex items-center gap-3">
          <Phone size={16} className="text-accent" />
          <span>{agent?.phone || 'Phone not available'}</span>
        </p>
        <p className="flex items-center gap-3">
          <Mail size={16} className="text-accent" />
          <span>{agent?.email || 'Email not available'}</span>
        </p>
      </div>
    </section>
  )
}

export default AgentCard
