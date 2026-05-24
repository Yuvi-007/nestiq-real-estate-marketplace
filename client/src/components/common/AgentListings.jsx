import { Link } from 'react-router-dom'

import { useProperties } from '../../hooks/useProperties'
import Button from '../ui/Button'
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import PropertyCard from './PropertyCard'

function AgentListings({ agent }) {
  const { data, isLoading } = useProperties({ page: 1, limit: 50, sort: 'views' })
  const listings = (data?.data || [])
    .filter((property) => property.agent?.email === agent.email || property.agent?.name === agent.name || property.location?.city === agent.city)
    .slice(0, 3)

  return (
    <Card>
      <SectionHeader
        eyebrow="Agent listings"
        title="Properties handled by this agent"
        description="Uses matching live NestIQ property data when available, with city-based fallback matching for demo presentation."
        action={<Button as={Link} to={`/properties?city=${agent.city}`} variant="secondary">Browse {agent.city}</Button>}
      />
      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-96 animate-pulse rounded-2xl bg-slate-200" />)
          : listings.map((property) => <PropertyCard key={property._id} property={property} />)}
      </div>
      {!isLoading && listings.length === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-surface p-5 text-sm font-semibold text-slate-600">
          No matching live listings are available for this demo agent yet.
        </div>
      )}
    </Card>
  )
}

export default AgentListings
