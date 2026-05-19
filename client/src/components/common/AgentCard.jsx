import { Mail, Phone, ShieldCheck, UserRound } from 'lucide-react'

function AgentCard({ agent }) {
  const agentName = agent?.name || 'NestIQ agent'

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
