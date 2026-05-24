import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const toQuery = (params) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value)
  })

  return searchParams.toString()
}

function CityPopularSearches({ city }) {
  const navigate = useNavigate()

  return (
    <Card>
      <SectionHeader eyebrow="Popular searches" title={`Common searches in ${city.name}`} />
      <div className="mt-5 flex flex-wrap gap-2">
        {city.popularSearches.map((search) => (
          <button
            key={search.label}
            type="button"
            onClick={() => navigate(`/properties?${toQuery(search.params)}`)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-4 py-2 text-sm font-extrabold text-charcoal transition hover:border-accent hover:bg-accent/10 hover:text-primary"
          >
            <Search size={14} className="text-accent" />
            {search.label}
          </button>
        ))}
      </div>
    </Card>
  )
}

export default CityPopularSearches
