import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const defaultPopularSearches = [
  { label: 'Villas in Goa', params: { type: 'Villa', city: 'Goa' } },
  { label: '3 BHK in Mumbai', params: { bhk: '3', city: 'Mumbai' } },
  { label: 'Flats under Rs. 1Cr in Pune', params: { type: 'Apartment', city: 'Pune', maxPrice: '10000000' } },
  { label: 'Apartments in Bangalore', params: { type: 'Apartment', city: 'Bangalore' } },
  { label: 'Houses in Nashik', params: { type: 'House', city: 'Nashik' } },
  { label: 'Luxury homes in Gurgaon', params: { q: 'luxury', city: 'Gurgaon' } },
  { label: 'Sea-view homes in Goa', params: { q: 'sea view', city: 'Goa' } },
]

const toSearchParams = (params) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value)
  })

  return searchParams.toString()
}

function PopularSearches({
  compact = false,
  searches = defaultPopularSearches,
  title,
  description,
}) {
  const navigate = useNavigate()

  const openSearch = (params) => {
    navigate(`/properties?${toSearchParams(params)}`)
  }

  return (
    <Card className={compact ? 'bg-white/95 shadow-xl backdrop-blur' : ''}>
      <SectionHeader
        eyebrow="Popular searches"
        title={title || (compact ? 'Quick search paths' : 'Popular buyer searches')}
        description={compact ? undefined : description || 'Jump into common search paths inspired by how buyers browse premium marketplaces.'}
      />
      <div className="mt-5 flex flex-wrap gap-2">
        {searches.map((search) => (
          <button
            key={search.label}
            type="button"
            onClick={() => openSearch(search.params)}
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

export default PopularSearches
