import { GraduationCap, Hospital, MapPinned, ShoppingBag, TrainFront } from 'lucide-react'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const placeGroups = [
  { key: 'schools', label: 'Schools', icon: GraduationCap },
  { key: 'hospitals', label: 'Hospitals', icon: Hospital },
  { key: 'malls', label: 'Malls', icon: ShoppingBag },
  { key: 'transit', label: 'Transit', icon: TrainFront },
]

function NearbyPlaces({ insights }) {
  return (
    <Card>
      <SectionHeader
        eyebrow="Nearby access"
        title="Nearby places"
        description="Demo insights based on city-level sample data."
      />

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {placeGroups.map(({ key, label, icon: Icon }) => (
          <div key={key} className="rounded-2xl border border-slate-200 bg-surface p-4">
            <p className="flex items-center gap-2 text-sm font-extrabold text-primary">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-accent shadow-sm">
                <Icon size={17} />
              </span>
              {label}
            </p>
            <ul className="mt-3 space-y-2">
              {(insights?.[key] || []).map((place) => (
                <li key={place} className="flex gap-2 text-sm leading-6 text-slate-600">
                  <MapPinned size={15} className="mt-1 shrink-0 text-slate-400" />
                  <span>{place}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default NearbyPlaces
