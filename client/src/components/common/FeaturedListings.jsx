import { Link } from 'react-router-dom'

import { useProperties } from '../../hooks/useProperties'
import PropertyCard from './PropertyCard'

function FeaturedListings() {
  const { data, isLoading } = useProperties({ page: 1, limit: 4, sort: 'views' })
  const properties = data?.data?.slice(0, 4) || []

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-accent">Featured homes</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-primary">Premium Listings</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Handpicked properties from the live NestIQ marketplace.
            </p>
          </div>
          <Link to="/properties" className="inline-flex w-fit rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-charcoal">
            View all
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-2xl bg-slate-200" />
              ))
            : properties.map((property) => <PropertyCard key={property._id} property={property} variant="grid" />)}
        </div>
      </div>
    </section>
  )
}

export default FeaturedListings
