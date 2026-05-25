import { X } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'
import Badge from '../ui/Badge'

const getChips = (filters) => {
  const chips = []

  if (filters.q) chips.push({ key: 'q', label: filters.q })
  if (filters.city) chips.push({ key: 'city', label: filters.city })
  ;(filters.cityList || []).forEach((city) => chips.push({ key: `cityList:${city}`, label: city }))
  if (filters.type) chips.push({ key: 'type', label: filters.type })
  if (filters.mode) chips.push({ key: 'mode', label: filters.mode.charAt(0).toUpperCase() + filters.mode.slice(1) })
  if (filters.minPrice && !filters.maxPrice) chips.push({ key: 'minPrice', label: `Above ${formatPrice(filters.minPrice)}` })
  if (!filters.minPrice && filters.maxPrice) chips.push({ key: 'maxPrice', label: `Under ${formatPrice(filters.maxPrice)}` })
  if (filters.minPrice && filters.maxPrice) {
    chips.push({ key: 'price', label: `${formatPrice(filters.minPrice)} - ${formatPrice(filters.maxPrice)}` })
  }
  if (filters.bhk) chips.push({ key: 'bhk', label: filters.bhk === '4' ? '4+ BHK' : `${filters.bhk} BHK` })
  ;(filters.amenities || []).forEach((amenity) => chips.push({ key: `amenities:${amenity}`, label: amenity }))
  ;(filters.furnishing || []).forEach((item) => chips.push({ key: `furnishing:${item}`, label: item }))
  if (filters.verifiedOnly) chips.push({ key: 'verifiedOnly', label: 'Verified only' })

  return chips
}

function ActiveFilterChips({ filters, onRemove, onClear }) {
  const chips = getChips(filters)

  if (chips.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Active</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          className="transition hover:-translate-y-0.5"
        >
          <Badge className="border border-slate-200 bg-white text-charcoal shadow-sm hover:border-danger hover:text-danger">
            {chip.label}
            <X size={14} />
          </Badge>
        </button>
      ))}
      <button type="button" onClick={onClear} className="ml-auto text-sm font-extrabold text-accent">
        Clear all
      </button>
    </div>
  )
}

export default ActiveFilterChips
