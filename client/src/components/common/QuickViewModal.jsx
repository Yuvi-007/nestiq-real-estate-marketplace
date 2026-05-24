import { useEffect } from 'react'
import { Bath, BedDouble, MapPin, Square, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { formatPrice } from '../../utils/formatPrice'

const fallbackImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'

function QuickViewModal({ property, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!property) {
    return null
  }

  const image = property.images?.[0] || fallbackImage
  const amenities = property.amenities || []

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6">
      <button
        type="button"
        className="absolute inset-0 bg-primary/70 backdrop-blur-sm"
        aria-label="Close quick view"
        onClick={onClose}
      />

      <motion.article
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-md"
          aria-label="Close quick view"
        >
          <X size={20} />
        </button>

        <div className="relative h-56 bg-slate-100 sm:h-72 md:h-auto md:min-h-full">
          <img src={image} alt={property.title} className="h-full w-full object-cover" />
          {property.badge && (
            <span className="absolute left-5 top-5 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-primary">
              {property.badge}
            </span>
          )}
        </div>

        <div className="min-w-0 p-5 sm:p-8">
          <p className="text-2xl font-extrabold text-primary sm:text-3xl">{formatPrice(property.price)}</p>
          <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-primary sm:text-3xl">{property.title}</h2>

          <p className="mt-4 flex gap-2 text-sm leading-6 text-slate-600">
            <MapPin size={17} className="mt-0.5 shrink-0 text-accent" />
            <span>
              <span className="font-bold text-charcoal">{property.location?.city || 'City unavailable'}</span>
              <span className="text-muted"> - {property.location?.address || 'Address unavailable'}</span>
            </span>
          </p>

          <div className="mt-6 flex flex-wrap gap-2 rounded-xl bg-surface p-3">
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-charcoal">
              <BedDouble size={16} className="text-muted" />
              {property.bhk || 0} BHK
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-charcoal">
              <Bath size={16} className="text-muted" />
              {property.bathrooms || 0} Bath
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-charcoal">
              <Square size={16} className="text-muted" />
              {property.area} sqft
            </span>
          </div>

          {amenities.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-extrabold uppercase text-muted">Amenities</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {amenities.slice(0, 6).map((amenity) => (
                  <span key={amenity} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-amber-700">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase text-muted">Agent</p>
            <p className="mt-1 text-sm font-extrabold text-primary">{property.agent?.name || 'NestIQ agent'}</p>
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-white transition hover:bg-charcoal"
          >
            View Details
          </Link>
        </div>
      </motion.article>
    </div>
  )
}

export default QuickViewModal
