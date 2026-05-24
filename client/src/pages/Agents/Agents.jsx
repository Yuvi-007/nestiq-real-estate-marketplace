import { BadgeCheck, Home, MessageCircle, Search, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

import AgentCard from '../../components/common/AgentCard'
import AgentMatchForm from '../../components/common/AgentMatchForm'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import PageHeader from '../../components/ui/PageHeader'
import SectionHeader from '../../components/ui/SectionHeader'
import { agentDirectoryData } from '../../utils/agentDirectoryData'

const intents = ['Buy', 'Sell', 'Rent', 'Investment']

function Agents() {
  const [query, setQuery] = useState('')
  const [intent, setIntent] = useState('Buy')

  const agents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return agentDirectoryData.filter((agent) => {
      const matchesQuery =
        !normalizedQuery ||
        agent.name.toLowerCase().includes(normalizedQuery) ||
        agent.city.toLowerCase().includes(normalizedQuery) ||
        agent.specialties.some((specialty) => specialty.toLowerCase().includes(normalizedQuery))
      const matchesIntent =
        intent === 'Investment'
          ? agent.specialties.some((specialty) => specialty.toLowerCase().includes('investment'))
          : intent === 'Rent'
            ? agent.specialties.some((specialty) => specialty.toLowerCase().includes('rent') || specialty.toLowerCase().includes('pg'))
            : intent === 'Sell'
              ? agent.specialties.some((specialty) => specialty.toLowerCase().includes('seller') || specialty.toLowerCase().includes('pricing'))
              : true

      return matchesQuery && matchesIntent
    })
  }, [intent, query])

  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-8 lg:p-10">
        <PageHeader
          eyebrow="Agent directory"
          title="Find trusted NestIQ property experts"
          description="Search demo agent profiles by city, name, or specialty. Agent stats are demo metrics for presentation."
          className="[&_h1]:text-white [&_p:last-child]:text-white/75"
          action={<Button as={Link} to="/properties" variant="accent" icon={Home}>Browse properties</Button>}
        />

        <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <Input
            icon={Search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by city, name, or specialty"
            className="bg-white"
            aria-label="Search agents"
          />
          <div className="flex flex-wrap gap-2">
            {intents.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setIntent(item)}
                className={`rounded-xl px-4 py-3 text-sm font-extrabold transition ${
                  intent === item ? 'bg-accent text-primary' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card>
            <SectionHeader
              eyebrow="Directory"
              title={`${agents.length} matching agents`}
              description="Use profiles to compare specialties, demo response metrics, listings, and local focus."
            />
            <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-5">
              {agents.map((agent) => <AgentCard key={agent.id} agent={agent} variant="directory" />)}
            </div>
            {agents.length === 0 && (
              <p className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-surface p-5 text-sm font-semibold text-slate-600">
                No agents match this search. Try a city like Mumbai, Pune, Bangalore, or Gurgaon.
              </p>
            )}
          </Card>

          <Card>
            <SectionHeader eyebrow="Why verified agents" title="Why work with a verified NestIQ agent?" />
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                [ShieldCheck, 'Clear accountability', 'Profile data, contact details, and listing context are shown in one place.'],
                [MessageCircle, 'Faster follow-up', 'Use agent matching to route buyer, seller, rental, and investment intent.'],
                [BadgeCheck, 'Better context', 'Agent specialties help buyers and sellers choose the right conversation.'],
              ].map(([Icon, title, text]) => (
                <div key={title} className="rounded-2xl bg-surface p-5">
                  <Icon className="text-accent" size={22} />
                  <p className="mt-4 font-extrabold text-primary">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <AgentMatchForm />
          <Card className="bg-primary text-white">
            <p className="text-sm font-extrabold uppercase tracking-wide text-accent">Marketplace CTA</p>
            <h2 className="mt-3 text-2xl font-extrabold">Start with listings</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Browse homes first, then contact the agent attached to listings you trust.
            </p>
            <Button as={Link} to="/properties" variant="accent" className="mt-5">
              Open marketplace
            </Button>
          </Card>
        </aside>
      </div>
    </section>
  )
}

export default Agents
