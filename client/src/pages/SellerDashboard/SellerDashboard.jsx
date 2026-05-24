import { CalendarDays, MessageCircle, ShieldAlert } from 'lucide-react'

import AddPropertyWizard from '../../components/common/AddPropertyWizard'
import MyListingsTable from '../../components/common/MyListingsTable'
import SellerStats from '../../components/common/SellerStats'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import PageHeader from '../../components/ui/PageHeader'
import SectionHeader from '../../components/ui/SectionHeader'
import SystemStatusBadge from '../../components/ui/StatusBadge'
import useAuth from '../../hooks/useAuth'
import useInquiries from '../../hooks/useInquiries'
import useSellerListings from '../../hooks/useSellerListings'
import useVisits from '../../hooks/useVisits'

const allowedRoles = ['seller', 'agent', 'admin']
const inquiryStatuses = ['new', 'contacted', 'closed']
const visitStatuses = ['scheduled', 'completed', 'cancelled']
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

function SellerInquiriesTable({ inquiries, isLoading, isError, error, onStatusChange, busyId }) {
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
        title="No listing inquiries"
        description="Buyer messages for your listings will appear here."
      />
    )
  }

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[940px] divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Property</th>
              <th className="px-5 py-4">Buyer</th>
              <th className="px-5 py-4">Message</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Created</th>
              <th className="px-5 py-4 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inquiries.map((inquiry) => (
              <tr key={inquiry._id} className="align-top">
                <td className="px-5 py-4 font-bold text-primary">{inquiry.property?.title || '-'}</td>
                <td className="px-5 py-4 text-slate-600">
                  <span className="block font-bold text-primary">{inquiry.sender?.name || '-'}</span>
                  <span className="text-xs text-slate-500">{inquiry.sender?.email || '-'}</span>
                </td>
                <td className="max-w-sm px-5 py-4 text-slate-600">{inquiry.message}</td>
                <td className="px-5 py-4"><StatusBadge status={inquiry.status} /></td>
                <td className="px-5 py-4 text-slate-600">
                  {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-5 py-4 text-right">
                  <select
                    value={inquiry.status}
                    disabled={busyId === inquiry._id}
                    onChange={(event) => onStatusChange(inquiry._id, event.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-primary outline-none transition focus:border-accent disabled:cursor-wait disabled:opacity-60"
                    aria-label="Update inquiry status"
                  >
                    {inquiryStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function SellerVisitsTable({ visits, isLoading, isError, error, onStatusChange, busyId }) {
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
        description="Buyer tour requests for your listings will appear here."
      />
    )
  }

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Property</th>
              <th className="px-5 py-4">Buyer</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Time</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visits.map((visit) => (
              <tr key={visit._id} className="align-top">
                <td className="px-5 py-4 font-bold text-primary">{visit.property?.title || '-'}</td>
                <td className="px-5 py-4 text-slate-600">
                  <span className="block font-bold text-primary">{visit.user?.name || '-'}</span>
                  <span className="text-xs text-slate-500">{visit.user?.email || '-'}</span>
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {visit.date ? new Date(visit.date).toLocaleDateString() : '-'}
                </td>
                <td className="px-5 py-4 text-slate-600">{visit.time || '-'}</td>
                <td className="px-5 py-4"><StatusBadge status={visit.status} /></td>
                <td className="px-5 py-4 text-right">
                  <select
                    value={visit.status}
                    disabled={busyId === visit._id}
                    onChange={(event) => onStatusChange(visit._id, event.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-primary outline-none transition focus:border-accent disabled:cursor-wait disabled:opacity-60"
                    aria-label="Update visit status"
                  >
                    {visitStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function SellerDashboard() {
  const { user } = useAuth()
  const hasSellerAccess = allowedRoles.includes(user?.role)
  const {
    listings,
    isLoading,
    isError,
    error,
    refetch,
    createListing,
    deleteListing,
  } = useSellerListings()
  const {
    inquiries,
    isLoading: inquiriesLoading,
    isError: inquiriesError,
    error: inquiriesErrorData,
    updateInquiryStatus,
  } = useInquiries(hasSellerAccess)
  const {
    visits,
    isLoading: visitsLoading,
    isError: visitsError,
    error: visitsErrorData,
    updateVisitStatus,
  } = useVisits(hasSellerAccess)

  const handleCreate = async (payload) => {
    await createListing.mutateAsync(payload)
  }

  const handleDelete = async (propertyId) => {
    await deleteListing.mutateAsync(propertyId)
  }

  const handleInquiryStatus = async (id, status) => {
    await updateInquiryStatus.mutateAsync({ id, status })
  }

  const handleVisitStatus = async (id, status) => {
    await updateVisitStatus.mutateAsync({ id, status })
  }

  if (!hasSellerAccess) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Seller/Agent access required"
        description="This workspace is available for seller, agent, and admin accounts. Buyer dashboard access is still available."
        actionLabel="Go to buyer dashboard"
        actionTo="/dashboard"
      />
    )
  }

  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-primary px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
        <PageHeader
          eyebrow="Seller workspace"
          title={`Manage listings, ${user?.name || 'seller'}`}
          description="Create active property listings, review marketplace visibility, and manage buyer conversations."
          className="[&_h1]:text-white [&_p:last-child]:text-white/75"
        />
      </div>

      <SellerStats listings={listings} />

      <AddPropertyWizard onCreate={handleCreate} isSubmitting={createListing.isPending} />

      <section className="space-y-5">
        <SectionHeader
          eyebrow="My listings"
          title="Published properties"
          action={<Button variant="secondary" onClick={() => refetch()}>Refresh</Button>}
        />

        {isLoading && (
          <Card className="text-sm font-semibold text-slate-600">
            Loading your listings...
          </Card>
        )}

        {isError && (
          <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {error?.message || 'Unable to load seller listings'}
          </div>
        )}

        {!isLoading && !isError && (
          <MyListingsTable
            listings={listings}
            onDelete={handleDelete}
            deletingId={deleteListing.variables}
          />
        )}
      </section>

      <section className="space-y-5">
        <SectionHeader eyebrow="Buyer messages" title="Listing inquiries" />
        <SellerInquiriesTable
          inquiries={inquiries}
          isLoading={inquiriesLoading}
          isError={inquiriesError}
          error={inquiriesErrorData}
          onStatusChange={handleInquiryStatus}
          busyId={updateInquiryStatus.variables?.id}
        />
      </section>

      <section className="space-y-5">
        <SectionHeader eyebrow="Scheduled tours" title="Property visits" />
        <SellerVisitsTable
          visits={visits}
          isLoading={visitsLoading}
          isError={visitsError}
          error={visitsErrorData}
          onStatusChange={handleVisitStatus}
          busyId={updateVisitStatus.variables?.id}
        />
      </section>
    </section>
  )
}

export default SellerDashboard
