import { RefreshCw, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import AdminCharts from '../../components/common/AdminCharts'
import AdminListingsTable from '../../components/common/AdminListingsTable'
import AdminStats from '../../components/common/AdminStats'
import AdminUsersTable from '../../components/common/AdminUsersTable'
import useAdmin from '../../hooks/useAdmin'
import useAuth from '../../hooks/useAuth'

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
    deleteProperty.variables

  if (!hasAdminAccess) {
    return (
      <section className="rounded-lg border border-accent/30 bg-white px-6 py-12 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <ShieldAlert size={26} />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-primary">Admin access required</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          This panel is only available to admin accounts. Your buyer and seller dashboards are still available.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-charcoal"
        >
          Go to dashboard
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <div className="rounded-lg bg-primary px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Admin workspace</p>
            <h1 className="mt-3 font-display text-4xl font-bold">Platform control center</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
              Review growth, manage accounts, and moderate listings without affecting public browsing flows.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary transition hover:bg-slate-100"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-10 text-sm font-semibold text-slate-600 shadow-sm">
          Loading admin dashboard...
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {error?.response?.data?.message || error?.message || 'Unable to load admin dashboard'}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <AdminStats stats={stats} />
          <AdminCharts stats={stats} />

          <section className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-accent">Users</p>
                <h2 className="mt-2 text-2xl font-extrabold text-primary">Account management</h2>
              </div>
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-primary outline-none transition focus:border-accent"
                aria-label="Filter users by role"
              >
                <option value="">All roles</option>
                <option value="buyer">Buyers</option>
                <option value="seller">Sellers</option>
                <option value="agent">Agents</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            <AdminUsersTable
              users={users}
              currentUserId={user?._id}
              onUpdateUser={handleUserUpdate}
              onDeleteUser={handleUserDelete}
              busyUserId={busyUserId}
            />
          </section>

          <section className="space-y-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-accent">Listings</p>
              <h2 className="mt-2 text-2xl font-extrabold text-primary">Moderation queue</h2>
            </div>
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
