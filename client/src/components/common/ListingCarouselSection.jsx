import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import Button from '../ui/Button'
import Card from '../ui/Card'
import SkeletonCard from '../ui/SkeletonCard'
import PropertyCard from './PropertyCard'

function ListingCarouselSection({
  title,
  subtitle,
  properties = [],
  viewAllTo,
  isLoading = false,
  emptyMessage = 'No matching live listings are available yet. Try the full marketplace.',
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-accent">Explore listings</p>
          <h2 className="mt-2 text-2xl font-extrabold text-primary">{title}</h2>
          {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p>}
        </div>
        {viewAllTo && (
          <Button as={Link} to={viewAllTo} variant="secondary" icon={ArrowRight} iconPosition="right" className="sm:shrink-0">
            View all
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : properties.length ? (
        <div className="-mx-5 mt-5 flex snap-x gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-3">
          {properties.map((property) => (
            <div key={property._id} className="w-[84vw] max-w-sm shrink-0 snap-start sm:w-auto sm:max-w-none">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-surface p-5 text-sm font-semibold leading-6 text-slate-600">
          {emptyMessage}
        </div>
      )}
    </Card>
  )
}

export default ListingCarouselSection
