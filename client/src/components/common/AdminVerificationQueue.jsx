import { ExternalLink, ShieldCheck, ShieldX } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '../ui/Button'
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import VerificationStatusBadge from './VerificationStatusBadge'

const documentLabels = {
  ownership: 'Ownership',
  taxReceipt: 'Tax receipt',
  idProof: 'ID proof',
  utilityBill: 'Utility bill',
  other: 'Other',
}

function AdminVerificationQueue({ properties, onApprove, onReject, busyId }) {
  const [rejectionReasons, setRejectionReasons] = useState({})
  const queue = properties.filter((property) => ['submitted', 'underReview', 'rejected'].includes(property.verification?.status))

  return (
    <Card>
      <SectionHeader
        eyebrow="Verification"
        title="Verification Queue"
        description="Review submitted seller/agent documents. Document links are visible only in admin tools."
      />

      {queue.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-surface p-5 text-sm font-semibold text-slate-600">
          No properties are waiting for verification review.
        </p>
      ) : (
        <div className="mt-5 grid gap-4">
          {queue.map((property) => (
            <div key={property._id} className="rounded-2xl border border-slate-200 bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Link to={`/properties/${property._id}`} className="text-lg font-extrabold text-primary hover:text-accent">
                    {property.title}
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {property.location?.city || 'City unavailable'} - {property.agent?.name || 'Agent unavailable'}
                  </p>
                </div>
                <VerificationStatusBadge status={property.verification?.status} />
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {(property.verification?.documents || []).map((document) => (
                  <a
                    key={document.publicId}
                    href={document.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-primary transition hover:border-accent"
                  >
                    <span>{documentLabels[document.type] || document.type}</span>
                    <ExternalLink size={15} />
                  </a>
                ))}
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
                <input
                  value={rejectionReasons[property._id] || ''}
                  onChange={(event) => setRejectionReasons((current) => ({ ...current, [property._id]: event.target.value }))}
                  placeholder="Optional rejection reason"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary outline-none focus:border-accent"
                />
                <Button
                  icon={ShieldCheck}
                  disabled={busyId === property._id}
                  onClick={() => onApprove(property._id)}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  icon={ShieldX}
                  disabled={busyId === property._id}
                  onClick={() => onReject(property._id, rejectionReasons[property._id] || '')}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default AdminVerificationQueue
