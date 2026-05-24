import { Home, Ruler } from 'lucide-react'

import { formatPrice } from '../../utils/formatPrice'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const calculateEmi = (price) => {
  const principal = Number(price || 0) * 0.8
  const monthlyRate = 8.5 / 12 / 100
  const months = 20 * 12

  if (!principal) return 0

  return Math.round((principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1))
}

const getPlanCount = (property) => {
  const bhk = Number(property?.bhk || 0)

  if (!bhk) return [1, 2, 3]

  return Array.from({ length: Math.min(Math.max(bhk, 1), 3) }, (_, index) => index + 1)
}

function FloorPlansSection({ property }) {
  const area = Number(property?.area || 900)
  const price = Number(property?.price || 0)
  const isRental = ['rent', 'rental'].includes(String(property?.mode || property?.purpose || property?.listingType || '').toLowerCase()) || property?.type === 'PG'
  const plans = getPlanCount(property).map((bhk, index) => {
    const areaRatio = bhk / Math.max(Number(property?.bhk || bhk), bhk)
    const planArea = Math.max(Math.round(area * areaRatio), 450)
    const planPrice = Math.max(Math.round(price * areaRatio), price || 0)

    return {
      bhk,
      area: planArea,
      estimate: isRental ? formatPrice(planPrice || 25000) : formatPrice(calculateEmi(planPrice || 6500000)),
      estimateLabel: isRental ? 'Estimated rent' : 'Estimated EMI',
      available: index === 0 ? 'Available' : 'Check with agent',
    }
  })

  return (
    <Card>
      <SectionHeader
        eyebrow="Floor plans"
        title="Available configuration snapshot"
        description="Demo floor plan data based on property configuration."
      />
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.bhk} className="rounded-2xl border border-slate-200 bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                <Home size={20} />
              </div>
              <Badge variant={plan.available === 'Available' ? 'success' : 'neutral'}>{plan.available}</Badge>
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-primary">{plan.bhk} BHK plan</h3>
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Ruler size={16} className="text-accent" />
              {plan.area.toLocaleString('en-IN')} sq.ft
            </p>
            <p className="mt-4 text-xs font-extrabold uppercase text-slate-500">{plan.estimateLabel}</p>
            <p className="mt-1 text-2xl font-extrabold text-primary">{plan.estimate}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default FloorPlansSection
