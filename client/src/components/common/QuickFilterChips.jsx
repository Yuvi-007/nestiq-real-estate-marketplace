import { BadgeCheck, Dog, Home, ParkingCircle, Sofa, Sparkles, Waves } from 'lucide-react'

const quickFilters = [
  { label: 'Verified only', icon: BadgeCheck, patch: { verifiedOnly: true } },
  { label: 'Under Rs. 1Cr', icon: Sparkles, patch: { minPrice: '', maxPrice: '10000000' } },
  { label: 'Villas', icon: Home, patch: { type: 'Villa' } },
  { label: '3 BHK', icon: Home, patch: { bhk: '3' } },
  { label: 'Pet-friendly', icon: Dog, arrayKey: 'amenities', value: 'Pet-friendly' },
  { label: 'Parking', icon: ParkingCircle, arrayKey: 'amenities', value: 'Parking' },
  { label: 'Furnished', icon: Sofa, arrayKey: 'furnishing', value: 'Furnished' },
  { label: 'Pool', icon: Waves, arrayKey: 'amenities', value: 'Pool' },
  { label: 'Recently added', icon: Sparkles, patch: { sort: 'latest' } },
]

function QuickFilterChips({ filters, onApply }) {
  const applyFilter = (filter) => {
    if (filter.arrayKey) {
      const current = filters[filter.arrayKey] || []
      const nextValues = current.includes(filter.value) ? current.filter((item) => item !== filter.value) : [...current, filter.value]
      onApply({ ...filters, [filter.arrayKey]: nextValues })
      return
    }

    onApply({ ...filters, ...filter.patch })
  }

  const isActive = (filter) => {
    if (filter.arrayKey) return (filters[filter.arrayKey] || []).includes(filter.value)
    return Object.entries(filter.patch).every(([key, value]) => filters[key] === value)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {quickFilters.map((filter) => {
        const Icon = filter.icon
        const active = isActive(filter)

        return (
          <button
            key={filter.label}
            type="button"
            onClick={() => applyFilter(filter)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold transition ${
              active
                ? 'border-primary bg-primary text-white'
                : 'border-slate-200 bg-white text-charcoal hover:border-accent hover:bg-accent/10 hover:text-primary'
            }`}
          >
            <Icon size={15} />
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}

export default QuickFilterChips
