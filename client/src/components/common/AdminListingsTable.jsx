import { CheckCircle2, CircleDollarSign, Trash2, XCircle } from 'lucide-react'

import { formatPrice } from '../../utils/formatPrice'

const statusClasses = {
  active: 'bg-success/10 text-success',
  pending: 'bg-accent/10 text-accent',
  sold: 'bg-primary/10 text-primary',
  rejected: 'bg-danger/10 text-danger',
}

function AdminListingsTable({
  properties,
  onApprove,
  onReject,
  onMarkSold,
  onDelete,
  busyPropertyId,
}) {
  if (properties.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
        <h3 className="text-xl font-extrabold text-primary">No listings found</h3>
        <p className="mt-2 text-sm text-slate-600">New seller and agent listings will appear here.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">City</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Agent</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Views</th>
              <th className="px-5 py-4">Created</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.map((property) => {
              const isBusy = busyPropertyId === property._id

              return (
                <tr key={property._id} className="align-top">
                  <td className="max-w-xs px-5 py-4 font-bold text-primary">{property.title}</td>
                  <td className="px-5 py-4 text-slate-600">{property.location?.city || '-'}</td>
                  <td className="px-5 py-4 font-bold text-primary">{formatPrice(property.price)}</td>
                  <td className="px-5 py-4 text-slate-600">
                    <span className="block font-bold text-primary">{property.agent?.name || 'Unknown'}</span>
                    <span className="text-xs text-slate-500">{property.agent?.email || '-'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                        statusClasses[property.status] || 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {property.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{property.views || 0}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onApprove(property._id)}
                        disabled={isBusy}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-success hover:text-success disabled:cursor-wait disabled:opacity-60"
                        aria-label="Approve listing"
                        title="Approve listing"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(property._id)}
                        disabled={isBusy}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-danger hover:text-danger disabled:cursor-wait disabled:opacity-60"
                        aria-label="Reject listing"
                        title="Reject listing"
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMarkSold(property._id)}
                        disabled={isBusy}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-primary hover:text-primary disabled:cursor-wait disabled:opacity-60"
                        aria-label="Mark sold"
                        title="Mark sold"
                      >
                        <CircleDollarSign size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(property._id)}
                        disabled={isBusy}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-danger hover:text-danger disabled:cursor-wait disabled:opacity-60"
                        aria-label="Delete listing"
                        title="Delete listing"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminListingsTable
