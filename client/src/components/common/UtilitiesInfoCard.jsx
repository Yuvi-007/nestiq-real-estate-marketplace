import { Droplets, Flame, Router, Zap } from 'lucide-react'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const hasAmenity = (amenities, value) =>
  amenities.some((amenity) => String(amenity).toLowerCase().includes(value))

function UtilitiesInfoCard({ amenities = [] }) {
  const utilities = [
    [Droplets, 'Water supply', hasAmenity(amenities, 'water') ? 'Water supply mentioned' : 'Confirm municipal / tanker supply'],
    [Zap, 'Power backup', hasAmenity(amenities, 'backup') || hasAmenity(amenities, 'power') ? 'Power backup mentioned' : 'Backup details not listed'],
    [Router, 'Internet availability', 'Provider availability placeholder'],
    [Flame, 'Gas connection', 'Piped / cylinder setup to verify'],
  ]

  return (
    <Card>
      <SectionHeader
        eyebrow="Utilities"
        title="Utility readiness"
        description="Maintenance and utility details should be verified with the seller, society, or landlord before payment."
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {utilities.map(([Icon, label, value]) => (
          <div key={label} className="rounded-2xl bg-surface p-4">
            <Icon className="text-accent" size={21} />
            <p className="mt-3 text-xs font-extrabold uppercase text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-bold text-primary">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-800">
        Maintenance inclusions can differ by society. Confirm water, power, security, lift, parking, and clubhouse charges.
      </p>
    </Card>
  )
}

export default UtilitiesInfoCard
