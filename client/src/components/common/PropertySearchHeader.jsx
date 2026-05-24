import { Search } from 'lucide-react'

import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'

const modes = ['buy', 'rent', 'sell']
const propertyTypes = ['', 'House', 'Apartment', 'Villa', 'Plot', 'PG']
const priceRanges = [
  { label: 'Any budget', minPrice: '', maxPrice: '' },
  { label: 'Under Rs. 75L', minPrice: '', maxPrice: '7500000' },
  { label: 'Rs. 75L - 2Cr', minPrice: '7500000', maxPrice: '20000000' },
  { label: 'Rs. 2Cr - 5Cr', minPrice: '20000000', maxPrice: '50000000' },
  { label: 'Above Rs. 5Cr', minPrice: '50000000', maxPrice: '' },
]

const getSelectedRange = (filters) => {
  return (
    priceRanges.find((range) => range.minPrice === filters.minPrice && range.maxPrice === filters.maxPrice)?.label ||
    'Custom budget'
  )
}

function PropertySearchHeader({ filters, onChange, onSearch }) {
  const updateFilter = (name, value) => {
    onChange({ ...filters, [name]: value })
  }

  const updatePriceRange = (label) => {
    const range = priceRanges.find((item) => item.label === label)

    if (!range) {
      return
    }

    onChange({ ...filters, minPrice: range.minPrice, maxPrice: range.maxPrice })
  }

  return (
    <Card className="bg-white/95 shadow-xl backdrop-blur">
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        {modes.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => updateFilter('mode', mode)}
            className={`rounded-xl px-4 py-2 text-sm font-extrabold capitalize transition ${
              filters.mode === mode ? 'bg-primary text-white' : 'bg-surface text-charcoal hover:text-primary'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="grid gap-3 pt-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
        <Input
          type="search"
          value={filters.q}
          onChange={(event) => updateFilter('q', event.target.value)}
          placeholder="Search by city, locality, property name..."
          aria-label="Search by city, locality, property name"
        />
        <Input
          type="text"
          value={filters.city}
          onChange={(event) => updateFilter('city', event.target.value)}
          placeholder="City or location"
          aria-label="City or location"
        />
        <Input
          as="select"
          value={filters.type}
          onChange={(event) => updateFilter('type', event.target.value)}
          aria-label="Property type"
        >
          {propertyTypes.map((type) => (
            <option key={type || 'all'} value={type}>
              {type || 'All property types'}
            </option>
          ))}
        </Input>
        <Input
          as="select"
          value={getSelectedRange(filters)}
          onChange={(event) => updatePriceRange(event.target.value)}
          aria-label="Price range"
        >
          {priceRanges.map((range) => (
            <option key={range.label} value={range.label}>
              {range.label}
            </option>
          ))}
          <option value="Custom budget">Custom budget</option>
        </Input>
        <Button variant="accent" size="lg" icon={Search} onClick={onSearch}>
          Search
        </Button>
      </div>
    </Card>
  )
}

export default PropertySearchHeader
