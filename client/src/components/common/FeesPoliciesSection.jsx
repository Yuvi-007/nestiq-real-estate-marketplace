import { Banknote, Car, PawPrint, ReceiptText, ShieldCheck, Zap } from 'lucide-react'

import { formatPrice } from '../../utils/formatPrice'
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const hasAmenity = (property, value) =>
  (property?.amenities || []).some((amenity) => String(amenity).toLowerCase().includes(value))

function FeesPoliciesSection({ property }) {
  const price = Number(property?.price || 0)
  const area = Number(property?.area || 0)
  const isRental = ['rent', 'rental'].includes(String(property?.mode || property?.purpose || property?.listingType || '').toLowerCase()) || property?.type === 'PG'
  const maintenance = area ? area * 4 : Math.max(Math.round(price * 0.0004), 2500)
  const deposit = isRental ? Math.max(price * 2, 25000) : 0

  const items = [
    [ReceiptText, 'Maintenance estimate', `${formatPrice(maintenance)} / month`, 'Calculated from area and typical society maintenance assumptions.'],
    [ShieldCheck, 'Security deposit', isRental ? formatPrice(deposit) : 'Usually not applicable', isRental ? 'Estimated as roughly two months of rent.' : 'Confirm token and booking amounts directly with the seller.'],
    [Car, 'Parking policy', hasAmenity(property, 'parking') ? 'Parking mentioned' : 'Confirm availability', 'Ask whether the spot is covered, open, paid, or included.'],
    [PawPrint, 'Pet policy', hasAmenity(property, 'pet') ? 'Pet-friendly signal found' : 'Confirm with owner / society', 'Society rules can vary by building and lease terms.'],
    [Banknote, 'Brokerage note', 'May vary by agent', 'NestIQ does not add brokerage. Confirm any agent fee before committing.'],
    [Zap, 'Utility responsibility', 'Buyer / tenant to verify', 'Electricity, water, gas, internet, and move-in fees should be confirmed during inquiry.'],
  ]

  return (
    <Card>
      <SectionHeader
        eyebrow="Fees & Policies"
        title="Costs and rules to verify before committing"
        description="Fees are estimated/demo unless the seller or agent provides real values."
      />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map(([Icon, title, value, note]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-surface p-5">
            <Icon className="text-accent" size={22} />
            <p className="mt-4 text-sm font-extrabold uppercase text-slate-500">{title}</p>
            <p className="mt-1 text-lg font-extrabold text-primary">{value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default FeesPoliciesSection
