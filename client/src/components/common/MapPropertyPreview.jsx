import { Bath, BedDouble, MapPin, Square } from 'lucide-react'
import { Link } from 'react-router-dom'

import { formatPrice } from '../../utils/formatPrice'
import Button from '../ui/Button'
import TrustScoreBadge from './TrustScoreBadge'

const fallbackImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'

function MapPropertyPreview({ property }) {
  const image = property.images?.[0] || fallbackImage

  return (
    <article className="w-64 overflow-hidden rounded-2xl bg-white text-left">
      <Link to={`/properties/${property._id}`} className="block aspect-[16/10] overflow-hidden bg-slate-100">
        <img src={image} alt={property.title} className="h-full w-full object-cover" />
      </Link>

      <div className="space-y-3 p-3">
        <div>
          <p className="text-xl font-extrabold text-primary">{formatPrice(property.price)}</p>
          <Link to={`/properties/${property._id}`}>
            <h3 className="mt-1 line-clamp-2 text-sm font-extrabold leading-snug text-charcoal hover:text-primary">
              {property.title}
            </h3>
          </Link>
          <p className="mt-2 flex gap-1.5 text-xs font-semibold text-slate-600">
            <MapPin size={14} className="shrink-0 text-accent" />
            <span className="line-clamp-1">{property.location?.city || 'City unavailable'}</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-xl bg-surface p-2 text-xs font-bold text-charcoal">
          <span className="inline-flex items-center gap-1">
            <BedDouble size={13} className="text-muted" />
            {property.bhk || 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath size={13} className="text-muted" />
            {property.bathrooms || 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <Square size={13} className="text-muted" />
            {property.area || 0}
          </span>
        </div>

        <TrustScoreBadge trustScore={property.trustScore} compact />

        <Button as={Link} to={`/properties/${property._id}`} size="sm" className="w-full">
          View Details
        </Button>
      </div>
    </article>
  )
}

export default MapPropertyPreview
