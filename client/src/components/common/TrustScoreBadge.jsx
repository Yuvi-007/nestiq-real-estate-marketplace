import { Info, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'

const riskStyles = {
  LOW: {
    label: 'LOW',
    icon: ShieldCheck,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  MEDIUM: {
    label: 'MEDIUM',
    icon: ShieldQuestion,
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  HIGH: {
    label: 'HIGH',
    icon: ShieldAlert,
    className: 'border-red-200 bg-red-50 text-red-700',
  },
}

function TrustScoreBadge({ trustScore, compact = false }) {
  if (!trustScore) {
    return null
  }

  const risk = riskStyles[trustScore.riskLevel] || riskStyles.MEDIUM
  const Icon = risk.icon

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 shadow-sm ${
        compact ? 'text-xs' : 'text-sm'
      }`}
      title="NestIQ Score is a transparent rule-based confidence score using listing quality, value, location, media, and agent signals."
    >
      <span className="font-extrabold text-primary">NestIQ Score {trustScore.overallScore}</span>
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-extrabold ${risk.className}`}>
        <Icon size={compact ? 12 : 14} />
        {risk.label}
      </span>
      {!compact && <Info size={14} className="text-slate-400" />}
    </div>
  )
}

export default TrustScoreBadge
