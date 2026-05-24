import { BarChart3, Camera, Crown, MapPinned, ShieldCheck, TrendingDown } from 'lucide-react'

const riskRank = {
  LOW: 3,
  MEDIUM: 2,
  HIGH: 1,
}

const getPricePerSqft = (property) => {
  const price = Number(property.price || 0)
  const area = Number(property.area || 0)
  return price && area ? price / area : Number.POSITIVE_INFINITY
}

const pickHighest = (properties, selector) =>
  [...properties].sort((a, b) => Number(selector(b) || 0) - Number(selector(a) || 0))[0]

const insightConfig = [
  {
    label: 'Best overall NestIQ Score',
    icon: Crown,
    pick: (properties) => pickHighest(properties, (property) => property.trustScore?.overallScore),
    explain: (property) => `${property.trustScore?.overallScore || 0}/10 overall confidence.`,
  },
  {
    label: 'Best value',
    icon: TrendingDown,
    pick: (properties) => [...properties].sort((a, b) => getPricePerSqft(a) - getPricePerSqft(b))[0],
    explain: (property) => `Lowest price per sqft among selected listings.`,
  },
  {
    label: 'Best location confidence',
    icon: MapPinned,
    pick: (properties) => pickHighest(properties, (property) => property.trustScore?.locationScore),
    explain: (property) => `${property.trustScore?.locationScore || 0}/10 location confidence.`,
  },
  {
    label: 'Lowest risk',
    icon: ShieldCheck,
    pick: (properties) => pickHighest(properties, (property) => riskRank[property.trustScore?.riskLevel] || 0),
    explain: (property) => `${property.trustScore?.riskLevel || 'MEDIUM'} risk profile.`,
  },
  {
    label: 'Best media quality',
    icon: Camera,
    pick: (properties) => pickHighest(properties, (property) => property.trustScore?.mediaScore),
    explain: (property) => `${property.images?.length || 0} images and ${property.trustScore?.mediaScore || 0}/10 media score.`,
  },
]

function SmartComparePanel({ properties }) {
  if (properties.length < 2) {
    return null
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-surface p-4">
      <p className="flex items-center gap-2 text-sm font-extrabold text-primary">
        <BarChart3 size={17} className="text-accent" />
        Smart compare insights
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-5">
        {insightConfig.map((insight) => {
          const property = insight.pick(properties)
          const Icon = insight.icon

          return (
            <div key={insight.label} className="rounded-2xl bg-white p-3 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Icon size={16} />
              </span>
              <p className="mt-3 text-xs font-extrabold uppercase text-slate-500">{insight.label}</p>
              <p className="mt-1 line-clamp-2 text-sm font-extrabold text-primary">{property?.title || '-'}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{property ? insight.explain(property) : '-'}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SmartComparePanel
