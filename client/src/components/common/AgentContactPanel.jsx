import { Mail, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'

import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'

function AgentContactPanel({ agent }) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <Card className="shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
      <p className="text-sm font-extrabold uppercase text-accent">Contact agent</p>
      <h2 className="mt-2 text-2xl font-extrabold text-primary">{agent.name}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Agent stats are demo metrics for presentation. Contact routing can be connected to a lead workflow later.
      </p>

      <div className="mt-5 space-y-3 text-sm font-semibold text-slate-700">
        <p className="flex items-center gap-3">
          <Phone size={16} className="text-accent" />
          {agent.phone}
        </p>
        <p className="flex items-center gap-3">
          <Mail size={16} className="text-accent" />
          {agent.email}
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        <Input label="Your name" placeholder="Name" />
        <Input label="Phone or email" placeholder="How should they reach you?" />
        <Input as="textarea" label="Message" rows={4} placeholder={`I would like help from ${agent.name}.`} className="resize-none" />
        <Button icon={MessageCircle} onClick={() => setSubmitted(true)}>
          Contact agent
        </Button>
        {submitted && (
          <p className="rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
            Demo contact request captured locally.
          </p>
        )}
      </div>
    </Card>
  )
}

export default AgentContactPanel
