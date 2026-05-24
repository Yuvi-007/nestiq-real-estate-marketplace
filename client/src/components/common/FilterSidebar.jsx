import { RotateCcw, Search } from 'lucide-react'

import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'
import SectionHeader from '../ui/SectionHeader'

const propertyTypes = ['', 'House', 'Apartment', 'Villa', 'Plot', 'PG']
const bhkOptions = ['1', '2', '3', '4']
const amenityOptions = ['Pool', 'Gym', 'Parking', 'Security', 'Pet-friendly']
const furnishingOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished']

function FilterSection({ title, children }) {
  return (
    <section className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
      <h3 className="text-sm font-extrabold text-primary">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function FilterSidebar({ filters, onChange, onApply, onClear, className = '' }) {
  const updateFilter = (name, value) => {
    onChange({ ...filters, [name]: value })
  }

  const toggleArrayValue = (name, value) => {
    const currentValues = filters[name] || []
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value]

    updateFilter(name, nextValues)
  }

  return (
    <Card as="aside" className={className}>
      <div className="flex items-center justify-between gap-3">
        <SectionHeader eyebrow="Marketplace" title="Refine Results" className="[&_h2]:text-xl [&_p]:text-xs" />
        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={onClear} className="text-muted hover:border-danger hover:text-danger">
          Clear
        </Button>
      </div>

      <div className="mt-6 space-y-5">
        <FilterSection title="City">
          <Input
            type="text"
            value={filters.city}
            onChange={(event) => updateFilter('city', event.target.value)}
            placeholder="Goa, Mumbai, Pune"
            className="px-3 py-2.5"
          />
        </FilterSection>

        <FilterSection title="Property Type">
          <div className="grid gap-2">
            {propertyTypes.map((type) => (
              <label key={type || 'any'} className="flex items-center gap-3 text-sm font-semibold text-charcoal">
                <input
                  type="radio"
                  name="property-type"
                  checked={filters.type === type}
                  onChange={() => updateFilter('type', type)}
                  className="h-4 w-4 accent-amber-500"
                />
                {type || 'Any type'}
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price Range">
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(event) => updateFilter('minPrice', event.target.value)}
              placeholder="Min"
              className="px-3 py-2.5"
            />
            <Input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(event) => updateFilter('maxPrice', event.target.value)}
              placeholder="Max"
              className="px-3 py-2.5"
            />
          </div>
        </FilterSection>

        <FilterSection title="BHK">
          <div className="flex flex-wrap gap-2">
            {bhkOptions.map((bhk) => (
              <button
                key={bhk}
                type="button"
                onClick={() => updateFilter('bhk', filters.bhk === bhk ? '' : bhk)}
                className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                  filters.bhk === bhk
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-200 bg-surface text-charcoal hover:border-accent'
                }`}
              >
                {bhk === '4' ? '4+' : bhk}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Amenities">
          <div className="grid gap-2">
            {amenityOptions.map((amenity) => (
              <label key={amenity} className="flex items-center gap-3 text-sm font-semibold text-charcoal">
                <input
                  type="checkbox"
                  checked={(filters.amenities || []).includes(amenity)}
                  onChange={() => toggleArrayValue('amenities', amenity)}
                  className="h-4 w-4 accent-amber-500"
                />
                {amenity}
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Furnishing">
          <div className="grid gap-2">
            {furnishingOptions.map((furnishing) => (
              <label key={furnishing} className="flex items-center gap-3 text-sm font-semibold text-charcoal">
                <input
                  type="checkbox"
                  checked={(filters.furnishing || []).includes(furnishing)}
                  onChange={() => toggleArrayValue('furnishing', furnishing)}
                  className="h-4 w-4 accent-amber-500"
                />
                {furnishing}
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Trust">
          <label className="flex items-center gap-3 text-sm font-semibold text-charcoal">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(event) => updateFilter('verifiedOnly', event.target.checked)}
              className="h-4 w-4 accent-amber-500"
            />
            Verified only
          </label>
        </FilterSection>

        <Button size="lg" icon={Search} onClick={onApply} className="w-full">
          Apply Filters
        </Button>
      </div>
    </Card>
  )
}

export default FilterSidebar
