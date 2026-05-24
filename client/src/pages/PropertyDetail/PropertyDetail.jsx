import { lazy, Suspense, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, ChevronDown, ChevronUp, Heart, MapPin, MessageCircle } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import AgentCard from '../../components/common/AgentCard'
import AmenitiesGrid from '../../components/common/AmenitiesGrid'
import ContactAgentModal from '../../components/common/ContactAgentModal'
import EMICalculator from '../../components/common/EMICalculator'
import FairPriceEstimate from '../../components/common/FairPriceEstimate'
import ImageGallery from '../../components/common/ImageGallery'
import LifestyleScorePanel from '../../components/common/LifestyleScorePanel'
import NearbyPlaces from '../../components/common/NearbyPlaces'
import PropertyHighlights from '../../components/common/PropertyHighlights'
import PropertyActivityTimeline from '../../components/common/PropertyActivityTimeline'
import ScheduleVisitModal from '../../components/common/ScheduleVisitModal'
import SimilarProperties from '../../components/common/SimilarProperties'
import TrustScorePanel from '../../components/common/TrustScorePanel'
import PageLoader from '../../components/common/PageLoader'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import StatusBadge from '../../components/ui/StatusBadge'
import SkeletonCard from '../../components/ui/SkeletonCard'
import useAuth from '../../hooks/useAuth'
import useInquiries from '../../hooks/useInquiries'
import { useProperties } from '../../hooks/useProperties'
import useSavedProperties from '../../hooks/useSavedProperties'
import useVisits from '../../hooks/useVisits'
import { propertyService } from '../../services/api'
import { getCityInsights } from '../../utils/cityInsights'
import { formatPrice } from '../../utils/formatPrice'
import { saveRecentlyViewed } from '../../utils/recentlyViewed'

const PriceHistoryChart = lazy(() => import('../../components/common/PriceHistoryChart'))

const badgeStyles = {
  New: 'bg-success/10 text-success',
  'Hot Deal': 'bg-accent/15 text-amber-700',
  'Price Reduced': 'bg-danger/10 text-danger',
}

