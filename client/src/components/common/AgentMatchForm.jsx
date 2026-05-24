import { useState } from 'react'

import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'
import SectionHeader from '../ui/SectionHeader'

const needs = ['Buy', 'Sell', 'Rent', 'Both buy and sell']

function AgentMatchForm() {
  const [need, setNeed] = useState('Buy')
  const [submitted, setSubmitted] = useState(false)

  return (
    <Card>
      <SectionHeader
        eyebrow="Agent match"
        title="Tell us what you need"
        description="Demo matching form. In production this can connect to verified agent routing."
      />

      <div className="mt-5 grid gap-4">
        <div>
          <p className="mb-2 text-sm font-bold text-primary">What do you need help with?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {needs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setNeed(item)}
                className={`rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                  need === item ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-surface text-charcoal hover:border-accent'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <Input label="Location" placeholder="City or locality" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" placeholder="Your name" />
          <Input label="Phone or email" placeholder="How should an agent reach you?" />
        </div>

        <Button onClick={() => setSubmitted(true)}>Find verified agents</Button>
        {submitted && (
          <p className="rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
            Demo request captured locally. Verified agent routing can be connected later.
          </p>
        )}
      </div>
    </Card>
  )
}

export default AgentMatchForm
