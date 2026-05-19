import { Bath, BedDouble, Building2, Compass, Layers, Sofa, Square } from 'lucide-react'

const highlights = [
  { key: 'bhk', label: 'BHK', icon: BedDouble, suffix: ' BHK' },
  { key: 'bathrooms', label: 'Bathrooms', icon: Bath, suffix: ' Bath' },
  { key: 'area', label: 'Area', icon: Square, suffix: ' sq.ft' },
  { key: 'floor', label: 'Floor', icon: Layers, suffix: '' },
  { key: 'furnishing', label: 'Furnishing', icon: Sofa, suffix: '' },
  { key: 'facing', label: 'Facing', icon: Compass, suffix: '' },
]

function getDisplayValue(property, item) {
  const value = property[item.key]

  if (value === undefined || value === null || value === '') {
    return 'Not specified'
  }

  if (item.key === 'floor' && Number(value) === 0) {
    return 'Ground'
  }

  if (typeof value === 'number') {
    return `${value}${item.suffix}`
  }

  return `${value}${item.suffix}`
}

function PropertyHighlights({ property }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Building2 size={20} className="text-accent" />
        <h2 className="text-xl font-bold text-primary">Property Highlights</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.key} className="rounded-lg border border-slate-100 bg-surface p-4">
              <Icon size={20} className="text-muted" />
              <p className="mt-3 text-xs font-bold uppercase text-muted">{item.label}</p>
              <p className="mt-1 text-sm font-bold text-charcoal">{getDisplayValue(property, item)}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default PropertyHighlights
