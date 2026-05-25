import { lazy, Suspense, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bath, BedDouble, CalendarDays, ChevronDown, ChevronUp, Heart, Home, MapPin, MessageCircle, ShieldCheck, Sofa, Sparkles, Square, UserRound } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import AgentCard from '../../components/common/AgentCard'
import AmenitiesByCategory from '../../components/common/AmenitiesByCategory'
import AskNestIQ from '../../components/common/AskNestIQ'
import ContactAgentModal from '../../components/common/ContactAgentModal'
import EMICalculator from '../../components/common/EMICalculator'
import FairPriceEstimate from '../../components/common/FairPriceEstimate'
import FeesPoliciesSection from '../../components/common/FeesPoliciesSection'
import FloorPlansSection from '../../components/common/FloorPlansSection'
import ImageGallery from '../../components/common/ImageGallery'
import LifestyleScorePanel from '../../components/common/LifestyleScorePanel'
import MobileStickyCTA from '../../components/common/MobileStickyCTA'
import NearbyPlaces from '../../components/common/NearbyPlaces'
import PropertyHighlights from '../../components/common/PropertyHighlights'
import PropertyActivityTimeline from '../../components/common/PropertyActivityTimeline'
import PropertySectionNav from '../../components/common/PropertySectionNav'
import ScheduleVisitModal from '../../components/common/ScheduleVisitModal'
import SharePropertyButton from '../../components/common/SharePropertyButton'
import SimilarProperties from '../../components/common/SimilarProperties'
import TrustScoreBadge from '../../components/common/TrustScoreBadge'
import TrustScorePanel from '../../components/common/TrustScorePanel'
import UtilitiesInfoCard from '../../components/common/UtilitiesInfoCard'
import VerificationStatusBadge from '../../components/common/VerificationStatusBadge'
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
  const summaryStats = property ? [
    { icon: BedDouble, label: `${property.bhk || 0} BHK` },
    { icon: Bath, label: `${property.bathrooms || 0} Bath` },
    { icon: Square, label: property.area ? `${Number(property.area).toLocaleString('en-IN')} sqft` : 'Area N/A' },
    { icon: Sofa, label: property.furnishing || 'Furnishing N/A' },
  ] : []

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
    <section className="space-y-8">
      <div id="photos" className="scroll-mt-32">
        <ImageGallery images={property.images} title={property.title} />
      </div>

      <PropertySectionNav />

      <div id="overview" className="scroll-mt-36 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <Card className="shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-center gap-3">
              {property.badge && (
                <Badge className={badgeStyles[property.badge] || 'bg-primary/10 text-primary'}>
                  {property.badge}
                </Badge>
              )}
              <StatusBadge status={property.status || 'active'} />
              <Badge className="bg-slate-100 text-slate-700">
                <Home size={14} />
                {property.type || 'Property'}
              </Badge>
              <VerificationStatusBadge status={property.verification?.status} />
              <TrustScoreBadge trustScore={property.trustScore} compact />
            </div>

            <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <h1 className="text-3xl font-extrabold leading-tight text-primary sm:text-4xl">{property.title}</h1>
                <p className="mt-3 flex gap-2 text-sm leading-6 text-slate-600 sm:text-base">
                  <MapPin size={19} className="mt-0.5 shrink-0 text-accent" />
                  <span>
                    <span className="font-semibold text-charcoal">{property.location?.city || 'City unavailable'}</span>
                    <span className="text-muted"> - {property.location?.address || 'Address unavailable'}</span>
                  </span>
                </p>
              </div>

              <div className="shrink-0">
                <p className="text-sm font-bold uppercase tracking-wide text-muted">Listing price</p>
                <p className="mt-1 text-3xl font-extrabold text-primary sm:text-4xl">{formatPrice(property.price)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {summaryStats.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-surface p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                      <Icon size={18} />
                    </span>
                    <p className="text-sm font-extrabold text-charcoal">{item.label}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <SharePropertyButton property={property} />
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
            {saveError && <p className="mt-3 text-sm font-semibold text-danger">{saveError}</p>}
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-primary">Overview</h2>
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

          <PropertyHighlights property={property} />

          <div id="intelligence" className="scroll-mt-36 space-y-8">
            <FairPriceEstimate property={property} />
            <TrustScorePanel trustScore={property.trustScore} />
            <AskNestIQ property={property} lifestyleInsights={cityInsights} />
            <FloorPlansSection property={property} />
          </div>

          <div id="amenities" className="scroll-mt-36 space-y-8">
            <AmenitiesByCategory amenities={property.amenities} />
            <UtilitiesInfoCard amenities={property.amenities} />
          </div>

          <section id="nearby" className="scroll-mt-36 space-y-5">
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

          <div id="fees-policies" className="scroll-mt-36 space-y-8">
            <FeesPoliciesSection property={property} />
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
        </div>

        <aside id="contact" className="scroll-mt-36 space-y-5 lg:sticky lg:top-36 lg:self-start">
          <Card className="shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted">Listing price</p>
                <p className="mt-1 text-3xl font-extrabold text-primary">{formatPrice(property.price)}</p>
              </div>
              <VerificationStatusBadge status={property.verification?.status} />
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-surface p-4">
              {property.agent?.avatar ? (
                <img src={property.agent.avatar} alt={property.agent?.name || 'NestIQ agent'} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-muted">
                  <UserRound size={22} />
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-primary">{property.agent?.name || 'NestIQ agent'}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-success">
                  <ShieldCheck size={13} />
                  Verified listing contact
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <Button
                size="lg"
                onClick={() => requireLoginOrOpen(setContactOpen)}
                icon={MessageCircle}
              >
                Contact Agent
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => requireLoginOrOpen(setVisitOpen)}
                icon={CalendarDays}
              >
                Schedule Visit
              </Button>
              <Button variant="secondary" size="lg" disabled icon={MessageCircle}>
                Message Agent
              </Button>
            </div>

            <div className="mt-5 grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-600">
              <p className="flex items-center gap-2">
                <Sparkles size={16} className="text-accent" />
                Trust Score and price signals are available in Intelligence.
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-success" />
                Login required before inquiries or visits.
              </p>
            </div>
          </Card>

          <AgentCard agent={property.agent} />
          <EMICalculator price={property.price} />
        </aside>
      </div>

      <div id="similar-listings" className="scroll-mt-36">
        <SimilarProperties properties={similarProperties} />
      </div>

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
      <MobileStickyCTA
        price={property.price}
        onContact={() => requireLoginOrOpen(setContactOpen)}
        onSchedule={() => requireLoginOrOpen(setVisitOpen)}
      />
    </section>
  )
}

export default PropertyDetail
