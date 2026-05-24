import { Link } from 'react-router-dom'

import { useProperties } from '../../hooks/useProperties'
import Button from '../ui/Button'
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import PropertyCard from './PropertyCard'

function CityFeaturedProperties({ cityName }) {
  const { data, isLoading } = useProperties({ page: 1, limit: 50, sort: 'views' })
  const properties = (data?.data || []).filter((property) => property.location?.city === cityName).slice(0, 3)

  return (
    <Card>
      <SectionHeader
        eyebrow="Featured properties"
        title={`Homes for sale in ${cityName}`}
        description="Live NestIQ listings filtered by city when matching inventory is available."
        action={<Button as={Link} to={`/properties?city=${cityName}`} variant="secondary">View all</Button>}
      />
      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-96 animate-pulse rounded-2xl bg-slate-200" />)
          : properties.map((property) => <PropertyCard key={property._id} property={property} />)}
      </div>
      {!isLoading && properties.length === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-surface p-5 text-sm font-semibold text-slate-600">
          No matching live listings are available for this city yet. Browse the full marketplace or save this city search for later.
        </div>
      )}
    </Card>
  )
}

export default CityFeaturedProperties
