import { HeartHandshake, Network, TrendingUp, Trees } from 'lucide-react'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const scoreItems = [
  { key: 'lifestyleScore', label: 'Lifestyle Score', icon: Trees },
  { key: 'connectivityScore', label: 'Connectivity Score', icon: Network },
  { key: 'familyScore', label: 'Family Score', icon: HeartHandshake },
  { key: 'investmentScore', label: 'Investment Score', icon: TrendingUp },
]

function ScoreRow({ label, value, icon: Icon }) {
  const score = Math.min(Math.max(Number(value || 0), 0), 10)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-extrabold text-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Icon size={17} />
          </span>
          {label}
        </p>
        <span className="text-sm font-extrabold text-primary">{score}/10</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-accent" style={{ width: `${score * 10}%` }} />
      </div>
    </div>
  )
}

function LifestyleScorePanel({ city, insights }) {
  return (
    <Card>
      <SectionHeader
        eyebrow="Lifestyle fit"
        title={`${city || 'City'} lifestyle snapshot`}
        description="Sample neighborhood guidance using city-level demo data. Confirm exact access during property visits."
      />

      <p className="mt-4 rounded-2xl bg-surface p-4 text-sm leading-6 text-slate-700">
        {insights.shortSummary}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {scoreItems.map((item) => (
          <ScoreRow key={item.key} label={item.label} value={insights[item.key]} icon={item.icon} />
        ))}
      </div>
    </Card>
  )
}

export default LifestyleScorePanel
