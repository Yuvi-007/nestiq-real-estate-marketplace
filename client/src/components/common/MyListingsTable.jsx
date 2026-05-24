import { Edit3, Trash2 } from 'lucide-react'

import { formatPrice } from '../../utils/formatPrice'
import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'
import StatusBadge from '../ui/StatusBadge'

function MyListingsTable({ listings, onDelete, deletingId }) {
  if (listings.length === 0) {
    return (
      <EmptyState
        title="No listings yet"
        description="Publish your first property from the wizard and it will appear here immediately."
      />
    )
  }

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">City</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Views</th>
              <th className="px-5 py-4">Created</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {listings.map((property) => (
              <tr key={property._id} className="align-top">
                <td className="max-w-xs px-5 py-4 font-bold text-primary">{property.title}</td>
                <td className="px-5 py-4 text-slate-600">{property.location?.city || '-'}</td>
                <td className="px-5 py-4 font-bold text-primary">{formatPrice(property.price)}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={property.status || 'active'} />
                </td>
                <td className="px-5 py-4 text-slate-600">{property.views || 0}</td>
                <td className="px-5 py-4 text-slate-600">
                  {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500"
                      aria-label="Edit listing"
                      title="Edit placeholder"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(property._id)}
                      disabled={deletingId === property._id}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-danger hover:text-danger disabled:cursor-wait disabled:opacity-60"
                      aria-label="Delete listing"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default MyListingsTable
