import { AlertTriangle, BrainCircuit, CheckCircle2, MapPinned, ShieldCheck, Sparkles } from 'lucide-react'

const riskClasses = {
  LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  HIGH: 'bg-red-50 text-red-700 border-red-200',
}

const scoreItems = [
  { key: 'priceScore', label: 'Price fairness' },
  { key: 'listingCompletenessScore', label: 'Listing completeness' },
  { key: 'locationScore', label: 'Location confidence' },
  { key: 'mediaScore', label: 'Media quality' },
  { key: 'agentTrustScore', label: 'Agent trust' },
]

function ScoreMeter({ label, value }) {
  const width = `${Math.min(Math.max(Number(value || 0), 0), 10) * 10}%`

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-slate-600">{label}</span>
        <span className="font-extrabold text-primary">{value}/10</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-accent" style={{ width }} />
      </div>
    </div>
  )
}

function TrustScorePanel({ trustScore }) {
  if (!trustScore) {
    return null
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
      <div className="bg-primary p-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-accent">
              <BrainCircuit size={17} />
              NestIQ Intelligence
            </p>
            <h2 className="mt-3 text-3xl font-extrabold">Trust Score {trustScore.overallScore}/10</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
              Rule-based, explainable property intelligence across price, completeness, location, media, and agent signals.
            </p>
          </div>
          <span className={`rounded-full border px-4 py-2 text-sm font-extrabold ${riskClasses[trustScore.riskLevel] || riskClasses.MEDIUM}`}>
            {trustScore.riskLevel} risk
          </span>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {scoreItems.map((item) => (
            <ScoreMeter key={item.key} label={item.label} value={trustScore[item.key]} />
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-surface p-4">
            <p className="flex items-center gap-2 text-sm font-extrabold text-primary">
              <Sparkles size={16} className="text-accent" />
              Strengths
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {trustScore.strengths?.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="flex items-center gap-2 text-sm font-extrabold text-primary">
              <AlertTriangle size={16} className="text-accent" />
              Warnings
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {(trustScore.warnings?.length ? trustScore.warnings : ['No major warnings detected.']).map((item) => (
                <li key={item} className="flex gap-2">
                  <MapPinned size={16} className="mt-0.5 shrink-0 text-amber-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="flex items-center gap-2 text-sm font-extrabold text-primary">
              <ShieldCheck size={16} className="text-accent" />
              Risk reasons
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {trustScore.riskReasons?.length ? trustScore.riskReasons.join(', ') : 'No major risk indicators detected.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustScorePanel
