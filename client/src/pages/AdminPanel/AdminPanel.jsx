import { RefreshCw, ShieldAlert } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'

import AdminListingsTable from '../../components/common/AdminListingsTable'
import AdminRiskOverview from '../../components/common/AdminRiskOverview'
import AdminStats from '../../components/common/AdminStats'
import AdminUsersTable from '../../components/common/AdminUsersTable'
import AdminVerificationQueue from '../../components/common/AdminVerificationQueue'
import PageLoader from '../../components/common/PageLoader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import Input from '../../components/ui/Input'
import PageHeader from '../../components/ui/PageHeader'
import SectionHeader from '../../components/ui/SectionHeader'
import useAdmin from '../../hooks/useAdmin'
import useAuth from '../../hooks/useAuth'

const AdminCharts = lazy(() => import('../../components/common/AdminCharts'))

function AdminPanel() {
  const { user } = useAuth()
  const [roleFilter, setRoleFilter] = useState('')
  const hasAdminAccess = user?.role === 'admin'
  const {
    stats,
    users,
    properties,
    isLoading,
    isError,
    error,
    refetch,
    updateUser,
    deleteUser,
    approveProperty,
    rejectProperty,
    updatePropertyStatus,
    approveVerification,
    rejectVerification,
    deleteProperty,
  } = useAdmin(roleFilter, hasAdminAccess)

  const handleUserUpdate = async (id, payload) => {
    await updateUser.mutateAsync({ id, payload })
  }

  const handleUserDelete = async (id) => {
    if (window.confirm('Delete this user? This action cannot be undone.')) {
      await deleteUser.mutateAsync(id)
    }
  }

  const handleReject = async (id) => {
    const rejectionReason = window.prompt('Optional rejection reason') || ''
    await rejectProperty.mutateAsync({ id, rejectionReason })
  }

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Delete this listing? This action cannot be undone.')) {
      await deleteProperty.mutateAsync(id)
    }
  }

  const busyUserId = updateUser.variables?.id || deleteUser.variables
  const busyPropertyId =
    approveProperty.variables ||
    rejectProperty.variables?.id ||
    updatePropertyStatus.variables?.id ||
    approveVerification.variables ||
    rejectVerification.variables?.id ||
    deleteProperty.variables

  if (!hasAdminAccess) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Admin access required"
        description="This panel is only available to admin accounts. Your buyer and seller dashboards are still available."
        actionLabel="Go to dashboard"
        actionTo="/dashboard"
      />
    )
  }

  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-primary px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageHeader
            eyebrow="Admin workspace"
            title="Platform control center"
            description="Review growth, manage accounts, and moderate listings without affecting public browsing flows."
            className="[&_h1]:text-white [&_p:last-child]:text-white/75"
          />
          <Button
            variant="secondary"
            onClick={() => refetch()}
            icon={RefreshCw}
            className="bg-white"
          >
            Refresh
          </Button>
        </div>
      </div>

      {isLoading && (
        <Card className="text-sm font-semibold text-slate-600">
          Loading admin dashboard...
        </Card>
      )}

      {isError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {error?.response?.data?.message || error?.message || 'Unable to load admin dashboard'}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <AdminStats stats={stats} />
          <AdminRiskOverview stats={stats} properties={properties} />
          <AdminVerificationQueue
            properties={properties}
            onApprove={(id) => approveVerification.mutateAsync(id)}
            onReject={(id, rejectionReason) => rejectVerification.mutateAsync({ id, rejectionReason })}
            busyId={busyPropertyId}
          />
          <Suspense
            fallback={
              <PageLoader
                compact
                title="Loading analytics"
                message="Preparing the admin charts and breakdowns."
              />
            }
          >
            <AdminCharts stats={stats} />
          </Suspense>

          <section className="space-y-5">
            <SectionHeader
              eyebrow="Users"
              title="Account management"
              action={
                <Input
                  as="select"
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                  aria-label="Filter users by role"
                  className="min-w-40 bg-white py-2"
                >
                  <option value="">All roles</option>
                  <option value="buyer">Buyers</option>
                  <option value="seller">Sellers</option>
                  <option value="agent">Agents</option>
                  <option value="admin">Admins</option>
                </Input>
              }
            />
            <AdminUsersTable
              users={users}
              currentUserId={user?._id}
              onUpdateUser={handleUserUpdate}
              onDeleteUser={handleUserDelete}
              busyUserId={busyUserId}
            />
          </section>

          <section className="space-y-5">
            <SectionHeader eyebrow="Listings" title="Moderation queue" />
            <AdminListingsTable
              properties={properties}
              onApprove={(id) => approveProperty.mutateAsync(id)}
              onReject={handleReject}
              onMarkSold={(id) => updatePropertyStatus.mutateAsync({ id, status: 'sold' })}
              onDelete={handleDeleteProperty}
              busyPropertyId={busyPropertyId}
            />
          </section>
        </>
      )}
    </section>
  )
}

export default AdminPanel
