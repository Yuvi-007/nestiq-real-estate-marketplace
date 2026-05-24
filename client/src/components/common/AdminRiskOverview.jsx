import { AlertTriangle, CameraOff, FileWarning, MapPinned, ShieldCheck, ShieldQuestion } from 'lucide-react'

import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

const riskCards = [
  { key: 'highRiskListings', label: 'High-risk listings', icon: AlertTriangle, className: 'bg-red-50 text-red-700' },
  { key: 'mediumRiskListings', label: 'Medium-risk listings', icon: ShieldQuestion, className: 'bg-amber-50 text-amber-700' },
  { key: 'lowRiskListings', label: 'Low-risk listings', icon: ShieldCheck, className: 'bg-emerald-50 text-emerald-700' },
  { key: 'listingsMissingImages', label: 'Missing images', icon: CameraOff, className: 'bg-slate-100 text-slate-700' },
  { key: 'listingsMissingCoordinates', label: 'Missing coordinates', icon: MapPinned, className: 'bg-slate-100 text-slate-700' },
  { key: 'listingsWithWeakDescriptions', label: 'Weak descriptions', icon: FileWarning, className: 'bg-slate-100 text-slate-700' },
]

function AdminRiskOverview({ stats, properties }) {
  const highRiskListings = properties
    .filter((property) => property.trustScore?.riskLevel === 'HIGH')
    .slice(0, 5)

  return (
    <Card>
      <SectionHeader
        eyebrow="Trust intelligence"
        title="Risk overview"
        description="Transparent rule-based quality checks for moderation, fraud review, and listing cleanup."
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {riskCards.map(({ key, label, icon: Icon, className }) => (
          <div key={key} className="rounded-2xl border border-slate-200 bg-surface p-4">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}>
              <Icon size={18} />
            </span>
            <p className="mt-4 text-2xl font-extrabold text-primary">{stats?.[key] || 0}</p>
            <p className="mt-1 text-xs font-bold uppercase text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <div className="bg-primary px-4 py-3 text-sm font-extrabold text-white">High-risk listings</div>
        {highRiskListings.length === 0 ? (
          <p className="px-4 py-5 text-sm font-semibold text-slate-600">No high-risk listings detected.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[680px] divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-extrabold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Listing</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Primary risks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {highRiskListings.map((property) => (
                  <tr key={property._id}>
                    <td className="px-4 py-3 font-bold text-primary">{property.title}</td>
                    <td className="px-4 py-3 font-extrabold text-red-700">{property.trustScore?.overallScore || 0}/10</td>
                    <td className="px-4 py-3 text-slate-600">
                      {property.trustScore?.riskReasons?.slice(0, 2).join(', ') || 'Needs manual review'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  )
}

export default AdminRiskOverview
