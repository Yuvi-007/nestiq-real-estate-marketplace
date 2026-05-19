import { useState } from 'react'

import { clearRecentlyViewed, getRecentlyViewed } from '../../utils/recentlyViewed'
import PropertyCard from './PropertyCard'

function RecentlyViewed({ onQuickView, comparedIds = [], onToggleCompare }) {
  const [recentProperties, setRecentProperties] = useState(() => getRecentlyViewed())

  const handleClear = () => {
    clearRecentlyViewed()
    setRecentProperties([])
  }

  if (recentProperties.length === 0) {
    return null
  }

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-accent">Recent activity</p>
          <h2 className="mt-1 text-xl font-extrabold text-primary">Recently Viewed</h2>
        </div>
        <button type="button" onClick={handleClear} className="text-sm font-bold text-muted hover:text-danger">
          Clear
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
        {recentProperties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            variant="grid"
            isCompared={comparedIds.includes(property._id)}
            onToggleCompare={onToggleCompare}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  )
}

export default RecentlyViewed
