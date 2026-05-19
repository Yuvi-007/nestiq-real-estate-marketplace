import { X } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'

const getChips = (filters) => {
  const chips = []

  if (filters.q) chips.push({ key: 'q', label: filters.q })
  if (filters.city) chips.push({ key: 'city', label: filters.city })
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
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-charcoal shadow-sm transition hover:border-danger hover:text-danger"
        >
          {chip.label}
          <X size={14} />
        </button>
      ))}
      <button type="button" onClick={onClear} className="text-sm font-extrabold text-accent">
        Clear all
      </button>
    </div>
  )
}

export default ActiveFilterChips
