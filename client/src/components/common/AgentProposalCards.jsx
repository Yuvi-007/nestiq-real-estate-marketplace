import { Link } from 'react-router-dom'
import { Star, Trophy } from 'lucide-react'

import { agentDirectoryData } from '../../utils/agentDirectoryData'
import Button from '../ui/Button'
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

function AgentProposalCards({ city }) {
  const agents = agentDirectoryData
    .filter((agent) => !city || agent.city.toLowerCase() === city.toLowerCase())
    .slice(0, 3)

  const visibleAgents = agents.length ? agents : agentDirectoryData.slice(0, 3)

  return (
    <Card>
      <SectionHeader
        eyebrow="Local agents"
        title="Compare seller-ready agent proposals"
        description="Demo agent cards help sellers compare experience, sold count, and ratings before opening a profile."
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {visibleAgents.map((agent) => (
          <article key={agent.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <img src={agent.avatar} alt={agent.name} className="h-16 w-16 rounded-2xl object-cover" />
              <div className="min-w-0">
                <h3 className="truncate text-lg font-extrabold text-primary">{agent.name}</h3>
                <p className="text-sm font-semibold text-slate-600">{agent.city}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-surface p-3">
                <p className="text-lg font-extrabold text-primary">{agent.experience}</p>
                <p className="mt-1 text-xs font-bold text-muted">Experience</p>
              </div>
              <div className="rounded-2xl bg-surface p-3">
                <p className="text-lg font-extrabold text-primary">{agent.totalDeals}</p>
                <p className="mt-1 text-xs font-bold text-muted">Sold</p>
              </div>
              <div className="rounded-2xl bg-surface p-3">
                <p className="inline-flex items-center justify-center gap-1 text-lg font-extrabold text-primary">
                  <Star size={15} className="fill-accent text-accent" />
                  {agent.averageRating}
                </p>
                <p className="mt-1 text-xs font-bold text-muted">Rating</p>
              </div>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-success">
              <Trophy size={14} />
              {agent.role}
            </p>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{agent.bio}</p>

            <Button as={Link} to={`/agents/${agent.id}`} variant="secondary" className="mt-5 w-full">
              View profile
            </Button>
          </article>
        ))}
      </div>
    </Card>
  )
}

export default AgentProposalCards
