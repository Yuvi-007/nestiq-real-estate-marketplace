import { Calculator, IndianRupee } from 'lucide-react'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import { formatPrice } from '../../utils/formatPrice'

const getPriceBand = (priceScore) => {
  if (priceScore >= 8) {
    return {
      label: 'Fair',
      className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      explanation: 'The listing price appears reasonable based on NestIQ rule-based sanity checks.',
    }
  }

  if (priceScore >= 6) {
    return {
      label: 'Slightly High',
      className: 'border-amber-200 bg-amber-50 text-amber-700',
      explanation: 'The price may need closer comparison with similar listings before shortlisting.',
    }
  }

  if (priceScore >= 4) {
    return {
      label: 'Premium',
      className: 'border-orange-200 bg-orange-50 text-orange-700',
      explanation: 'The listing appears premium or outside the expected sanity range for this rule-based check.',
    }
  }

  return {
    label: 'Needs Review',
    className: 'border-red-200 bg-red-50 text-red-700',
    explanation: 'The price signals need manual review because area or price sanity checks are limited.',
  }
}

function FairPriceEstimate({ property }) {
  const price = Number(property.price || 0)
  const area = Number(property.area || 0)
  const pricePerSqft = price && area ? price / area : 0
  const priceScore = property.trustScore?.priceScore || 0
  const band = getPriceBand(priceScore)

  return (
    <Card>
      <SectionHeader
        eyebrow="Price confidence"
        title="Fair Price Estimate"
        description="This is a rule-based explanation, not a live market valuation or appraisal."
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
        <div className="rounded-2xl bg-primary p-5 text-white">
          <p className="flex items-center gap-2 text-sm font-bold text-white/70">
            <IndianRupee size={16} />
            Price per sqft
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {pricePerSqft ? formatPrice(Math.round(pricePerSqft)) : 'N/A'}
          </p>
          <p className="mt-2 text-xs font-semibold text-white/65">Based on listing price and declared area.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-surface p-5">
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-extrabold ${band.className}`}>
            {band.label}
          </span>
          <p className="mt-4 flex gap-2 text-sm leading-6 text-slate-700">
            <Calculator size={17} className="mt-1 shrink-0 text-accent" />
            <span>
              {band.explanation} NestIQ uses transparent checks like price per sqft, declared area, and listing quality signals.
            </span>
          </p>
        </div>
      </div>
    </Card>
  )
}

export default FairPriceEstimate
