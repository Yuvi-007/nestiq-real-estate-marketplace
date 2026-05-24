import { ArrowLeft, BadgeCheck, Languages, MapPin, ShieldCheck, Star } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import AgentContactPanel from '../../components/common/AgentContactPanel'
import AgentListings from '../../components/common/AgentListings'
import AgentReviews from '../../components/common/AgentReviews'
import AgentStats from '../../components/common/AgentStats'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import SectionHeader from '../../components/ui/SectionHeader'
import { getAgentById } from '../../utils/agentDirectoryData'

function AgentProfile() {
  const { agentId } = useParams()
  const agent = getAgentById(agentId)

  if (!agent) {
    return (
      <EmptyState
        title="Agent profile not found"
        description="This demo agent profile is not available. Return to the directory to browse active profiles."
        actionLabel="Back to agents"
        actionTo="/agents"
      />
    )
  }

  return (
    <section className="space-y-10">
      <Button as={Link} to="/agents" variant="ghost" icon={ArrowLeft}>
        Back to agents
      </Button>

      <div className="overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <img src={agent.avatar} alt={agent.name} className="h-28 w-28 rounded-3xl object-cover ring-4 ring-white/15" />
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">{agent.trustLevel}</Badge>
              <Badge className="bg-white/10 text-white">{agent.role}</Badge>
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">{agent.name}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-white/75">
              <MapPin size={17} className="text-accent" />
              {agent.city}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/70">{agent.bio}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-5">
            <p className="flex items-center gap-2 text-2xl font-extrabold text-accent">
              <Star size={22} fill="currentColor" />
              {agent.averageRating}
            </p>
            <p className="mt-1 text-sm font-semibold text-white/70">Average rating</p>
          </div>
        </div>
      </div>

      <AgentStats agent={agent} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card>
            <SectionHeader eyebrow="Profile" title="Specialties and languages" />
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 text-sm font-extrabold uppercase text-slate-500">
                  <BadgeCheck size={16} className="text-accent" />
                  Specialties
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {agent.specialties.map((specialty) => (
                    <span key={specialty} className="rounded-full bg-surface px-4 py-2 text-sm font-extrabold text-charcoal">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="flex items-center gap-2 text-sm font-extrabold uppercase text-slate-500">
                  <Languages size={16} className="text-accent" />
                  Languages
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {agent.languages.map((language) => (
                    <span key={language} className="rounded-full bg-surface px-4 py-2 text-sm font-extrabold text-charcoal">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-800">
              Agent stats are demo metrics for presentation. NestIQ displays trusted platform contacts, but licensed verification should be connected to a real compliance workflow before production claims.
            </p>
          </Card>

          <AgentListings agent={agent} />
          <AgentReviews agent={agent} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <AgentContactPanel agent={agent} />
          <Card>
            <p className="flex items-center gap-2 text-sm font-extrabold text-primary">
              <ShieldCheck size={17} className="text-success" />
              Trust note
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This profile uses demo trust language for the project presentation and does not claim independent license verification.
            </p>
          </Card>
        </aside>
      </div>
    </section>
  )
}

export default AgentProfile