function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <div className="aspect-[16/10] animate-pulse rounded-lg bg-slate-200" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="space-y-5">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [visitOpen, setVisitOpen] = useState(false)
  const [saveError, setSaveError] = useState('')
  const { isAuthenticated } = useAuth()
  const { createInquiry } = useInquiries(isAuthenticated)
  const { createVisit } = useVisits(isAuthenticated)
  const { isPropertySaved, savingPropertyId, toggleSavedProperty } = useSavedProperties()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getPropertyById(id),
    enabled: Boolean(id),
  })

  const { data: propertiesData } = useProperties()
  const property = data?.data
  const isSaved = property ? isPropertySaved(property._id) : false
  const isSaving = property ? savingPropertyId === property._id : false
  const description = property?.description || ''
  const cityInsights = getCityInsights(property?.location?.city)
  const shouldClampDescription = description.length > 260
  const similarProperties = (propertiesData?.data || [])
    .filter((item) => item._id !== property?._id)
    .filter((item) => item.location?.city === property?.location?.city || item.type === property?.type)
    .slice(0, 3)

  useEffect(() => {
    if (property) {
      saveRecentlyViewed(property)
    }
  }, [property])

  const handleSaveClick = async () => {
    if (!property) return

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }

    setSaveError('')

    try {
      await toggleSavedProperty(property._id)
    } catch (error) {
      setSaveError(error.message)
    }
  }

  const requireLoginOrOpen = (openModal) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }

    openModal(true)
  }

  const handleInquirySubmit = async (message) => {
    await createInquiry.mutateAsync({
      property: property._id,
      message,
    })
  }

  const handleVisitSubmit = async ({ date, time }) => {
    await createVisit.mutateAsync({
      property: property._id,
      date,
      time,
    })
  }

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (isError) {
    return (
      <section className="rounded-lg border border-danger/20 bg-danger/5 px-6 py-10">
        <h1 className="text-2xl font-bold text-danger">Unable to load property</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
          {error?.message || 'Please confirm the backend is running and try again.'}
        </p>
        <Button className="mt-6" onClick={() => refetch()}>
          Retry
        </Button>
      </section>
    )
  }

  if (!property) {
    return (
      <EmptyState
        title="Property not found"
        description="This listing may have been removed or the property ID is invalid."
        actionLabel="Back to properties"
        actionTo="/properties"
      />
    )
  }

  return (
    <section className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <ImageGallery images={property.images} title={property.title} />

          <div className="space-y-5 border-b border-slate-200 pb-8">
            <div className="flex flex-wrap items-center gap-3">
              {property.badge && (
                <Badge className={badgeStyles[property.badge] || 'bg-primary/10 text-primary'}>
                  {property.badge}
                </Badge>
              )}
              <StatusBadge status={property.status || 'active'} />
            </div>

            <div>
              <h1 className="font-display text-4xl font-bold leading-tight text-primary sm:text-5xl">{property.title}</h1>
              <p className="mt-4 flex gap-2 text-base text-slate-600">
                <MapPin size={19} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="font-semibold text-charcoal">{property.location?.city || 'City unavailable'}</span>
                  <span className="text-muted"> - {property.location?.address || 'Address unavailable'}</span>
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-3xl font-extrabold text-primary">{formatPrice(property.price)}</p>
              <Button
                variant="secondary"
                onClick={handleSaveClick}
                disabled={isSaving}
                className={`hover:border-danger hover:text-danger ${isSaved ? 'border-danger text-danger' : 'text-charcoal'}`}
              >
                <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} className={isSaving ? 'animate-pulse' : ''} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>
            {saveError && <p className="text-sm font-semibold text-danger">{saveError}</p>}
          </div>

          <PropertyHighlights property={property} />

          <TrustScorePanel trustScore={property.trustScore} />

          <FairPriceEstimate property={property} />

          <Card>
            <h2 className="text-xl font-bold text-primary">Description</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {showFullDescription || !shouldClampDescription ? description : `${description.slice(0, 260)}...`}
            </p>
            {shouldClampDescription && (
              <button
                type="button"
                onClick={() => setShowFullDescription((value) => !value)}
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-accent"
              >
                {showFullDescription ? 'Show less' : 'Read more'}
                {showFullDescription ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </Card>

          <AmenitiesGrid amenities={property.amenities} />

          <section className="space-y-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-accent">Nearby & Lifestyle Insights</p>
              <h2 className="mt-2 text-2xl font-extrabold text-primary">Neighborhood decision support</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                These are demo/sample city-level insights for hackathon evaluation. Verify exact schools, hospitals, transit,
                and neighborhood fit during site visits.
              </p>
            </div>
            <LifestyleScorePanel city={property.location?.city} insights={cityInsights} />
            <NearbyPlaces insights={cityInsights} />
          </section>

          <PropertyActivityTimeline property={property} />

          <Suspense
            fallback={
              <PageLoader
                compact
                title="Loading price history"
                message="Preparing the price trend chart for this property."
              />
            }
          >
            <PriceHistoryChart price={property.price} />
          </Suspense>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <p className="text-sm font-semibold text-muted">Listing price</p>
            <p className="mt-1 text-3xl font-extrabold text-primary">{formatPrice(property.price)}</p>

            <div className="mt-5 grid gap-3">
              <Button
                size="lg"
                onClick={() => requireLoginOrOpen(setVisitOpen)}
                icon={CalendarDays}
              >
                Schedule Visit
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => requireLoginOrOpen(setContactOpen)}
                icon={MessageCircle}
              >
                Contact Agent
              </Button>
            </div>
          </Card>

          <AgentCard agent={property.agent} />
          <EMICalculator price={property.price} />
        </aside>
      </div>

      <SimilarProperties properties={similarProperties} />

      <ContactAgentModal
        property={property}
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        onSubmit={handleInquirySubmit}
        isSubmitting={createInquiry.isPending}
      />
      <ScheduleVisitModal
        property={property}
        isOpen={visitOpen}
        onClose={() => setVisitOpen(false)}
        onSubmit={handleVisitSubmit}
        isSubmitting={createVisit.isPending}
      />
    </section>
  )
}

export default PropertyDetail
