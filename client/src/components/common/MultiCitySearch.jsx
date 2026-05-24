import { X } from 'lucide-react'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const cityOptions = ['Mumbai', 'Pune', 'Goa', 'Bangalore', 'Delhi', 'Hyderabad', 'Nashik', 'Gurgaon']

function MultiCitySearch({ selectedCities = [], onChange }) {
  const toggleCity = (city) => {
    const nextCities = selectedCities.includes(city)
      ? selectedCities.filter((item) => item !== city)
      : [...selectedCities, city]

    onChange(nextCities)
  }

  return (
    <Card>
      <SectionHeader
        eyebrow="Multi-area search"
        title="Search across multiple cities"
        description="Pick one or more markets. NestIQ filters matching inventory client-side when multi-city backend search is not available."
        className="[&_h2]:text-xl"
      />
      {selectedCities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => toggleCity(city)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-extrabold text-white"
            >
              {city}
              <X size={13} />
            </button>
          ))}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {cityOptions.map((city) => {
          const active = selectedCities.includes(city)

          return (
            <button
              key={city}
              type="button"
              onClick={() => toggleCity(city)}
              className={`rounded-full border px-4 py-2 text-sm font-extrabold transition ${
                active
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-200 bg-surface text-charcoal hover:border-accent hover:bg-accent/10 hover:text-primary'
              }`}
            >
              {city}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

export default MultiCitySearch
