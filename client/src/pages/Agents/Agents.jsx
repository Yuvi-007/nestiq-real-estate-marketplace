import { BadgeCheck, MessageCircle, ShieldCheck, Star } from 'lucide-react'

import AgentMatchForm from '../../components/common/AgentMatchForm'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import SectionHeader from '../../components/ui/SectionHeader'

const agents = [
  { name: 'Priya Sharma', city: 'Mumbai', role: 'Verified Agent', rating: '4.9' },
  { name: 'Rohan Mehta', city: 'Goa', role: 'Seller Specialist', rating: '4.8' },
  { name: 'Ananya Rao', city: 'Bangalore', role: 'Rental Advisor', rating: '4.7' },
]

function Agents() {
  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Find an agent"
        title="Match with verified property experts"
        description="Tell NestIQ what you need help with. This demo form can later connect to verified agent routing and lead assignment."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <AgentMatchForm />
        <Card>
          <SectionHeader eyebrow="Why verified agents" title="Work with more confidence" />
          <div className="mt-5 space-y-4">
            {[
              [ShieldCheck, 'Clear accountability'],
              [MessageCircle, 'Faster buyer-seller communication'],
              [BadgeCheck, 'Better listing context and follow-up'],
            ].map(([Icon, text]) => (
              <p key={text} className="flex gap-3 text-sm font-semibold text-slate-700">
                <Icon className="shrink-0 text-accent" size={18} />
                {text}
              </p>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader eyebrow="Demo agents" title="Featured NestIQ agents" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.name} className="rounded-2xl border border-slate-200 bg-surface p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                {agent.name.charAt(0)}
              </div>
              <p className="mt-4 text-lg font-extrabold text-primary">{agent.name}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">{agent.role} in {agent.city}</p>
              <p className="mt-3 flex items-center gap-1 text-sm font-bold text-accent">
                <Star size={15} fill="currentColor" />
                {agent.rating}
              </p>
              <Button variant="secondary" size="sm" className="mt-4 w-full">
                Contact agent
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

export default Agents
