import { CalendarDays, Heart, Home, MapPin, MessageCircle, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import useAuth from '../../hooks/useAuth'
import useInquiries from '../../hooks/useInquiries'
import useSavedProperties from '../../hooks/useSavedProperties'
import useVisits from '../../hooks/useVisits'
import { formatPrice } from '../../utils/formatPrice'
import SavedSearchesPanel from '../../components/common/SavedSearchesPanel'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import PageHeader from '../../components/ui/PageHeader'
import SectionHeader from '../../components/ui/SectionHeader'
import SystemStatusBadge from '../../components/ui/StatusBadge'

const fallbackImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'

function DashboardStat({ icon: Icon, label, value }) {
  return (
    <Card>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
        <Icon size={20} />
      </span>
      <p className="mt-4 text-3xl font-extrabold text-primary">{value}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
    </Card>
  )
}

function SavedPropertyCard({ property, onRemove, isRemoving }) {
  const image = property.images?.[0] || fallbackImage
  const city = property.location?.city || 'City unavailable'
  const address = property.location?.address || 'Address unavailable'

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/properties/${property._id}`} className="block aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={image} alt={property.title} className="h-full w-full object-cover transition duration-700 hover:scale-110" />
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xl font-extrabold text-primary">{formatPrice(property.price)}</p>
            <Link to={`/properties/${property._id}`}>
              <h2 className="mt-2 line-clamp-2 text-lg font-extrabold leading-snug text-charcoal hover:text-primary">
                {property.title}
              </h2>
            </Link>
          </div>
          <button
            type="button"
            onClick={() => onRemove(property._id)}
            disabled={isRemoving}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-danger hover:text-danger disabled:cursor-wait disabled:opacity-60"
            aria-label="Remove saved property"
          >
            <Trash2 size={17} />
          </button>
        </div>

        <p className="mt-3 flex gap-2 text-sm text-slate-600">
          <MapPin size={17} className="mt-0.5 shrink-0 text-accent" />
          <span className="line-clamp-2">
            <span className="font-bold text-charcoal">{city}</span>
            <span className="text-muted"> - {address}</span>
          </span>
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs font-bold uppercase text-muted">Agent</p>
            <p className="mt-1 text-sm font-bold text-primary">{property.agent?.name || 'NestIQ agent'}</p>
          </div>
          <Button
            as={Link}
            to={`/properties/${property._id}`}
            size="sm"
          >
            View
          </Button>
        </div>
      </div>
    </article>
  )
}

function StatusBadge({ status }) {
  return <SystemStatusBadge status={status} />
}

function EmptyPanel({ icon: Icon, title, description }) {
  return (
    <Card className="border-dashed border-slate-300">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <Icon size={19} />
      </span>
      <h3 className="mt-4 text-lg font-extrabold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </Card>
  )
}

function InquiryList({ inquiries, isLoading, isError, error }) {
  if (isLoading) {
    return <Card className="text-sm font-semibold text-slate-600">Loading inquiries...</Card>
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-danger/20 bg-danger/10 p-5 text-sm font-semibold text-danger">
        {error?.response?.data?.message || error?.message || 'Unable to load inquiries'}
      </div>
    )
  }

  if (inquiries.length === 0) {
    return (
      <EmptyPanel
        icon={MessageCircle}
        title="No inquiries yet"
        description="Contact an agent from a property detail page and your messages will appear here."
      />
    )
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inquiry) => (
        <Card key={inquiry._id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link to={`/properties/${inquiry.property?._id}`} className="font-extrabold text-primary hover:text-accent">
                {inquiry.property?.title || 'Property unavailable'}
              </Link>
              <p className="mt-1 text-sm text-slate-600">{inquiry.message}</p>
            </div>
            <StatusBadge status={inquiry.status} />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            Sent {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : '-'}
          </p>
        </Card>
      ))}
    </div>
  )
}

function VisitList({ visits, isLoading, isError, error, onCancel, cancellingId }) {
  if (isLoading) {
    return <Card className="text-sm font-semibold text-slate-600">Loading visits...</Card>
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-danger/20 bg-danger/10 p-5 text-sm font-semibold text-danger">
        {error?.response?.data?.message || error?.message || 'Unable to load visits'}
      </div>
    )
  }

  if (visits.length === 0) {
    return (
      <EmptyPanel
        icon={CalendarDays}
        title="No scheduled visits"
        description="Schedule a tour from a property detail page and it will appear here."
      />
    )
  }

  return (
    <div className="space-y-3">
      {visits.map((visit) => (
        <Card key={visit._id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link to={`/properties/${visit.property?._id}`} className="font-extrabold text-primary hover:text-accent">
                {visit.property?.title || 'Property unavailable'}
              </Link>
              <p className="mt-1 text-sm text-slate-600">
                {visit.date ? new Date(visit.date).toLocaleDateString() : '-'} at {visit.time || '-'}
              </p>
            </div>
            <StatusBadge status={visit.status} />
          </div>
          {visit.status !== 'cancelled' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onCancel(visit._id)}
              disabled={cancellingId === visit._id}
              className="mt-4 hover:border-danger hover:text-danger"
            >
              {cancellingId === visit._id ? 'Cancelling...' : 'Cancel visit'}
            </Button>
          )}
        </Card>
      ))}
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const { savedProperties, savingPropertyId, toggleSavedProperty } = useSavedProperties()
  const {
    inquiries,
    isLoading: inquiriesLoading,
    isError: inquiriesError,
    error: inquiriesErrorData,
  } = useInquiries()
  const {
    visits,
    isLoading: visitsLoading,
    isError: visitsError,
    error: visitsErrorData,
    updateVisitStatus,
  } = useVisits()
  const [removeError, setRemoveError] = useState('')

  const handleRemove = async (propertyId) => {
    setRemoveError('')

    try {
      await toggleSavedProperty(propertyId)
    } catch (error) {
      setRemoveError(error.message)
    }
  }

  const handleCancelVisit = async (visitId) => {
    await updateVisitStatus.mutateAsync({ id: visitId, status: 'cancelled' })
  }

  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-primary px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
        <PageHeader
          eyebrow="Buyer workspace"
          title={`Welcome back, ${user?.name || 'NestIQ user'}`}
          description="Your saved homes, visit planning, and property conversations live in one private workspace."
          className="[&_h1]:text-white [&_p:last-child]:text-white/75"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardStat icon={Heart} label="Saved properties" value={savedProperties.length} />
        <DashboardStat icon={MessageCircle} label="Inquiries" value={inquiries.length} />
        <DashboardStat icon={CalendarDays} label="Visits" value={visits.length} />
      </div>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Saved homes"
          title="Properties you are watching"
          action={<Button as={Link} to="/properties" variant="secondary">Browse more</Button>}
        />

        {savedProperties.length > 0 ? (
          <>
            {removeError && (
              <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
                {removeError}
              </div>
            )}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
              {savedProperties.map((property) => (
                <SavedPropertyCard
                  key={property._id}
                  property={property}
                  onRemove={handleRemove}
                  isRemoving={savingPropertyId === property._id}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={Home}
            title="No saved properties yet"
            description="Save homes from the marketplace and they will appear here for quick comparison and follow-up."
            actionLabel="Explore properties"
            actionTo="/properties"
          />
        )}
      </section>

      <SavedSearchesPanel />

      <div className="grid gap-5 md:grid-cols-2">
        <section className="space-y-4">
          <SectionHeader eyebrow="Messages" title="My inquiries" />
          <InquiryList
            inquiries={inquiries}
            isLoading={inquiriesLoading}
            isError={inquiriesError}
            error={inquiriesErrorData}
          />
        </section>
        <section className="space-y-4">
          <SectionHeader eyebrow="Tours" title="Scheduled visits" />
          <VisitList
            visits={visits}
            isLoading={visitsLoading}
            isError={visitsError}
            error={visitsErrorData}
            onCancel={handleCancelVisit}
            cancellingId={updateVisitStatus.variables?.id}
          />
        </section>
      </div>
    </section>
  )
}

export default Dashboard
