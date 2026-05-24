import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bath, BedDouble, Eye, Heart, MapPin, Scale, ShieldCheck, Square, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import useSavedProperties from '../../hooks/useSavedProperties'
import { formatPrice } from '../../utils/formatPrice'
import TrustScoreBadge from './TrustScoreBadge'

const badgeStyles = {
  New: 'bg-success/10 text-success',
  'Hot Deal': 'bg-accent/15 text-amber-700',
  'Price Reduced': 'bg-danger/10 text-danger',
}

const fallbackImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'

const amenityAliases = {
  'Swimming Pool': 'Pool',
  'Private Pool': 'Pool',
  'Covered Parking': 'Parking',
  'Private Parking': 'Parking',
}

function getAmenityPreview(amenities = []) {
  return amenities.slice(0, 3).map((amenity) => amenityAliases[amenity] || amenity)
}

function getEmiEstimate(price) {
  const principal = Number(price || 0) * 0.8
  const monthlyRate = 8.5 / 12 / 100
  const months = 20 * 12

  if (!principal) {
    return 'EMI on request'
  }

  const emi = Math.round((principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1))
  return `${formatPrice(emi)}/mo est.`
}

function getRecencyText(property) {
  const date = property.updatedAt || property.createdAt

  if (!date) {
    return 'Posted recently'
  }

  const days = Math.max(Math.floor((Date.now() - new Date(date).getTime()) / 86400000), 0)

  if (days <= 1) return 'Updated recently'
  if (days <= 7) return `Updated ${days} days ago`
  return 'Posted recently'
}

function PropertyCard({
  property,
  variant = 'grid',
  isCompared = false,
  isCompareDisabled = false,
  onToggleCompare,
  onQuickView,
}) {
  const [saveError, setSaveError] = useState('')
  const { isPropertySaved, savingPropertyId, toggleSavedProperty } = useSavedProperties()
  const image = property.images?.[0] || fallbackImage
  const city = property.location?.city || 'City unavailable'
  const address = property.location?.address || 'Address unavailable'
  const agentName = property.agent?.name || 'NestIQ agent'
  const amenityPreview = getAmenityPreview(property.amenities)
  const extraAmenityCount = Math.max((property.amenities?.length || 0) - amenityPreview.length, 0)
  const isList = variant === 'list'
  const isSaved = isPropertySaved(property._id)
  const isSaving = savingPropertyId === property._id
  const emiEstimate = useMemo(() => getEmiEstimate(property.price), [property.price])
  const stats = [
    { icon: BedDouble, label: `${property.bhk || 0} BHK` },
    { icon: Bath, label: `${property.bathrooms || 0} Bath` },
    { icon: Square, label: `${property.area} sqft` },
  ]

  const handleSaveClick = async () => {
    setSaveError('')

    try {
      await toggleSavedProperty(property._id)
    } catch (error) {
      setSaveError(error.message)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        isList ? 'grid md:grid-cols-[320px_minmax(0,1fr)]' : 'flex h-full min-w-0 flex-col'
      }`}
    >
      <div className={`relative overflow-hidden bg-slate-100 ${isList ? 'aspect-[16/10] md:aspect-auto md:min-h-full' : 'aspect-[4/3]'}`}>
        <Link to={`/properties/${property._id}`} className="block h-full w-full">
          <img
            src={image}
            alt={property.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </Link>
        {property.badge && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
              badgeStyles[property.badge] || 'bg-primary/10 text-primary'
            }`}
          >
            {property.badge}
          </span>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 0.82 }}
          onClick={handleSaveClick}
          disabled={isSaving}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm transition ${
            isSaved ? 'text-danger' : 'text-muted hover:text-danger'
          } ${isSaving ? 'cursor-wait opacity-70' : ''}`}
          aria-label={isSaved ? 'Unsave property' : 'Save property'}
        >
          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} className={isSaving ? 'animate-pulse' : ''} />
        </motion.button>
      </div>

      <div className={`${isList ? 'p-6' : 'p-5'} flex min-w-0 flex-1 flex-col`}>
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-2xl font-extrabold text-primary">{formatPrice(property.price)}</p>
            <p className="mt-1 text-xs font-bold text-muted">{emiEstimate}</p>
            <Link to={`/properties/${property._id}`}>
              <h2 className={`${isList ? 'text-xl' : 'text-lg'} mt-2 line-clamp-2 font-extrabold leading-snug text-charcoal hover:text-primary`}>
                {property.title}
              </h2>
            </Link>
          </div>
        </div>

        <div className="mt-3">
          <TrustScoreBadge trustScore={property.trustScore} compact />
        </div>

        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-success">{getRecencyText(property)}</p>
        {saveError && <p className="mt-2 text-xs font-bold text-danger">{saveError}</p>}

        <div className="mt-3 flex gap-2 text-sm text-slate-600">
          <MapPin size={17} className="mt-0.5 shrink-0 text-accent" />
          <p className="line-clamp-2">
            <span className="font-bold text-charcoal">{city}</span>
            <span className="text-muted"> - {address}</span>
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 rounded-xl bg-surface p-3 text-sm">
          {stats.map((item) => {
            const Icon = item.icon

            return (
              <span key={item.label} className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 font-bold text-charcoal shadow-sm">
                <Icon size={16} className="shrink-0 text-muted" />
                <span className="whitespace-nowrap">{item.label}</span>
              </span>
            )
          })}
        </div>

        {amenityPreview.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {amenityPreview.map((amenity) => (
              <span key={amenity} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-amber-700">
                {amenity}
              </span>
            ))}
            {extraAmenityCount > 0 && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                +{extraAmenityCount} more
              </span>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-muted">Furnishing</p>
              <p className="mt-1 text-sm font-bold text-charcoal">{property.furnishing || 'Not specified'}</p>
              <p className="mt-3 text-sm font-bold text-primary">{agentName}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-success">
                <ShieldCheck size={13} />
                Verified
              </p>
            </div>

            {property.agent?.avatar ? (
              <img src={property.agent.avatar} alt={agentName} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-muted">
                <UserRound size={17} />
              </span>
            )}
          </div>

          <div className={`mt-auto grid gap-2 ${onQuickView ? 'sm:grid-cols-2' : ''}`}>
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(property)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-extrabold text-primary transition hover:border-accent"
              >
                <Eye size={16} />
                Quick View
              </button>
            )}
            <Link
              to={`/properties/${property._id}`}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-charcoal"
            >
              View Details
            </Link>
          </div>

          {onToggleCompare && (
            <button
              type="button"
              disabled={!isCompared && isCompareDisabled}
              onClick={() => onToggleCompare(property)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition ${
                isCompared
                  ? 'border-accent bg-accent/10 text-primary'
                  : 'border-slate-200 text-charcoal hover:border-accent'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Scale size={16} />
              {isCompared ? 'Selected to compare' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default PropertyCard
