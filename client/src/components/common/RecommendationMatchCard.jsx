import { Link } from 'react-router-dom'
import { CheckCircle2, MapPin, ShieldAlert } from 'lucide-react'

import { formatPrice } from '../../utils/formatPrice'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Card from '../ui/Card'

const fallbackImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'

function getBadgeVariant(label) {
  if (label === 'Best Match') return 'success'
  if (label === 'Good Match') return 'accent'
  return 'neutral'
}

function RecommendationMatchCard({ recommendation, compact = false }) {
  const { property, matchScore, label, matchedReasons, missingPreferences, shortExplanation } = recommendation
  const image = property.images?.[0] || fallbackImage
  const city = property.location?.city || 'City unavailable'

  return (
    <Card padded={false} className="flex h-full min-w-0 flex-col overflow-hidden">
      <Link to={`/properties/${property._id}`} className="block aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={image} alt={property.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-2xl font-extrabold text-primary">{matchScore}%</p>
            <Badge variant={getBadgeVariant(label)}>{label}</Badge>
          </div>
          <p className="rounded-2xl bg-primary px-3 py-2 text-sm font-extrabold text-white">
            {formatPrice(property.price)}
          </p>
        </div>

        <Link to={`/properties/${property._id}`}>
          <h3 className="mt-4 line-clamp-2 text-lg font-extrabold leading-snug text-charcoal hover:text-primary">
            {property.title}
          </h3>
        </Link>
        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <MapPin size={16} className="text-accent" />
          {city}
        </p>
        {!compact && <p className="mt-3 text-sm leading-6 text-slate-600">{shortExplanation}</p>}

        <div className="mt-4 space-y-2">
          {matchedReasons.slice(0, compact ? 3 : 5).map((reason) => (
            <p key={reason} className="flex gap-2 text-sm font-semibold text-slate-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
              <span>{reason}</span>
            </p>
          ))}
          {!compact && missingPreferences.slice(0, 2).map((reason) => (
            <p key={reason} className="flex gap-2 text-sm font-semibold text-slate-500">
              <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <span>{reason}</span>
            </p>
          ))}
        </div>

        <Button as={Link} to={`/properties/${property._id}`} className="mt-5">
          View Details
        </Button>
      </div>
    </Card>
  )
}

export default RecommendationMatchCard
